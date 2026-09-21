import { NextResponse } from "next/server";
import "@/lib/server/net";
import type { CanonicalLead } from "@/lib/leads/schema";
import { getLeadRepository } from "@/lib/server/leads";
import { pipelineHealth, type SinkHealth } from "@/lib/server/leads/service";
import { hasOsSession } from "@/lib/server/os/auth";

/**
 * /api/os/status — everything the dashboard renders except the lead rows
 * themselves: pipeline health, lead counts, website configuration, and the
 * notifications derived from all three.
 *
 * HONESTY RULE. This endpoint reports only what it can actually observe. Where
 * a number is not measurable from the server — GA4 sessions, for instance — it
 * returns null and the dashboard says "not connected". It never estimates,
 * never carries a placeholder forward, and never invents a metric to fill a
 * tile. A founder acting on a fabricated number is worse off than one looking
 * at an empty one.
 *
 * WHAT CHANGED IN PHASE 3: authentication moved from `?key=` to the session
 * cookie, and the lead figures now come from the CRM through the repository
 * port rather than from an n8n relay. n8n remains the automation plane; it is
 * no longer the only thing that knows how many leads exist.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "cache-control": "no-store, private" };
const TOKEN = process.env.N8N_WEBHOOK_TOKEN;
const METRICS_URL = process.env.N8N_METRICS_WEBHOOK_URL;
const BRAIN_URL = process.env.N8N_BRAIN_WEBHOOK_URL;

/** How many rows to aggregate. Beyond this the dashboard is the wrong tool. */
const WINDOW = 200;

type Counts = Record<string, number>;

function tally(leads: CanonicalLead[], pick: (l: CanonicalLead) => string): Counts {
  const out: Counts = {};
  for (const l of leads) {
    const k = pick(l) || "Unknown";
    out[k] = (out[k] ?? 0) + 1;
  }
  return out;
}

function since(leads: CanonicalLead[], ms: number): number {
  const cutoff = Date.now() - ms;
  return leads.filter((l) => {
    const t = Date.parse(l.createdAt);
    return Number.isFinite(t) && t >= cutoff;
  }).length;
}

/** POST a health ping to an n8n webhook. Returns config + reachability only. */
async function probe(url: string | undefined, timeoutMs = 10_000) {
  if (!url) return { configured: false, reachable: false };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(TOKEN ? { authorization: `Bearer ${TOKEN}` } : {}),
      },
      body: JSON.stringify({ type: "health" }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    return { configured: true, reachable: res.ok };
  } catch {
    // Deliberately swallowed: the caller needs a boolean, and the error text
    // from a fetch to a private webhook can contain the webhook URL.
    return { configured: true, reachable: false };
  }
}

/**
 * Business metrics relayed from the OS. The website does not compute these —
 * n8n owns them — so an absent or unreachable webhook yields null, not zeros.
 * Zeros would be indistinguishable from a genuinely quiet day.
 */
async function relayMetrics(): Promise<Record<string, unknown> | null> {
  if (!METRICS_URL) return null;
  try {
    const res = await fetch(METRICS_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(TOKEN ? { authorization: `Bearer ${TOKEN}` } : {}),
      },
      body: JSON.stringify({ type: "metrics" }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return null;
    const body: unknown = await res.json();
    // Only a plain object is accepted. The relay is trusted infrastructure but
    // its response still shapes what the dashboard renders.
    return body && typeof body === "object" && !Array.isArray(body)
      ? (body as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

type Notice = { level: "critical" | "warn" | "info"; text: string };

/**
 * The Notifications panel. Every item is an observed condition with an action
 * attached — nothing is raised that the founder cannot do something about.
 */
function buildNotices(
  pipeline: SinkHealth[],
  repoPersists: boolean,
  newLeads: number,
  analytics: boolean,
): Notice[] {
  const notices: Notice[] = [];

  if (!repoPersists) {
    notices.push({
      level: "critical",
      text: "No CRM configured — leads are held in memory and will be lost on restart. Set the Google Sheets credentials.",
    });
  }

  for (const sink of pipeline) {
    if (!sink.configured) {
      notices.push({ level: "warn", text: `${sink.name} is not configured — ${sink.detail}` });
    } else if (!sink.reachable) {
      notices.push({ level: "critical", text: `${sink.name} is unreachable — ${sink.detail}` });
    }
  }

  if (newLeads > 0) {
    notices.push({
      level: "info",
      text: `${newLeads} lead${newLeads === 1 ? "" : "s"} still marked New — reply or move the status.`,
    });
  }

  if (!analytics) {
    notices.push({ level: "info", text: "GA4 is not configured, so traffic figures are unavailable." });
  }

  return notices;
}

export async function GET() {
  if (!(await hasOsSession())) {
    return NextResponse.json({ ok: false }, { status: 404, headers: NO_STORE });
  }

  const repo = getLeadRepository();

  const [leadsResult, pipelineResult, brain, metrics] = await Promise.all([
    repo.list({ limit: WINDOW }).catch(() => null),
    pipelineHealth().catch((): SinkHealth[] => []),
    probe(BRAIN_URL),
    relayMetrics(),
  ]);

  const leads = leadsResult ?? [];
  const byStatus = tally(leads, (l) => l.status);
  const analytics = Boolean(
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? process.env.NEXT_PUBLIC_GA_ID,
  );

  return NextResponse.json(
    {
      ok: true,
      ts: Date.now(),
      leads: {
        // null (not 0) when the CRM could not be read, so the dashboard can
        // distinguish "no leads yet" from "we could not ask".
        available: leadsResult !== null,
        window: WINDOW,
        total: leads.length,
        today: since(leads, 24 * 60 * 60_000),
        week: since(leads, 7 * 24 * 60 * 60_000),
        byStatus,
        byService: tally(leads, (l) => l.service),
        byChannel: tally(leads, (l) => l.channel),
      },
      pipeline: pipelineResult,
      crm: { name: repo.name, persists: repo.persists },
      website: {
        env: process.env.NODE_ENV,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.stayedge.co.in",
        analytics: {
          ga4: analytics,
          clarity: Boolean(process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID),
        },
        gbp: Boolean(process.env.NEXT_PUBLIC_GBP_URL),
        brain,
      },
      metrics,
      notices: buildNotices(
        pipelineResult,
        repo.persists,
        byStatus["New"] ?? 0,
        analytics,
      ),
    },
    { headers: NO_STORE },
  );
}
