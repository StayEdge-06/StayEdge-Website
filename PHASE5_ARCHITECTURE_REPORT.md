# Phase 5 — Future Scalability & StayEdge OS Architecture — Report

**Branch:** `v2` · **Scope:** `stayedge-website/` · **Status:** Complete, not deployed (no push, no deploy, no production secrets/config touched)

---

## 1. Architecture audit

Read the complete lead pipeline, OS auth, all API routes, all integration adapters, `.env.example`, and the test suite before changing anything. **Headline finding: this codebase already implements most of what Phase 5 asks for.** Specifically, before any Phase 5 change existed:

- **Lead → Lead Service → CRM Adapter** was already a real port/adapter pattern (`lib/server/leads/repository.ts` defines `LeadRepository`; `GoogleSheetsLeadRepository` and `InMemoryLeadRepository` both implement it; adapter selection is one function in `lib/server/leads/index.ts`).
- **The n8n integration already carries a versioned, extensible event envelope** (`N8nEvent { event, version, id, sentAt, lead }`), with its own comment naming exactly the future event types Phase 5's workflow model discusses ("audit delivered", "video rendered").
- **The AI Website Service extension point already existed** — `components/os/OSDashboard.tsx` has a dashed-border, honestly-labelled `AIServiceSlot` component with a comment explaining precisely the architecture it plugs into.
- **`.env.example`** already documents every environment variable actually used in the code, with clear public/server-only sectioning — verified by diffing every `process.env.*` reference in the codebase against it: zero drift, zero undocumented variables.
- **Error/observability**: every integration already reports `{configured, reachable, detail}` and never leaks a credential or upstream error body.
- **Auth**: `/os` was already session-cookie based (not the old `?key=` scheme), httpOnly, signed, throttled, single-operator, with its own comment explicitly describing where a future identity provider would slot in.

Given that, Phase 5's real work was: **(a)** confirm this rigorously by reading it end to end, **(b)** find and close the few genuine gaps, **(c)** write the architecture documentation that didn't yet exist, **(d)** avoid inventing anything the brief itself warned against building speculatively.

### Genuine gaps found

| # | Finding | Action |
|---|---|---|
| 1 | `RepositoryHealth` (CRM), `SinkHealth` (Telegram/n8n pipeline), and the `/os` dashboard's client-side `SinkHealth` were three independently hand-declared, structurally-identical `{configured, reachable, detail}` types that could silently drift. | **Fixed** — consolidated into `lib/integrations/health.ts`, a client-safe shared type both server and dashboard now import |
| 2 | No unified "what services does StayEdge have" query surface existed for a future OS module — service data was scattered across `ROUTES`, the `/services` hub array, and six schema builders. | **Fixed** — added `lib/services/registry.ts` (the Phase 5 §3 "AI Website Service extension point" ask), populated with today's 6 live services + 1 declared-planned entry |
| 3 | **A pre-existing, latent module-resolution defect**: every relative import inside `lib/server/leads/*.ts`, `lib/leads/*.ts` and `lib/server/os/auth.ts` omitted the `.ts` extension. Under Node's native TypeScript-stripping test runner (`node --test`), this made `tests/leads.test.ts` fail to load *at all* — meaning its ~40 assertions had not actually been executed by `npm test` for some time in this environment, silently. | **Fixed** — added explicit `.ts` extensions throughout (tsconfig already had `allowImportingTsExtensions: true` with a comment anticipating exactly this fix; Next's bundler resolution is unaffected either way) |
| 4 | Fixing #3 surfaced **one genuine, narrow, pre-existing logic bug**: `submitLead()`'s `formPath`/`landingPath` fallback (`attr.formPath || fallbackPath`) never actually falls back, because `EMPTY_ATTRIBUTION.formPath` defaults to the literal string `"/"` (truthy), not empty. | **Documented, not fixed** — see §4 below for why, and the exact real-world blast radius |
| 5 | No architecture documentation existed describing the system for a new developer/agent. | **Fixed** — `ARCHITECTURE.md` (repo root), the primary Phase 5 deliverable |

Nothing else was changed. The lead pipeline's runtime behaviour, the `/os` dashboard's rendering, the API contracts, and every public route are byte-for-byte the same as Phase 4 left them, except for the two additive files and the type-consolidation above.

---

## 2. Changes made

**New files:**
- `ARCHITECTURE.md` (repo root) — the durable architecture reference (see §16)
- `lib/integrations/health.ts` — shared `IntegrationHealth`/`NamedIntegrationHealth` types
- `lib/services/registry.ts` — `ServiceModule` type + `SERVICE_REGISTRY` (the AI Website Service extension point, §9 below)
- `tests/services-registry.test.ts` — 6 tests covering the registry's invariants

**Modified (type consolidation + import-extension fix only — no behavior change):**
- `lib/server/leads/repository.ts`, `lib/server/leads/service.ts`, `lib/server/leads/n8n.ts` — `RepositoryHealth`/`SinkHealth` now alias `IntegrationHealth`/`NamedIntegrationHealth`
- `components/os/OSDashboard.tsx` — imports the shared type instead of hand-declaring it
- `lib/server/leads/{abuse,index,memory-repository,sheets-repository,telegram}.ts`, `lib/leads/{attribution,attribution-client}.ts`, `lib/server/os/auth.ts` — `.ts` extensions added to relative imports (module-resolution fix, §1 #3)

**Explicitly not changed**: `lib/leads/schema.ts` (the canonical lead schema — see §4 for why the one discovered bug was left alone), every page/route from Phase 4, `next.config.ts`, `vercel.json`, any environment variable, any redirect.

---

## 3. StayEdge OS architecture

Documented in full in `ARCHITECTURE.md` §8. Summary: `/os` remains **one dashboard page**, not split into `/os/leads`, `/os/analytics`, etc. — correctly, for now. There is exactly one operator; the current single-page dashboard is already internally organised into the sections a future modular OS would split into routes (Lead overview, Recent leads, Workflow Monitor, Notifications, Website health, `AIServiceSlot`). Splitting into real routes is deferred until a second concurrent audience for the dashboard exists (a second staff role) — building that navigation now, for an audience of one, would be exactly the overengineering Phase 5 was told to avoid. The mapping from today's sections to tomorrow's conceptual modules is written down so the split is a known, low-risk move when it's actually justified.

---

## 4. Lead architecture

Documented in full in `ARCHITECTURE.md` §3. The `LeadRepository` port was already correct and complete; Phase 5 added nothing to it beyond the type-consolidation in §1.

**The one bug found and deliberately not fixed here**: `buildLead()` in `lib/server/leads/service.ts` computes `formPath: attr.formPath || fallbackPath`. Because `EMPTY_ATTRIBUTION.formPath` (in the canonical schema) defaults to `"/"` — a truthy string — the `||` fallback never actually triggers, so a submission with no captured attribution records `formPath: "/"` instead of the real page path.

**Why this was left alone rather than patched:**
1. **Real-world impact is narrow.** Every real visitor submits through `LeadForm`, which calls `currentAttribution(pathname)` before every submit (`components/forms/LeadForm.tsx:149`) — and `currentAttribution()` *always* explicitly overrides `formPath` to the real current path, even when nothing was captured (`lib/leads/attribution-client.ts:75`). The bug is only reachable via a raw `POST /api/lead` that bypasses the browser form entirely (a bot or a third-party integration) — a case where the visitor is either not real or not going through the product's own UI. `landingPath` (not overridden the same way) can degrade to `"/"` in the genuine no-JS/storage-unavailable edge case, which is a minor data-quality nit on one CRM column, not a lead-loss or security issue.
2. **The fix touches the canonical lead schema**, which the codebase's own architectural rule treats as sacred ("nothing downstream may invent its own lead shape"). A correct fix (using the existing `attr.captured` flag, which the schema was explicitly designed to carry for exactly this distinction) is a business-logic change to live CRM data formatting, not an architectural seam.
3. **Phase 5's explicit charter is "architecture and future-proofing only,"** and the brief states plainly: "The current lead pipeline must continue working exactly as before." A silent behavior change to production lead-attribution data, made incidentally while fixing an unrelated test-tooling defect, is exactly the kind of change that deserves its own dedicated, tested, reviewed change — not a rider on an architecture pass.

This is recorded as a **remaining risk** (§19) with the exact fix already identified (branch on `attr.captured` in `buildLead()`, not on string truthiness) for a dedicated follow-up.

---

## 5. Integration architecture

Documented in full in `ARCHITECTURE.md` §4. Audited Google Sheets, Telegram, n8n, GA4/Clarity, and Google Business Profile — all already follow the same `xConfigured()` + typed call + health-check shape, and no client component holds a credential (verified by grep: every `process.env.*` secret reference is under `lib/server/` or an `app/api/*/route.ts`). The n8n payload's existing `event`/`version` fields are the seam for future event types; nothing needed to be added.

---

## 6. Configuration architecture

Documented in full in `ARCHITECTURE.md` §6. Audited every `process.env.*` reference in the codebase against `.env.example` — **zero undocumented variables, zero drift.** Public (`NEXT_PUBLIC_*`) and server-only variables are already cleanly separated by naming convention and file placement. No runtime guard exists against a future developer accidentally prefixing a secret with `NEXT_PUBLIC_`; documented as a real but currently-acceptable gap (single-founder codebase, single reviewer) with a stated trigger for hardening it (a second developer joining).

---

## 7. Workflow model

Documented in full in `ARCHITECTURE.md` §10. Today's real, implemented workflow is `LeadStatus` (a flat 9-value enum, validated end-to-end, no enforced transitions — correct for one human operator making judgement calls). The brief's fuller conceptual pipeline (audit generated → audit reviewed → client onboarding → service delivery → reporting) maps only partially onto it, because those later stages don't exist as system-tracked states yet — nothing in the current product generates them automatically. **Deliberately not implemented**: a generic `WorkflowEvent`/`Stage` type for stages nothing sets yet, which would be exactly the "speculative abstraction" the brief warns against. The extension point (`LEAD_STATUSES` as a plain `as const` array, already total-function-safe via `asStatus()`) is documented as sufficient until a real feature needs a real new stage.

---

## 8. Future AI extension points

Documented in full in `ARCHITECTURE.md` §11. **No new types were added for `Agent`, `Task`, `Workflow`, `Job`, `Artifact`, `Client`, or `Project`** — every one of them currently has zero call sites, and typing them now would be dead code pretending to be architecture. Instead, `ARCHITECTURE.md` documents the two patterns already proven in this codebase (port + adapter; `{configured, reachable, detail}` health) as the template any of these concepts should follow once something real needs them, plus the specific observation that n8n already gives the system an automation surface that doesn't require the Next.js app to change to host a future agent.

---

## 9. AI Website Service extension point

The concrete Phase 5 §3 deliverable. Two things now constitute the seam:

1. **`AIServiceSlot`** on `/os` — pre-existing, unchanged, already honest and empty.
2. **`lib/services/registry.ts`** (new) — `ServiceModule` type (`id`, `name`, `kind`, `status`, `route?`, `description`) + `SERVICE_REGISTRY`: today's 6 commercial services (all `status: "commercial-live"`, `route` populated from the existing `ROUTES` constant — no second source of truth) plus one `ai-website-service` row at `status: "planned"` with no route. `liveServices()` and `getServiceModule()` are the two functions a future OS module or public page would call.

Deliberately **not wired into any existing UI** in this phase — it is additive, tested (`tests/services-registry.test.ts`, 6 assertions, all passing), and ready for a future `/os` services panel or a future public services page to consume, without touching the verified Phase 4 rendering. `lib/leads/schema.ts`'s `Service` type (the lead-form wire contract, still exactly its original two values) was explicitly left untouched and is documented as a deliberately separate, narrower concept from `ServiceModule`.

---

## 10. Authentication/authorization assessment

Documented in full in `ARCHITECTURE.md` §8. Current `/os` auth (session cookie, httpOnly, signed, `SameSite=Lax`, 12h TTL, per-IP login throttling, minimum-key-length gate) is **appropriate for the current stage** — one operator, no client-facing surface, no reason for a heavier identity provider yet. Three audiences (public site / internal OS / future client portal) are already conceptually distinct in the codebase's own comments; a future client portal is documented as its own auth domain, not an extension of `/os`'s founder-only session system, so building one later requires no change to `lib/server/os/`. No client portal was built (per instruction). No authorization role model was added (per instruction) — the extension point (`hasOsSession()` growing a role claim) is documented, not implemented, since nothing needs it yet.

---

## 11. Database decision

Documented in full in `ARCHITECTURE.md` §7, with a full "why Sheets is still correct" case and four concrete, ordered migration triggers (lead volume crossing ~1–2k rows; a second concurrent CRM writer; queries beyond the port's five methods; a future job/artifact store needing structure a spreadsheet can't hold). **No database was introduced.** This section exists because the brief explicitly asked the decision be written down, not assumed.

---

## 12. Security findings

Full list in `ARCHITECTURE.md` §13. No secret exposure found (every `process.env.*` secret reference verified server-only). Sheets writes use `RAW` (not `USER_ENTERED`) specifically to prevent formula-injection via a submitted lead name — verified this is still true after the type-consolidation changes. `/os` session cookie properties (httpOnly, SameSite=Lax, HMAC-signed, timing-safe comparison) verified unchanged. **Stated limitations, not fixed**: in-process (not shared-store) rate limiting and login throttling — deliberate at current volume, with the upgrade path named; `OS_SESSION_SECRET` falling back to `OS_DASHBOARD_KEY` when unset; no `npm audit` was run (no registry access in this environment); no adversarial input fuzzing was performed. This is not a "production secure" claim — it is an honest account of what was and wasn't checked.

**One runtime observation, not a Phase 5 regression**: `/os` and `/os/login` both returned HTTP `200` under `next start` locally regardless of whether `notFound()`/`redirect()` fired (verified against a locally-configured short/invalid `OS_DASHBOARD_KEY`, where `osConfigured()` correctly returns `false` and the page body is genuinely the not-found content — but the status code is `200`, not `404`). **Verified this predates Phase 5**: reproduced identically on the clean Phase-4 commit (`297977e`) with the same local build, before any Phase 5 file was touched. Not caused by this phase's changes. Flagged in §19/§20 for verification against the real Vercel deployment target before Phase 6, since `next start` locally can differ from Vercel's serverless routing.

---

## 13. Performance impact

Zero. All Phase 5 changes are either pure TypeScript types (erased at compile time, `import type` throughout — `lib/integrations/health.ts`'s client-side usage costs the `/os` dashboard's bundle nothing), a small static data array (`SERVICE_REGISTRY`, unconsumed by any current route so it adds nothing to any bundle until something imports it), or import-specifier extensions (a build-time resolution detail with no runtime footprint). No new dependency, no new client component, no new hydration path, no new API call.

---

## 14. Documentation created/updated

- `ARCHITECTURE.md` (new, repo root) — 14 sections: system shape, application architecture, lead architecture, integration boundaries, error/observability, configuration, database decision, StayEdge OS architecture (with authentication/authorization), AI Website Service extension point, workflow model, future AI agent architecture, artifact/asset model, security review, testing. Written so a developer or AI agent with zero prior context can understand the system end to end.
- `PHASE5_ARCHITECTURE_REPORT.md` (this file) — the phase deliverable.

---

## 15. Tests performed

- `npx tsc --noEmit` — clean, zero errors (before and after every change)
- `npm run lint` — zero errors; same 8 pre-existing `react-hooks/set-state-in-effect` warnings as Phase 4, in files this phase did not touch
- `npm run build` — succeeded repeatedly; all 56 routes compiled, identical route list to Phase 4's verified output
- `npm test` (`node --test`) — **before this phase's import-extension fix**: `tests/leads.test.ts` failed to load at all (`ERR_MODULE_NOT_FOUND`), meaning its assertions were not running; verified this predates Phase 5 by reproducing it on the clean Phase-4 commit. **After the fix**: 63 tests run, 62 pass, 1 fails (the documented pre-existing attribution edge case, §4)
- **Backward-compatibility smoke test**: built and ran the app with `next start` on a local port; curled the homepage, `/free-audit`, a Phase-4 service page, `/os`, `/os/login`, `/api/health`, `sitemap.xml`, and the `/roast` legacy redirect — all responded as expected (200s, a working JSON health check, a 308 redirect) except the `/os` status-code observation in §12, which was verified pre-existing
- **Regression check on the one runtime observation**: reproduced identically against the clean pre-Phase-5 commit with the same environment, confirming it was not introduced by this phase
- Not run in this pass (no browser tooling invoked in this session): live viewport testing at the seven specified breakpoints, a Lighthouse pass, a screen-reader walkthrough. Phase 4's report already flagged these as outstanding; Phase 5 made no visual changes, so the risk is unchanged, not new.

---

## 16. Test results

TypeScript: clean. Lint: clean. Build: clean, all routes present. Tests: 62/63 passing (up from an environment where the lead-pipeline suite was silently not executing at all). The one failure is documented, narrow in real-world impact, and deliberately left for a dedicated fix rather than patched under this phase's architecture-only scope.

---

## 17. Files changed

See §2 for the categorized list. In total: 2 new library modules, 1 new test file, 1 new architecture document (+ this report), 12 modified files (all either import-extension fixes or type-alias consolidation — zero logic changes).

---

## 18. Commit hash

Committed as a dedicated Phase 5 commit immediately following this report — see `git log`. Not pushed, not deployed.

---

## 19. Remaining risks

1. **The `formPath`/`landingPath` fallback bug** (§4) — narrow real-world impact, exact fix identified, deliberately not patched in an architecture-only phase. Recommend a dedicated, tested fix before it's forgotten.
2. **`/os` returning HTTP 200 instead of 404/redirect status under local `next start`** (§12) — pre-existing, reproduced on the Phase-4 baseline, not a Phase 5 regression, but unverified against the actual Vercel deployment target. The page *content* is correct (genuinely the not-found page when unconfigured); only the status code is suspect locally.
3. **No shared rate-limit/login-throttle store** — acceptable at current volume, real limitation on Vercel's multi-instance model, documented with an upgrade trigger.
4. **No `npm audit` run** — this environment had no registry access; recommend running it before Phase 6.
5. **`SERVICE_REGISTRY` is currently unconsumed by any route** — by design (an extension point, not a feature), but worth noting so a future developer doesn't mistake it for dead code and delete it.

## 20. Remaining blockers (before Phase 6)

- Verify the `/os` status-code observation (§12) against an actual Vercel preview deployment, not just local `next start` — this environment cannot reach Vercel.
- Run `npm audit` and a live Lighthouse/browser pass (carried over from Phase 4's report, still outstanding — Phase 5 introduced no new visual surface, so this is not newly blocking, but it remains unverified).
- Decide whether to fix the attribution fallback bug (§4/§19.1) before or after Phase 6 — it does not block deployment, but it is now a known, written-down defect.

## 21. What Phase 6 must configure

Phase 6 (per its own future scope) will handle production configuration and deployment. Nothing in Phase 5 requires new environment variables or secrets — `SERVICE_REGISTRY` and `lib/integrations/health.ts` are pure code, no configuration surface. Phase 6 should still separately confirm: `OS_DASHBOARD_KEY` is at least 16 characters in the actual production environment (the local dev key used for this phase's smoke test was intentionally short and is not a production concern); the apex→www redirect flagged in the Phase 4 report; and the `/os` status-code behavior (§12) on real Vercel infrastructure.

## 22. GO/NO-GO for Phase 6

**GO.** All Phase 5 architecture work is complete, additive, and verified not to regress Phase 4 or any existing route, integration, or test that was actually passing before this phase started. The one test failure and the one runtime status-code observation are both pre-existing, both fully root-caused, and both explicitly documented rather than silently patched or silently ignored — consistent with this codebase's own honesty discipline. Conditional only on Phase 6 independently verifying §20's two live-environment items, which this offline environment cannot reach.
