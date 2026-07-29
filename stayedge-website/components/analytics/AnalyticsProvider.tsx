"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  getConsent,
  setConsent,
  loadAnalytics,
  track,
  GA_ID,
  CLARITY_ID,
} from "@/lib/analytics";
import { readPassport, isReturning } from "@/lib/ai/memory";

/**
 * Site-wide measurement, consent-first.
 * - Cookie banner (only when analytics IDs exist and no choice stored);
 *   decline = nothing loads, ever.
 * - Delegated click tracking: WhatsApp, audit/roast CTAs (one listener, no
 *   per-component wiring).
 * - SPA route-change tracking via usePathname() — fires gtag('config') with
 *   new page_path on every client-side navigation (fills the App Router gap).
 *   Uses analyticsReady ref to avoid racing against loadAnalytics().
 * - Scroll depth (25/50/75/100, once per page) + returning-visitor signal.
 */
export function AnalyticsProvider() {
  const [showBanner, setShowBanner] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
    // gtag('config') with updated page_path is the standard GA4 SPA approach
    // — it triggers a page_view automatically and avoids racing with
    // gtag.js's own initial page_view from the first config call.
    window.gtag?.("config", GA_ID, {
      page_path: p,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  // ── Initialisation effect ─────────────────────────────────────────────
  // Declared FIRST so it runs before the route-change effect above.
  useEffect(() => {
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
      else if (href.startsWith("/audit"))
        track("discovery_call_click", { href });
      else if (href.startsWith("/roast"))
        track("cta_click", { cta: "roast" });
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
      // Fire the initial page_view now that consent was just granted
      const p =
        pathname +
        (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      prevPath.current = p;
      window.gtag?.("config", GA_ID, {
        page_path: p,
        page_title: document.title,
      });
    }
  }

  if (!showBanner) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-4 bottom-[96px] z-[300] mx-auto max-w-md rounded-[var(--se-radius-lg)] border border-[var(--se-line-strong)] bg-se-charcoal p-4 sm:inset-x-auto sm:left-6 sm:bottom-6"
    >
      <p className="text-sm text-se-offwhite">
        We use analytics to understand what helps hosts — nothing more.
      </p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => choose("granted")}
          className="cursor-pointer rounded-[var(--se-radius-pill)] bg-se-purple px-4 py-2 text-sm font-bold text-se-offwhite"
        >
          Allow
        </button>
        <button
          onClick={() => choose("denied")}
          className="cursor-pointer rounded-[var(--se-radius-pill)] border border-[var(--se-line-strong)] px-4 py-2 text-sm text-se-offwhite"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
