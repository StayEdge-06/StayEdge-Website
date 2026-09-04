import type { LeadInput } from "../../leads/schema";

/**
 * Spam and abuse controls for the public lead form.
 *
 * SCOPE, STATED HONESTLY: this is nuisance control, not a security boundary.
 * The counters live in one process's memory, so on Vercel two concurrent
 * lambdas each keep their own — a distributed burst can exceed the limit. That
 * is the right trade for a low-volume form: the alternative is a shared store
 * (Redis/KV) this project does not otherwise need, and the failure mode of
 * getting it wrong is refusing a real host, which costs more than an extra
 * junk row the founder deletes. The audit trail is the CRM itself.
 *
 * Everything here is a pure function of the request plus module state, so the
 * rules can be exercised by `node --test` with no server.
 */

/** A human needs at least a couple of seconds to fill even a short form. */
export const MIN_FILL_MS = 2_500;
/** Per IP. Five enquiries in ten minutes is already generous for one host. */
export const RATE_WINDOW_MS = 10 * 60_000;
export const RATE_MAX = 5;

export type SpamVerdict = { automated: boolean; signal: string };

/**
 * Bot detection. Each signal is something a human never does, not something a
 * human rarely does — a false positive here silently discards a real lead, so
 * the bar is deliberately high and "suspicious" is not enough.
 */
export function detectAutomation(lead: LeadInput, now = Date.now()): SpamVerdict {
  if (lead.hp.trim() !== "") return { automated: true, signal: "honeypot" };

  if (lead.renderedAt) {
    const elapsed = now - lead.renderedAt;
    // A negative elapsed time means the client clock is ahead of ours, which a
    // real phone with a skewed clock does routinely. Only a too-FAST fill is
    // evidence of a script.
    if (elapsed >= 0 && elapsed < MIN_FILL_MS) return { automated: true, signal: "too_fast" };
  }

  // Link-stuffed free text is the dominant spam shape on Indian lead forms.
  // One link is normal (a host pasting their listing into the message box).
  const links = lead.message.match(/https?:\/\//g)?.length ?? 0;
  if (links > 1) return { automated: true, signal: "link_stuffing" };

  return { automated: false, signal: "" };
}

const hits = new Map<string, number[]>();

function sweep(now: number): void {
  for (const [k, ts] of hits) {
    const keep = ts.filter((t) => now - t < RATE_WINDOW_MS);
    if (keep.length) hits.set(k, keep);
    else hits.delete(k);
  }
}

export type RateVerdict = { limited: boolean; retryAfterSeconds: number };

/** Records the attempt and reports whether it should be refused. */
export function checkRate(ip: string, now = Date.now()): RateVerdict {
  sweep(now);
  const ts = hits.get(ip) ?? [];
  if (ts.length >= RATE_MAX) {
    const oldest = ts[0]!;
    const wait = Math.max(1, Math.ceil((RATE_WINDOW_MS - (now - oldest)) / 1000));
    return { limited: true, retryAfterSeconds: wait };
  }
  ts.push(now);
  hits.set(ip, ts);
  return { limited: false, retryAfterSeconds: 0 };
}

/**
 * The caller's IP as the platform reports it.
 *
 * x-forwarded-for is client-controlled in general; behind Vercel's proxy the
 * left-most entry is the real client and the header cannot be spoofed past it.
 * Worst case a forged value buys an attacker a fresh rate-limit bucket — the
 * same thing a new IP would buy them — so nothing security-relevant rests on it.
 */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/** Test seam. */
export function __resetRateLimiter(): void {
  hits.clear();
}
