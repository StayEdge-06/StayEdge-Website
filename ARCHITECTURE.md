# StayEdge — System Architecture

**Last updated:** Phase 5 (2026-09-05) · **Scope:** `stayedge-website/` · **Audience:** any developer or AI agent picking up this codebase cold.

This is the durable architecture reference. Phase-specific deliverables (what changed, when, why) live in `PHASE4_SEO_AUTHORITY_CONVERSION_REPORT.md` and `PHASE5_ARCHITECTURE_REPORT.md`. This document describes what the system *is*, not what changed to get here.

---

## 1. The shape of the system today

```
Visitor
  │
  ▼
Next.js 16 app (App Router, Turbopack)
  ├── Public marketing site (~20 routes + 11 city pages + 20 articles)
  ├── /free-audit, /services/* — lead capture (LeadForm)
  └── /os — internal dashboard (founder-only, session-gated)
       │
       ▼
  POST /api/lead  ──►  submitLead()  [lib/server/leads/service.ts]
                          │
                          ├─ 1. validate + screen (Zod schema, spam/rate checks)
                          ├─ 2. write to CRM        (LeadRepository port → Google Sheets today)
                          ├─ 3. notify, in parallel:
                          │      ├─ Telegram (founder's phone)
                          │      └─ n8n webhook (automation plane)
                          └─ 4. record delivery outcome back onto the CRM row
  │
  ▼
/os dashboard reads the same CRM through the same port, plus pipeline/website
health, plus (optionally) business metrics relayed from n8n.
```

**One Next.js app, one deployment, no microservices, no database.** That is a
deliberate choice for the current business stage (see §7, Database Decision),
not a limitation nobody noticed.

---

## 2. Application architecture

- **Framework:** Next.js 16 (App Router), React Server Components by default; `"use client"` only where interaction requires it (forms, the OS dashboard, motion/animation components).
- **Routing:** file-based under `app/`. Static generation (`○`) for every marketing page; `generateStaticParams` for the two programmatic families (`app/knowledge/[slug]`, `app/airbnb-listing-optimization/[city]`); `force-dynamic` for anything session- or request-dependent (`/os`, all `/api/*`).
- **Styling:** Tailwind, design tokens as CSS custom properties (`--se-*`), no CSS-in-JS.
- **Content:** typed TypeScript data modules under `lib/content/` (articles, cities, glossary, case studies) — not a CMS. A human edits a `.ts` array to publish. This is intentional at current volume; see §7 for the migration trigger.

### Server/client boundaries

- **Server-only code** lives under `lib/server/` — anything that touches `node:crypto`, `node:dns`, `process.env` secrets, or `next/headers`. Nothing under `lib/server/` is ever imported from a `"use client"` file (TypeScript/Next would refuse the build if it were, since e.g. `node:crypto` has no browser polyfill here).
- **Client-safe shared code** lives under `lib/` directly (`lib/leads/schema.ts`, `lib/config/site.ts`, `lib/integrations/health.ts`, `lib/services/registry.ts`, `lib/content/*`). These have zero `node:`/`next/headers` imports by construction, so the same validation/types run in the browser (form validation) and on the server (API route) without drift.
- **The one deliberate wire-type re-declaration** was the `/os` dashboard's local `SinkHealth` type, which duplicated the server's shape by hand because a client component cannot import a server module. Phase 5 closed this by moving the shared shape into `lib/integrations/health.ts` (client-safe) and having both sides import it — see §5.

### API routes

| Route | Method | Purpose | Auth |
|---|---|---|---|
| `/api/lead` | POST | The one lead endpoint — every form on the site posts here | none (rate-limited + spam-screened) |
| `/api/health` | GET | Liveness probe for external monitors (n8n Monitor workflow) | none |
| `/api/os/login` | POST | Exchange the dashboard key for a session cookie | key comparison |
| `/api/os/logout` | POST | Clear the session cookie | session |
| `/api/os/status` | GET | Everything the dashboard renders except lead rows: pipeline health, counts, website config | session |
| `/api/os/leads` | GET, PATCH | Read/write the CRM's lead rows | session |

Every route is thin: it speaks HTTP (status codes, headers, JSON) and delegates business logic to `lib/server/`. This means the same logic is testable without a server (`tests/leads.test.ts`, `tests/os-auth.test.ts` call the service functions directly).

---

## 3. Lead architecture

```
LeadForm (browser)
  │  currentAttribution() attaches first-touch marketing data
  ▼
POST /api/lead
  │  thin HTTP shell (lib/server/leads/service.ts wraps everything below)
  ▼
submitLead(body, ctx)
  │
  ├─ leadInputSchema.safeParse(body)         [lib/leads/schema.ts — CLIENT-SAFE]
  ├─ detectAutomation() / checkRate()        [lib/server/leads/abuse.ts]
  ├─ repo.findRecentMatch(...)               [LeadRepository port]
  ├─ repo.create(lead)                       ← record of truth, awaited first
  ├─ Promise.allSettled([notifyTelegram, forwardToN8n])
  └─ repo.updateDelivery(...)                ← best-effort, patches the row
```

**The canonical schema (`lib/leads/schema.ts`) is the single source of truth.**
Every surface — the CRM columns, the Telegram message, the n8n payload, the
`/os` dashboard — derives from `CanonicalLead` and `CRM_COLUMNS`. A field
added anywhere else is treated as a bug, by the file's own architectural
rule comment.

### The replaceability seam: `LeadRepository`

```ts
interface LeadRepository {
  readonly name: string;
  readonly persists: boolean;
  create(lead): Promise<void>;
  findRecentMatch(phoneKey, service, windowMs): Promise<CanonicalLead | null>;
  list(options?): Promise<CanonicalLead[]>;
  updateStatus(id, status): Promise<boolean>;
  updateDelivery(id, delivery): Promise<boolean>;
  health(): Promise<IntegrationHealth>;
}
```

Two adapters exist today:

- **`GoogleSheetsLeadRepository`** — the live CRM. Calls the Sheets REST API directly (not the `googleapis` SDK, to avoid ~15MB of dependency for two endpoints), signs its own service-account JWT, caches reads for 30s, treats `RAW` value input as a hard security requirement (never `USER_ENTERED` — see the formula-injection comment in `sheets-repository.ts`).
- **`InMemoryLeadRepository`** — development/test fallback. Starts empty (no seed data, ever — the codebase's "no fabricated data" law applies to the dev fallback too), persists to `globalThis` so hot-reload doesn't wipe it mid-session.

**Selection is by configuration, not `NODE_ENV`** (`lib/server/leads/index.ts`): if Sheets credentials exist, use Sheets; otherwise fall back to in-memory, logging a loud warning in production (a silent fallback there is a lost-lead condition). This is exactly the seam Phase 5 §4 asks for:

```
Today:    submitLead → LeadRepository → GoogleSheetsLeadRepository
Tomorrow: submitLead → LeadRepository → PostgresLeadRepository / a real CRM adapter
```

Swapping the adapter touches one new file implementing `LeadRepository` and one line in `lib/server/leads/index.ts`. **Nothing else changes** — not the form, not the API route, not the dashboard, not the tests (`tests/leads.test.ts` already runs its assertions against a swappable repository via `__setLeadRepository`).

---

## 4. Integration boundaries

Every external integration follows the same shape: a `xConfigured(): boolean`
guard, a typed call function, and a `health()`/probe function returning the
shared `IntegrationHealth` shape (`lib/integrations/health.ts`, added Phase 5
— see §5). No client component ever holds a credential; every integration
call originates in `lib/server/`.

| Integration | Module | What it does | Auth |
|---|---|---|---|
| Google Sheets | `lib/server/leads/sheets-repository.ts` | CRM read/write | Service-account JWT (RS256), OAuth token cached 1h |
| Telegram | `lib/server/leads/telegram.ts` | Founder notification per lead | Bot token (server env only) |
| n8n | `lib/server/leads/n8n.ts` | Automation plane — one signed webhook POST per accepted lead | Bearer token + optional HMAC body signature |
| GA4 / Clarity | `lib/analytics.ts`, `components/analytics/*` | Consent-gated measurement | Public measurement IDs only (no secret) |
| Google Business Profile | `lib/config/gbp.ts` | Entity/schema linkage | Public URL only, validated against an allow-list of real Google hosts — never a guessed value |

**Why n8n over a direct MCP/agent connector**: the website is an outbound
HTTPS webhook *client*, not an LLM tool-calling client — a plain signed POST
is the right-sized integration; MCP would add a protocol dependency and a
second failure mode for no benefit (documented directly in `n8n.ts`).

**The n8n payload is already versioned and extensible**:

```ts
type N8nEvent = { event: "lead.created"; version: string; id: string; sentAt: string; lead: CanonicalLead };
```

New event types (`"audit.delivered"`, `"video.rendered"`, one for each future
service) can be added by extending the `event` union and building a new
payload function — n8n workflows branch on `event`, so existing workflows
are unaffected by a new one appearing.

---

## 5. Error + observability architecture

Every integration reports health in the same shape (`lib/integrations/health.ts`, introduced Phase 5):

```ts
type IntegrationHealth = { configured: boolean; reachable: boolean; detail: string };
type NamedIntegrationHealth = IntegrationHealth & { name: string };
```

`RepositoryHealth` (CRM) and `SinkHealth` (Telegram/n8n) are now type aliases
of this shape rather than hand-duplicated structs, and the `/os` dashboard's
client-side `SinkHealth` type imports it directly (a `type`-only import, so
it costs the client bundle nothing). Before Phase 5 these were three
independently-declared, structurally-identical types that could silently
drift; now there is one.

**Rules that hold everywhere in this layer**:

1. `configured` and `reachable` are reported as *different facts* — "never set up" and "set up but down" need different founder actions, so they must never be collapsed into one boolean.
2. `detail` is always a short, human-safe string — never a raw upstream error body, never a credential, never a spreadsheet ID. Sheets errors are normalised to short codes (`sheets_http_403`) precisely so Google's response body (which can echo the service-account address) never reaches the dashboard.
3. A downstream failure (Telegram down, n8n down, CRM down) never rejects a real lead. The CRM write is awaited and completes *before* any notification is attempted; if the CRM write itself fails, the lead is still notified via Telegram and still returned as accepted to the visitor — only `delivery.crm = "failed"` is recorded, visible on `/os`.
4. Bots get a `200`, not a `4xx` — a `4xx` teaches a scripted attacker which check to defeat next; a silent `200` teaches it nothing.

This is the seam a future integration — a database, a real CRM, the AI
Website Service — reports through: implement `health(): Promise<IntegrationHealth>`
and it appears on the Workflow Monitor with zero new dashboard code.

---

## 6. Configuration architecture

Every environment variable used in the codebase is documented in
`.env.example` (verified Phase 5 — zero drift between actual `process.env.*`
usage and the example file). The public/secret boundary is enforced by
Next.js's `NEXT_PUBLIC_*` convention plus file placement:

**Public** (safe in client JS — bundled at build time):
`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_MEASUREMENT_ID` / `NEXT_PUBLIC_GA_ID`,
`NEXT_PUBLIC_CLARITY_PROJECT_ID`, `NEXT_PUBLIC_GBP_URL`, `NEXT_PUBLIC_DISABLE_3D`

**Server-only** (read exclusively inside `lib/server/` or `app/api/*/route.ts`,
never reachable from a `"use client"` file):
`GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEETS_ID`,
`GOOGLE_SHEETS_RANGE`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`,
`N8N_BRAIN_WEBHOOK_URL`, `N8N_LEAD_WEBHOOK_URL`, `N8N_METRICS_WEBHOOK_URL`,
`N8N_WEBHOOK_TOKEN`, `N8N_WEBHOOK_SECRET`, `OS_DASHBOARD_KEY`, `OS_SESSION_SECRET`

There is no runtime check preventing a future developer from typing
`NEXT_PUBLIC_` in front of a secret by mistake — the discipline is naming
convention plus code review, same as the rest of the Next.js ecosystem.
**Trigger for hardening this further**: the day a second developer joins the
project, add a small `scripts/check-env.mjs` that fails CI if any server-only
name pattern (`_SECRET`, `_KEY`, `_TOKEN`) appears with a `NEXT_PUBLIC_`
prefix — not needed for a single-founder codebase where every env change
passes through one person's review today.

---

## 7. Database decision

**Current answer: no database. Google Sheets is the CRM of record, by design, not by omission.**

Reasons this is the right call at this stage (from `sheets-repository.ts`'s own comment, formalised here):

- The founder already works in a spreadsheet — zero new tool to learn.
- Zero hosting, zero migration tooling, zero connection-pool/cold-start concerns for a serverless deployment.
- Every row is editable by hand when a real conversation outruns the software (e.g. the founder manually correcting a lead status mid-call) — a real database with an app-only write path would make this harder, not easier, at this volume.
- The `LeadRepository` port makes this a reversible decision, not an architectural bet. See §3.

**Known, stated limits** (not hidden): no transactions, no indexes, a full-column read per query (mitigated by a 30s read cache), linear-scan duplicate/id lookup. At current and near-term lead volume (tens to low hundreds per month) this is imperceptible.

**Migration triggers** — the concrete signals that would justify moving to a real database, in the order they are likely to arrive:

1. **Lead volume** crosses roughly 1,000–2,000 rows and the Sheets full-column read (even cached) becomes a visible `/os` dashboard latency problem.
2. **A second write-concurrency source** appears — e.g. a client portal or a second operator writing to the CRM simultaneously — since Sheets has no transactions and the current architecture assumes effectively single-writer semantics.
3. **Structured queries beyond the current port's five methods** become necessary (joins, aggregations, full-text search across notes) — `LeadListOptions` is deliberately narrow; growing it is the signal the port itself needs a real query engine behind it.
4. **The AI Website Service or a future agent needs to write jobs/artifacts** that don't fit a spreadsheet row (binary assets, nested structure, high write frequency) — see §9.

When any of these arrive, the fix is: implement `LeadRepository` against Postgres/Supabase/a real CRM, flip the adapter-selection logic in `lib/server/leads/index.ts`, migrate existing rows with a one-off script reading the Sheets adapter and writing the new one (both implement the same interface, so the migration script is ~20 lines). No form, route, or dashboard code changes.

---

## 8. StayEdge OS architecture

`/os` today is **one dashboard page** (`app/os/page.tsx` → `components/os/OSDashboard.tsx`, 658 lines), not yet split into routed modules — and that is currently correct: there is exactly one operator (the founder), one screen answering "what came in, where did it go, what is broken" is faster to use than navigating between five routes for the same person.

The component is already internally organised into the sections a future
modular OS would split into routes, each backed by its own panel function:

| Current section (in `OSDashboard.tsx`) | Conceptual future module |
|---|---|
| Lead overview + Recent leads (editable status) | `/os/leads` |
| Website health, CRM state | `/os/settings` (config visibility) |
| Workflow Monitor (pipeline health) | `/os/workflows` |
| Notifications | shared across modules |
| Business metrics (relayed from n8n) | `/os/analytics` |
| `AIServiceSlot` (declared, empty) | `/os/services` |
| — | `/os/content` (not yet needed — content is edited by hand in `lib/content/*.ts`) |

**When to actually split into routes**: the trigger is a second concurrent
audience for the dashboard (a second team member with a narrower role — see
§10, Authorization) or the page genuinely becoming too large/slow to load as
one screen. Splitting now, with one operator and no role model, would add
navigation for a user who doesn't need it — exactly the overengineering
Phase 5 was told to avoid.

### Authentication (audited, unchanged in Phase 5)

Single-operator, session-cookie based (`lib/server/os/auth.ts` +
`lib/server/os/session-token.ts`):

- The dashboard key is typed once at `/os/login`, exchanged for a signed,
  httpOnly, `SameSite=Lax` cookie (12h TTL) — never a URL query string
  (query strings leak into logs, `Referer` headers, browser history).
- Token = `<expiry-ms>.<hmac>`, self-contained — no server-side session
  store needed for one operator.
- Login attempts are throttled per IP (in-process, resets on deploy —
  explicitly documented as a "nuisance control, not a security boundary,"
  the same honest framing as the lead-form rate limiter).
- A dashboard key under 16 characters is treated as **not configured at
  all** — `/os` 404s rather than accepting a weak secret.

This is explicitly **not a user system**: no accounts, no passwords stored,
no roles, because there is exactly one operator. `lib/server/os/auth.ts`'s
own comment states plainly: "When StayEdge has staff, this is the file that
grows an identity provider; nothing else has to change, because every route
asks this module the same question" (`hasOsSession()`).

### Authorization boundary for the future

Three audiences are already conceptually distinct in the codebase, even
though only two exist today:

```
Public website        — everyone, no auth
Internal StayEdge OS   — one operator today, session-gated
Future client portal   — DOES NOT EXIST. Explicitly out of scope (Phase 5 §12).
```

When a second internal role appears (Operator vs. Admin vs. Analyst), the
extension point is `hasOsSession()`: it currently returns a boolean; the
natural evolution is a session payload carrying a role claim, checked by the
same function, still with no external identity provider needed until roles
themselves need to be self-service (i.e. until StayEdge has to onboard staff
without the founder personally minting their access).

A future **client portal is architecturally distinct from `/os`** and would
be a new, separate auth domain — not an extension of the founder-only
session system. Nothing in the current auth code assumes it will be, so
building one later does not require touching `lib/server/os/`.

---

## 9. AI Website Service extension point

**Status: a declared seam, not an implementation.** Two things constitute the seam today:

1. **`AIServiceSlot`** (`components/os/OSDashboard.tsx`) — a labelled, honest,
   empty panel already rendered on `/os`: *"Not built yet. Reserved slot.
   When the service ships it reports through the same canonical lead schema
   and repository port used by the audit pipeline, so it appears here
   without an architectural change."* This predates Phase 5.

2. **`SERVICE_REGISTRY`** (`lib/services/registry.ts`, added Phase 5) — the
   typed inventory the brief's §3 asks for: service registration, status,
   and metadata as one queryable array, distinct from `lib/leads/schema.ts`'s
   `Service` type (which is the narrow, validated wire contract for what a
   *lead* can request — must stay exactly the six/two real values it
   validates today, never grow speculative entries).

   ```ts
   type ServiceStatus = "commercial-live" | "internal-preview" | "planned";
   type ServiceKind = "consulting" | "ai-generated" | "internal-tool";
   interface ServiceModule { id; name; kind; status; route?; description; }
   ```

   Today: 6 `commercial-live` consulting/AI-video services (Phase 4's public
   IA) + 1 `planned` row for `ai-website-service` — declared, not linked,
   not sold. Adding a "planned" row never launches anything; a service only
   becomes `commercial-live` once it ships a real page, the same way AI
   Property Video did in Phase 1 and the other five did in Phase 4.

**What "jobs/tasks, client association, workflow status, generated assets"
means when the service actually gets built** (documented, not implemented —
avoiding exactly the speculative abstraction Phase 5 was told to avoid):

- **Jobs/tasks**: when the AI Website Service produces work items, they
  follow the same port pattern as leads — a `Job` type in
  `lib/*` (client-safe shape) + a `JobRepository` port in `lib/server/*`,
  with a Sheets or lightweight-DB adapter behind it, exactly mirroring
  `LeadRepository`. Do not build this until there is a real job to store.
- **Client association**: a job needs to reference *which lead/host* it was
  produced for — `CanonicalLead.id` already exists as a stable, quotable
  identifier (`SE-20260904-7KQ3M2`) for exactly this purpose; a future `Job`
  would carry a `leadId` field pointing at it, not invent a parallel
  "client" identity.
- **Workflow status**: reuse the `IntegrationHealth`/status-string pattern
  already established (§5) rather than inventing a bespoke state machine
  before one is needed.
- **Generated assets**: see §10, Artifact model.

---

## 10. Workflow model

**Current, real, implemented workflow**: the lead pipeline's status field.

```ts
type LeadStatus = "New" | "Contacted" | "Qualified" | "Audit Sent" | "Proposal Sent" | "Won" | "Lost" | "Duplicate" | "Spam";
```

This is a flat enum, not a state machine — `/os` lets the founder set any
status on any lead (no enforced transitions), which is correct for a single
human operator making judgement calls, and is validated end-to-end: the CRM
column is checked against this exact list on read, so a value hand-typed
into the sheet can never become an unknown state the dashboard cannot
render (`asStatus()` in `lib/leads/schema.ts`).

**The fuller conceptual pipeline** the Phase 5 brief describes —

```
Lead received → Lead qualified → Audit requested → Audit generated →
Audit reviewed → Sales conversation → Client converted → Client onboarding →
Service delivery → Reporting
```

— maps onto today's `LeadStatus` values only partially (received→New,
qualified→Qualified, sales conversation→Contacted/Proposal Sent, converted→
Won). The stages with no current equivalent (audit *generated*, audit
*reviewed*, client *onboarding*, service *delivery*, *reporting*) do not
exist as distinct states because nothing in the current product generates
them automatically — the "audit" today is a human reading a listing and
replying on WhatsApp, not a system-tracked artifact with its own lifecycle.

**Deliberately not implemented in Phase 5**: a generic `WorkflowEvent`/`Stage`
type extending `LeadStatus` for stages that don't exist yet. That would be
exactly the "avoid speculative abstraction for its own sake" the brief warns
against — an enum value with zero code paths that ever set it is worse than
no enum value, because it lies about what the system does. **The correct
extension point already exists**: `LEAD_STATUSES` is a plain `as const`
array; adding a real stage when a real feature produces it is a one-line
change with the same total-function safety net (`asStatus()`) already in
place.

---

## 11. Future AI agent architecture

Not implemented in Phase 5, by instruction. What the current architecture
already does *not* foreclose:

- **n8n already owns the automation plane** (§4) with a versioned event
  envelope. A future agent (Research Agent, Copy Agent, Campaign Strategy
  Agent, …) is architecturally an n8n workflow subscribing to or emitting
  `N8nEvent`-shaped events — it does not need the Next.js app to change to
  exist, because the website was already built as "an outbound HTTPS webhook
  client and nothing else" (`n8n.ts`'s own words).
- **The service registry** (§9) is where a new agent-driven capability would
  register itself once it produces something client-facing.
- **No code today assumes there is exactly one AI provider, one workflow, or
  one automation surface** — n8n is referenced by URL/webhook, not by SDK, so
  adding a second automation surface (a different orchestrator, a direct
  Claude/OpenAI call from a future job processor) does not require touching
  the lead pipeline.

Concepts named in the brief (`Agent`, `Task`, `Workflow`, `Job`, `Artifact`,
`Client`, `Project`) are **documented here, not typed in code**, because zero
current call sites would consume them — the same restraint applied
throughout this phase. When any one of them gets a real implementation, it
should follow the two patterns already proven in this codebase:

1. **Port + adapter** (`LeadRepository`) for anything that persists.
2. **`{configured, reachable, detail}` health** (`IntegrationHealth`) for
   anything that talks to an external system.

---

## 12. Artifact / asset model

**Not implemented — none is needed yet.** No part of the current system
generates a file, report, or media asset that needs storage beyond what
already exists (Telegram messages, CRM rows, static content files in the
repo). When the AI Property Video service or a future AI Website Service
actually produces binary output (a rendered video, a generated audit PDF),
the natural extension is:

- An `Artifact` concept (id, `kind`, `leadId` or job reference, storage
  location, created/expires timestamps) — deliberately not typed yet, per §11.
- **Storage**: object storage (S3-compatible — Vercel Blob, Cloudflare R2, or
  similar) rather than the CRM itself, the same separation-of-concerns the
  `LeadRepository` port already models: the CRM stores facts about a lead,
  not the lead's binary attachments.
- No paid storage infrastructure exists today and none should be added
  before there is a real artifact to store — this section exists so the
  decision is documented, not deferred by accident.

---

## 13. Security review (Phase 5)

Findings, stated honestly — this is not a "production secure" claim.

**Holds up well:**
- No secret is ever `NEXT_PUBLIC_`-prefixed; verified by direct grep of every `process.env.*` reference in the codebase (§6).
- Google Sheets writes use `RAW` value input exclusively — `USER_ENTERED` would let a submitted `=IMPORTXML(...)` name execute as a live formula inside the founder's spreadsheet on every open. This is treated as a named, explicit attack class in the adapter's own comments, not an incidental choice.
- `/os` session cookie is httpOnly (XSS cannot read it), `SameSite=Lax` (CSRF-resistant on the state-changing `PATCH`), signed with HMAC-SHA256, and compared with `crypto.timingSafeEqual` after hashing both sides to equal length (prevents both a timing oracle and a length oracle).
- A dashboard key under 16 characters disables `/os` entirely rather than accepting a weak secret.
- Every unauthenticated request to an internal endpoint gets `404`, not `401` — an internal tool should not confirm its own existence to a stranger.
- The lead API returns `200` to detected bots (never teaches an attacker which check caught them) while still discarding the submission.
- Upstream error bodies (Google's, Telegram's) are never forwarded to any client-facing surface — only short internal status codes.

**Real, stated limitations (not fixed in Phase 5 — architectural, not urgent):**
- **Rate limiting and login throttling are in-process memory**, not a shared store (Redis/Upstash). On Vercel's multi-instance serverless model, a distributed burst can exceed the stated limit, and every limit resets on deploy. Documented as a deliberate trade for a low-volume form; the upgrade path is a shared KV store, needed only past a volume this system does not have yet.
- **`OS_SESSION_SECRET` falls back to `OS_DASHBOARD_KEY`** when unset — documented, deliberate (a half-configured deployment still gets signed sessions), but means rotating the login key also invalidates every session, which is a minor operational surprise if not expected.
- **No dependency-vulnerability scan was run in this pass** (no network access to `npm audit`'s advisory database in this environment) — recommend running `npm audit` before Phase 6 deployment.
- **No formal input-fuzzing or penetration test was performed.** The Zod schema at `lib/leads/schema.ts` is the sole validation boundary for the public lead form; it was read and appears comprehensive (length caps on every field, URL-shape validation on `listingUrl`, enum validation on `service`/`propertyType`) but was not adversarially tested in this phase.

---

## 14. Testing

Pure business logic (`lib/leads/*`, `lib/server/leads/*`, `lib/server/os/session-token.ts`, `lib/services/registry.ts`) runs under Node's native test runner (`npm test` → `node --test "tests/**/*.test.ts"`), no framework, no transpiler, no server. This works because every server-only module still avoids framework imports where possible (`session-token.ts` has zero Next.js imports; the cookie-handling wrapper lives separately in `auth.ts`).

See `PHASE5_ARCHITECTURE_REPORT.md` §18 for the concrete Phase 5 test results, including a module-resolution defect this phase found and fixed (extensionless relative imports across `lib/`, which silently prevented `tests/leads.test.ts` from running at all under Node's native TypeScript stripping) and one narrow, pre-existing, documented-but-unfixed logic edge case it surfaced as a result.
