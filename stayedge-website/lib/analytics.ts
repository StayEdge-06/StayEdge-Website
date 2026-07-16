/**
 * Analytics — GA4 + Microsoft Clarity, both consent-gated and env-configured.
 * With no IDs set (or consent denied) every call is a silent no-op, so the
 * product never breaks and never tracks without permission.
 *
 * Env (set in .env.production / hosting dashboard):
 *   NEXT_PUBLIC_GA_ID      e.g. G-XXXXXXXXXX
 *   NEXT_PUBLIC_CLARITY_ID e.g. abcdefghij
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
export const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

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
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { anonymize_ip: true });
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);
  }

  if (CLARITY_ID) {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
    document.head.appendChild(s);
  }
}

/** Event taxonomy (founder-specified). */
export type EventName =
  | "roast_started"
  | "roast_completed"
  | "snapshot_unlocked"
  | "discovery_call_click"
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
