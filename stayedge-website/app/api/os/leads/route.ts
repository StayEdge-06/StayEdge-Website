import { NextResponse } from "next/server";
import { LEAD_STATUSES, SERVICES, type LeadStatus, type Service } from "@/lib/leads/schema";
import { getLeadRepository } from "@/lib/server/leads";
import { hasOsSession } from "@/lib/server/os/auth";

/**
 * /api/os/leads — the dashboard's read/write view of the CRM.
 *
 * This is the only endpoint on the site that returns personal data (names,
 * phone numbers, email addresses). Three rules follow from that:
 *
 * 1. It is session-gated, and an unauthenticated request gets 404, not 401 —
 *    an internal tool should not confirm its own existence to a stranger.
 * 2. It is never cached. `force-dynamic` plus an explicit no-store header, so
 *    no CDN edge or browser back-button holds a copy of someone's contact
 *    details.
 * 3. Errors are opaque. A Sheets outage returns "crm_unavailable", never
 *    Google's response body, which can contain the spreadsheet ID.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "cache-control": "no-store, private" };

/**
 * Built per call, never shared: a Response body is a stream that can only be
 * read once, so a module-level instance would serve an empty body from the
 * second request onward.
 */
const hidden = () => NextResponse.json({ ok: false }, { status: 404, headers: NO_STORE });

/** Hard ceiling: the dashboard is a working view, not a bulk export. */
const MAX_LIMIT = 200;

function isStatus(v: string | null): v is LeadStatus {
  return Boolean(v) && (LEAD_STATUSES as readonly string[]).includes(v!);
}

function isService(v: string | null): v is Service {
  return Boolean(v) && (SERVICES as readonly string[]).includes(v!);
}

export async function GET(req: Request) {
  if (!(await hasOsSession())) return hidden();

  const params = new URL(req.url).searchParams;
  const status = params.get("status");
  const service = params.get("service");
  const limitRaw = Number(params.get("limit"));
  const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, MAX_LIMIT) : 50;

  const repo = getLeadRepository();
  try {
    const leads = await repo.list({
      limit,
      ...(isStatus(status) ? { status } : {}),
      ...(isService(service) ? { service } : {}),
    });
    return NextResponse.json(
      { ok: true, source: repo.name, persists: repo.persists, count: leads.length, leads },
      { headers: NO_STORE },
    );
  } catch {
    // The adapter has already logged the specific cause server-side.
    return NextResponse.json(
      { ok: false, error: "crm_unavailable" },
      { status: 502, headers: NO_STORE },
    );
  }
}

/**
 * PATCH — move a lead through the pipeline. The only write the dashboard makes.
 *
 * Protected against cross-site writes by the session cookie's SameSite=Lax:
 * a form or fetch on another origin cannot attach it to a PATCH.
 */
export async function PATCH(req: Request) {
  if (!(await hasOsSession())) return hidden();

  let id = "";
  let status = "";
  try {
    const body = (await req.json()) as { id?: unknown; status?: unknown };
    id = typeof body.id === "string" ? body.id.trim() : "";
    status = typeof body.status === "string" ? body.status : "";
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid" },
      { status: 400, headers: NO_STORE },
    );
  }

  // Validated against the canonical list, never written through verbatim — an
  // unchecked value would put arbitrary attacker text into the founder's CRM.
  if (!id || !isStatus(status)) {
    return NextResponse.json(
      { ok: false, error: "invalid" },
      { status: 400, headers: NO_STORE },
    );
  }

  try {
    const updated = await getLeadRepository().updateStatus(id, status);
    if (!updated) {
      return NextResponse.json(
        { ok: false, error: "not_found" },
        { status: 404, headers: NO_STORE },
      );
    }
    return NextResponse.json({ ok: true, id, status }, { headers: NO_STORE });
  } catch {
    return NextResponse.json(
      { ok: false, error: "crm_unavailable" },
      { status: 502, headers: NO_STORE },
    );
  }
}
