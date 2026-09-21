"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LEAD_STATUSES, type CanonicalLead, type LeadStatus } from "@/lib/leads/schema";
import type { NamedIntegrationHealth } from "@/lib/integrations/health";

/**
 * StayEdge OS — the founder's operations view.
 *
 * WHAT THIS IS: one screen answering "what came in, where did it go, and what
 * is broken". Lead overview, the recent leads themselves with editable status,
 * CRM state, analytics, workflow monitor, notifications, website health, and a
 * declared slot for the AI Website Service when it ships.
 *
 * WHAT THIS IS NOT: a client portal. There is exactly one audience — the
 * founder — so there is no per-customer view, no sharing, no invite flow, and
 * nothing here is designed to be shown to a host.
 *
 * THE HONESTY RULE APPLIES TO THE UI TOO. Every number rendered here is a
 * number the server actually measured. Where a figure is unavailable the tile
 * says so and names the setting that would supply it. No placeholder digits,
 * no sample rows, no "example client" — the same law that governs the public
 * site governs the dashboard, because a founder acting on a fabricated number
 * is worse off than one looking at an empty tile.
 */

/** Wire shape from /api/os/status — the same type the server-side health
 * checks report in (lib/integrations/health.ts), imported rather than
 * hand-duplicated so the two can never silently drift apart. */
type SinkHealth = NamedIntegrationHealth;
type Notice = { level: "critical" | "warn" | "info"; text: string };

type Status = {
  ok: boolean;
  ts: number;
  leads: {
    available: boolean;
    window: number;
    total: number;
    today: number;
    week: number;
    byStatus: Record<string, number>;
    byService: Record<string, number>;
    byChannel: Record<string, number>;
  };
  pipeline: SinkHealth[];
  crm: { name: string; persists: boolean };
  website: {
    env: string;
    siteUrl: string;
    analytics: { ga4: boolean; clarity: boolean };
    gbp: boolean;
    brain: { configured: boolean; reachable: boolean };
  };
  metrics: Record<string, unknown> | null;
  notices: Notice[];
};

type LeadsResponse = { ok: true; source: string; persists: boolean; leads: CanonicalLead[] };

const POLL_MS = 60_000;
const RECENT_LIMIT = 25;

export function OSDashboard() {
  const router = useRouter();
  const [status, setStatus] = useState<Status | null>(null);
  const [leads, setLeads] = useState<CanonicalLead[] | null>(null);
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [savingId, setSavingId] = useState("");

  const load = useCallback(async () => {
    try {
      const [s, l] = await Promise.all([
        fetch("/api/os/status", { cache: "no-store" }),
        fetch(`/api/os/leads?limit=${RECENT_LIMIT}`, { cache: "no-store" }),
      ]);
      // A 404 here means the session expired mid-session (the endpoints hide
      // themselves rather than answering 401), so send the founder to sign in
      // again instead of showing a permanently broken screen.
      if (s.status === 404 || l.status === 404) {
        router.replace("/os/login");
        return;
      }
      if (!s.ok) throw new Error("status");
      setStatus((await s.json()) as Status);
      setLeads(l.ok ? ((await l.json()) as LeadsResponse).leads : null);
      setUpdatedAt(new Date());
      setError("");
    } catch {
      setError("Status unreachable — retrying");
    }
  }, [router]);

  useEffect(() => {
    load();
    const t = setInterval(load, POLL_MS);
    return () => clearInterval(t);
  }, [load]);

  async function changeStatus(id: string, next: LeadStatus) {
    setSavingId(id);
    // Optimistic, then reconciled by the reload below. A failed write restores
    // the server's value rather than leaving a lie on screen.
    setLeads((prev) => prev?.map((l) => (l.id === id ? { ...l, status: next } : l)) ?? prev);
    try {
      const res = await fetch("/api/os/leads", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, status: next }),
      });
      if (!res.ok) setError("Status change failed — the CRM rejected the write");
    } catch {
      setError("Status change failed — network error");
    } finally {
      setSavingId("");
      load();
    }
  }

  async function signOut() {
    await fetch("/api/os/logout", { method: "POST" }).catch(() => {});
    router.replace("/os/login");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-[1180px] px-5 py-12 md:px-8">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="se-eyebrow mb-2">StayEdge OS</p>
          <h1 className="se-title text-[clamp(24px,4vw,38px)] text-se-ink">
            The acquisition machine, live.
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-xs text-se-ink-muted" aria-live="polite">
            {error || (updatedAt ? `Updated ${updatedAt.toLocaleTimeString()}` : "Loading…")}
          </p>
          <button
            onClick={signOut}
            className="cursor-pointer rounded-[var(--se-radius-pill)] border border-[var(--se-line-strong)] px-3 py-1.5 text-xs text-se-ink transition-colors hover:bg-[color-mix(in_srgb,var(--se-lavender)_10%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--se-focus)]"
          >
            Sign out
          </button>
        </div>
      </header>

      <Notifications notices={status?.notices ?? []} />

      <LeadOverview status={status} />

      <RecentLeads
        leads={leads}
        available={status?.leads.available ?? true}
        crm={status?.crm ?? null}
        savingId={savingId}
        onChange={changeStatus}
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <WorkflowMonitor pipeline={status?.pipeline ?? null} crm={status?.crm ?? null} />
        <AnalyticsSummary status={status} />
      </div>

      <WebsiteHealth status={status} />

      <AIServiceSlot />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Sections
 * ------------------------------------------------------------------ */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="se-eyebrow mb-3">{title}</h2>
      {children}
    </section>
  );
}

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 ${className}`}
    >
      {children}
    </div>
  );
}

function Notifications({ notices }: { notices: Notice[] }) {
  if (notices.length === 0) return null;
  // Critical first: an unconfigured CRM must not sit below an FYI.
  const order = { critical: 0, warn: 1, info: 2 } as const;
  const sorted = [...notices].sort((a, b) => order[a.level] - order[b.level]);

  return (
    <Section title="Notifications">
      <ul className="space-y-2">
        {sorted.map((n, i) => (
          <li
            key={i}
            className="flex items-start gap-3 rounded-[var(--se-radius-md)] border border-[var(--se-line)] bg-se-ground-2 p-3 text-sm text-se-ink"
          >
            <span
              aria-hidden
              className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
              style={{
                background:
                  n.level === "critical"
                    ? "var(--se-negative)"
                    : n.level === "warn"
                      ? "var(--se-accent)"
                      : "var(--se-ink-muted)",
              }}
            />
            <span>
              <span className="sr-only">{n.level}: </span>
              {n.text}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function LeadOverview({ status }: { status: Status | null }) {
  const l = status?.leads;
  const unreadable = l && !l.available;

  return (
    <Section title="Lead overview">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Last 24 hours" value={unreadable ? null : l?.today} />
        <Stat label="Last 7 days" value={unreadable ? null : l?.week} />
        <Stat
          label={`In view (max ${l?.window ?? 200})`}
          value={unreadable ? null : l?.total}
        />
        <Stat label="Awaiting reply" value={unreadable ? null : l?.byStatus["New"] ?? 0} />
      </div>

      {unreadable && (
        <p className="mt-3 text-sm text-[var(--se-negative-ink)]">
          The CRM could not be read, so these counts are unavailable — see the workflow monitor.
        </p>
      )}

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Distribution title="By status" data={l?.byStatus} />
        <Distribution title="By service" data={l?.byService} />
        <Distribution title="By source" data={l?.byChannel} />
      </div>
    </Section>
  );
}

function Stat({ label, value }: { label: string; value: number | null | undefined }) {
  return (
    <Panel className="p-4">
      <p className="text-xs text-se-ink-muted">{label}</p>
      <p className="se-num mt-1 text-3xl text-se-ink">
        {value === null || value === undefined ? "—" : value}
      </p>
    </Panel>
  );
}

function Distribution({ title, data }: { title: string; data?: Record<string, number> }) {
  const rows = Object.entries(data ?? {}).sort((a, b) => b[1] - a[1]);
  return (
    <Panel className="p-4">
      <p className="text-xs text-se-ink-muted">{title}</p>
      {rows.length === 0 ? (
        <p className="mt-2 text-sm text-se-ink-muted">No leads yet.</p>
      ) : (
        <ul className="mt-2 space-y-1">
          {rows.map(([k, v]) => (
            <li key={k} className="flex items-baseline justify-between gap-3 text-sm text-se-ink">
              <span className="truncate">{k}</span>
              <span className="se-num tabular-nums text-se-ink-muted">{v}</span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

function RecentLeads({
  leads,
  available,
  crm,
  savingId,
  onChange,
}: {
  leads: CanonicalLead[] | null;
  available: boolean;
  crm: { name: string; persists: boolean } | null;
  savingId: string;
  onChange: (id: string, status: LeadStatus) => void;
}) {
  return (
    <Section title="Recent leads">
      {/* The CRM is named on the table itself, not buried in settings: a row
          read from the in-memory adapter and a row read from the founder's
          Sheet look identical otherwise, and only one of them still exists
          tomorrow. */}
      <p className="-mt-1 mb-3 text-xs text-se-ink-muted">
        {crm
          ? `Read live from ${crm.name}${crm.persists ? "" : " · not persisted"} · status changes write straight back`
          : " "}
      </p>
      {leads === null ? (
        <Panel className="p-6">
          <p className="text-se-ink">
            {available ? "Loading…" : "The CRM is not readable right now."}
          </p>
        </Panel>
      ) : leads.length === 0 ? (
        <Panel className="p-6">
          <p className="text-se-ink">No leads yet.</p>
          <p className="mt-1 text-sm text-se-ink-muted">
            Every submission from the Free Property Growth Audit form lands here, on Telegram, and
            in the CRM sheet at the same time.
          </p>
        </Panel>
      ) : (
        // Its own scroll container so a wide table never makes the page itself
        // scroll sideways on a phone.
        <Panel className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--se-line)] text-left text-xs text-se-ink-muted">
                <Th>When</Th>
                <Th>Name</Th>
                <Th>Contact</Th>
                <Th>City</Th>
                <Th>Wants</Th>
                <Th>Source</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-b border-[var(--se-line)] last:border-0">
                  <Td>
                    <span className="whitespace-nowrap text-se-ink-muted">{when(l.createdAt)}</span>
                    <span className="mt-0.5 block font-mono text-[11px] text-se-ink-muted">
                      {l.id}
                    </span>
                  </Td>
                  <Td>
                    <span className="font-bold text-se-ink">{l.name}</span>
                    {l.duplicateOf && (
                      <span className="mt-0.5 block text-[11px] text-se-ink-muted">
                        repeat of {l.duplicateOf}
                      </span>
                    )}
                  </Td>
                  <Td>
                    <a className="block text-se-ink hover:underline" href={`tel:${l.phone}`}>
                      {l.phone}
                    </a>
                    {l.email && (
                      <a
                        className="block truncate text-se-ink-muted hover:underline"
                        href={`mailto:${l.email}`}
                      >
                        {l.email}
                      </a>
                    )}
                    {l.whatsapp && (
                      <a
                        className="block text-xs text-se-ink-muted hover:underline"
                        href={`https://wa.me/${l.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        WhatsApp →
                      </a>
                    )}
                  </Td>
                  <Td>
                    <span className="text-se-ink">{l.city || "—"}</span>
                    {l.propertyType && (
                      <span className="mt-0.5 block text-xs text-se-ink-muted">
                        {l.propertyType}
                      </span>
                    )}
                  </Td>
                  <Td>
                    <span className="text-se-ink">{l.service}</span>
                    {l.listingUrl && (
                      <a
                        className="mt-0.5 block text-xs text-se-ink-muted hover:underline"
                        href={l.listingUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                      >
                        Listing →
                      </a>
                    )}
                  </Td>
                  <Td>
                    <span className="text-se-ink">{l.channel}</span>
                    {l.campaign && (
                      <span className="mt-0.5 block truncate text-xs text-se-ink-muted">
                        {l.campaign}
                      </span>
                    )}
                  </Td>
                  <Td>
                    <label className="sr-only" htmlFor={`status-${l.id}`}>
                      Status for {l.name}
                    </label>
                    <select
                      id={`status-${l.id}`}
                      value={l.status}
                      disabled={savingId === l.id}
                      onChange={(e) => onChange(l.id, e.target.value as LeadStatus)}
                      className="cursor-pointer rounded-[var(--se-radius-md)] border border-[var(--se-line-strong)] bg-se-ground px-2 py-1.5 text-se-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--se-focus)] disabled:opacity-50"
                    >
                      {LEAD_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <DeliveryChips lead={l} />
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </Section>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-body font-bold">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="max-w-[220px] px-4 py-3 align-top">{children}</td>;
}

/**
 * Where each lead actually landed. This is the row-level answer to "did the
 * notification go out?", which is why the workflow monitor does not need to
 * ping Telegram on every poll.
 */
function DeliveryChips({ lead }: { lead: CanonicalLead }) {
  const d = lead.delivery;
  const entries: [string, string][] = [
    ["CRM", d?.crm ?? "?"],
    ["TG", d?.telegram ?? "?"],
    ["n8n", d?.n8n ?? "?"],
  ];
  return (
    <div className="mt-1.5 flex gap-1.5">
      {entries.map(([label, outcome]) => (
        <span
          key={label}
          title={`${label}: ${outcome}`}
          className="rounded px-1.5 py-0.5 text-[10px] font-bold"
          style={{
            color:
              outcome === "ok"
                ? "var(--se-positive-ink)"
                : outcome === "failed"
                  ? "var(--se-negative-ink)"
                  : "var(--se-ink-muted)",
            border: "1px solid var(--se-line)",
          }}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

function WorkflowMonitor({
  pipeline,
  crm,
}: {
  pipeline: SinkHealth[] | null;
  crm: { name: string; persists: boolean } | null;
}) {
  return (
    <Section title="Workflow monitor">
      <Panel className="divide-y divide-[var(--se-line)]">
        {(pipeline ?? []).length === 0 ? (
          <p className="p-4 text-sm text-se-ink-muted">Loading…</p>
        ) : (
          pipeline!.map((s) => {
            const state = !s.configured ? "off" : s.reachable ? "ok" : "down";
            return (
              <div key={s.name} className="flex items-start justify-between gap-4 p-4">
                <div>
                  <p className="font-body font-bold text-se-ink">{s.name}</p>
                  <p className="mt-0.5 text-xs text-se-ink-muted">{s.detail}</p>
                </div>
                <StateBadge state={state} />
              </div>
            );
          })
        )}
        {crm && !crm.persists && (
          <p className="p-4 text-xs text-[var(--se-negative-ink)]">
            Leads are being stored in memory only and will not survive a restart.
          </p>
        )}
      </Panel>
    </Section>
  );
}

function StateBadge({ state }: { state: "ok" | "down" | "off" | "wait" }) {
  const color =
    state === "ok"
      ? "var(--se-positive-ink)"
      : state === "down"
        ? "var(--se-negative-ink)"
        : "var(--se-ink-muted)";
  const text =
    state === "ok"
      ? "Healthy"
      : state === "down"
        ? "Unreachable"
        : state === "off"
          ? "Not connected"
          : "…";
  return (
    <span className="flex shrink-0 items-center gap-2 text-xs" style={{ color }}>
      <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      {text}
    </span>
  );
}

function AnalyticsSummary({ status }: { status: Status | null }) {
  const metrics = status?.metrics ?? null;
  const keys = useMemo(() => Object.keys(metrics ?? {}), [metrics]);

  return (
    <Section title="Analytics summary">
      <Panel className="p-4">
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-se-ink">
          <span>GA4 {status?.website.analytics.ga4 ? "connected" : "not connected"}</span>
          <span>Clarity {status?.website.analytics.clarity ? "connected" : "not connected"}</span>
        </div>

        {metrics && keys.length > 0 ? (
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {keys.map((k) => (
              <div key={k} className="rounded-[var(--se-radius-md)] border border-[var(--se-line)] p-3">
                <dt className="text-xs text-se-ink-muted">{k}</dt>
                <dd className="se-num mt-1 text-xl text-se-ink">{String(metrics[k] ?? "—")}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-3 text-sm text-se-ink-muted">
            Traffic figures come from the OS metrics workflow. Set N8N_METRICS_WEBHOOK_URL to
            populate this panel — nothing is estimated in the meantime. Lead counts above are read
            directly from the CRM and do not depend on it.
          </p>
        )}
      </Panel>
    </Section>
  );
}

function WebsiteHealth({ status }: { status: Status | null }) {
  const w = status?.website;
  return (
    <Section title="Website health">
      <Panel className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Environment" value={w?.env ?? "—"} />
        <Field label="Canonical host" value={w?.siteUrl ?? "—"} />
        <Field
          label="Google Business Profile"
          value={w ? (w.gbp ? "Linked" : "Not linked") : "—"}
        />
        <Field
          label="n8n brain webhook"
          value={
            !w
              ? "—"
              : !w.brain.configured
                ? "Not connected"
                : w.brain.reachable
                  ? "Healthy"
                  : "Unreachable"
          }
        />
      </Panel>
    </Section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-se-ink-muted">{label}</p>
      <p className="mt-1 truncate text-sm text-se-ink" title={value}>
        {value}
      </p>
    </div>
  );
}

/**
 * The declared integration point for the AI Website Service.
 *
 * It is a labelled empty slot on purpose. The architecture it plugs into
 * already exists — a service emits leads or jobs through the same canonical
 * schema, the repository port persists them, and this dashboard reads them —
 * so adding it later is a new section here plus an adapter, not a rewrite.
 * Rendering invented figures for an unbuilt service would be exactly the
 * fabrication this project refuses to ship.
 */
function AIServiceSlot() {
  return (
    <Section title="AI website service">
      <Panel className="border-dashed p-6">
        <p className="text-se-ink">Not built yet.</p>
        <p className="mt-1 text-sm text-se-ink-muted">
          Reserved slot. When the service ships it reports through the same canonical lead schema
          and repository port used by the audit pipeline, so it appears here without an
          architectural change.
        </p>
      </Panel>
    </Section>
  );
}

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

/** Relative for the first day, absolute after — the founder's actual question. */
function when(iso: string): string {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "—";
  const mins = Math.floor((Date.now() - t) / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (mins < 60 * 24) return `${Math.floor(mins / 60)}h ago`;
  return new Date(t).toLocaleDateString();
}
