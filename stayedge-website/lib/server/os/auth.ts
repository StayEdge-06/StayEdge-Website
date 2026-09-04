import { cookies } from "next/headers";
import {
  TTL_MS,
  keyConfigured,
  keyMatches,
  mintToken,
  tokenValid,
} from "./session-token";

/**
 * /os authentication — the Next.js binding.
 *
 * The security logic lives in ./session-token.ts (no framework imports, unit
 * tested). This file only reads configuration and moves a cookie.
 *
 * WHAT THIS REPLACES AND WHY. Until Phase 3 the dashboard was gated by
 * `/os?key=<OS_DASHBOARD_KEY>`. A secret in a query string is the worst place
 * to put one: it lands in server access logs, in the Referer header of every
 * outbound link, in browser history, in the URL bar over someone's shoulder,
 * and in any analytics that records page paths. It also cannot be revoked
 * without changing the secret itself.
 *
 * The replacement is a signed, httpOnly session cookie. The key is typed once
 * into a POST body, exchanged for a session, and never appears in a URL again.
 * httpOnly means no script on the page can read it, so an XSS bug on the site
 * cannot exfiltrate the founder's session. SameSite=Lax means another site
 * cannot make an authenticated request on the founder's behalf, which is what
 * protects the status-changing endpoints from CSRF.
 *
 * WHAT THIS IS NOT: a user system. There is exactly one operator — the founder
 * — so there are no accounts, no passwords to store and no roles. When StayEdge
 * has staff, this is the file that grows an identity provider; nothing else has
 * to change, because every route asks this module the same question.
 */

const COOKIE = "se_os";

/**
 * The signing secret. OS_SESSION_SECRET is preferred, because a session secret
 * independent of the login key means either can be rotated alone. When it is
 * absent the login key doubles as the signing secret — a documented, deliberate
 * fallback so a half-configured deployment still gets signed sessions rather
 * than silently unsigned ones (and so rotating the login key also invalidates
 * every live session).
 */
function signingSecret(): string | null {
  return process.env.OS_SESSION_SECRET || process.env.OS_DASHBOARD_KEY || null;
}

/** True when the submitted key is the configured dashboard key. */
export function verifyKey(submitted: string): boolean {
  return keyMatches(submitted, process.env.OS_DASHBOARD_KEY);
}

/** True when /os can be used at all — i.e. a strong enough key is configured. */
export function osConfigured(): boolean {
  return keyConfigured(process.env.OS_DASHBOARD_KEY);
}

export async function createSession(): Promise<void> {
  const secret = signingSecret();
  if (!secret) throw new Error("os_not_configured");
  const jar = await cookies();
  jar.set(COOKIE, mintToken(secret), {
    httpOnly: true,
    sameSite: "lax",
    // Vercel is HTTPS-only; local development over http would refuse a Secure
    // cookie and lock the founder out of their own dev server.
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(TTL_MS / 1000),
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

/** True when the current request carries a valid session. */
export async function hasOsSession(): Promise<boolean> {
  const jar = await cookies();
  return tokenValid(jar.get(COOKIE)?.value, signingSecret());
}

export { clearThrottle, loginThrottled } from "./session-token";
