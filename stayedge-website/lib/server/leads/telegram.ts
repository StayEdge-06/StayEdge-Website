import { whatsappDigits, type CanonicalLead } from "../../leads/schema.ts";
import { withRetry, type Attempt } from "./retry.ts";

/**
 * Telegram notifier — the founder's phone buzzing within seconds of a real
 * enquiry. In practice this is the single highest-value integration on the
 * site: the CRM row is the record, but the notification is what makes a reply
 * happen in ten minutes instead of the next morning.
 *
 * FAILURE CONTRACT (Phase 3 requirement 4): a Telegram failure must never
 * destroy an accepted lead. The CRM write happens FIRST and independently in
 * the service; this function only ever reports back. When it fails, the lead
 * row carries tg=failed, the API response says the notification did not go out,
 * and the /os Workflow Monitor shows Telegram as degraded. Nothing is retried
 * out-of-band and nothing is queued — the lead is already safe in the CRM, and
 * a queue would be infrastructure with its own failure modes for a message the
 * founder can also read on the dashboard.
 */

const TIMEOUT_MS = 8_000;

/** Telegram HTML parse mode: only these three characters need escaping. */
function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function telegramConfigured(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}

/**
 * The message. Optimised for a phone lock screen: who, what they want, and a
 * tappable WhatsApp link, in that order, so the founder can act without opening
 * anything else. Everything is escaped — a lead's own text reaches this message
 * verbatim, so an unescaped "<b>" from a form field would corrupt the markup.
 */
export function buildTelegramMessage(lead: CanonicalLead): string {
  const wa = whatsappDigits(lead.whatsapp || lead.phone);
  const isDuplicate = lead.status === "Duplicate";

  return [
    `${isDuplicate ? "🔁" : "🔥"} <b>${isDuplicate ? "REPEAT ENQUIRY" : "NEW STAYEDGE LEAD"}</b>`,
    "",
    `<b>Name:</b> ${esc(lead.name)}`,
    `<b>Phone:</b> ${esc(lead.phone)}`,
    lead.email ? `<b>Email:</b> ${esc(lead.email)}` : "",
    lead.city ? `<b>City:</b> ${esc(lead.city)}` : "",
    lead.propertyType ? `<b>Property:</b> ${esc(lead.propertyType)}` : "",
    `<b>Wants:</b> ${esc(lead.service)}`,
    lead.listingUrl ? `<b>Listing:</b> ${esc(lead.listingUrl)}` : "",
    lead.notes ? `<b>Notes:</b> ${esc(lead.notes)}` : "",
    "",
    `<b>Channel:</b> ${esc(lead.channel)}${lead.campaign ? ` · ${esc(lead.campaign)}` : ""}`,
    `<b>Page:</b> ${esc(lead.formPath)}`,
    `<b>Lead ID:</b> ${esc(lead.id)}`,
    isDuplicate && lead.duplicateOf ? `<i>Repeat of ${esc(lead.duplicateOf)}</i>` : "",
    "",
    wa ? `Reply on WhatsApp: https://wa.me/${wa}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function notifyTelegram(
  lead: CanonicalLead,
): Promise<{ ok: boolean; detail: string; attempts: number }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return { ok: false, detail: "not_configured", attempts: 0 };

  const text = buildTelegramMessage(lead);

  const result = await withRetry(async (): Promise<Attempt> => {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chat,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    // The response body can echo the bot token in some error shapes, so only
    // the status code is ever kept.
    return { ok: res.ok, status: res.status, detail: res.ok ? "sent" : `http_${res.status}` };
  });

  return { ok: result.ok, detail: result.detail, attempts: result.attempts };
}
