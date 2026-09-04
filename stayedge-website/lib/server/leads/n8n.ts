import crypto from "node:crypto";
import { SCHEMA_VERSION, type CanonicalLead } from "../../leads/schema";
import { withRetry, type Attempt } from "./retry";

/**
 * n8n — the automation plane.
 *
 * ARCHITECTURE: the website is an outbound HTTPS webhook client and nothing
 * else. It POSTs one signed JSON event per accepted lead to an n8n Webhook node
 * and forgets about it; every follow-up sequence, enrichment step and future
 * agent lives inside n8n, where the founder can change it without a deploy.
 *
 * WHY NOT MCP: the n8n MCP connector is a tool-calling interface for an LLM
 * client. The website is not an LLM client — it is a server emitting an event.
 * MCP would add an authenticated session, a protocol dependency and a second
 * failure mode to a plain POST. (The claude.ai n8n MCP connector is also
 * currently returning 404 at the account level, but that is not why: even
 * working, it would be the wrong tool for this job.)
 *
 * EXTENSIBILITY: the payload is versioned and typed (`event`, `version`), so
 * n8n workflows can branch on the event name and new event types — "audit
 * delivered", "video rendered" — can be added later without breaking the
 * existing lead workflow.
 */

/** n8n cloud instances cold-start; it is the least critical sink, so it waits. */
const TIMEOUT_MS = 12_000;

export function n8nConfigured(): boolean {
  return Boolean(process.env.N8N_LEAD_WEBHOOK_URL);
}

export type N8nEvent = {
  event: "lead.created";
  version: string;
  /** Idempotency key — n8n workflows should ignore a repeated id. */
  id: string;
  sentAt: string;
  lead: CanonicalLead;
};

export function buildN8nPayload(lead: CanonicalLead): N8nEvent {
  return {
    event: "lead.created",
    version: SCHEMA_VERSION,
    id: lead.id,
    sentAt: new Date().toISOString(),
    // The whole canonical lead, unflattened. Downstream workflows read named
    // fields from one documented shape rather than a bespoke projection that
    // would have to be kept in sync by hand.
    lead,
  };
}

/**
 * AUTHENTICATION — two independent mechanisms, both optional but both
 * recommended, because an n8n Webhook node is a public URL by default:
 *
 *   N8N_WEBHOOK_TOKEN   sent as `Authorization: Bearer …`. Matches n8n's
 *                       built-in Header Auth credential, so it can be enforced
 *                       by the node itself with no workflow logic.
 *   N8N_WEBHOOK_SECRET  an HMAC-SHA256 of the exact request body, sent as
 *                       `X-StayEdge-Signature: sha256=…`. This proves the body
 *                       was not altered in transit and that the sender holds
 *                       the secret — a bearer token alone proves neither, since
 *                       anyone who ever sees the header can replay it verbatim.
 *
 * Neither secret is ever NEXT_PUBLIC_, so neither reaches the browser.
 */
function signBody(body: string): string | null {
  const secret = process.env.N8N_WEBHOOK_SECRET;
  if (!secret) return null;
  return `sha256=${crypto.createHmac("sha256", secret).update(body).digest("hex")}`;
}

export async function forwardToN8n(
  lead: CanonicalLead,
): Promise<{ ok: boolean; detail: string; attempts: number }> {
  const url = process.env.N8N_LEAD_WEBHOOK_URL;
  if (!url) return { ok: false, detail: "not_configured", attempts: 0 };

  const body = JSON.stringify(buildN8nPayload(lead));
  const signature = signBody(body);
  const token = process.env.N8N_WEBHOOK_TOKEN;

  const result = await withRetry(async (): Promise<Attempt> => {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-stayedge-event": "lead.created",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
        ...(signature ? { "x-stayedge-signature": signature } : {}),
      },
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return { ok: res.ok, status: res.status, detail: res.ok ? "sent" : `http_${res.status}` };
  });

  return { ok: result.ok, detail: result.detail, attempts: result.attempts };
}

/**
 * Liveness probe for the /os Workflow Monitor.
 *
 * Deliberately does NOT send a test lead: a probe that fabricates a lead would
 * put a fake row into the founder's real automation. It only reports whether
 * the webhook is configured and whether the host resolves and answers at all —
 * an n8n Webhook node returns 404 to a GET when the workflow is inactive, which
 * is itself the most useful signal this can give.
 */
export async function n8nHealth(): Promise<{ configured: boolean; reachable: boolean; detail: string }> {
  const url = process.env.N8N_LEAD_WEBHOOK_URL;
  if (!url) return { configured: false, reachable: false, detail: "Set N8N_LEAD_WEBHOOK_URL" };
  try {
    const res = await fetch(url, { method: "GET", signal: AbortSignal.timeout(6_000) });
    // Any HTTP answer proves the instance is up and the URL resolves. A 404
    // specifically means n8n is running but the workflow is not active.
    return {
      configured: true,
      reachable: true,
      detail: res.status === 404 ? "reachable · workflow inactive" : `reachable · ${res.status}`,
    };
  } catch (e) {
    return {
      configured: true,
      reachable: false,
      detail: e instanceof Error ? e.name : "unreachable",
    };
  }
}
