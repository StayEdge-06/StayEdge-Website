import { NextResponse } from "next/server";
import { clientIp } from "@/lib/server/leads/abuse";
import {
  clearThrottle,
  createSession,
  loginThrottled,
  osConfigured,
  verifyKey,
} from "@/lib/server/os/auth";

/**
 * POST /api/os/login — exchange the dashboard key for a session cookie.
 *
 * Deliberately uniform failures: a wrong key, an unconfigured deployment and a
 * malformed body all return the same 401 shape. Distinguishing them would tell
 * someone probing the endpoint whether /os exists here at all.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DENY = { ok: false, error: "invalid" } as const;

export async function POST(req: Request) {
  const ip = clientIp(req);

  if (loginThrottled(ip)) {
    return NextResponse.json(
      { ok: false, error: "throttled" },
      { status: 429, headers: { "retry-after": "900" } },
    );
  }

  if (!osConfigured()) return NextResponse.json(DENY, { status: 401 });

  let key = "";
  try {
    const body = (await req.json()) as { key?: unknown };
    key = typeof body.key === "string" ? body.key : "";
  } catch {
    return NextResponse.json(DENY, { status: 401 });
  }

  if (!verifyKey(key)) return NextResponse.json(DENY, { status: 401 });

  clearThrottle(ip);
  await createSession();
  return NextResponse.json({ ok: true });
}
