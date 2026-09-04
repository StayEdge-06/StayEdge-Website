import {
  EMPTY_ATTRIBUTION,
  attributionInputSchema,
  type AttributionInput,
} from "./schema";
import { isInternalReferrer, readCampaignParams } from "./attribution";

/**
 * First-touch attribution capture, browser side.
 *
 * Captured once per session, on the first page the visitor lands on, and held
 * in sessionStorage until they submit a form. First-touch beats last-touch here
 * because the interesting question is "what brought this host to StayEdge",
 * not "which internal link did they click last" — and by the time someone
 * reaches /free-audit the referrer is always our own homepage.
 *
 * PRIVACY: this is not analytics and is deliberately not behind the consent
 * gate. Nothing is sent anywhere on page load; the values sit in the visitor's
 * own browser for the length of the session and are transmitted only if they
 * choose to submit an enquiry, as part of that enquiry. No identifiers, no
 * cross-site state, no third party. Session storage also means it is gone when
 * the tab closes.
 */

const KEY = "stayedge.attr.v1";

function readStored(): AttributionInput | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = attributionInputSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

/**
 * Capture first-touch attribution if this is the first page of the session.
 * Safe to call on every route change: it only writes once.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    if (readStored()) return;

    const referrer = isInternalReferrer(document.referrer, window.location.hostname)
      ? "" // an internal referrer is not a channel; treat it as no referrer
      : document.referrer.slice(0, 500);

    const value: AttributionInput = {
      ...EMPTY_ATTRIBUTION,
      captured: true,
      landingPath: (window.location.pathname + window.location.search).slice(0, 300),
      formPath: window.location.pathname.slice(0, 300),
      referrer,
      ...readCampaignParams(window.location.search),
    };
    window.sessionStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    /* private mode / storage disabled — the lead is simply Unknown-sourced */
  }
}

/**
 * The attribution to attach to a submission. `formPath` is refreshed to where
 * the form actually lives; everything else stays first-touch.
 *
 * Returns an uncaptured record (which classifies as "Unknown", never "Direct")
 * when storage was unavailable — see the honesty note in ./attribution.ts.
 */
export function currentAttribution(formPath: string): AttributionInput {
  if (typeof window === "undefined") return EMPTY_ATTRIBUTION;
  const stored = readStored();
  if (!stored) return { ...EMPTY_ATTRIBUTION, formPath: formPath.slice(0, 300) };
  return { ...stored, formPath: formPath.slice(0, 300) };
}
