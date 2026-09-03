/**
 * Analytics — GA4 + Microsoft Clarity, both consent-gated and env-configured.
 * With no IDs set (or consent denied) every call is a silent no-op, so the
 * product never breaks and never tracks without permission.
 *
 * Env (set in .env.production / hosting dashboard):
 *   NEXT_PUBLIC_GA_MEASUREMENT_ID (or legacy NEXT_PUBLIC_GA_ID)  e.g. G-XXXXXXXXXX
 *   NEXT_PUBLIC_CLARITY_PROJECT_ID — consumed by components/analytics/Clarity.tsx
 */
export const GA_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? process.env.NEXT_PUBLIC_GA_ID;
export const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

const CONSENT_KEY = "stayedge.consent.v1";
export type Consent = "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

export function getConsent(): Consent | null {
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(v: Consent) {
  try {
    window.localStorage.setItem(CONSENT_KEY, v);
    // Let same-session listeners (e.g. the Clarity loader) react immediately.
    window.dispatchEvent(new Event("se-consent"));
  } catch {
    /* ignore */
  }
}

let loaded = false;

/** Inject GA4 + Clarity. Called only after explicit consent. */
export function loadAnalytics() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;

  if (GA_ID) {
    try {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag(...args: unknown[]) {
        if (!window.dataLayer) {
          window.dataLayer = [];
        }
        window.dataLayer.push(args);
      };
      window.gtag("js", new Date());
      window.gtag("config", GA_ID, { send_page_view: true });
      const s = document.createElement("script");
      s.async = true;
      s.onload = () => {
        // Safety net: fire explicit page_view once gtag.js is fully loaded
        try {
          window.gtag?.("event", "page_view", {
            page_location: window.location.href,
            page_title: document.title,
          });
        } catch {
          /* best-effort fallback */
        }
      };
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(s);
    } catch {
      /* analytics must never break the product */
    }
  }

  // NOTE: Microsoft Clarity is loaded exclusively by components/analytics/
  // Clarity.tsx (next/script, production-only) — never here, so it can't
  // initialise twice.
}

/**
 * Event taxonomy (V2). One funnel, two services:
 *   audit_*  — the primary conversion path (Free Property Growth Audit)
 *   video_*  — the AI Property Video enquiry path
 * The roast_* / snapshot_* events were retired with the AI Roast feature; any
 * GA4 explorations still referencing them will show no data after this release.
 */
export type EventName =
  | "audit_form_start"
  | "audit_form_submit"
  | "audit_lead_captured"
  | "video_form_submit"
  | "video_lead_captured"
  | "form_error"
  | "cta_click"
  | "whatsapp_click"
  | "scroll_depth"
  | "returning_visitor";

export function track(event: EventName, params?: Record<string, unknown>) {
  try {
    if (getConsent() !== "granted") return;
    window.gtag?.("event", event, params ?? {});
    // Clarity picks up custom tags for filtering sessions.
    window.clarity?.("set", event, JSON.stringify(params ?? {}));
  } catch {
    /* analytics must never break the product */
  }
}
