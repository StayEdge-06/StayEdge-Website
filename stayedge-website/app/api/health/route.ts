import { NextResponse } from "next/server";

/**
 * Website health probe — polled by the StayEdge OS monitoring layer (n8n
 * schedule) so the founder is notified if the website goes down. Cheap, no
 * dependencies, no caching.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "stayedge-website",
    ts: Date.now(),
  });
}
