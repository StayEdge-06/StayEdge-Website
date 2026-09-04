import crypto from "node:crypto";
import {
  COL,
  CRM_COLUMNS,
  CRM_HEADER,
  fromRow,
  isHeaderRow,
  phoneKey as toPhoneKey,
  toRow,
  type CanonicalLead,
  type LeadDelivery,
  type LeadStatus,
  type Service,
} from "../../leads/schema";
import type { LeadListOptions, LeadRepository, RepositoryHealth } from "./repository";

/**
 * Google Sheets adapter — the current CRM of record.
 *
 * A spreadsheet is the right store at this stage: the founder already works in
 * one, it needs no hosting, and every row is editable by hand when a real
 * conversation outruns the software. It is also, unambiguously, a temporary
 * one — hence the port in ./repository.ts. The known limits are stated on the
 * dashboard rather than hidden: no transactions, no indexes, and a full-column
 * read for every query.
 *
 * The REST API is called directly and the service-account JWT is signed here.
 * Pulling in googleapis would add ~15MB of dependency for two endpoints.
 */

const SHEET_ID = process.env.GOOGLE_SHEETS_ID;
const SA_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const SA_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

/**
 * Only the TAB NAME is taken from configuration; the column span is always
 * A:U, computed from the canonical schema.
 *
 * This is deliberate. GOOGLE_SHEETS_RANGE was "Leads!A:K" through Phase 1 and
 * that value is very likely still sitting in the Vercel dashboard. Honouring it
 * literally would silently truncate every row at column K — losing the lead id,
 * the listing URL and the whole attribution block with no error anywhere. The
 * tab name is the only part of that setting that is a real deployment choice.
 */
const LAST_COL = String.fromCharCode("A".charCodeAt(0) + CRM_COLUMNS.length - 1); // "U"
const TAB = (process.env.GOOGLE_SHEETS_RANGE ?? "Leads!A:K").split("!")[0]!.trim() || "Leads";
const FULL_RANGE = `${TAB}!A:${LAST_COL}`;

const TIMEOUT_MS = 10_000;
/** Sheets is slow to read; the dashboard asks often. One minute is plenty. */
const READ_CACHE_MS = 30_000;

const OAUTH_SCOPE = "https://www.googleapis.com/auth/spreadsheets";

function b64url(input: string | Buffer): string {
  return Buffer.from(input).toString("base64url");
}

/* ------------------------------------------------------------------ *
 * Auth
 * ------------------------------------------------------------------ */

let cachedToken: { value: string; expiresAt: number } | null = null;

/**
 * Mint (and cache) a Google OAuth access token from the service account.
 * Tokens last an hour; re-minting one per request would add an RSA signature
 * and a network round-trip to every dashboard poll.
 */
async function accessToken(): Promise<string | null> {
  if (!SA_EMAIL || !SA_KEY) return null;
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60_000) return cachedToken.value;

  const iat = Math.floor(now / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(
    JSON.stringify({
      iss: SA_EMAIL,
      scope: OAUTH_SCOPE,
      aud: "https://oauth2.googleapis.com/token",
      iat,
      exp: iat + 3600,
    }),
  );

  let assertion: string;
  try {
    const signature = b64url(
      crypto.sign("RSA-SHA256", Buffer.from(`${header}.${claims}`), SA_KEY),
    );
    assertion = `${header}.${claims}.${signature}`;
  } catch {
    // A malformed GOOGLE_PRIVATE_KEY (the classic: literal \n never unescaped)
    // fails here, not at the network. Say so without echoing the key.
    throw new Error("sheets_bad_private_key");
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`sheets_auth_${res.status}`);
  const json = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!json.access_token) throw new Error("sheets_auth_no_token");

  cachedToken = {
    value: json.access_token,
    expiresAt: now + (json.expires_in ?? 3600) * 1000,
  };
  return cachedToken.value;
}

async function api(
  path: string,
  init: RequestInit & { query?: Record<string, string> } = {},
): Promise<Response> {
  const token = await accessToken();
  if (!token) throw new Error("sheets_not_configured");
  const url = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(SHEET_ID!)}${path}`,
  );
  for (const [k, v] of Object.entries(init.query ?? {})) url.searchParams.set(k, v);

  const res = await fetch(url, {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      ...(init.headers ?? {}),
    },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) {
    // A 401 usually means the cached token went stale early; drop it so the
    // next call re-mints instead of failing identically.
    if (res.status === 401) cachedToken = null;
    throw new Error(`sheets_http_${res.status}`);
  }
  return res;
}

/* ------------------------------------------------------------------ *
 * Reads
 * ------------------------------------------------------------------ */

let cachedRows: { rows: string[][]; at: number } | null = null;

async function readRows(force = false): Promise<string[][]> {
  const now = Date.now();
  if (!force && cachedRows && now - cachedRows.at < READ_CACHE_MS) return cachedRows.rows;

  const res = await api(`/values/${encodeURIComponent(FULL_RANGE)}`, {
    method: "GET",
    query: { majorDimension: "ROWS" },
  });
  const json = (await res.json()) as { values?: string[][] };
  const rows = (json.values ?? []).filter((r) => r.some((c) => (c ?? "").trim() !== ""));
  cachedRows = { rows, at: now };
  return rows;
}

/** Data rows only, newest first, with their 1-based sheet row number. */
async function readLeads(force = false): Promise<Array<{ lead: CanonicalLead; rowNumber: number }>> {
  const rows = await readRows(force);
  const out: Array<{ lead: CanonicalLead; rowNumber: number }> = [];
  rows.forEach((row, i) => {
    if (i === 0 && isHeaderRow(row)) return;
    out.push({ lead: fromRow(row), rowNumber: i + 1 });
  });
  // Sheet order is append order; the newest lead is the last row. Sorting by
  // timestamp instead would misplace hand-entered rows with no timestamp.
  return out.reverse();
}

/* ------------------------------------------------------------------ *
 * Writes
 * ------------------------------------------------------------------ */

/**
 * Put the canonical header in row 1 of an empty sheet, so the CRM documents
 * itself and a human reading the tab knows what column R means. Only ever
 * writes into a genuinely empty sheet — an existing sheet is never rewritten,
 * because that would clobber a founder's own header edits.
 */
async function ensureHeader(): Promise<void> {
  const rows = await readRows(true);
  if (rows.length > 0) return;
  await api(`/values/${encodeURIComponent(`${TAB}!A1`)}`, {
    method: "PUT",
    query: { valueInputOption: "RAW" },
    body: JSON.stringify({ values: [CRM_HEADER] }),
  });
  cachedRows = null;
}

/**
 * Find the row carrying this lead id and write one cell, always stamping
 * Updated At alongside it. Returns false when the id is not in the sheet —
 * which is the normal answer for a lead the founder deleted by hand.
 *
 * Sheets has no index, so the id is found by scanning the rows we just read.
 * At this volume that is a single API call and a linear walk over a few hundred
 * strings; it is called out as a known scaling limit rather than hidden.
 */
async function patchCells(id: string, column: number, value: string): Promise<boolean> {
  if (!SHEET_ID || !id) return false;
  const hit = (await readLeads(true)).find((r) => r.lead.id === id);
  if (!hit) return false;

  const cell = (c: number) => `${TAB}!${String.fromCharCode(65 + c)}${hit.rowNumber}`;

  await api(`/values:batchUpdate`, {
    method: "POST",
    body: JSON.stringify({
      valueInputOption: "RAW",
      data: [
        { range: cell(column), values: [[value]] },
        { range: cell(COL.updatedAt), values: [[new Date().toISOString()]] },
      ],
    }),
  });
  cachedRows = null;
  return true;
}

export class GoogleSheetsLeadRepository implements LeadRepository {
  readonly name = "google-sheets";
  readonly persists = true;

  async create(lead: CanonicalLead): Promise<void> {
    if (!SHEET_ID) throw new Error("sheets_not_configured");
    await ensureHeader();

    await api(`/values/${encodeURIComponent(FULL_RANGE)}:append`, {
      method: "POST",
      query: {
        // RAW, never USER_ENTERED.
        //
        // USER_ENTERED makes Sheets interpret the cell the way a typing human
        // would — which means a lead who enters `=IMPORTXML(...)` as their name
        // gets that formula EXECUTED inside the founder's private CRM, with the
        // founder's Google identity, on every open. That is spreadsheet formula
        // injection and it is a real attack against a public form. RAW stores
        // exactly the characters submitted and renders them as text.
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
      },
      body: JSON.stringify({ values: [toRow(lead)] }),
    });
    cachedRows = null;
  }

  async findRecentMatch(
    key: string,
    service: Service,
    windowMs: number,
  ): Promise<CanonicalLead | null> {
    if (!SHEET_ID) return null;
    try {
      const leads = await readLeads();
      const cutoff = Date.now() - windowMs;
      for (const { lead } of leads) {
        if (lead.service !== service) continue;
        if (toPhoneKey(lead.phone) !== key) continue;
        const t = Date.parse(lead.createdAt);
        // A row with an unparseable timestamp still counts as a match: a human
        // typed it in, which is stronger evidence of a real prior contact than
        // a machine timestamp would be.
        if (Number.isNaN(t) || t >= cutoff) return lead;
      }
      return null;
    } catch {
      // Read failures must never cost us a lead. Falling through means the
      // submission is simply not marked as a duplicate.
      return null;
    }
  }

  async list(options: LeadListOptions = {}): Promise<CanonicalLead[]> {
    if (!SHEET_ID) return [];
    const leads = (await readLeads()).map((r) => r.lead);
    const filtered = leads.filter(
      (l) =>
        (!options.status || l.status === options.status) &&
        (!options.service || l.service === options.service),
    );
    return options.limit ? filtered.slice(0, options.limit) : filtered;
  }

  async updateStatus(id: string, status: LeadStatus): Promise<boolean> {
    return patchCells(id, COL.status, status);
  }

  async updateDelivery(id: string, delivery: LeadDelivery): Promise<boolean> {
    // The cell text is produced by the same column definition that writes it at
    // insert time, so the two can never disagree about the format.
    const cell = String(CRM_COLUMNS[COL.delivery]!.get({ delivery } as CanonicalLead));
    return patchCells(id, COL.delivery, cell);
  }

  async health(): Promise<RepositoryHealth> {
    const configured = Boolean(SHEET_ID && SA_EMAIL && SA_KEY);
    if (!configured) {
      return {
        configured: false,
        reachable: false,
        detail: "Set GOOGLE_SHEETS_ID + service account",
      };
    }
    try {
      const rows = await readRows(true);
      const count = Math.max(0, rows.length - (rows[0] && isHeaderRow(rows[0]) ? 1 : 0));
      return { configured: true, reachable: true, detail: `${TAB} · ${count} rows` };
    } catch (e) {
      // The message is one of our own short codes (sheets_http_403, …) — never
      // Google's response body, which can echo the service-account address.
      return {
        configured: true,
        reachable: false,
        detail: e instanceof Error ? e.message : "unreachable",
      };
    }
  }
}

/** True when the Sheets adapter has everything it needs to run. */
export function sheetsConfigured(): boolean {
  return Boolean(SHEET_ID && SA_EMAIL && SA_KEY);
}
