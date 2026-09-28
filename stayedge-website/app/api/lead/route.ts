import { NextResponse } from "next/server";
import { clientIp } from "@/lib/server/leads/abuse";
import { submitLead } from "@/lib/server/leads/service";

/**
 * The one lead endpoint. Every form on the site posts here.
 *
 * This file is deliberately thin: it speaks HTTP (status codes, headers, JSON)
 * and nothing else. Validation, spam control, duplicate detection, storage and
 * notification all live in the lead service, so the same rules apply no matter
 * what calls them — a future server action, an admin re-submit, or a test.
 *
 * RESPONSE CONTRACT
 *   200 { ok: true, id, duplicate, delivered }  accepted (delivered is per-sink)
 *   200 { ok: true, id: null, delivered: null } silently discarded as automated
 *   400 { ok: false, error: "invalid", fields } field-level validation messages
 *   429 { ok: false, error: "rate_limited" }    with a Retry-After header
 *
 * WHY BOTS GET A 200: a spammer who receives a 4xx simply retries with the trap
 * field removed. A silent 200 teaches them nothing and costs a false positive
 * nothing visible either.
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

  const result = await submitLead(body, {
    ip: clientIp(req),
    fallbackPath: new URL(req.url).pathname,
  });

  switch (result.outcome) {
    case "invalid":
      return NextResponse.json(
        { ok: false, error: "invalid", fields: result.fieldErrors },
        { status: 400 },
      );

    case "rate_limited":
      return NextResponse.json(
        { ok: false, error: "rate_limited" },
        {
          status: 429,
          headers: { "retry-after": String(result.retryAfterSeconds) },
        },
      );

    case "discarded":
      // The signal that caught it is never returned — it would tell a bot
      // exactly which check to defeat next.
      return NextResponse.json({ ok: true, id: null, delivered: null });

    case "accepted":
      return NextResponse.json({
        ok: true,
        // The lead id is safe to return and genuinely useful: the founder can
        // ask a host to quote it, and the success screen can show it.
        id: result.lead.id,
        duplicate: result.duplicate,
        delivered: result.lead.delivery,
      });
  }
}
