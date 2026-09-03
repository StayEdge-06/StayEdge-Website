import { NextResponse } from "next/server";
import {
  clientIp,
  deliverLead,
  isDuplicate,
  leadSchema,
  looksAutomated,
  rateLimited,
} from "@/lib/server/leads";

/**
 * The one lead endpoint. Every form on the site (Free Property Growth Audit,
 * AI Property Video) posts here; `lib/server/leads.ts` owns validation, spam
 * control and the delivery fan-out to Sheets / Telegram / n8n.
 *
 * Response contract: `ok` means "we accepted your lead and it is recorded
 * somewhere we will see it". `delivered` reports which sinks took it, so the
 * /os dashboard and the client can tell a wiring problem from a spam block
 * without exposing that detail to the visitor.
 *
 * Node runtime (not edge): the Sheets service-account JWT is signed with
 * node:crypto.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    // Field-level messages so the form can point at the offending input rather
    // than showing one generic failure.
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fields[key]) fields[key] = issue.message;
    }
    return NextResponse.json({ ok: false, error: "invalid", fields }, { status: 400 });
  }

  const lead = parsed.data;

  // Silent success for bots: a spammer that gets a 4xx just retries with the
  // trap field removed, while a false positive on a real host would look like
  // a broken site. Nothing is delivered either way.
  if (looksAutomated(lead)) {
    return NextResponse.json({ ok: true, delivered: null });
  }

  if (rateLimited(clientIp(req))) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "retry-after": "600" } },
    );
  }

  const duplicate = isDuplicate(lead);
  const delivered = await deliverLead(lead, duplicate);

  return NextResponse.json({ ok: true, duplicate, delivered });
}
