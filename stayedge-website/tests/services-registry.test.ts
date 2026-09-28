import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import {
  SERVICE_REGISTRY,
  getServiceModule,
  liveServices,
  type ServiceModule,
} from "../lib/services/registry.ts";

/**
 * The service registry (Phase 5, §3 — AI Website Service extension point).
 * Guards the two invariants that make it trustworthy as a future OS query
 * surface: a "commercial-live" row always has somewhere to send a visitor,
 * and a "planned" row never does (nothing to link to yet).
 */

describe("SERVICE_REGISTRY", () => {
  it("gives every commercial-live service a route", () => {
    for (const s of SERVICE_REGISTRY) {
      if (s.status === "commercial-live") {
        assert.ok(s.route, `${s.id} is commercial-live but has no route`);
      }
    }
  });

  it("gives no planned service a route", () => {
    for (const s of SERVICE_REGISTRY) {
      if (s.status === "planned") {
        assert.equal(s.route, undefined, `${s.id} is planned but has a route`);
      }
    }
  });

  it("has unique ids", () => {
    const ids = SERVICE_REGISTRY.map((s: ServiceModule) => s.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  it("matches Phase 4's six public services, all live", () => {
    assert.equal(liveServices().length, 6);
  });

  it("includes the declared AI Website Service seam as planned, not live", () => {
    const svc = getServiceModule("ai-website-service");
    assert.ok(svc);
    assert.equal(svc!.status, "planned");
  });

  it("getServiceModule returns undefined for an unknown id", () => {
    assert.equal(getServiceModule("does-not-exist"), undefined);
  });
});
