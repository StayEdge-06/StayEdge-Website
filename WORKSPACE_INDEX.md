# Workspace Index — D:\Claude code

_Generated 2026-07-20. This file is a map of everything in the workspace: every project, git repository, Obsidian vault, and piece of documentation, how they relate, and where the gaps are._

---

## 1. What this workspace actually is

`D:\Claude code` is **itself** an Obsidian vault (`.obsidian/`) **and** the git repository for the StayEdge marketing website (`.git` remote → `github.com/StayEdge-06/StayEdge-Website.git`). The actual Next.js app lives one level down in `stayedge-website/`, while the repo root also carries six strategy/spec markdown files (`AUTHORITY_ENGINE.md`, `DESIGN_SYSTEM.md`, `PRODUCTION_READINESS.md`, `SEARCH_DOMINANCE.md`, `UX_ARCHITECTURE.md`, `WEBSITE_EXPERIENCE_SPECIFICATION.md`) that aren't inside the website folder itself.

Nested inside `Projects/` are **five more independent git repositories**, each with its own `.git`, none of them submodules — they just sit inside the tree:

| Nested repo | Tracked by root `.gitignore`? |
|---|---|
| `Projects/raphael-os` | Yes — explicitly ignored (`raphael-os/`) |
| `Projects/OmniRoute` | **No** |
| `Projects/Stayedge-OS` | **No** |
| `Projects/automaton` | **No** |
| `Projects/ruflo` | **No** |

**⚠ Structural note:** because four of those five nested repos aren't gitignored at the root, `git status` in the root repo will show them as opaque untracked directories. That's probably intentional (nobody's accidentally committed one into the website repo yet), but it isn't documented anywhere, and it's the kind of thing that bites someone during a `git add -A`.

The root `CLAUDE.md` also references a `graphify-out/` knowledge graph "at project root" — in practice that graph lives at `Projects/graphify-out/` and its corpus (97 files, built from commit `636f8fe9`) only covers `stayedge-website/` plus the six root strategy docs. It does **not** cover OmniRoute, ruflo, raphael-os, Stayedge-OS, automaton, or the StayEdge vault — so `graphify query` is only useful for website/strategy questions, not for the rest of this workspace.

---

## 2. Project index (at a glance)

| Project | Path | Kind | Stack | Git remote | Maturity |
|---|---|---|---|---|---|
| **StayEdge Website** | `stayedge-website/` (+ root) | Next.js marketing site | Next.js 16 / React 19 / TS / Tailwind 4 / Three.js | root repo → `StayEdge-06/StayEdge-Website` | Active, V1 in production-readiness review |
| **OmniRoute** | `Projects/OmniRoute/` | Self-hosted LLM gateway/router | TS / Node 22 / Next.js 16 / SQLite / Electron | `diegosouzapw/OmniRoute` | Very active (v3.8.49, 306 commits in current cycle) |
| **ruflo** (claude-flow) | `Projects/ruflo/` | AI agent orchestration harness for Claude Code/Codex | TS/Node (npm+pnpm workspaces) + thin Rust surface | `ruvnet/ruflo` | Very active (v3.32.8) |
| **raphael-os** | `Projects/raphael-os/` | Business-agnostic "Executive OS" framework for AI-run companies | Python 3.11 / asyncio / JSON Schema | none (local only) | Pre-release v0.5.0, Goal 5/8 |
| **Stayedge-OS** | `Projects/Stayedge-OS/` | StayEdge's business operating system (docs/process, not code) | Markdown + n8n specs | `StayEdge-06/Stayedge-OS` | Early, "v1.0 Foundation" |
| **automaton** | `Projects/automaton/` | Self-funding, self-replicating sovereign AI agent runtime | TS/Node, SQLite, viem (Ethereum) | `Conway-Research/automaton` | Active |
| **StayEdge vault** | `Projects/StayEdge/` | Obsidian business knowledge base (company docs, not code) | Markdown | none | Sparse — mostly empty folders |
| **Stayedge-OS ↔ Website integration (WEB-HEAD)** | `stayedge-website/os/` | Integration doc + n8n workflow export | n8n (cloud-hosted) | n/a | **LIVE** in production |
| **Diablo vault** | `Projects/Diablo/Diablo/` | Obsidian vault | — | none | Empty (default welcome note only) |
| **"Obsidian"** | `Projects/Obsidian/` | Not a project — the installed Obsidian.exe application binaries (350MB) | — | — | n/a |

---

## 3. Project details

### StayEdge Website (`stayedge-website/`, root docs)
Marketing/product site for StayEdge, an Airbnb-listing growth consultancy. Next.js 16 App Router, React 19, Tailwind 4, Framer Motion/GSAP/Three.js for the "premium" interactive experience described in the root spec docs. Notable app surfaces per the graphify report: a "Roast Engine" (AI listing critique), "Jarvis" (site AI assistant), a Growth Snapshot tool, and an `/os` dashboard.
- Key docs (root-level, sit **outside** `stayedge-website/`): `WEBSITE_EXPERIENCE_SPECIFICATION.md` (the "experience bible," source of truth for UX/motion), `UX_ARCHITECTURE.md` (sitemap/journeys, downstream of the bible), `DESIGN_SYSTEM.md` (visual language, sources brand tokens from the Stayedge-OS repo), `SEARCH_DOMINANCE.md` (SEO/AEO/GEO audit), `AUTHORITY_ENGINE.md` (content/authority roadmap), `PRODUCTION_READINESS.md` (V1 launch checklist, milestones M1–M11).
- `stayedge-website/os/README.md` documents a **live integration** with Stayedge-OS: the website calls a single n8n gateway workflow (`StayEdge WEB-HEAD - Website Gateway`) for `/api/roast`, `/api/lead`, and `/api/os/status`, which in turn drives AI generation, CRM lead capture, and Telegram founder notifications. This is the one confirmed live wiring between two projects in this workspace — worth knowing if you touch either side.
- Known issue documented in that README: both configured AI providers (Gemini, OpenAI) are billing-constrained; the site falls back to a local heuristic when AI is unavailable.

### OmniRoute (`Projects/OmniRoute/`)
Open-source, self-hosted AI gateway: one local OpenAI/Claude/Gemini-compatible endpoint that fans out across 268 LLM providers with automatic fallback, so coding tools never hit rate limits. Ships its own MCP server (104 tools), A2A agent protocol, memory, and skills subsystem. npm workspace monorepo; `open-sse/` is the core streaming engine (handlers/executors/translators/transformers), `src/lib/db/` is a 95-file/110-migration SQLite domain layer, `electron/` is the desktop wrapper, `bin/` is the CLI.
- Best entry points: `docs/README.md` (doc index), `docs/architecture/ARCHITECTURE.md`, `docs/routing/AUTO-COMBO.md`, root `CLAUDE.md` (46KB engineering handbook, 22 numbered "Hard Rules").
- No references anywhere to any other project in this workspace — fully independent, third-party-authored codebase you're presumably contributing to or vendoring.

### ruflo / claude-flow (`Projects/ruflo/`)
"Agent = Model + Harness." Ruflo is the execution-layer harness around Claude Code/Codex: 100+ specialized agents, swarm coordination, self-learning vector memory (AgentDB/HNSW), federated cross-machine comms, and security guardrails, distributed as a plugin marketplace. Published as three coupled packages: `@claude-flow/cli` → `claude-flow` → `ruflo` (thin wrapper).
- `v3/` is the **current** actively-developed codebase (DDD architecture, 25 `@claude-flow/*` packages) — not legacy.
- `ruflo/` (the nested dir) is the npm-installable end-user wrapper + self-hosted web UI, not legacy either.
- `plugins/` (root, 38 subfolders) is the stable plugin marketplace; `v3/plugins/` (16 more) holds newer/experimental plugins.
- `crates/` is a deliberately minimal Rust surface (2 crates), explicitly kept thin per a comment in the manifest.
- Docs: `docs/USERGUIDE.md`, `docs/federation/` (zero-trust mesh, mTLS+ed25519), `docs/metaharness-user-guide.md`, ADRs under `ruflo/docs/adr/`.
- No references to any other project in this workspace.

### raphael-os (`Projects/raphael-os/`)
An "Executive Operating System" — explicitly **not** an agent framework or a product, but a business-agnostic substrate that real companies (in their own repos) consume via frozen JSON-Schema contracts. Coordinates AI "executives" (decide), "departments" (plan), and "specialists" (execute) over a shared deterministic-first memory/intelligence layer. Python 3.11, stdlib-first, packaged as `raphael-kernel`/`raphael-intelligence`/`raphael-capabilities`.
- Currently pre-release (v0.5.0): kernel, contracts, and intelligence layer are implemented and frozen; **no executives, departments, specialists, or business logic exist yet** (that's the next goal). 20 ADRs in `docs/adr/`, constitution at `constitution/CONSTITUTION.md` (v1.0.0, ratified 2026-07-14).
- Its own docs explicitly forbid StayEdge (or any company's) business logic from living in this repo — StayEdge is named only as a negative example. This is the one place in the workspace where a cross-reference to another project exists, and it's a boundary rule, not a dependency.

### Stayedge-OS (`Projects/Stayedge-OS/`)
StayEdge's "Business Operating System" — a documentation/process repo (explicitly "not a code repository"), single source of truth for capabilities, workflows, and knowledge, meant to guide both the founder and AI assistants (Claude Code, ChatGPT, Gemini). Numbered folders `00-Governance` through `10-Archive`; almost everything is still empty placeholders except `04-Knowledge` and `08-Automations` (which holds n8n **specs**, not actual workflow code/exports).
- State: "v1.0 Foundation," only `CAP-001-Lead-Generation` exists so far (README only). Planned order: Lead Gen → Growth Snapshot → Outreach → CRM → Proposals → Onboarding → Reporting → Content Platform → Business Brain.
- ADRs in `architecture/ADR/`: business-first architecture, n8n as orchestrator, Telegram as CEO interface, Business Brain, multi-AI routing, GitHub as source of truth.
- **Undocumented in this repo but confirmed live elsewhere:** the n8n WEB-HEAD gateway described in `stayedge-website/os/README.md` is the real implementation of ADR-002 (n8n Orchestrator) — Stayedge-OS's own docs don't mention it, so if you're working in Stayedge-OS, check the website's `os/` folder too.

### automaton (`Projects/automaton/`)
A continuously-running, self-improving, self-replicating sovereign AI agent runtime by Conway Research. Generates its own Ethereum wallet, pays for its own compute via USDC/x402, and dies if it runs out of credits ("earn your existence" as a hard constitutional law). ReAct loop, 57 built-in tools across 10 categories, a 7-layer defense-in-depth security model (constitution → policy engine → injection defense → path protection → command safety → financial limits → authority hierarchy), 5-tier memory system, and a self-authored `SOUL.md` identity file that evolves over time.
- `README.md` (product pitch, quick start, constitution) and `ARCHITECTURE.md` (exhaustive, ~800-line system design doc covering every subsystem) are both excellent and current — this is the best-documented project in the workspace.
- 897 tests across 24 files. No relationship to any other project here; it's an independent open-source project from a different organization (Conway Research).

### StayEdge vault (`Projects/StayEdge/`)
An Obsidian-style business knowledge vault for StayEdge (no `.git`). `01 Company/` has the real content — `MISSION.md`, `VALUES.md`, `GOALS.md`, `BRAND.md`, `SERVICES.md`, `TARGET_CUSTOMER.md`, `Vision.md` — and `03 Departments/` has one subfolder per department (CEO, CCO, Acquisition, Audit, Automation, Client Success, Creative Director, Finance) with mission docs like the CEO one read above. Everything else (`04 SOPs` through `10 Assets`) is empty.
- **⚠ Security flag:** `Projects/StayEdge/API Keys.txt` is a 74-line plaintext file sitting directly in this vault. It was not opened/read as part of this audit, but its name and location strongly suggest live credentials stored unencrypted outside any secrets manager, and outside git (this folder has no `.git`, so at least it isn't at risk of being pushed anywhere — but it also isn't backed up or access-controlled). Worth moving to a password manager or `.env` + secret store.

### Diablo vault (`Projects/Diablo/Diablo/`)
An Obsidian vault containing only the default `Welcome.md` — never actually used. Candidate for deletion or, if it was meant for something (a game project? a client named Diablo?), for starting to fill in.

### "Obsidian" (`Projects/Obsidian/`)
Not a project — this is the installed Obsidian.exe application itself (portable/electron build, ~350MB of binaries, DLLs, locales, resource paks). It's oddly located inside `Projects/`; probably belongs outside the workspace entirely, or at minimum outside `Projects/`.

---

## 4. How the projects relate to each other

Despite living in one workspace, **almost none of these projects reference each other**. Explicit checks (grep across each repo) found:

- **stayedge-website ↔ Stayedge-OS**: real, live, production dependency via the n8n WEB-HEAD gateway (see §3). This is the only confirmed *runtime* dependency in the workspace, and it's documented on the website side only.
- **raphael-os → StayEdge**: one-directional and negative — raphael-os's docs cite StayEdge only as an example of business logic that must *not* be added to raphael-os.
- **OmniRoute, ruflo, automaton**: fully independent third-party/upstream projects (different GitHub orgs: `diegosouzapw`, `ruvnet`, `Conway-Research`). No references to anything else in this workspace, and nothing here references them either. They read as vendored/adopted tooling rather than StayEdge-authored work — likely present because they're used *as tools* (ruflo as the Claude Code harness, OmniRoute as an LLM gateway) rather than because they're part of the StayEdge product.
- **Stayedge-OS ↔ StayEdge vault (`Projects/StayEdge/`)**: these look like two generations of the same idea (a business knowledge base) — the Obsidian vault (unstructured, mostly empty) and Stayedge-OS (structured, git-tracked, ADR-driven) — with no explicit migration note between them. Worth clarifying which one is authoritative going forward.

---

## 5. Missing / thin documentation

- **Stayedge-OS**: 6 of 11 numbered top-level folders are empty placeholders (`00-Governance`, `01-Brain`, `05-SOPs`, `06-Templates`, `09-Metrics`, `10-Archive`). `01-Brain` in particular is referenced as central ("Business Brain") in ADR-004 and the CEO's daily-question philosophy in the StayEdge vault, but doesn't exist yet.
- **raphael-os**: `departments/`, `executives/`, `specialists/` are contracts-only — no real implementations, by design (Goal 6 not started).
- **StayEdge vault**: `04 SOPs` through `10 Assets` (7 of 10 top folders) are empty.
- **Diablo vault**: entirely unused.
- **Root workspace**: no top-level README explaining what `D:\Claude code` as a whole is, how the nested repos relate, or why OmniRoute/ruflo/automaton (third-party projects) live under `Projects/` alongside StayEdge-authored work. This file is meant to fill that gap going forward.
- **Nested-repo git hygiene**: no documentation anywhere explaining why 4 of 5 nested repos are untracked-but-not-ignored at the root (see §1).
- **Stayedge-OS ↔ website integration**: the live n8n WEB-HEAD gateway is documented only in `stayedge-website/os/README.md`; Stayedge-OS's own `08-Automations/N8N/` folder (which is supposed to be the automation source of truth) doesn't mention it.

---

## 6. Quick reference paths

| Need to... | Look at |
|---|---|
| Understand the website's UX/motion rules | `WEBSITE_EXPERIENCE_SPECIFICATION.md`, `UX_ARCHITECTURE.md`, `DESIGN_SYSTEM.md` (repo root) |
| Check website SEO strategy | `SEARCH_DOMINANCE.md`, `AUTHORITY_ENGINE.md` (repo root) |
| Trace the website ↔ n8n ↔ CRM integration | `stayedge-website/os/README.md`, `stayedge-website/os/ops-monitor-workflow.sdk.ts` |
| Query the (partial) knowledge graph | `graphify query "<question>"` — covers `stayedge-website/` + root docs only |
| Understand OmniRoute's routing engine | `Projects/OmniRoute/docs/routing/AUTO-COMBO.md` |
| Understand ruflo's plugin system | `Projects/ruflo/plugins/README.md`, `Projects/ruflo/v3/README.md` |
| Understand raphael-os's contract model | `Projects/raphael-os/core/contracts/README.md`, `Projects/raphael-os/docs/adr/` |
| Understand automaton's full architecture | `Projects/automaton/ARCHITECTURE.md` (comprehensive, ~800 lines) |
| Understand StayEdge the business | `Projects/StayEdge/01 Company/MISSION.md`, `VALUES.md`, `SERVICES.md` |
| Understand StayEdge's planned automation roadmap | `Projects/Stayedge-OS/PROJECT_STATE.md`, `architecture/ADR/` |
