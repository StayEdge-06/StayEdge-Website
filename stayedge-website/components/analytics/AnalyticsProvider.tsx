"use client";

import { useEffect, useState } from "react";
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
 * - Scroll depth (25/50/75/100, once per page) + returning-visitor signal.
 */
export function AnalyticsProvider() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const hasIds = Boolean(GA_ID || CLARITY_ID);
    const consent = getConsent();
    if (consent === "granted") loadAnalytics();
    else if (consent === null && hasIds) setShowBanner(true);

    // Returning visitor (Passport-based, no cookies needed for the check)
    if (isReturning(readPassport())) track("returning_visitor");

    // Delegated CTA / WhatsApp click tracking
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (href.includes("wa.me")) track("whatsapp_click", { href });
      else if (href.startsWith("/audit")) track("discovery_call_click", { href });
      else if (href.startsWith("/roast")) track("cta_click", { cta: "roast" });
    };
    document.addEventListener("click", onClick, { capture: true, passive: true });

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
  }, []);

  function choose(v: "granted" | "denied") {
    setConsent(v);
    setShowBanner(false);
    if (v === "granted") loadAnalytics();
  }

  if (!showBanner) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="se-glass fixed inset-x-4 bottom-[96px] z-[300] mx-auto max-w-md rounded-[var(--se-radius-lg)] p-4 sm:inset-x-auto sm:left-6 sm:bottom-6"
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
