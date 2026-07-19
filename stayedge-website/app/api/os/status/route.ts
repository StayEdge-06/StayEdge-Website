import { NextResponse } from "next/server";
import "@/lib/server/net";

/**
 * OS status aggregator — the data source for the internal CEO dashboard (/os).
 * Architecture rule: n8n is the data plane; this route only PROBES and RELAYS.
 * - Integration config presence (which env wiring exists)
 * - Brain reachability (POST {type:"health"} to the WEB-HEAD webhook)
 * - Business metrics relayed from the OS metrics webhook when configured
 * Token-gated: requires ?key= matching OS_DASHBOARD_KEY (internal tool).
 */
export const dynamic = "force-dynamic";

const BRAIN_URL = process.env.N8N_ROAST_WEBHOOK_URL;
const LEAD_URL = process.env.N8N_LEAD_WEBHOOK_URL;
const METRICS_URL = process.env.N8N_METRICS_WEBHOOK_URL;
const TOKEN = process.env.N8N_ROAST_TOKEN;
const DASH_KEY = process.env.OS_DASHBOARD_KEY;

async function probe(url: string | undefined, body: unknown, timeoutMs = 15000) {
  if (!url) return { configured: false, reachable: false };
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(TOKEN ? { authorization: `Bearer ${TOKEN}` } : {}),
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timer);
    return { configured: true, reachable: res.ok };
  } catch {
    return { configured: true, reachable: false };
  }
}

export async function GET(req: Request) {
  const key = new URL(req.url).searchParams.get("key");
  if (!DASH_KEY || key !== DASH_KEY) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const [brain, lead] = await Promise.all([
    probe(BRAIN_URL, { type: "health" }),
    probe(LEAD_URL, { type: "health" }),
  ]);

  // Business metrics come from the OS (single source of truth — no duplication).
  let metrics: Record<string, unknown> | null = null;
  if (METRICS_URL) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(METRICS_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(TOKEN ? { authorization: `Bearer ${TOKEN}` } : {}),
        },
        body: JSON.stringify({ type: "metrics" }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (res.ok) metrics = (await res.json()) as Record<string, unknown>;
    } catch {
      metrics = null;
    }
  }

  return NextResponse.json({
    ok: true,
    ts: Date.now(),
    website: { ok: true },
    integrations: {
      brain,
      lead,
      metrics: { configured: Boolean(METRICS_URL), loaded: metrics !== null },
      ga4: {
        configured: Boolean(
          process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? process.env.NEXT_PUBLIC_GA_ID,
        ),
      },
      clarity: { configured: Boolean(process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID) },
    },
    metrics,
  });
}
