import { z } from "zod";

/**
 * THE CANONICAL LEAD SCHEMA — one definition, used everywhere.
 *
 *   LeadForm (browser)
 *     -> POST /api/lead
 *       -> LeadService (lib/server/leads/service.ts)
 *         -> LeadRepository port
 *           -> Google Sheets adapter  (today's CRM)
 *         -> Telegram notifier
 *         -> n8n webhook
 *   /os dashboard reads back through the same port and the same schema.
 *
 * ARCHITECTURAL RULE: nothing downstream may invent its own lead shape. If a
 * new surface needs a field, it is added here first — the CRM column list, the
 * Telegram message, the n8n payload and the dashboard all derive from this
 * file, so a field added here appears everywhere consistently and a field
 * added anywhere else is a bug.
 *
 * This module is CLIENT-SAFE on purpose: the browser form imports the same
 * validation the server enforces, so the two can never drift. That means no
 * node: imports, no process.env, no secrets. Server-only concerns (persistence,
 * credentials, notification) live under lib/server/leads/.
 *
 * Sibling modules are imported by RELATIVE path rather than the "@/" alias so
 * the pure logic runs under `node --test` with no build step and no bundler.
 */

/**
 * Bumped when the CRM column list changes. Written into every row so a future
 * migration can tell which rows were produced by which contract.
 *   v1  — Phase 1: columns A:K, source held a URL path.
 *   v2  — Phase 3: columns A:U, Source holds a marketing channel and the path
 *         moved to its own Landing Path column.
 */
export const SCHEMA_VERSION = "v2";

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
export type PropertyType = (typeof PROPERTY_TYPES)[number];

/**
 * The founder's pipeline, in the order a lead moves through it. "Duplicate" and
 * "Spam" are terminal side-states, not stages. The dashboard offers exactly
 * these and the CRM column is validated against them, so a typed-in status in
 * the sheet can never become an unknown state the dashboard cannot render.
 */
export const LEAD_STATUSES = [
  "New",
  "Contacted",
  "Qualified",
  "Audit Sent",
  "Proposal Sent",
  "Won",
  "Lost",
  "Duplicate",
  "Spam",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

/**
 * Marketing channels the pipeline can distinguish.
 *
 * "Unknown" is a first-class value, not a failure: a visitor who arrives with
 * no referrer and no campaign tags genuinely cannot be attributed, and guessing
 * would poison every channel decision made from this data later. See
 * ./attribution.ts for exactly which evidence produces which value.
 */
export const CHANNELS = [
  "Organic Search",
  "Google Business Profile",
  "WhatsApp",
  "Instagram",
  "LinkedIn",
  "Facebook",
  "X",
  "YouTube",
  "Paid",
  "Referral",
  "Direct",
  "Unknown",
] as const;
export type Channel = (typeof CHANNELS)[number];

/* ------------------------------------------------------------------ *
 * Normalisation
 * ------------------------------------------------------------------ */

/**
 * Indian hosts write their number as "+91 63093 48354", "9163093 48354",
 * "06309348354" and "6309348354" — all the same reachable person. We keep the
 * raw string for display (it is how they wrote it) and derive a stable key for
 * matching. Last 10 digits is the right key for India: it survives the country
 * code, the leading zero and every spacing style.
 */
export function phoneKey(phone: string): string {
  return phone.replace(/\D/g, "").slice(-10);
}

/** wa.me needs digits only, with the country code. Assumes +91 when absent. */
export function whatsappDigits(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.length === 10) return `91${d}`;
  if (d.length === 11 && d.startsWith("0")) return `91${d.slice(1)}`;
  return d;
}

/* ------------------------------------------------------------------ *
 * What the browser sends
 * ------------------------------------------------------------------ */

/**
 * A listing link is the single most valuable optional field — it is what makes
 * the first reply specific. It is also the one free-text field that gets echoed
 * into a Telegram message the founder will tap, so it is validated as a real
 * http(s) URL rather than trusted. javascript:, data: and relative strings are
 * rejected outright.
 */
const listingUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^https?:\/\/[^\s]+\.[^\s]+/i.test(v), {
    message: "Please paste a full link starting with https://",
  });

export const attributionInputSchema = z.object({
  /**
   * True once the client-side capture has actually run. This is what separates
   * "we looked and there was nothing to see" (Direct) from "we never looked"
   * (Unknown) — without it, a lead that arrived through a path where capture
   * never ran would be silently filed as Direct, which is a fabricated claim.
   */
  captured: z.boolean().default(false),
  /** Path the visitor first landed on in this session. */
  landingPath: z.string().trim().max(300).default("/"),
  /** Path the form itself was submitted from. */
  formPath: z.string().trim().max(300).default("/"),
  /** document.referrer at first landing. Empty string is meaningful: direct. */
  referrer: z.string().trim().max(500).default(""),
  utmSource: z.string().trim().max(120).default(""),
  utmMedium: z.string().trim().max(120).default(""),
  utmCampaign: z.string().trim().max(160).default(""),
  utmTerm: z.string().trim().max(160).default(""),
  utmContent: z.string().trim().max(160).default(""),
  /** gclid / fbclid / msclkid — presence alone proves a paid click. */
  clickId: z.string().trim().max(200).default(""),
});

export type AttributionInput = z.infer<typeof attributionInputSchema>;

export const EMPTY_ATTRIBUTION: AttributionInput = {
  captured: false,
  landingPath: "/",
  formPath: "/",
  referrer: "",
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmTerm: "",
  utmContent: "",
  clickId: "",
};

/**
 * The wire contract for POST /api/lead.
 *
 * Only name and phone are required. Every additional required field on an
 * Indian mobile form costs completions, and a name plus a reachable number is
 * already enough to do the work and reply.
 */
export const leadInputSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a reachable phone number")
    .max(24)
    .refine((v) => phoneKey(v).length >= 7, {
      message: "That doesn't look like a phone number",
    }),
  email: z.string().trim().email("Please check this email address").max(200).or(z.literal("")).default(""),
  whatsapp: z.string().trim().max(24).default(""),
  city: z.string().trim().max(80).default(""),
  propertyType: z.enum(PROPERTY_TYPES).optional(),
  listingUrl: listingUrl.default(""),
  message: z.string().trim().max(1200).default(""),
  service: z.enum(SERVICES),
  attribution: attributionInputSchema.default(EMPTY_ATTRIBUTION),

  /** Honeypot: a real person never fills a field they cannot see. */
  hp: z.string().max(200).default(""),
  /** Client render timestamp (ms) for the time-to-fill check. */
  renderedAt: z.number().int().nonnegative().optional(),
});

export type LeadInput = z.infer<typeof leadInputSchema>;

/* ------------------------------------------------------------------ *
 * What the system stores
 * ------------------------------------------------------------------ */

/** Per-sink outcome, persisted so a failed notification is never silent. */
export type DeliveryOutcome = "ok" | "failed" | "skipped";

export type LeadDelivery = {
  /** The CRM write. "skipped" means no adapter was configured. */
  crm: DeliveryOutcome;
  telegram: DeliveryOutcome;
  n8n: DeliveryOutcome;
};

/**
 * The canonical lead: the visitor's input plus everything the system decided
 * about it. This is the shape the CRM stores, the dashboard renders and the
 * n8n payload carries.
 */
export type CanonicalLead = {
  id: string;
  createdAt: string;
  updatedAt: string;
  schemaVersion: string;

  name: string;
  phone: string;
  email: string;
  whatsapp: string;
  city: string;
  propertyType: PropertyType | "";
  listingUrl: string;
  notes: string;
  service: Service;

  status: LeadStatus;
  /** Lead id of the earlier submission this one repeats, when known. */
  duplicateOf: string;

  /** Human-readable marketing channel — this is the CRM's "Source" column. */
  channel: Channel;
  landingPath: string;
  formPath: string;
  referrer: string;
  /** Campaign tags, packed for one CRM cell. Empty when none were present. */
  campaign: string;

  delivery: LeadDelivery;
};

/** Stable, sortable, human-quotable on a phone call: SE-20260904-7KQ3M2. */
export function newLeadId(now = new Date()): string {
  const d =
    `${now.getUTCFullYear()}` +
    `${String(now.getUTCMonth() + 1).padStart(2, "0")}` +
    `${String(now.getUTCDate()).padStart(2, "0")}`;
  // Crockford-ish alphabet: no I/O/U/L, so a read-aloud id can't be mistyped.
  const alphabet = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const bytes = new Uint8Array(6);
  globalThis.crypto.getRandomValues(bytes);
  let suffix = "";
  for (const b of bytes) suffix += alphabet[b % alphabet.length];
  return `SE-${d}-${suffix}`;
}

/** Pack the campaign tags into one CRM cell; "" when nothing was tagged. */
export function packCampaign(a: AttributionInput): string {
  const parts: string[] = [];
  if (a.utmSource) parts.push(`source=${a.utmSource}`);
  if (a.utmMedium) parts.push(`medium=${a.utmMedium}`);
  if (a.utmCampaign) parts.push(`campaign=${a.utmCampaign}`);
  if (a.utmTerm) parts.push(`term=${a.utmTerm}`);
  if (a.utmContent) parts.push(`content=${a.utmContent}`);
  if (a.clickId) parts.push(`click=${a.clickId}`);
  return parts.join(" · ");
}

/* ------------------------------------------------------------------ *
 * The CRM column contract
 * ------------------------------------------------------------------ */

/**
 * The sheet's columns, in order. A:K is byte-for-byte the Phase 1 layout so
 * rows already in the sheet still line up; everything from L onward is new.
 *
 * ONE DELIBERATE MEANING CHANGE: column H "Source" held a URL path in v1 and
 * holds a marketing channel in v2, because "Source" in a CRM is the question
 * "where did this person come from", not "which page was the form on" — that
 * moved to its own Landing Path column. Rows written before this release have
 * a path in Source; they are identifiable by an empty Schema Version cell.
 *
 * Changing this array changes the sheet. Append, never reorder.
 */
export const CRM_COLUMNS = [
  { header: "Timestamp", get: (l: CanonicalLead) => l.createdAt },
  { header: "Name", get: (l: CanonicalLead) => l.name },
  { header: "Phone", get: (l: CanonicalLead) => l.phone },
  { header: "Email", get: (l: CanonicalLead) => l.email },
  { header: "WhatsApp", get: (l: CanonicalLead) => l.whatsapp },
  { header: "City", get: (l: CanonicalLead) => l.city },
  { header: "Property Type", get: (l: CanonicalLead) => l.propertyType },
  { header: "Source", get: (l: CanonicalLead) => l.channel },
  { header: "Service Interested", get: (l: CanonicalLead) => l.service },
  { header: "Lead Status", get: (l: CanonicalLead) => l.status },
  { header: "Notes", get: (l: CanonicalLead) => l.notes },
  { header: "Lead ID", get: (l: CanonicalLead) => l.id },
  { header: "Listing URL", get: (l: CanonicalLead) => l.listingUrl },
  { header: "Landing Path", get: (l: CanonicalLead) => l.landingPath },
  { header: "Form Path", get: (l: CanonicalLead) => l.formPath },
  { header: "Referrer", get: (l: CanonicalLead) => l.referrer },
  { header: "Campaign", get: (l: CanonicalLead) => l.campaign },
  { header: "Duplicate Of", get: (l: CanonicalLead) => l.duplicateOf },
  {
    header: "Delivery",
    get: (l: CanonicalLead) =>
      `crm=${l.delivery.crm} tg=${l.delivery.telegram} n8n=${l.delivery.n8n}`,
  },
  { header: "Updated At", get: (l: CanonicalLead) => l.updatedAt },
  { header: "Schema Version", get: (l: CanonicalLead) => l.schemaVersion },
] as const;

/** Column index of the fields the dashboard writes back. Zero-based. */
export const COL = {
  timestamp: 0,
  name: 1,
  phone: 2,
  email: 3,
  whatsapp: 4,
  city: 5,
  propertyType: 6,
  source: 7,
  service: 8,
  status: 9,
  notes: 10,
  id: 11,
  listingUrl: 12,
  landingPath: 13,
  formPath: 14,
  referrer: 15,
  campaign: 16,
  duplicateOf: 17,
  delivery: 18,
  updatedAt: 19,
  schemaVersion: 20,
} as const;

export const CRM_HEADER: string[] = CRM_COLUMNS.map((c) => c.header);

/** The lead as one sheet row, in canonical column order. */
export function toRow(lead: CanonicalLead): string[] {
  return CRM_COLUMNS.map((c) => String(c.get(lead) ?? ""));
}

function pick(row: string[], i: number): string {
  return (row[i] ?? "").toString().trim();
}

function asStatus(v: string): LeadStatus {
  return (LEAD_STATUSES as readonly string[]).includes(v) ? (v as LeadStatus) : "New";
}

function asChannel(v: string): Channel {
  return (CHANNELS as readonly string[]).includes(v) ? (v as Channel) : "Unknown";
}

function asOutcome(v: string | undefined): DeliveryOutcome {
  return v === "ok" || v === "failed" ? v : "skipped";
}

/**
 * Read a sheet row back into a lead. Deliberately total: a row a human edited
 * by hand, or one written by the v1 schema, still produces a renderable lead
 * rather than throwing and blanking the whole dashboard. Unrecognised values
 * fall back ("New", "Unknown") instead of inventing meaning.
 */
export function fromRow(row: string[]): CanonicalLead {
  const delivery = pick(row, COL.delivery);
  const parts = Object.fromEntries(
    delivery
      .split(/\s+/)
      .filter(Boolean)
      .map((p) => p.split("=") as [string, string]),
  );
  const createdAt = pick(row, COL.timestamp);
  const serviceRaw = pick(row, COL.service);

  return {
    id: pick(row, COL.id),
    createdAt,
    updatedAt: pick(row, COL.updatedAt) || createdAt,
    schemaVersion: pick(row, COL.schemaVersion),
    name: pick(row, COL.name),
    phone: pick(row, COL.phone),
    email: pick(row, COL.email),
    whatsapp: pick(row, COL.whatsapp),
    city: pick(row, COL.city),
    propertyType: (PROPERTY_TYPES as readonly string[]).includes(pick(row, COL.propertyType))
      ? (pick(row, COL.propertyType) as PropertyType)
      : "",
    listingUrl: pick(row, COL.listingUrl),
    notes: pick(row, COL.notes),
    service: (SERVICES as readonly string[]).includes(serviceRaw)
      ? (serviceRaw as Service)
      : SERVICES[0],
    status: asStatus(pick(row, COL.status)),
    duplicateOf: pick(row, COL.duplicateOf),
    channel: asChannel(pick(row, COL.source)),
    landingPath: pick(row, COL.landingPath),
    formPath: pick(row, COL.formPath),
    referrer: pick(row, COL.referrer),
    campaign: pick(row, COL.campaign),
    delivery: {
      crm: asOutcome(parts.crm),
      telegram: asOutcome(parts.tg),
      n8n: asOutcome(parts.n8n),
    },
  };
}

/** True when a row is the header rather than a lead. */
export function isHeaderRow(row: string[]): boolean {
  return pick(row, 0).toLowerCase() === "timestamp";
}
