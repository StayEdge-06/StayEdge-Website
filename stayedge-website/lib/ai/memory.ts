/**
 * Property Passport (client seed) — the persistent object that ties an anonymous
 * visitor → lead → client (Strategy v2 / UX Decision 5). Stored in localStorage
 * so returning visitors are recognised; later milestones sync it to the account.
 * Degrades gracefully when storage is unavailable (privacy mode).
 *
 * V2 note: the per-property record set was written for the Roast engine, which
 * no longer exists. Nothing produced those records after the removal, so the
 * passport is now just the visit counter that Vira and the returning-visitor
 * analytics signal actually read.
 */
const KEY = "stayedge.passport.v1";

export type Passport = {
  visits: number;
  firstSeen: number;
  lastSeen: number;
};

function canUse(): boolean {
  try {
    if (typeof window === "undefined") return false;
    const k = "__se_test__";
    window.localStorage.setItem(k, "1");
    window.localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

export function readPassport(): Passport | null {
  if (!canUse()) return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Passport;
  } catch {
    return null;
  }
}

function write(p: Passport) {
  if (!canUse()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* ignore quota / privacy errors */
  }
}

/** Call once per visit; returns the passport (creating it on first visit). */
export function touchVisit(): Passport | null {
  if (!canUse()) return null;
  const now = Date.now();
  const existing = readPassport();
  const next: Passport = existing
    ? { ...existing, visits: existing.visits + 1, lastSeen: now }
    : { visits: 1, firstSeen: now, lastSeen: now };
  write(next);
  return next;
}

/**
 * Persist a captured lead on-device as a safety net. The server route is the
 * real delivery path (Sheets + Telegram); this exists so a lead is not lost if
 * that POST fails while the visitor is mid-form, and so support can recover it
 * from the browser if a host reports "I submitted and heard nothing".
 */
export function rememberLead(lead: Record<string, unknown>) {
  if (!canUse()) return;
  try {
    const k = "stayedge.leads.v1";
    const raw = window.localStorage.getItem(k);
    const list = raw ? (JSON.parse(raw) as unknown[]) : [];
    list.push({ ...lead, ts: Date.now() });
    window.localStorage.setItem(k, JSON.stringify(list.slice(-20)));
  } catch {
    /* ignore quota / privacy errors */
  }
}

export function isReturning(p: Passport | null): boolean {
  return !!p && p.visits > 1;
}
