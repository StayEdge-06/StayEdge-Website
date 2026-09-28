/**
 * The shared health shape every integration adapter reports in.
 *
 * Client-safe on purpose (no `node:`/`next/headers` imports) — it is the one
 * type both the server (repository/service/notifier health checks) and the
 * /os dashboard client component import, instead of each hand-declaring the
 * same three fields and drifting apart. A `type`-only import erases to
 * nothing in the client bundle, so this costs the dashboard zero bytes.
 *
 * Phase 5 (§8, Error + Observability Architecture): this is the seam a future
 * integration (a database, a real CRM, the AI Website Service) reports
 * through — add a health() function returning this shape and it slots into
 * the same Workflow Monitor / Website Health surfaces with no new plumbing.
 */
export type IntegrationHealth = {
  /** Credentials/target are present in the environment. */
  configured: boolean;
  /** A real round-trip succeeded just now (or, for config-only checks, the
   * same as `configured` — see individual adapters for which they do). */
  reachable: boolean;
  /** Human-readable, safe to show on the internal dashboard. Never a secret,
   * never a raw upstream error body. */
  detail: string;
};

/** IntegrationHealth plus which integration it describes — one row of the
 * /os Workflow Monitor. */
export type NamedIntegrationHealth = IntegrationHealth & { name: string };
