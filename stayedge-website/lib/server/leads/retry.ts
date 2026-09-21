/**
 * Retry policy for outbound notifications.
 *
 * WHAT IS AND IS NOT RETRIED — the distinction that matters:
 *
 *   RETRIED   network errors, timeouts, 429, and 5xx. The request never got a
 *             considered answer, so asking again is meaningful.
 *   NOT       4xx other than 429. A 401 means the token is wrong and a 400
 *             means the payload is wrong; repeating either just turns one clear
 *             failure into three identical ones a few seconds apart.
 *
 * The delays are short and few on purpose. This runs inside the request the
 * visitor is waiting on, so the whole retry budget has to fit inside the time a
 * host will sit on a "Sending…" button. A notification that cannot be delivered
 * inside that budget is recorded as failed on the lead row and shown on the /os
 * Workflow Monitor — visible, not silently dropped, and not paid for with the
 * visitor's patience.
 */

export const RETRY_DELAYS_MS = [400, 1200];

export type Attempt = { ok: boolean; status: number; detail: string };

/** True when another attempt could plausibly succeed. */
export function isRetryable(status: number): boolean {
  return status === 0 || status === 429 || status >= 500;
}

export async function withRetry(
  attempt: () => Promise<Attempt>,
  delays: number[] = RETRY_DELAYS_MS,
): Promise<Attempt & { attempts: number }> {
  let last: Attempt = { ok: false, status: 0, detail: "not_attempted" };

  for (let i = 0; i <= delays.length; i++) {
    try {
      last = await attempt();
    } catch (e) {
      // status 0 = the request never completed (DNS, TLS, abort, offline).
      last = { ok: false, status: 0, detail: e instanceof Error ? e.name : "network_error" };
    }
    if (last.ok) return { ...last, attempts: i + 1 };
    if (!isRetryable(last.status)) return { ...last, attempts: i + 1 };
    if (i < delays.length) await sleep(delays[i]!);
  }

  return { ...last, attempts: delays.length + 1 };
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
