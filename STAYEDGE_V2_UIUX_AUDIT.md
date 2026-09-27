# STAYEDGE V2 — UI/UX AUDIT

**Branch:** `worktree-ui-refresh` (based on `v2` tip `132ed3a`) · **Scope:** `stayedge-website/` UI/UX/content/conversion only — no backend, infra, or env changes · **Status:** Audit complete, awaiting priority sign-off before implementation

**Brand-palette decision (locked in, confirms with the user before this audit):** the incoming brief specified Navy/Emerald/Gold. That conflicts with StayEdge's actual, documented brand — purple/lavender/charcoal, sourced from `app/brand/brand-tokens.css` (`--se-purple: #6F2DBD`, `--se-lavender: #A663CC`, `--se-charcoal: #171123`), which traces to the real Brand Operating System and the logo geometry, and is used consistently across all 22 pages. **Decision: keep the real brand.** Every recommendation below applies the brief's *principles* (restraint, hierarchy, premium whitespace, less gimmick) to the existing palette, not a palette swap.

---

## 1. Current strengths

- **Copy voice is already right.** "The sharp operator, not the loud guru," the DIY/property-manager/StayEdge comparison table, "We don't guess. We run a process." — this is confident, specific, non-generic language, already matching the brief's tone guidance (§25) almost verbatim.
- **AI positioning is already correct.** The "AI plus operators" section (homepage) reads: *"Vira reads your listing at a scale no human can. Real operators turn that into a plan you can act on."* That's consultancy-first, technology-enabled — not an "AI-powered everything" pitch. AI Property Video is positioned as one service among six, not the flagship.
- **Free Property Growth Audit is already the dominant, singular CTA** across hero, nav, footer, floating card, and final CTA — no competing conversion paths.
- **No fabricated proof anywhere.** Case studies are explicitly labelled "ILLUSTRATIVE" / "EXAMPLE OPTIMIZATION," the revenue calculator is user-input-driven and labelled "illustrative only," and the comparison table's property-manager cost range is footnoted as an industry range, not a StayEdge claim. This already satisfies §14/§33 (do not fabricate) without any change needed.
- **Service-page template consistency is strong.** All 6 service pages share one structural shape (hero → 4-item grid → 3-step process → related services → FAQ → schema), similar length (177–249 lines), same `Button` component. Nothing looks thin or off-brand.
- **City pages have real per-city variation** (12 cities: pilgrimage-driven Tirupati vs. tech-corridor Bangalore vs. medical-tourism Chennai, etc.), not templated filler.
- **Accessibility fundamentals are already handled**, not bolted on: `prefers-reduced-motion` is respected via Framer's `useReducedMotion()` across every motion component (Reveal, AIPresence, FloatingAuditCard, Vira, LeadForm), single `<h1>` per page confirmed on 3 sampled pages, theme system remixes ~15 color tokens for contrast per mode rather than inverting (lavender→purple accent swap because lavender only hits ~3.8:1 on light vs ~7.8:1 for purple).
- **Free-audit form is well-built**: only name+phone required (deliberate low-friction), shared client/server validation schema, honeypot + timing-based bot detection, distinct rate-limit/field/network error copy, accessible `aria-live` success state.
- **SEO surface is intact and wired**: sitemap covers all services/cities/knowledge articles, robots.txt present, JSON-LD schema helpers actually rendered (not just declared) on every page type checked.
- **AI Roast is fully removed already** — see §9.

## 2. Critical UX problems (P0 candidates)

- **No mobile navigation exists.** `SiteHeader.tsx` has a code comment: *"the mobile sheet [is] layered in milestone 2"* — it was never built. Below `lg` (1024px), a visitor cannot reach Who We Help, Results, How We Think, How We Work, AI Lab, Knowledge, About, or Contact from the header at all; only the footer and the mobile action bar's few items are reachable. On a site whose stated positioning is mobile-first India traffic, this is the single biggest functional gap on the site — not polish, a missing feature.
- **Two fixed-position UI elements share the same mobile real estate.** The analytics-consent banner (`fixed inset-x-4 bottom-[96px] z-[300]`) and the Vira floating button (`fixed bottom-[calc(96px+...)] right-4 z-[200]`) occupy the same vertical band on mobile before a consent choice is made. Higher z-index likely covers Vira, but the two were evidently built without reference to each other. Worth a deliberate fix, not a guess.

## 3. Visual inconsistencies

- **No shared `Card` primitive.** FAQ items, "related service" tiles, and process-step tiles are hand-rolled per page (`pricing-strategy/page.tsx:119`, `listing-optimization/page.tsx:136`, `[slug]/page.tsx:169`, `[city]/page.tsx:109`) with copy-pasted Tailwind classes rather than one component. Visually consistent today only because the classes were copied correctly; a future spacing/radius tweak needs find-and-replace across 4+ files instead of one edit. Matches the brief's §30/§31 concern directly.
- **`Skeleton` component is dead code** — built but never imported; the actual loading shimmer is a separate raw CSS class (`.se-skeleton`). Minor, but it's drift between the declared design system and what's wired up.
- Knowledge articles have no in-page table of contents or jump links for longer pieces — relies solely on the closing "related reading" grid.

## 4. Conversion problems

- None found that need fixing independent of the nav gap above. CTA hierarchy (Free Audit primary, AI Property Video secondary), placement, and the low-friction form design are already sound per the brief's own criteria (§13).

## 5. Mobile problems

- The nav gap in §2 is the headline mobile problem.
- The consent-banner/Vira overlap in §2 is mobile-specific (Vira collapses to a smaller `bottom-6 right-6` position only at `sm:` and up; the conflict is below that).
- Desktop nav has a plausible tight spot at 1024–1150px width (5 labels + logo + 2 CTA buttons + theme toggle in one unwrapped flex row) — flagged as a risk from code reading, not yet confirmed visually.
- No other viewport-specific breakage found in the code read; a visual pass at the breakpoints in §37 of the brief (320/375/390/430/768/1024/1280/1440) is still recommended once nav is rebuilt, since the rebuild is exactly the kind of change that needs re-verifying at each width.

## 6. Accessibility problems

- Nothing broken found. The one gap worth closing: no visible focus-state audit was done on interactive elements (buttons, form fields, FAQ `<details>`) — worth a pass alongside any component work, low cost to bundle in.

## 7. Performance risks

- `AIPresence.tsx` already tiers its WebGL/3D usage by device capability and `prefers-reduced-motion` — the expensive 3D work is already gated, not a blind risk.
- Nothing else flagged. A Lighthouse/CLS pass is worth doing once nav/homepage changes land, not before.

## 8. Content problems

- None found. Uncited-but-reasonable rhetorical framing exists in two city pages ("2–3x normal rates" for Mysore Dasara, "70%+ occupancy") — not presented as sourced statistics, just seasonal framing. Low priority; could add "typical seasonal pattern" framing if ever challenged.

## 9. AI Roast references

**Already fully removed.** Grepped the entire codebase: every remaining string match is either (a) a code comment explaining the historical removal (`lib/analytics.ts`, `lib/ai/memory.ts`, `components/sections/Process.tsx`, `components/sections/VideoService.tsx`, `lib/seo/schema.ts`), or (b) the legitimate `/roast` → `/free-audit` 308 redirect in `next.config.ts`, which the brief itself says to preserve. No customer-facing Roast UI, copy, navigation, cards, or schema exists anywhere. **Phase A of the brief's own plan is a no-op — nothing to implement.**

## 10. Recommended redesign priorities

| # | Item | Priority | Status | Why |
|---|---|---|---|---|
| 1 | Build the mobile navigation sheet | **P0** | ✅ Done (`f1b3e29`) | Doesn't exist; most site sections are unreachable on mobile via header |
| 2 | Resolve Vira / consent-banner mobile overlap | **P0** | ✅ Done (`f1b3e29`) | Two live elements can visually collide before consent |
| 3 | Extract a shared `Card` primitive from the 4+ hand-rolled variants | **P1** | ✅ Done for the 6 service pages + hub (`71bd421`); about/who-we-help/results/knowledge/city pages deferred — each has its own bespoke variant | Visual-consistency and maintainability risk the brief explicitly calls out |
| 4 | Verify desktop nav at 1024–1150px; add wrap/overflow safety if needed | **P1** | ✅ Checked (`71bd421`) — no overflow/wrap at 1024/1080/1150/1280px, no code change needed | Unverified risk from code reading |
| 5 | Homepage polish pass (hierarchy, spacing, motion restraint) per brief §5–§7, applied to the real palette | **P1–P2** | ✅ Audited + one real fix (`4cbe9f4`): Hero/Section/Reveal/AILabPreview already solid, no changes needed there; comparison table now signals it's swipeable on mobile | You already chose homepage as the starting page |
| 6 | Focus-state audit on buttons/forms/FAQ toggles | **P2** | ✅ Done (`362cef9`) — Card, nav (header/footer/mobile sheet), 6 standalone accent links, 9 of 10 FAQ summaries | Accessibility completeness |
| 7 | Add a lightweight table-of-contents to long knowledge articles | **P2** | ✅ Done (`439dd2b`) — gated on 3+ sections, verified click-to-scroll works | Reading-experience improvement, not urgent |
| 8 | Wire up or remove the dead `Skeleton` component | **P3** | ✅ Removed (`64a8dbb`) — confirmed zero references repo-wide first | Cleanup, no user-facing effect |
| 9 | Add "typical seasonal pattern" framing to the two city-page rhetorical stats | **P3** | ✅ Done (`bd65aa2`) — reframed as general pattern, no numbers changed | Precautionary, not currently misleading |
| 10 | Extend the `Card` shell to about/who-we-help/results/knowledge/city pages | **P1** (new) | Not started | Same duplication pattern found in more files during P1 work; deferred to keep this pass reviewable |

---

## Implementation plan (proposed phasing)

Given the brief's own 13-phase structure (A–M) is sized for a much larger, multi-week engagement, and Phase A (AI Roast) is already done, the practical next slice is:

- **Phase 1 (P0):** mobile navigation sheet + Vira/consent-banner overlap fix.
- **Phase 2 (P1):** shared `Card` primitive extraction (mechanical refactor, low risk, unblocks future consistency) + desktop nav width check.
- **Phase 3 (P1–P2):** homepage polish pass — the page you already picked to start on.
- **Phase 4 (P2–P3):** the smaller cleanup items, only if you want them.

Each phase ends with: `tsc`, lint, `npm test`, production build, and a real-browser screenshot pass at the breakpoints in the brief — the same rigor used for the `/os` fix already on `v2`.

**Not doing in this pass, and why:** service-page rewrites, city-page rewrites, knowledge-page rewrites — the audit found these already structurally consistent and content-sound; rewriting working, on-brand pages would be scope creep against the brief's own "don't destroy working functionality" rule (§2). If you want any of them touched, say which and why (e.g. a specific page reads weak) rather than a blanket redo.
