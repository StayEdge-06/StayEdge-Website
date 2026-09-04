import "../net";
import {
  EMPTY_ATTRIBUTION,
  leadInputSchema,
  newLeadId,
  packCampaign,
  phoneKey,
  SCHEMA_VERSION,
  type CanonicalLead,
  type LeadDelivery,
  type LeadInput,
  type LeadStatus,
} from "../../leads/schema";
import { classifyChannel } from "../../leads/attribution";
import { checkRate, detectAutomation } from "./abuse";
import { getLeadRepository } from "./index";
import { notifyTelegram, telegramConfigured } from "./telegram";
import { forwardToN8n, n8nConfigured, n8nHealth } from "./n8n";

/**
 * THE LEAD SERVICE — the one place a lead is turned from a form submission into
 * a business fact.
 *
 *   route (HTTP concerns) → submitLead (business rules) → repository (storage)
 *                                                       → notifiers (Telegram, n8n)
 *
 * The route knows about status codes and headers; this file knows about
 * duplicates, attribution and delivery; neither knows about Google Sheets. That
 * is the whole point of the layering — swapping the CRM touches one adapter.
 *
 * ORDER OF OPERATIONS IS THE DESIGN. The CRM write is awaited and completes
 * before any notification is attempted, because the CRM is the record of truth
 * and a notification about a lead that was never stored is worse than no
 * notification. Only after the lead is safe do Telegram and n8n run — in
 * parallel with each other, each contained by allSettled, each recorded on the
 * row. Nothing downstream of the CRM can cost us a lead.
 *
 * WHAT HAPPENS IF THE CRM ITSELF FAILS: the lead is still notified, still
 * returned as accepted to the visitor (they did nothing wrong and re-submitting
 * would not help), and the failure is recorded as crm=failed and raised on the
 * /os Workflow Monitor. Telling a real host "something went wrong" while their
 * details sit in a Telegram message the founder can act on would lose the lead
 * for no reason.
 */

/** Same person, same service, inside this window = a repeat, not a new lead. */
export const DUPLICATE_WINDOW_MS = 24 * 60 * 60_000;

export type SubmitContext = {
  ip: string;
  /** Path the request came from, used only when the client sent no formPath. */
  fallbackPath?: string;
};

export type SubmitResult =
  | { outcome: "accepted"; lead: CanonicalLead; duplicate: boolean }
  | { outcome: "invalid"; fieldErrors: Record<string, string> }
  | { outcome: "rate_limited"; retryAfterSeconds: number }
  /** Bot traffic. The route answers 200 so the bot learns nothing. */
  | { outcome: "discarded"; signal: string };

function buildLead(
  input: LeadInput,
  status: LeadStatus,
  duplicateOf: string,
  fallbackPath: string,
): CanonicalLead {
  const attr = input.attribution ?? EMPTY_ATTRIBUTION;
  const now = new Date().toISOString();

  return {
    id: newLeadId(),
    createdAt: now,
    updatedAt: now,
    schemaVersion: SCHEMA_VERSION,

    name: input.name,
    phone: input.phone,
    email: input.email,
    // A host who leaves WhatsApp blank almost always uses the same number; the
    // founder's reply link needs something to point at. This is a defaulting
    // convenience, not a claim about a second number.
    whatsapp: input.whatsapp || input.phone,
    city: input.city,
    propertyType: input.propertyType ?? "",
    listingUrl: input.listingUrl,
    notes: input.message,
    service: input.service,

    status,
    duplicateOf,

    channel: classifyChannel(attr),
    landingPath: attr.landingPath || fallbackPath,
    formPath: attr.formPath || fallbackPath,
    referrer: attr.referrer,
    campaign: packCampaign(attr),

    delivery: { crm: "skipped", telegram: "skipped", n8n: "skipped" },
  };
}

/**
 * Validate, screen, store and announce one submission.
 *
 * Takes an already-parsed JSON body so the route stays a thin HTTP shell and
 * this function can be exercised directly in tests with no server.
 */
export async function submitLead(body: unknown, ctx: SubmitContext): Promise<SubmitResult> {
  const parsed = leadInputSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { outcome: "invalid", fieldErrors };
  }
  const input = parsed.data;

  // Bots are screened before the rate limiter so a scripted flood cannot use up
  // the bucket that protects a real host sharing the same NAT'd IP.
  const spam = detectAutomation(input);
  if (spam.automated) return { outcome: "discarded", signal: spam.signal };

  const rate = checkRate(ctx.ip);
  if (rate.limited) {
    return { outcome: "rate_limited", retryAfterSeconds: rate.retryAfterSeconds };
  }

  const repo = getLeadRepository();
  const fallbackPath = ctx.fallbackPath ?? "/";

  // Duplicate detection asks the CRM itself, not a process-local cache: on
  // serverless the cache would be empty on a cold instance and a repeat would
  // read as new. A read failure returns null, so it can never block a lead.
  const prior = await repo.findRecentMatch(
    phoneKey(input.phone),
    input.service,
    DUPLICATE_WINDOW_MS,
  );
  const duplicate = prior !== null;

  const lead = buildLead(
    input,
    duplicate ? "Duplicate" : "New",
    prior?.id ?? "",
    fallbackPath,
  );

  const delivery: LeadDelivery = { crm: "skipped", telegram: "skipped", n8n: "skipped" };

  // 1 — the record of truth, first and alone.
  try {
    await repo.create(lead);
    delivery.crm = "ok";
  } catch (e) {
    delivery.crm = "failed";
    // The lead is about to be delivered to Telegram regardless, so this is the
    // one place the details would otherwise be lost. Logged without the
    // visitor's contact details: server logs are not a CRM.
    console.error(`[leads] CRM write failed for ${lead.id}:`, e instanceof Error ? e.message : e);
  }
  lead.delivery.crm = delivery.crm;

  // 2 — notifications, in parallel, each contained.
  const [tg, n8n] = await Promise.allSettled([
    telegramConfigured() ? notifyTelegram(lead) : Promise.resolve(null),
    n8nConfigured() ? forwardToN8n(lead) : Promise.resolve(null),
  ]);

  delivery.telegram = settled(tg);
  delivery.n8n = settled(n8n);
  lead.delivery = delivery;

  if (delivery.telegram === "failed") {
    console.error(`[leads] Telegram notification failed for ${lead.id} — lead is in the CRM`);
  }
  if (delivery.n8n === "failed") {
    console.error(`[leads] n8n forward failed for ${lead.id} — lead is in the CRM`);
  }

  // 3 — record what actually happened on the row itself, so a failed
  // notification is visible in the CRM and not only in a server log nobody
  // reads. Strictly best-effort: the lead is already safe, and losing this
  // patch loses a diagnostic, not a lead.
  if (delivery.crm === "ok") {
    try {
      await repo.updateDelivery(lead.id, delivery);
    } catch {
      /* the row stands with its insert-time delivery cell */
    }
  }

  return { outcome: "accepted", lead, duplicate };
}

function settled(
  r: PromiseSettledResult<{ ok: boolean } | null>,
): LeadDelivery["telegram"] {
  if (r.status === "rejected") return "failed";
  if (r.value === null) return "skipped";
  return r.value.ok ? "ok" : "failed";
}

/* ------------------------------------------------------------------ *
 * Workflow monitoring
 * ------------------------------------------------------------------ */

export type SinkHealth = {
  name: string;
  configured: boolean;
  reachable: boolean;
  detail: string;
};

/**
 * The state of every leg of the pipeline, for the /os Workflow Monitor.
 *
 * "configured but unreachable" and "not configured" are reported as different
 * things, because they need different actions from the founder: one is an
 * outage, the other is a setting that was never filled in. Details are
 * human-readable strings the adapters produce; none of them ever contains a
 * credential.
 */
export async function pipelineHealth(): Promise<SinkHealth[]> {
  const repo = getLeadRepository();
  const [crm, n8n] = await Promise.allSettled([repo.health(), n8nHealth()]);

  const crmHealth =
    crm.status === "fulfilled"
      ? crm.value
      : { configured: true, reachable: false, detail: "health check failed" };

  return [
    { name: `CRM · ${repo.name}`, ...crmHealth },
    {
      // Telegram is checked by configuration only. The alternative — calling
      // getMe on every dashboard poll — spends the bot's rate limit to learn
      // something the last real notification already told us, and that outcome
      // is recorded on each lead row.
      name: "Telegram",
      configured: telegramConfigured(),
      reachable: telegramConfigured(),
      detail: telegramConfigured()
        ? "bot configured · per-lead result on each row"
        : "Set TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID",
    },
    {
      name: "n8n",
      ...(n8n.status === "fulfilled"
        ? n8n.value
        : { configured: true, reachable: false, detail: "health check failed" }),
    },
  ];
}
