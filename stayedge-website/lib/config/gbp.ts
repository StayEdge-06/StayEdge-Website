/**
 * Google Business Profile — the single, validated source for the profile URL.
 *
 * The profile is verified and live, but its URL is deliberately NOT hardcoded
 * anywhere in this repo (HONESTY LAW): a guessed or placeholder maps URL is a
 * false identity claim in `sameAs`/`hasMap`, and a wrong one actively hurts
 * entity resolution. The real URL arrives through NEXT_PUBLIC_GBP_URL and
 * nothing else.
 *
 * Why this is validated rather than passed straight through: the failure mode
 * is silent and expensive. A typo, a link copied from the wrong service, or a
 * trailing paste artefact would otherwise ship into JSON-LD as a claim Google
 * can and does check. Anything that is not an https URL on a Google-owned
 * maps/profile host is ignored outright, and the site then behaves exactly as
 * it does with the variable unset — no sameAs entry, no hasMap, no footer link.
 * Absent is honest; wrong is not.
 *
 * BUILD-TIME: NEXT_PUBLIC_* is inlined by Next at build time, not read at
 * runtime. Setting this in the Vercel dashboard requires a redeploy before it
 * appears anywhere on the site.
 */

/** Hosts Google actually serves Business Profiles / Maps places from. */
const ALLOWED_HOSTS: readonly string[] = [
  "www.google.com", // /maps/place/…
  "google.com",
  "maps.google.com",
  "maps.app.goo.gl", // share link from the Maps app
  "goo.gl", // legacy /maps/… share link
  "g.page", // GBP short link, and /r/… review link
];
// business.google.com is deliberately NOT here: that is the management console,
// not a public profile. Pasting a dashboard URL would publish a link no visitor
// (and no crawler) can follow as this entity's identity claim.

function parseGbpUrl(raw: string | undefined): string | null {
  const value = raw?.trim();
  if (!value) return null;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;

  const host = url.hostname.toLowerCase();
  if (!ALLOWED_HOSTS.includes(host)) return null;

  // google.com and goo.gl serve far more than Maps, so on those hosts the path
  // has to prove it is a place. g.page / maps.app.goo.gl / maps.google.com are
  // maps-only by definition and need no path check.
  const needsMapsPath = host === "google.com" || host === "www.google.com" || host === "goo.gl";
  if (needsMapsPath && !url.pathname.startsWith("/maps")) return null;

  return url.toString();
}

/**
 * The verified profile URL, or null when unset/invalid. Every consumer must
 * treat null as "we have no profile to point at" and render nothing.
 */
export const GBP_URL: string | null = parseGbpUrl(process.env.NEXT_PUBLIC_GBP_URL);

/** True once a usable profile URL has been configured. */
export const HAS_GBP = GBP_URL !== null;

// A value that was supplied but rejected is the one case worth shouting about:
// it looks configured to whoever set it and is invisible everywhere else.
if (process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_GBP_URL && !GBP_URL) {
  console.warn(
    "[stayedge] NEXT_PUBLIC_GBP_URL is set but was rejected — expected an https URL on " +
      "google.com/maps, maps.app.goo.gl or g.page (a public profile link, not " +
      "the business.google.com dashboard). Ignoring it.",
  );
}
