"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE_SETTLE } from "@/lib/motion/ease";
import {
  getConsent,
  setConsent,
  loadAnalytics,
  track,
  GA_ID,
  CLARITY_ID,
} from "@/lib/analytics";
import { readPassport, isReturning } from "@/lib/ai/memory";
import { captureAttribution } from "@/lib/leads/attribution-client";

/**
 * Site-wide measurement, consent-first.
 * - Cookie banner (only when analytics IDs exist and no choice stored);
 *   decline = nothing loads, ever.
 * - Delegated click tracking: WhatsApp, free-audit and AI-video CTAs (one
 *   listener, no per-component wiring).
 * - SPA route-change tracking via usePathname() — fires gtag('config') with
 *   new page_path on every client-side navigation (fills the App Router gap).
 *   Uses analyticsReady ref to avoid racing against loadAnalytics().
 * - Scroll depth (25/50/75/100, once per page) + returning-visitor signal.
 */
export function AnalyticsProvider() {
  const [showBanner, setShowBanner] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reduce = useReducedMotion();

  // Tracks whether loadAnalytics() has completed so the route-change effect
  // never fires gtag calls before the dataLayer/gtag function exist.
  const analyticsReady = useRef(false);
  const prevPath = useRef("");

  // ── Route change tracking ─────────────────────────────────────────────
  // Declared SECOND so it runs AFTER the init effect (React runs effects in
  // declaration order).  Guards on analyticsReady — if consent was already
  // granted from a prior session the init effect sets the ref synchronously.
  useEffect(() => {
    if (!analyticsReady.current) return;
    const p =
      pathname +
      (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    if (p === prevPath.current) return;
    prevPath.current = p;
    // An explicit page_view event, NOT a repeat gtag('config').
    //
    // A second config call for an already-configured measurement ID is deduped
    // by gtag.js: verified at the network layer, a client-side navigation
    // produced the config push and zero /g/collect hits, so every SPA route
    // change — which on an App Router site is most navigations — went
    // unrecorded. An explicit page_view is the supported way to report one.
    //
    // Deferred a frame because Next applies the new route's <title> in its own
    // commit; reading document.title synchronously here reports the previous
    // page's title on the new page's hit.
    const t = setTimeout(() => {
      window.gtag?.("event", "page_view", {
        page_location: window.location.href,
        page_title: document.title,
      });
    }, 120);
    return () => clearTimeout(t);
  }, [pathname, searchParams]);

  // ── Initialisation effect ─────────────────────────────────────────────
  // Declared FIRST so it runs before the route-change effect above.
  useEffect(() => {
    // First-touch attribution, captured before anything else can navigate away
    // from the landing URL. Deliberately OUTSIDE the consent gate and above the
    // consent check: it writes to the visitor's own sessionStorage and sends
    // nothing anywhere unless they later submit a form. See
    // lib/leads/attribution-client.ts for the full reasoning.
    captureAttribution();

    const hasIds = Boolean(GA_ID || CLARITY_ID);
    const consent = getConsent();
    if (consent === "granted") {
      loadAnalytics();
      analyticsReady.current = true;
      // Record the initial path so the route-change effect skips the
      // duplicate — gtag('config') inside loadAnalytics() already fired
      // the first page_view.
      const p =
        pathname +
        (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      prevPath.current = p;
    } else if (consent === null && hasIds) {
      setShowBanner(true);
    }

    // Returning visitor (Passport-based, no cookies needed for the check)
    if (isReturning(readPassport())) track("returning_visitor");

    // Delegated CTA / WhatsApp click tracking
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (href.includes("wa.me")) track("whatsapp_click", { href });
      else if (href.startsWith("/free-audit"))
        track("cta_click", { cta: "free_audit", href });
      else if (href.startsWith("/services/"))
        // Generic per-service tracking (Phase 4) — covers every dedicated
        // service page (ai-property-video, airbnb-seo, pricing-strategy, …)
        // without needing a new branch each time one is added.
        track("cta_click", { cta: href.replace("/services/", "").replace(/\/$/, "") || "services_hub", href });
    };
    document.addEventListener("click", onClick, {
      capture: true,
      passive: true,
    });

    // Scroll depth, once per threshold per page view
    const fired = new Set<number>();
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = Math.round((window.scrollY / max) * 100);
      for (const t of [25, 50, 75, 100]) {
        if (pct >= t && !fired.has(t)) {
          fired.add(t);
          track("scroll_depth", { depth: t });
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function choose(v: "granted" | "denied") {
    setConsent(v);
    setShowBanner(false);
    if (v === "granted") {
      loadAnalytics();
      analyticsReady.current = true;
      // Record the current path ONLY. loadAnalytics()'s own gtag('config', …,
      // { send_page_view: true }) is what sends this page's page_view; firing a
      // second config here (as this used to) sent a duplicate the moment the
      // dataLayer bug was fixed and the queue actually started flushing.
      prevPath.current =
        pathname +
        (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    }
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          role="dialog"
          aria-label="Analytics consent"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
          // Held back a beat so it never competes with the page's own entrance
          // — the first thing a visitor meets should be the page, not a dialog.
          transition={{ duration: 0.4, delay: 0.9, ease: EASE_SETTLE }}
          // Opaque, not glass: this dialog is guaranteed to land on top of body
          // copy, and a translucent panel let the text underneath bleed through
          // it. The blur stays for the edge treatment only.
          className="fixed inset-x-4 bottom-[96px] z-[300] mx-auto max-w-sm rounded-[var(--se-radius-lg)] border border-[var(--se-line-strong)] bg-se-surface p-5 shadow-[0_18px_50px_-20px_var(--se-scrim)] backdrop-blur-md sm:inset-x-auto sm:bottom-6 sm:left-6"
        >
          <div className="flex items-start gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden className="mt-0.5 shrink-0">
              <rect
                x="12"
                y="2"
                width="14.14"
                height="14.14"
                rx="2"
                transform="rotate(45 12 2)"
                fill="none"
                stroke="var(--se-accent)"
                strokeWidth="1.5"
              />
            </svg>
            <div>
              <p className="font-body text-sm font-bold text-se-ink">Analytics, that&apos;s all.</p>
              <p className="mt-1 text-sm leading-relaxed text-se-ink-muted">
                We measure which pages actually help hosts. No ad tracking, no selling anything on.
                Decline and nothing loads.
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => choose("granted")}
              className="flex-1 cursor-pointer rounded-[var(--se-radius-pill)] bg-se-purple px-4 py-2 text-sm font-bold text-se-on-accent transition-shadow hover:shadow-[0_10px_30px_-12px_var(--se-glow)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--se-focus)]"
            >
              Allow
            </button>
            <button
              onClick={() => choose("denied")}
              className="flex-1 cursor-pointer rounded-[var(--se-radius-pill)] border border-[var(--se-line-strong)] px-4 py-2 text-sm text-se-ink transition-colors hover:bg-[color-mix(in_srgb,var(--se-lavender)_10%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--se-focus)]"
            >
              Decline
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
