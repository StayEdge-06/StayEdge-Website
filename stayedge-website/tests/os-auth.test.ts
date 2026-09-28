import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import {
  ATTEMPT_MAX,
  ATTEMPT_WINDOW_MS,
  MIN_KEY_LENGTH,
  TTL_MS,
  __resetThrottle,
  clearThrottle,
  keyConfigured,
  keyMatches,
  loginThrottled,
  mintToken,
  safeEqual,
  tokenValid,
} from "../lib/server/os/session-token.ts";

/**
 * /os session security.
 *
 * Runs on Node's native TypeScript type stripping — no test framework, no
 * transpiler, no new dependency. `npm test`.
 */

const KEY = "T3st-dashboard-key-0123456789";
const OTHER = "T3st-dashboard-key-0123456780";

describe("key comparison", () => {
  it("accepts the configured key", () => {
    assert.equal(keyMatches(KEY, KEY), true);
  });

  it("rejects a near-miss", () => {
    assert.equal(keyMatches(OTHER, KEY), false);
  });

  it("rejects an empty submission even against a configured key", () => {
    assert.equal(keyMatches("", KEY), false);
  });

  it("rejects everything when no key is configured", () => {
    assert.equal(keyMatches("anything", undefined), false);
    assert.equal(keyMatches("", undefined), false);
    // The failure mode that matters: an unset key must not mean "open".
    assert.equal(keyMatches("", ""), false);
  });

  it("treats a key shorter than the minimum as not configured", () => {
    const weak = "x".repeat(MIN_KEY_LENGTH - 1);
    assert.equal(keyConfigured(weak), false);
    assert.equal(keyMatches(weak, weak), false);
    assert.equal(keyConfigured("y".repeat(MIN_KEY_LENGTH)), true);
  });

  it("compares different-length inputs without throwing", () => {
    // timingSafeEqual throws on unequal buffer lengths; the hash-first design
    // exists precisely so this cannot happen.
    assert.equal(safeEqual("a", "abcdefghijklmnop"), false);
  });
});

describe("session token", () => {
  it("round-trips a freshly minted token", () => {
    assert.equal(tokenValid(mintToken(KEY), KEY), true);
  });

  it("rejects a token signed with a different secret", () => {
    assert.equal(tokenValid(mintToken(KEY), OTHER), false);
  });

  it("rejects a token whose expiry has been tampered with", () => {
    const token = mintToken(KEY);
    const mac = token.split(".")[1]!;
    const forged = `${Date.now() + 10 * TTL_MS}.${mac}`;
    assert.equal(tokenValid(forged, KEY), false);
  });

  it("rejects an expired token", () => {
    const issued = Date.now() - TTL_MS - 1000;
    const token = mintToken(KEY, issued);
    assert.equal(tokenValid(token, KEY), false);
    // ...and was valid at the moment it was issued.
    assert.equal(tokenValid(token, KEY, issued + 1000), true);
  });

  it("rejects missing and malformed tokens", () => {
    for (const bad of [undefined, "", "no-dot", ".", "abc.", ".abc", "x.y.z"]) {
      assert.equal(tokenValid(bad, KEY), false, `accepted ${JSON.stringify(bad)}`);
    }
  });

  it("rejects any token when no secret is configured", () => {
    assert.equal(tokenValid(mintToken(KEY), null), false);
  });
});

describe("login throttle", () => {
  after(__resetThrottle);

  it("allows up to the limit then blocks", () => {
    __resetThrottle();
    for (let i = 0; i < ATTEMPT_MAX; i++) {
      assert.equal(loginThrottled("1.2.3.4"), false, `blocked early at attempt ${i + 1}`);
    }
    assert.equal(loginThrottled("1.2.3.4"), true);
  });

  it("throttles each IP independently", () => {
    __resetThrottle();
    for (let i = 0; i < ATTEMPT_MAX; i++) loginThrottled("1.2.3.4");
    assert.equal(loginThrottled("1.2.3.4"), true);
    assert.equal(loginThrottled("5.6.7.8"), false);
  });

  it("forgets attempts once the window has passed", () => {
    __resetThrottle();
    const t0 = Date.now();
    for (let i = 0; i < ATTEMPT_MAX; i++) loginThrottled("1.2.3.4", t0);
    assert.equal(loginThrottled("1.2.3.4", t0), true);
    assert.equal(loginThrottled("1.2.3.4", t0 + ATTEMPT_WINDOW_MS + 1), false);
  });

  it("clears the counter after a successful login", () => {
    __resetThrottle();
    for (let i = 0; i < ATTEMPT_MAX; i++) loginThrottled("1.2.3.4");
    clearThrottle("1.2.3.4");
    assert.equal(loginThrottled("1.2.3.4"), false);
  });
});
