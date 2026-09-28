import crypto from "node:crypto";

/**
 * The pure half of /os authentication: key comparison, token minting, token
 * verification and login throttling. No Next.js imports, so it can be executed
 * directly by `node --test` — the cookie plumbing that cannot run outside a
 * request lives in ./auth.ts and is a thin wrapper over these functions.
 *
 * Splitting it this way is not only for tests. It keeps the security-critical
 * logic in one file with no framework surface, which is the part worth reading
 * closely during an audit.
 */

/** Long enough to work a full day without re-entry, short enough to expire. */
export const TTL_MS = 12 * 60 * 60_000;

/**
 * Minimum length of the dashboard key.
 *
 * A short key is the whole security of the dashboard reduced to something
 * guessable, so a deployment configured with one is treated as not configured
 * at all: /os 404s rather than accepting a weak secret. Rotating to a longer
 * key is a one-line change in the hosting dashboard.
 */
export const MIN_KEY_LENGTH = 16;

function sign(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

/**
 * Compare two secrets without leaking their contents through timing.
 *
 * Both sides are hashed first so timingSafeEqual always receives equal-length
 * buffers — it throws on a length mismatch, and that throw is itself an oracle
 * for the secret's length.
 */
export function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

/** True when a usable dashboard key is configured. */
export function keyConfigured(expected: string | undefined): boolean {
  return Boolean(expected && expected.length >= MIN_KEY_LENGTH);
}

/** True when the submitted key matches the configured one. */
export function keyMatches(submitted: string, expected: string | undefined): boolean {
  if (!keyConfigured(expected)) return false;
  if (!submitted) return false;
  return safeEqual(submitted, expected!);
}

/** `<expiry-ms>.<hmac>` — self-contained, so no server-side session store. */
export function mintToken(secret: string, now = Date.now()): string {
  const exp = String(now + TTL_MS);
  return `${exp}.${sign(exp, secret)}`;
}

export function tokenValid(
  token: string | undefined,
  secret: string | null,
  now = Date.now(),
): boolean {
  if (!secret || !token) return false;
  const [exp, mac] = token.split(".");
  if (!exp || !mac) return false;
  // Signature first: checking the expiry on unverified input would let an
  // attacker learn the token format by probing.
  if (!safeEqual(mac, sign(exp, secret))) return false;
  const expiry = Number(exp);
  return Number.isFinite(expiry) && expiry > now;
}

/* ------------------------------------------------------------------ *
 * Login throttling
 * ------------------------------------------------------------------ */

export const ATTEMPT_WINDOW_MS = 15 * 60_000;
export const ATTEMPT_MAX = 8;

const attempts = new Map<string, number[]>();

/**
 * Throttle login attempts per IP.
 *
 * A long random key is not guessable by brute force in any case; this exists so
 * a script hammering the endpoint cannot use it as a free CPU sink (each
 * attempt costs two SHA-256 digests) and so repeated failures are visibly
 * rate-limited rather than unbounded.
 *
 * In-process, like the lead rate limiter: it resets on deploy and is per
 * instance. Documented rather than hidden — a shared store (Redis, Upstash) is
 * the upgrade when there is more than one operator or more than one instance.
 */
export function loginThrottled(ip: string, now = Date.now()): boolean {
  const ts = (attempts.get(ip) ?? []).filter((t) => now - t < ATTEMPT_WINDOW_MS);
  if (ts.length >= ATTEMPT_MAX) {
    attempts.set(ip, ts);
    return true;
  }
  ts.push(now);
  attempts.set(ip, ts);
  return false;
}

/** Clear the throttle for an IP after a successful login. */
export function clearThrottle(ip: string): void {
  attempts.delete(ip);
}

/** Test helper. Never called by application code. */
export function __resetThrottle(): void {
  attempts.clear();
}
