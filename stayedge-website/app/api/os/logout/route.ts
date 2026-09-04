import { NextResponse } from "next/server";
import { destroySession } from "@/lib/server/os/auth";

/**
 * POST /api/os/logout — clear the session cookie.
 *
 * POST rather than GET so a prefetch, a crawler or an <img src> cannot log the
 * founder out. No authentication check: ending a session you may not have is
 * harmless, and refusing would leak whether one exists.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  await destroySession();
  return NextResponse.json({ ok: true });
}
