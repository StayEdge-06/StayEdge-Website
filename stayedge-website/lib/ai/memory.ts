/**
 * Property Passport (client seed) — the persistent object that ties an anonymous
 * visitor → lead → client (Strategy v2 / UX Decision 5). Milestone 2 stores it in
 * localStorage so returning visitors are recognised; later milestones sync it to
 * the account. Degrades gracefully when storage is unavailable (privacy mode).
 */
const KEY = "stayedge.passport.v1";

export type PropertyRecord = {
  /** Airbnb URL or, for launch mode, a synthetic id. */
  ref: string;
  /** Human label, e.g. "Tirupati Villa". */
  label?: string;
  city?: string;
  /** Last Roast Score, if analysed. */
  score?: number;
  /** epoch ms */
  ts: number;
};

export type Passport = {
  properties: PropertyRecord[];
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
    : { properties: [], visits: 1, firstSeen: now, lastSeen: now };
  write(next);
  return next;
}

/** Record (or update) a property the visitor analysed. */
export function rememberProperty(rec: Omit<PropertyRecord, "ts">) {
  const p = readPassport() ?? {
    properties: [],
    visits: 1,
    firstSeen: Date.now(),
    lastSeen: Date.now(),
  };
  const idx = p.properties.findIndex((x) => x.ref === rec.ref);
  const entry: PropertyRecord = { ...rec, ts: Date.now() };
  if (idx >= 0) p.properties[idx] = { ...p.properties[idx], ...entry };
  else p.properties.unshift(entry);
  p.properties = p.properties.slice(0, 8); // cap; multi-property investors supported
  write(p);
}

/**
 * Persist a captured lead locally so it is never lost. NOTE: real delivery /
 * CRM sync is the deferred backend (business decision) — this only records it on
 * the device; nothing is sent anywhere yet, so the UI must not claim it was.
 */
export function rememberLead(lead: { whatsapp?: string; email?: string; ref?: string }) {
  if (!canUse()) return;
  try {
    const k = "stayedge.leads.v1";
    const raw = window.localStorage.getItem(k);
    const list = raw ? (JSON.parse(raw) as unknown[]) : [];
    list.push({ ...lead, ts: Date.now() });
    window.localStorage.setItem(k, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

export function mostRecentProperty(p: Passport | null): PropertyRecord | null {
  if (!p || p.properties.length === 0) return null;
  return [...p.properties].sort((a, b) => b.ts - a.ts)[0];
}

export function isReturning(p: Passport | null): boolean {
  return !!p && p.visits > 1;
}
