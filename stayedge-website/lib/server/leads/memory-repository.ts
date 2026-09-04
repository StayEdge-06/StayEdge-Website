import {
  phoneKey as toPhoneKey,
  type CanonicalLead,
  type LeadDelivery,
  type LeadStatus,
  type Service,
} from "../../leads/schema";
import type { LeadListOptions, LeadRepository, RepositoryHealth } from "./repository";

/**
 * In-memory adapter — development, tests, and any environment where the Sheets
 * credentials are absent.
 *
 * Two rules make this safe to ship alongside the real one:
 *
 * 1. IT STARTS EMPTY. There is no seed data, no sample leads, no "example
 *    host from Goa". A dashboard backed by this adapter shows zero leads,
 *    because zero leads is the truth. Inventing rows here would put fabricated
 *    client work on the founder's own screen, which is the one thing this
 *    project does not do.
 *
 * 2. IT SAYS SO. `persists` is false and health() reports "not persisted", so
 *    every surface that renders it can tell the founder that what they are
 *    looking at will vanish on the next restart.
 *
 * Because a Next.js dev server re-evaluates modules on hot reload, the store is
 * parked on globalThis: without that, submitting a lead and then editing any
 * file would empty the list and make duplicate detection look broken.
 */

type Store = { leads: CanonicalLead[] };

const GLOBAL_KEY = Symbol.for("stayedge.leads.memory");

function store(): Store {
  const g = globalThis as unknown as Record<symbol, Store | undefined>;
  return (g[GLOBAL_KEY] ??= { leads: [] });
}

export class InMemoryLeadRepository implements LeadRepository {
  readonly name = "in-memory";
  readonly persists = false;

  async create(lead: CanonicalLead): Promise<void> {
    // Newest first, matching what the Sheets adapter returns, so the dashboard
    // cannot accidentally depend on one adapter's ordering.
    store().leads.unshift(lead);
    // A dev server left running for days should not grow without bound.
    if (store().leads.length > 500) store().leads.length = 500;
  }

  async findRecentMatch(
    key: string,
    service: Service,
    windowMs: number,
  ): Promise<CanonicalLead | null> {
    const cutoff = Date.now() - windowMs;
    return (
      store().leads.find((l) => {
        if (l.service !== service) return false;
        if (toPhoneKey(l.phone) !== key) return false;
        const t = Date.parse(l.createdAt);
        return Number.isNaN(t) || t >= cutoff;
      }) ?? null
    );
  }

  async list(options: LeadListOptions = {}): Promise<CanonicalLead[]> {
    const filtered = store().leads.filter(
      (l) =>
        (!options.status || l.status === options.status) &&
        (!options.service || l.service === options.service),
    );
    return options.limit ? filtered.slice(0, options.limit) : filtered;
  }

  async updateStatus(id: string, status: LeadStatus): Promise<boolean> {
    const lead = store().leads.find((l) => l.id === id);
    if (!lead) return false;
    lead.status = status;
    lead.updatedAt = new Date().toISOString();
    return true;
  }

  async updateDelivery(id: string, delivery: LeadDelivery): Promise<boolean> {
    const lead = store().leads.find((l) => l.id === id);
    if (!lead) return false;
    lead.delivery = delivery;
    lead.updatedAt = new Date().toISOString();
    return true;
  }

  async health(): Promise<RepositoryHealth> {
    return {
      configured: true,
      reachable: true,
      detail: `in-memory · ${store().leads.length} leads · not persisted`,
    };
  }
}

/** Test helper. Never called by application code. */
export function __resetMemoryRepository(): void {
  store().leads = [];
}
