"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * CEO Dashboard v1 — live view of the acquisition machine.
 * n8n is the data plane; this view polls /api/os/status every 60s.
 * Metric tiles read from the OS metrics webhook when configured; until then
 * they show honest "connect" states (never invented numbers — brand law).
 */
type Status = {
  ok: boolean;
  ts: number;
  integrations: {
    brain: { configured: boolean; reachable: boolean };
    lead: { configured: boolean; reachable: boolean };
    metrics: { configured: boolean; loaded: boolean };
    ga4: { configured: boolean };
    clarity: { configured: boolean };
  };
  metrics: Record<string, unknown> | null;
};

const METRIC_TILES: { key: string; label: string }[] = [
  { key: "visitorsToday", label: "Visitors today" },
  { key: "roastsToday", label: "Roasts today" },
  { key: "roastsCompleted", label: "Completed roasts" },
  { key: "snapshots", label: "Growth Snapshots" },
  { key: "qualifiedLeads", label: "Qualified leads" },
  { key: "discoveryCalls", label: "Discovery calls" },
  { key: "whatsappQueue", label: "WhatsApp queue" },
  { key: "pipelineValue", label: "Pipeline value" },
  { key: "mrr", label: "MRR" },
  { key: "conversionPct", label: "Conversion %" },
];

export function OSDashboard({ dashKey }: { dashKey: string }) {
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/os/status?key=${encodeURIComponent(dashKey)}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("status failed");
      setStatus((await res.json()) as Status);
      setUpdatedAt(new Date());
      setError(false);
    } catch {
      setError(true);
    }
  }, [dashKey]);

  useEffect(() => {
    load();
    const t = setInterval(load, 60_000);
    return () => clearInterval(t);
  }, [load]);

  const i = status?.integrations;

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-14 md:px-8">
      <p className="se-eyebrow mb-2">StayEdge OS</p>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="se-title text-[clamp(24px,4vw,38px)] text-se-offwhite">
          The acquisition machine, live.
        </h1>
        <p className="text-xs text-se-grey-lavender">
          {error
            ? "Status unreachable — retrying"
            : updatedAt
              ? `Updated ${updatedAt.toLocaleTimeString()}`
              : "Loading…"}
        </p>
      </div>

      {/* System health */}
      <h2 className="se-eyebrow mt-10 mb-3">System health</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <HealthTile label="Website" state={status ? "ok" : error ? "down" : "wait"} detail="This surface" />
        <HealthTile
          label="Brain (CAP-001 head)"
          state={!i ? "wait" : !i.brain.configured ? "off" : i.brain.reachable ? "ok" : "down"}
          detail={!i?.brain.configured ? "Set N8N_ROAST_WEBHOOK_URL" : "Roast webhook"}
        />
        <HealthTile
          label="Lead pipeline"
          state={!i ? "wait" : !i.lead.configured ? "off" : i.lead.reachable ? "ok" : "down"}
          detail={!i?.lead.configured ? "Set N8N_LEAD_WEBHOOK_URL" : "CRM + Telegram via OS"}
        />
        <HealthTile
          label="Analytics"
          state={!i ? "wait" : i.ga4.configured || i.clarity.configured ? "ok" : "off"}
          detail={
            !i
              ? ""
              : `GA4 ${i.ga4.configured ? "✓" : "—"} · Clarity ${i.clarity.configured ? "✓" : "—"}`
          }
        />
      </div>

      {/* Business metrics */}
      <h2 className="se-eyebrow mt-10 mb-3">Today&apos;s numbers</h2>
      {status?.metrics ? (
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {METRIC_TILES.map((m) => (
            <div key={m.key} className="rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-4">
              <p className="text-xs text-se-grey-lavender">{m.label}</p>
              <p className="se-num mt-1 text-2xl text-se-offwhite">
                {String(status.metrics?.[m.key] ?? "—")}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-6">
          <p className="text-se-offwhite">
            Metrics flow from the OS (single source of truth — the CRM sheet via n8n).
          </p>
          <p className="mt-1 text-sm text-se-grey-lavender">
            Set N8N_METRICS_WEBHOOK_URL once the WEB-HEAD workflow is live. No numbers are
            invented in the meantime.
          </p>
        </div>
      )}

      {/* Founder tasks — the human queue */}
      <h2 className="se-eyebrow mt-10 mb-3">Founder queue</h2>
      <ul className="space-y-2 text-sm text-se-offwhite/85">
        <li className="rounded-lg border border-[var(--se-line)] bg-se-ground-2 p-3">
          Approve outreach: new website leads arrive on Telegram — paste the Airbnb URL into
          CAP-001 to run Snapshot + WhatsApp.
        </li>
        <li className="rounded-lg border border-[var(--se-line)] bg-se-ground-2 p-3">
          Wire remaining env keys in the hosting dashboard (see .env.example).
        </li>
      </ul>
    </div>
  );
}

function HealthTile({
  label,
  state,
  detail,
}: {
  label: string;
  state: "ok" | "down" | "off" | "wait";
  detail: string;
}) {
  const color =
    state === "ok"
      ? "var(--se-positive)"
      : state === "down"
        ? "var(--se-negative)"
        : "var(--se-grey-lavender)";
  const text = state === "ok" ? "Healthy" : state === "down" ? "Unreachable" : state === "off" ? "Not connected" : "…";
  return (
    <div className="rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-4">
      <div className="flex items-center justify-between">
        <p className="font-body font-bold text-se-offwhite">{label}</p>
        <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      </div>
      <p className="mt-1 text-xs" style={{ color }}>
        {text}
      </p>
      <p className="mt-1 text-xs text-se-grey-lavender">{detail}</p>
    </div>
  );
}
