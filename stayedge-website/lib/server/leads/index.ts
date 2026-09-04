import { InMemoryLeadRepository } from "./memory-repository.ts";
import { GoogleSheetsLeadRepository, sheetsConfigured } from "./sheets-repository.ts";
import type { LeadRepository } from "./repository.ts";

export type { LeadListOptions, LeadRepository, RepositoryHealth } from "./repository.ts";

/**
 * Adapter selection.
 *
 * Configuration decides, not NODE_ENV: if a developer puts real Sheets
 * credentials in .env.local they get the real CRM locally, and if production
 * ever boots without them the site keeps accepting leads instead of returning
 * 500s to real hosts. What it must never do is fail quietly — a production
 * deployment falling back to the in-memory adapter is a lost-lead condition, so
 * it is logged once at startup and surfaced on the /os Workflow Monitor.
 */

let instance: LeadRepository | null = null;

export function getLeadRepository(): LeadRepository {
  if (instance) return instance;

  if (sheetsConfigured()) {
    instance = new GoogleSheetsLeadRepository();
  } else {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[leads] No CRM configured in production — leads are being held in memory " +
          "and WILL be lost on restart. Set GOOGLE_SHEETS_ID, " +
          "GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY.",
      );
    }
    instance = new InMemoryLeadRepository();
  }
  return instance;
}

/** Test seam: swap the adapter, or clear it so the next call re-selects. */
export function __setLeadRepository(repo: LeadRepository | null): void {
  instance = repo;
}
