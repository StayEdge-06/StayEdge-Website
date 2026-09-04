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

/**
 * GA4 DebugView only shows a stream that tags its hits with `debug_mode`.
 * On by default outside production so local work is verifiable, and opt-in on
 * the live site via `?ga_debug=1` so the founder can confirm a real deploy in
 * DebugView without shipping a debug build.
 */
function wantsDebugMode() {
  if (process.env.NODE_ENV !== "production") return true;
  try {
    return new URLSearchParams(window.location.search).has("ga_debug");
  } catch {
    return false;
  }
}

/** Inject GA4 + Clarity. Called only after explicit consent. */
export function loadAnalytics() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;

  if (GA_ID) {
    try {
      window.dataLayer = window.dataLayer || [];
      // MUST push `arguments`, not a rest array.
      //
      // gtag.js only interprets a dataLayer entry as a gtag command when that
      // entry is a genuine Arguments object; a plain Array is pushed, stored
      // and silently ignored. The previous `(...args) => dataLayer.push(args)`
      // therefore produced a perfectly healthy-looking dataLayer, a 200 on
      // gtag/js, an initialised google_tag_manager — and ZERO /g/collect
      // requests, because every command we queued was skipped. Verified at the
      // network layer: not one hit reached GA4, including manually dispatched
      // events. Keep this a classic `function` (arrows have no `arguments`).
      window.gtag = function gtag() {
        if (!window.dataLayer) window.dataLayer = [];
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer.push(arguments);
      } as NonNullable<Window["gtag"]>;
      window.gtag("js", new Date());
      // This single config is what sends the first page_view. Nothing else may
      // fire one for the same page — a second config or an explicit page_view
      // event here doubles every session's landing hit.
      window.gtag("config", GA_ID, {
        send_page_view: true,
        ...(wantsDebugMode() ? { debug_mode: true } : {}),
      });
      const s = document.createElement("script");
      s.async = true;
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
