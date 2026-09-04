import type { CanonicalLead, LeadDelivery, LeadStatus, Service } from "../../leads/schema";

/**
 * The LeadRepository PORT.
 *
 * This is the seam that keeps the website independent of whatever is storing
 * leads this quarter. Today the only adapter that persists is Google Sheets;
 * when the volume justifies Postgres, Supabase or a real CRM, the replacement
 * implements this interface and nothing else in the codebase changes — not the
 * form, not the API route, not the dashboard.
 *
 * The interface is deliberately narrow. Everything on it exists because a
 * screen or a rule needs it:
 *   create           — the submission itself
 *   findRecentMatch  — duplicate detection against the record of truth
 *   list             — Recent Leads and the pipeline summary on /os
 *   updateStatus     — the founder moving a lead along on /os
 *   updateDelivery   — recording whether the notifications actually went out
 *   health           — the Workflow Monitor tile
 *
 * Anything wider (arbitrary queries, joins, pagination cursors) would leak the
 * shape of one particular store into the callers and defeat the point.
 */

export type LeadListOptions = {
  /** Newest first. Adapters may cap this; callers must not assume more. */
  limit?: number;
  status?: LeadStatus;
  service?: Service;
};

export type RepositoryHealth = {
  /** Credentials/target are present in the environment. */
  configured: boolean;
  /** A real round-trip succeeded just now. */
  reachable: boolean;
  /** Human-readable, safe to show on the internal dashboard. Never a secret. */
  detail: string;
};

export interface LeadRepository {
  /** Stable identifier for the dashboard, e.g. "google-sheets". */
  readonly name: string;
  /** False for the development/no-op adapter, so callers can say so honestly. */
  readonly persists: boolean;

  /** Throws on failure — the caller decides what a failed CRM write means. */
  create(lead: CanonicalLead): Promise<void>;

  /**
   * The most recent lead from the same phone for the same service inside the
   * window, or null. Returns null (rather than throwing) when the adapter
   * cannot read: a duplicate check that fails must not block a real lead.
   */
  findRecentMatch(
    phoneKey: string,
    service: Service,
    windowMs: number,
  ): Promise<CanonicalLead | null>;

  list(options?: LeadListOptions): Promise<CanonicalLead[]>;

  /** False when the lead id was not found. Throws only on transport failure. */
  updateStatus(id: string, status: LeadStatus): Promise<boolean>;

  /**
   * Record the per-sink delivery outcome after the notifications have run.
   *
   * This exists because the row has to be written BEFORE Telegram and n8n are
   * attempted — the lead must be safe first — which means the outcomes are not
   * known yet at insert time. Rather than leave a permanently misleading
   * "skipped" in the Delivery cell, the service patches it once the answers are
   * in. Best-effort by contract: a failed patch loses a diagnostic, never a lead.
   */
  updateDelivery(id: string, delivery: LeadDelivery): Promise<boolean>;

  health(): Promise<RepositoryHealth>;
}
