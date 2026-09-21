import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { osGate } from "../lib/server/os/gate.ts";

/**
 * The /os proxy decision. The regression being pinned: an unconfigured /os and
 * /os/login used to answer HTTP 200 with not-found *content* (status committed
 * before the page's notFound() ran). The gate must say "not_found" so the proxy
 * can return a genuine 404, without changing what an authenticated founder sees.
 */

const NEXT = { action: "next" };
const NOT_FOUND = { action: "not_found" };

describe("unconfigured deployment (no OS_DASHBOARD_KEY)", () => {
  for (const hasSession of [false, true]) {
    it(`/os is a 404 (session=${hasSession})`, () => {
      assert.deepEqual(osGate({ pathname: "/os", configured: false, hasSession }), NOT_FOUND);
    });
    it(`/os/login is a 404 (session=${hasSession})`, () => {
      assert.deepEqual(osGate({ pathname: "/os/login", configured: false, hasSession }), NOT_FOUND);
    });
  }

  it("a stale session cookie cannot resurrect /os when the key is removed", () => {
    assert.deepEqual(osGate({ pathname: "/os", configured: false, hasSession: true }), NOT_FOUND);
  });
});

describe("configured deployment — existing behaviour is preserved", () => {
  it("/os without a session redirects to sign-in", () => {
    assert.deepEqual(osGate({ pathname: "/os", configured: true, hasSession: false }), {
      action: "redirect",
      to: "/os/login",
    });
  });

  it("/os with a session passes through to the dashboard", () => {
    assert.deepEqual(osGate({ pathname: "/os", configured: true, hasSession: true }), NEXT);
  });

  it("/os/login without a session shows the form", () => {
    assert.deepEqual(osGate({ pathname: "/os/login", configured: true, hasSession: false }), NEXT);
  });

  it("/os/login with a session redirects to the dashboard", () => {
    assert.deepEqual(osGate({ pathname: "/os/login", configured: true, hasSession: true }), {
      action: "redirect",
      to: "/os",
    });
  });
});

describe("path handling", () => {
  it("treats a trailing slash as the same path", () => {
    assert.deepEqual(osGate({ pathname: "/os/", configured: false, hasSession: false }), NOT_FOUND);
    assert.deepEqual(osGate({ pathname: "/os/login/", configured: false, hasSession: false }), NOT_FOUND);
  });

  it("does not touch unrelated paths, even similar-looking ones", () => {
    for (const pathname of ["/", "/free-audit", "/osx", "/os-tools", "/api/os/status", "/os/other"]) {
      assert.deepEqual(osGate({ pathname, configured: false, hasSession: false }), NEXT, pathname);
    }
  });
});
