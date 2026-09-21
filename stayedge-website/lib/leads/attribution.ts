import type { AttributionInput, Channel } from "./schema.ts";

/**
 * Source attribution — turning the evidence a browser gives us into one
 * channel label, and refusing to guess when there is no evidence.
 *
 * THE HONESTY RULE FOR THIS FILE: every branch below is driven by something the
 * visitor's browser actually sent — a campaign tag the founder put on a link, a
 * referrer host, a paid click id. Nothing is inferred from timing, geography or
 * probability. When the evidence runs out the answer is "Direct" (we looked and
 * the browser sent nothing) or "Unknown" (we never got to look), and both are
 * real answers that the dashboard shows as-is. A channel breakdown is only
 * worth having if the founder can trust every row in it.
 *
 * Client-safe and dependency-free: the same function labels a lead on the
 * server and previews it in tests.
 */

/** Paid campaign click ids. Presence alone is proof of a paid click. */
const PAID_CLICK_PARAMS = ["gclid", "wbraid", "gbraid", "fbclid", "msclkid", "ttclid", "li_fat_id"];

const PAID_MEDIUMS = new Set([
  "cpc",
  "ppc",
  "paid",
  "paidsearch",
  "paid_search",
  "paid-social",
  "paid_social",
  "paidsocial",
  "display",
  "cpm",
  "banner",
  "retargeting",
]);

const PAID_SOURCES = new Set(["googleads", "google_ads", "google-ads", "adwords", "bingads", "metaads"]);

/**
 * Google Business Profile.
 *
 * A GBP click is only distinguishable from ordinary organic Google traffic if
 * the founder tags the website link inside the profile — Google sends the same
 * referrer either way. The recommended tag is:
 *   ?utm_source=gbp&utm_medium=organic&utm_campaign=google-business-profile
 * Without it, GBP traffic lands in "Organic Search" and no amount of guessing
 * here can recover it. That is a configuration task, not a code problem, and it
 * is called out in the Phase 3 report.
 */
const GBP_SOURCES = new Set([
  "gbp",
  "gmb",
  "google_business",
  "googlebusiness",
  "google-business",
  "google_business_profile",
  "googlemybusiness",
  "google-maps",
  "googlemaps",
  "maps",
]);

/** Hosts that only ever appear when the click came from a Google place. */
const GBP_HOSTS = ["maps.google.", "g.page", "maps.app.goo.gl", "business.site", "business.google."];

const SEARCH_HOSTS = [
  "google.",
  "bing.",
  "duckduckgo.",
  "yahoo.",
  "ecosia.",
  "brave.",
  "search.marginalia",
  "startpage.",
  "yandex.",
  "baidu.",
];

/** referrer host fragment -> channel. Checked in order, first match wins. */
const SOCIAL_HOSTS: Array<[string, Channel]> = [
  ["wa.me", "WhatsApp"],
  ["whatsapp.com", "WhatsApp"],
  ["com.whatsapp", "WhatsApp"], // android-app://com.whatsapp
  ["instagram.com", "Instagram"],
  ["com.instagram", "Instagram"],
  ["linkedin.com", "LinkedIn"],
  ["lnkd.in", "LinkedIn"],
  ["com.linkedin", "LinkedIn"],
  ["facebook.com", "Facebook"],
  ["fb.com", "Facebook"],
  ["fb.me", "Facebook"],
  ["com.facebook", "Facebook"],
  ["messenger.com", "Facebook"],
  ["twitter.com", "X"],
  ["t.co", "X"],
  ["x.com", "X"],
  ["youtube.com", "YouTube"],
  ["youtu.be", "YouTube"],
];

/** utm_source value -> channel, for links the founder tags by hand. */
const SOURCE_ALIASES: Array<[RegExp, Channel]> = [
  [/^(whatsapp|wa|wapp)$/, "WhatsApp"],
  [/^(instagram|ig|insta)$/, "Instagram"],
  [/^(linkedin|li)$/, "LinkedIn"],
  [/^(facebook|fb|meta)$/, "Facebook"],
  [/^(twitter|x)$/, "X"],
  [/^(youtube|yt)$/, "YouTube"],
];

function host(referrer: string): string {
  const r = referrer.trim().toLowerCase();
  if (!r) return "";
  // android-app://com.whatsapp and similar have no parseable host but the
  // scheme-specific part is exactly the identifier we want to match on.
  if (r.startsWith("android-app://")) return r.slice("android-app://".length);
  try {
    return new URL(r).hostname;
  } catch {
    return "";
  }
}

/**
 * Classify one lead's attribution into a single channel.
 *
 * Order matters and encodes how much each signal is trusted:
 *   1. a paid click id or paid medium — unambiguous, and money is involved
 *   2. an explicit campaign tag the founder controls — deliberate, so trusted
 *      over anything the browser inferred
 *   3. the referrer host
 *   4. nothing at all
 */
export function classifyChannel(a: AttributionInput): Channel {
  if (!a.captured) return "Unknown";

  const source = a.utmSource.trim().toLowerCase();
  const medium = a.utmMedium.trim().toLowerCase();
  const campaign = a.utmCampaign.trim().toLowerCase();
  const h = host(a.referrer);

  // 1 — paid
  if (a.clickId.trim()) return "Paid";
  if (PAID_MEDIUMS.has(medium)) return "Paid";
  if (PAID_SOURCES.has(source)) return "Paid";

  // 2 — founder-tagged campaigns
  if (GBP_SOURCES.has(source)) return "Google Business Profile";
  if (/\b(gbp|gmb|google[-_]?business)\b/.test(campaign)) return "Google Business Profile";
  if (medium === "gbp" || medium === "maps") return "Google Business Profile";
  for (const [pattern, channel] of SOURCE_ALIASES) {
    if (pattern.test(source)) return channel;
  }
  if (source === "google" || source === "bing") {
    // Tagged as a search source but not as an ad: organic search.
    return "Organic Search";
  }
  if (source && medium === "referral") return "Referral";

  // 3 — referrer host
  if (h) {
    for (const frag of GBP_HOSTS) {
      if (h.includes(frag)) return "Google Business Profile";
    }
    for (const [frag, channel] of SOCIAL_HOSTS) {
      if (h.includes(frag)) return channel;
    }
    for (const frag of SEARCH_HOSTS) {
      if (h.includes(frag)) return "Organic Search";
    }
    return "Referral";
  }

  // 4 — the browser sent nothing. Genuinely typed/bookmarked, or a client that
  // strips the referrer (WhatsApp's in-app browser is the common case for us —
  // which is why WhatsApp shares should carry ?utm_source=whatsapp).
  if (source || medium || campaign) return "Referral";
  return "Direct";
}

/**
 * Read first-touch attribution out of a URL's query string.
 * Pure so it can be exercised without a browser.
 */
export function readCampaignParams(search: string): {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  clickId: string;
} {
  let q: URLSearchParams;
  try {
    q = new URLSearchParams(search);
  } catch {
    q = new URLSearchParams();
  }
  const get = (k: string) => (q.get(k) ?? "").slice(0, 160);
  let clickId = "";
  for (const p of PAID_CLICK_PARAMS) {
    const v = q.get(p);
    if (v) {
      clickId = `${p}=${v}`.slice(0, 200);
      break;
    }
  }
  return {
    utmSource: get("utm_source"),
    utmMedium: get("utm_medium"),
    utmCampaign: get("utm_campaign"),
    utmTerm: get("utm_term"),
    utmContent: get("utm_content"),
    clickId,
  };
}

/** True when a referrer points back at our own site (not a real channel). */
export function isInternalReferrer(referrer: string, selfHost: string): boolean {
  const h = host(referrer);
  return h !== "" && (h === selfHost || h.endsWith(`.${selfHost}`));
}
