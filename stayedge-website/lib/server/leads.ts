import crypto from "node:crypto";
import { z } from "zod";
import "@/lib/server/net";

/**
 * The lead layer — one schema and one delivery fan-out for every form on the
 * site (Free Property Growth Audit, AI Property Video).
 *
 * Architecture: the API route validates and responds; delivery to the sinks is
 * best-effort and never blocks or fails the visitor's submission. Every sink is
 * env-gated, so an unconfigured StayEdge still captures leads (the response
 * tells the caller which sinks actually accepted it) rather than showing a
 * broken form. Sinks, in order of business importance:
 *
 *   1. Google Sheets  — the CRM of record (columns fixed by the V2 brief)
 *   2. Telegram       — the founder's real-time notification
 *   3. n8n WEB-HEAD   — the automation plane (workflows, follow-up sequences)
 *
 * Node runtime only: RS256 JWT signing for the Sheets service account needs
 * node:crypto, so the route that imports this must not run on the edge.
 */

/** The two things a visitor can ask for. Written to the CRM verbatim. */
export const SERVICES = ["Free Property Growth Audit", "AI Property Video"] as const;
export type Service = (typeof SERVICES)[number];

export const PROPERTY_TYPES = [
  "Apartment",
  "Villa",
  "Homestay",
  "Boutique hotel",
  "Serviced apartment",
  "Other",
] as const;

/**
 * Phone/WhatsApp are kept as loose strings rather than a strict E.164 regex:
 * Indian hosts write "+91 63093 48354", "9163093...", "06309348354" and all of
 * them are reachable. Rejecting a real lead over formatting costs more than
 * normalising it downstream.
 */
export const leadSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(7).max(24),
  email: z.string().trim().email().max(200).optional().or(z.literal("")),
  whatsapp: z.string().trim().max(24).optional().or(z.literal("")),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  propertyType: z.enum(PROPERTY_TYPES).optional(),
  listingUrl: z.string().trim().max(500).optional().or(z.literal("")),
  message: z.string().trim().max(1200).optional().or(z.literal("")),
  service: z.enum(SERVICES),
  /** Where the submission came from — a path, not a marketing label. */
  source: z.string().trim().max(120).default("/"),
  /** Honeypot: a real person never fills a field they cannot see. */
  hp: z.string().max(200).optional(),
  /** Client-side render timestamp (ms). Used for the time-to-fill check. */
  renderedAt: z.number().int().nonnegative().optional(),
});

export type Lead = z.infer<typeof leadSchema>;

/* ------------------------------------------------------------------ *
 * Spam + abuse
 * ------------------------------------------------------------------ */

/** A human needs at least a couple of seconds to fill even a short form. */
const MIN_FILL_MS = 2_500;

export function looksAutomated(lead: Lead): boolean {
  if (lead.hp && lead.hp.trim() !== "") return true;
  if (lead.renderedAt && Date.now() - lead.renderedAt < MIN_FILL_MS) return true;
  // Link-stuffed free text is the dominant spam shape on Indian lead forms.
  const links = (lead.message ?? "").match(/https?:\/\//g)?.length ?? 0;
  return links > 1;
}

/**
 * Rate limit + duplicate detection, in process memory.
 *
 * Deliberate limitation: serverless instances don't share this map, so a
 * distributed burst can exceed the limit and a duplicate can slip through on a
 * cold instance. That is acceptable here — this is nuisance control on a
 * low-volume form, not a security boundary, and the alternative (a shared
 * store) is infrastructure this project does not otherwise need. The real
 * duplicate authority is the CRM sheet, which the founder reviews.
 */
const RATE_WINDOW_MS = 10 * 60_000;
const RATE_MAX = 5;
const DUPLICATE_WINDOW_MS = 24 * 60 * 60_000;

const hits = new Map<string, number[]>();
const seen = new Map<string, number>();

function sweep(now: number) {
  for (const [k, ts] of hits) {
    const keep = ts.filter((t) => now - t < RATE_WINDOW_MS);
    if (keep.length) hits.set(k, keep);
    else hits.delete(k);
  }
  for (const [k, t] of seen) {
    if (now - t > DUPLICATE_WINDOW_MS) seen.delete(k);
  }
}

export function rateLimited(ip: string): boolean {
  const now = Date.now();
  sweep(now);
  const ts = hits.get(ip) ?? [];
  if (ts.length >= RATE_MAX) return true;
  ts.push(now);
  hits.set(ip, ts);
  return false;
}

/** True when this person has already asked for this service recently. */
export function isDuplicate(lead: Lead): boolean {
  const digits = lead.phone.replace(/\D/g, "").slice(-10);
  const key = crypto
    .createHash("sha256")
    .update(`${digits}|${lead.service}`)
    .digest("hex");
  const now = Date.now();
  const prev = seen.get(key);
  seen.set(key, now);
  return prev !== undefined && now - prev < DUPLICATE_WINDOW_MS;
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/* ------------------------------------------------------------------ *
 * Sink 1 — Google Sheets (CRM of record)
 * ------------------------------------------------------------------ */

const SHEET_ID = process.env.GOOGLE_SHEETS_ID;
const SA_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const SA_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
/** Column order is fixed by the V2 brief; changing it breaks existing rows. */
const SHEET_RANGE = process.env.GOOGLE_SHEETS_RANGE ?? "Leads!A:K";

function b64url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Mint a Google OAuth access token from the service account, signing the JWT
 * ourselves. googleapis would pull ~15MB of dependency for this one call.
 */
async function sheetsAccessToken(): Promise<string | null> {
  if (!SA_EMAIL || !SA_KEY) return null;
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(
    JSON.stringify({
      iss: SA_EMAIL,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  );
  const signature = b64url(
    crypto.sign("RSA-SHA256", Buffer.from(`${header}.${claims}`), SA_KEY),
  );
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claims}.${signature}`,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { access_token?: string };
  return json.access_token ?? null;
}

async function appendToSheet(lead: Lead, duplicate: boolean): Promise<boolean> {
  if (!SHEET_ID) return false;
  const token = await sheetsAccessToken();
  if (!token) return false;

  // Timestamp, Name, Phone, Email, WhatsApp, City, Property Type, Source,
  // Service Interested, Lead Status, Notes
  const row = [
    new Date().toISOString(),
    lead.name,
    lead.phone,
    lead.email ?? "",
    lead.whatsapp || lead.phone,
    lead.city ?? "",
    lead.propertyType ?? "",
    lead.source,
    lead.service,
    duplicate ? "Duplicate" : "New",
    [lead.listingUrl ? `Listing: ${lead.listingUrl}` : "", lead.message ?? ""]
      .filter(Boolean)
      .join(" — "),
  ];

  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(SHEET_ID)}` +
    `/values/${encodeURIComponent(SHEET_RANGE)}:append` +
    `?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const res = await fetch(url, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ values: [row] }),
    signal: AbortSignal.timeout(10_000),
  });
  return res.ok;
}

/* ------------------------------------------------------------------ *
 * Sink 2 — Telegram (founder notification)
 * ------------------------------------------------------------------ */

const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_CHAT = process.env.TELEGRAM_CHAT_ID;

/** Telegram HTML parse mode: only these three need escaping. */
function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function notifyTelegram(lead: Lead, duplicate: boolean): Promise<boolean> {
  if (!TG_TOKEN || !TG_CHAT) return false;
  const wa = (lead.whatsapp || lead.phone).replace(/\D/g, "");
  const lines = [
    `🔥 <b>NEW STAYEDGE LEAD</b>${duplicate ? " (repeat)" : ""}`,
    "",
    `<b>Name:</b> ${esc(lead.name)}`,
    `<b>Phone:</b> ${esc(lead.phone)}`,
    lead.email ? `<b>Email:</b> ${esc(lead.email)}` : "",
    lead.city ? `<b>City:</b> ${esc(lead.city)}` : "",
    lead.propertyType ? `<b>Property:</b> ${esc(lead.propertyType)}` : "",
    `<b>Wants:</b> ${esc(lead.service)}`,
    lead.listingUrl ? `<b>Listing:</b> ${esc(lead.listingUrl)}` : "",
    lead.message ? `<b>Notes:</b> ${esc(lead.message)}` : "",
    `<b>From:</b> ${esc(lead.source)}`,
    "",
    `Reply on WhatsApp: https://wa.me/${wa}`,
  ].filter(Boolean);

  const res = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: TG_CHAT,
      text: lines.join("\n"),
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  return res.ok;
}

/* ------------------------------------------------------------------ *
 * Sink 3 — n8n WEB-HEAD (automation plane)
 * ------------------------------------------------------------------ */

const N8N_URL = process.env.N8N_LEAD_WEBHOOK_URL;
const N8N_TOKEN = process.env.N8N_WEBHOOK_TOKEN;

async function forwardToN8n(lead: Lead, duplicate: boolean): Promise<boolean> {
  if (!N8N_URL) return false;
  const res = await fetch(N8N_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(N8N_TOKEN ? { authorization: `Bearer ${N8N_TOKEN}` } : {}),
    },
    body: JSON.stringify({ type: "lead", duplicate, ...lead, ts: Date.now() }),
    // n8n cloud can cold-start slowly; it is the least critical sink, so it
    // gets the shortest patience.
    signal: AbortSignal.timeout(12_000),
  });
  return res.ok;
}

/* ------------------------------------------------------------------ */

export type DeliveryResult = {
  sheet: boolean;
  telegram: boolean;
  n8n: boolean;
};

/**
 * Fan out to every configured sink. Failures are contained per-sink: a dead
 * Telegram bot must never cost us the CRM row, and neither must ever surface
 * as an error to the host who just filled the form.
 */
export async function deliverLead(lead: Lead, duplicate: boolean): Promise<DeliveryResult> {
  const [sheet, telegram, n8n] = await Promise.allSettled([
    appendToSheet(lead, duplicate),
    notifyTelegram(lead, duplicate),
    forwardToN8n(lead, duplicate),
  ]);
  const ok = (r: PromiseSettledResult<boolean>) => r.status === "fulfilled" && r.value;
  return { sheet: ok(sheet), telegram: ok(telegram), n8n: ok(n8n) };
}

/** Which sinks are wired at all — surfaced on the /os health dashboard. */
export function leadSinkConfig() {
  return {
    sheet: Boolean(SHEET_ID && SA_EMAIL && SA_KEY),
    telegram: Boolean(TG_TOKEN && TG_CHAT),
    n8n: Boolean(N8N_URL),
  };
}
