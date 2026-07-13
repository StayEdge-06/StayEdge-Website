# DESIGN_SYSTEM.md
### StayEdge — Design System & Visual Language
*Version 1.0 · Owner: Creative Director / Design System Architect · Status: For approval · Phase 3 · Scope: Design language only — no React, no components, no implementation code*

> **Single source of truth:** the StayEdge Brand Operating System v1.0 (July 2026), located at `01-Business/Brand/StayEdge/` in the StayEdge OS repo (`Brand-Book.pdf`, `tokens/brand-tokens.json`, `tokens/brand-tokens.css`, `logos/`). This document **extends** that brand into an interactive digital product. It does not invent a new brand; every color, face, and the logo geometry below are taken verbatim from the token files. Where I add web-only rules (motion, glass, depth, 3D), they are derived *from* the existing brand DNA, and every extension is flagged for approval in §34.
>
> Downstream of and obedient to: `WEBSITE_EXPERIENCE_SPECIFICATION.md`, `UX_ARCHITECTURE.md`, and Strategy v1/v2. Phase 4 (UI/implementation) must not begin until this is approved.

**Terminology lock (from the brand book):** the audit deliverable is always the **"Property Growth Snapshot."** Earlier docs called it "Growth Snapshot" — this document adopts the brand-correct full term. I recommend we align all prior docs to it.

---

## 0. THE CENTRAL CREATIVE DECISION (read first)

The brand book was written for **static deliverables** (PDFs, proposals, social posts) and explicitly prohibits *gradients, 3D effects, drop shadows, and neon.* Your website vision (Experience Bible, Change 10) explicitly requires *3D, glass morphism, particle systems, dynamic lighting, depth.* These appear to conflict. They don't — if we govern them correctly:

**The resolution — one brand, two mediums:**
- **Document medium (PDF/print/social):** the brand book's prohibitions apply in full. Flat, editorial, serious. §17 (PDF Design Language) is 100% brand-book compliant — no gradients, no 3D, no shadows.
- **Interactive medium (web product):** we extend the brand into motion and depth, but **only through the brand's own DNA** — never generic effects:
  - **Depth** comes from the brand's *own* supporting purples (`--se-deep-purple`, `--se-dark-plum`) and light, not arbitrary grey drop-shadows.
  - **"Dynamic lighting" is purple light** — always within charcoal→purple→lavender. **Never neon, ever.** This honors the "no neon" rule absolutely.
  - **Glass is tinted with charcoal/lavender**, never generic frosted white.
  - **Gradients** exist only as near-invisible charcoal→deep-purple *grounds*, never as color for its own sake.
  - **The 18° shear** of the logo becomes the **signature geometric and motion axis of the entire product** — the single device that makes StayEdge instantly recognizable.
  - **The Rising Edge (three ascending bars, ratio 11:17:23)** and **the lavender diamond spark** become the core AI/loading/score visual language.

This keeps us unmistakably StayEdge — *the sharp operator, not the loud guru* — while delivering the "I've never seen a website like this" ambition. **This reconciliation is Decision D1 in §34 and needs your explicit sign-off, because it formally extends the brand book into a new medium.**

---

## TABLE OF CONTENTS
1. Design Philosophy
2. Visual Language
3. Layout System
4. Grid System
5. Typography System
6. Spacing System
7. Color System
8. Elevation System
9. Glass Morphism Rules
10. Motion Philosophy
11. Iconography
12. Illustration Style
13. Photography Direction
14. Component Design Rules
15. AI Visual Language
16. Roast Visual Language
17. Growth Snapshot Design
18. PDF Design Language
19. Card System
20. Form System
21. Navigation System
22. Mobile Design Rules
23. Desktop Design Rules
24. Accessibility Rules
25. Animation Principles
26. 3D Usage Guidelines
27. Three.js / Spline Usage Strategy
28. Premium Interaction Guidelines
29. Performance Budget
30. Reusable Design Tokens
31. Future Dashboard Design Language
32. The 22 Signature StayEdge Interactions
33. The Experience Score (rubric + threshold)
34. Open Decisions for Approval

---

# 1. DESIGN PHILOSOPHY

**One line:** *The intelligence is the aesthetic.* StayEdge looks premium because it is precise, not because it is loud.

**Five philosophical pillars (each maps to a brand voice pillar):**
1. **Sharp, not shiny.** (Voice: confident, not loud.) Restraint reads as expertise. We earn "wow" through precision and timing, not decoration. Every screen could belong to a company that charges what it's worth.
2. **Show the intelligence.** (Voice: specific, not vague.) The AI is visible, choreographed, and always tied to real signal. We celebrate the machine — but with the composure of a senior consultant, never a carnival.
3. **Purple is the judgement.** (Brand: purple = premium judgement, never below 40%.) The brand's purple-charcoal-lavender world is the mood: ambitious, grounded, human.
4. **Warm underneath the rigor.** (Voice: warm, not casual.) Data-led but human — the "hope" beat, the encouraging tone, the respect for the host's time and money.
5. **Every pixel has a job.** (Voice: clear, not clever.) If an element doesn't move Trust, Curiosity, Authority, Lead-gen, Discovery, or Revenue — it's cut. Design serves conversion, always.

**Inspiration, digested not copied:** Apple's restraint and choreography · Airbnb's warmth and belonging · Linear's precision and speed · Stripe's trustworthy clarity · Arc's playful confidence · Framer's motion craft · Vercel's dark elegance · OpenAI's calm intelligence · Nike's emotional conviction. **We take the *discipline* behind each, not their surfaces.** The output is unmistakably StayEdge because it is built from the Rising Edge geometry and the purple world — which none of them share.

---

# 2. VISUAL LANGUAGE

**The three signature devices** (the DNA that makes any screen recognizably StayEdge):

1. **The 18° Edge.** The logo's shear angle is the product's universal axis. Section reveals rise along it; dividers cut at it; cards lift toward it; the score climbs along it. When something enters or ascends, it does so at 18°. This is our "swoosh" — geometry, not ornament.
2. **The Rising Edge (three bars, 11:17:23).** Ascending progression is the brand's core metaphor (growth). It appears as loading rhythm, the score's climb, progress indicators, and data bars. Three ascending elements = StayEdge.
3. **The Lavender Diamond Spark.** The diamond at the logo's peak is the "intelligence present" marker — it is Jarvis's visual soul: it pulses when thinking, sparks at insight, and marks the top of every rising motion.

**Overall mood:** premium dark-first (Rich Charcoal grounds), with Off-White "breath" spaces for reading, Primary Purple as the anchor of every decision moment, Soft Lavender as the human warmth and the intelligence accent.

**Composition principles:** generous margins; strong hierarchy; asymmetry along the 18° axis for energy; one focal point per viewport; numbers always in IBM Plex Serif so data feels engineered.

**What StayEdge is NOT visually:** no neon, no rainbow gradients, no glossy 3D chrome, no stock-photo gloss, no emoji-driven UI, no exclamation-mark energy. Sharp operator, not loud guru.

---

# 3. LAYOUT SYSTEM

**Philosophy:** editorial structure (from the brand book's document design) brought to screen — generous margins, clear tiers, nothing overflowing its container.

- **Canvas modes:** *Dark* (Rich Charcoal `--se-charcoal` ground — default for hero, Roast, immersive sections) and *Light* (Off-White `--se-offwhite` — reading/proof/knowledge sections). Alternating dark→light→dark creates the brand's cinematic rhythm.
- **Section as chapter:** each section is a full-bleed "page" with an eyebrow (Jura), a title (Boldonse/Italiana), one idea, and one CTA. Mirrors the brand's section-divider anatomy.
- **The 18° edge-strip:** the brand's "purple edge-strip on left" of section dividers becomes a recurring left-rail motif on dark sections.
- **Max content width:** ~1200px reading measure on desktop; full-bleed for immersive/AI sections.
- **Vertical rhythm:** sections breathe — large whitespace is a premium signal, not wasted space.

---

# 4. GRID SYSTEM

- **Mobile (canonical):** 4-column fluid grid, 16px gutters, 20px outer margins. One idea per column-set.
- **Tablet:** 8-column, 20px gutters, 32px margins.
- **Desktop:** 12-column, 24px gutters, max 1200–1320px, auto side margins.
- **Baseline grid:** 8px vertical rhythm (see §6) governs all spacing so type and components snap to a consistent beat.
- **The Edge overlay:** an optional 18° diagonal guide used for hero and divider composition — signature asymmetry lives on this line.
- **Breakpoints:** `sm 480 · md 768 · lg 1024 · xl 1280 · 2xl 1536`. Mobile-first: styles cascade up, never down.

---

# 5. TYPOGRAPHY SYSTEM

**Six faces, exactly as the brand book mandates — all on Google Fonts. One display + one body per layout.**

| Role | Face | Web usage | Rule |
|---|---|---|---|
| Display / Headline | **Boldonse** | Hero headlines, score, big moments | Impact only — **never body, never long lines** |
| Signature / Titles | **Italiana** | Page titles, section titles (human register) | The elegant, human voice |
| Body / UI | **Outfit** (400/700/800) | All body, buttons, UI, nav | The workhorse |
| Editorial / Quotes | **Lora Italic** | Testimonials, pull quotes | Editorial warmth |
| Labels / Eyebrows | **Jura Light (300)** | Eyebrows, tags, metadata | **Always UPPERCASE, tracked ~0.35em** |
| Specs / Data | **IBM Plex Serif** | All numbers, scores, ₹ figures, metrics | **Reserved for data — signature detail** |

**Web type scale** (fluid `clamp`, mobile-first, 8px rhythm):
- Display XL (hero): `clamp(40px, 8vw, 76px)` Boldonse, line-height 0.95, uppercase.
- Display L: `clamp(32px, 5vw, 56px)`.
- Title (Italiana): `clamp(26px, 4vw, 44px)`.
- Section head (Boldonse): `clamp(16px, 2vw, 22px)` uppercase.
- Body L: 18px / Body: 16px / Body S: 14px (Outfit).
- Eyebrow (Jura): 12–13px, 0.35em tracking, uppercase.
- Data/score: IBM Plex Serif, sized per context up to Display for the Roast Score.

**Rules:** never set body in Boldonse or Jura; line length 60–75ch for reading; numbers *always* IBM Plex Serif (this is a recognizability signature — a ₹ figure in Plex Serif reads as StayEdge). Load fonts with `display: swap`, subset, and preload the two above-the-fold faces (Boldonse + Outfit).

---

# 6. SPACING SYSTEM

**8px base unit** (with a 4px half-step for fine tuning). Token scale:

`space-0 = 0 · 1 = 4 · 2 = 8 · 3 = 12 · 4 = 16 · 5 = 24 · 6 = 32 · 7 = 48 · 8 = 64 · 9 = 96 · 10 = 128`

- **Component padding:** cards 24–32px; buttons 12×24px (pill); inputs 16px.
- **Section vertical padding:** mobile 64–96px; desktop 96–128px. Generous by mandate.
- **Grid gutters:** per §4.
- **Rule:** all spacing is a token multiple of 8 (or the 4 half-step). No arbitrary values. Whitespace is the primary luxury signal.

---

# 7. COLOR SYSTEM

**Exact brand palette — no additions, no neon (locked).** Extends the existing `--se-*` namespace.

**Core**
- `--se-purple #6F2DBD` — the anchor. Every decision/CTA/brand moment. **Never below 40% of a brand-led layout.**
- `--se-lavender #A663CC` — accent, eyebrows, the diamond, AI presence.
- `--se-charcoal #171123` — the ground. Dark surfaces. **Never pure black.**
- `--se-offwhite #FBFBFB` — the breath. Light canvas, reversed type. **Never pure white.**

**Supporting**
- `--se-deep-purple #3D1568` — deep panels, elevated dark surfaces, depth.
- `--se-dark-plum #2A2040` — dark card surfaces.
- `--se-pale-lavender #E8D5F5` — light cards, KPI tiles.
- `--se-grey-lavender #9B94AE` — muted text on dark.
- `--se-light-lilac #E8E4F0` — light tint blocks.

**Semantic (sparingly — DO/DON'T, states)**
- `--se-positive #5ED08A` — the "hope" beat, gains, up-deltas, success.
- `--se-negative #E8768C` — issues, losses, down-deltas. *Used with restraint — we roast, we don't alarm.*

**Web-only functional tokens (derived, on-palette):**
- `--se-ground` = charcoal (dark mode default). `--se-ground-2` = dark-plum. `--se-ground-3` = deep-purple.
- `--se-line` = lavender at low alpha (hairlines/dividers).
- `--se-glow` = purple/lavender light for §9/§15 (never neon; capped luminance).
- `--se-focus` = lavender high-contrast focus ring.

**Usage law:** lead with purple + charcoal + off-white; lavender for warmth/AI; supporting purples for depth; semantics only for meaning. **Contrast is mandatory (§24)** — purple text on charcoal must meet AA, so body text on dark uses off-white/grey-lavender, not purple.

---

# 8. ELEVATION SYSTEM

Depth *without* the prohibited grey drop-shadow. StayEdge elevation is **built from purple light and tinted layers**, not shadow.

**Dark surfaces (default):** elevation = *lighter/warmer* layer, not shadow.
- E0 ground: `--se-charcoal`.
- E1 card: `--se-dark-plum`.
- E2 raised: `--se-deep-purple`.
- E3 floating (Jarvis, menus): tinted glass (§9) + a soft `--se-glow` purple halo (capped, not neon).
- E4 modal/peak: strongest glass + subtle 18° light cast.

**Light surfaces (reading):** elevation = tint + hairline, minimal shadow.
- E0 `--se-offwhite` → E1 `--se-light-lilac` card → E2 `--se-pale-lavender` KPI tile → E3 white card with a *purple-tinted* soft shadow (the one place a whisper of shadow is allowed on web, kept ≤8% and purple-hued, never grey).

**Rule:** elevation communicates hierarchy and interactivity, never decoration. On dark (our default), we prefer *light* over *shadow* — a StayEdge signature.

---

# 9. GLASS MORPHISM RULES

Glass is a premium surface for **floating intelligence** (Jarvis, nav-on-scroll, the Unlock gate, toasts) — used sparingly (performance + restraint).

- **Tint, not clear:** glass is always tinted with `--se-charcoal`/`--se-deep-purple` (dark) or `--se-offwhite`/`--se-light-lilac` (light) at 60–75% opacity. **Never generic frosted white.**
- **Blur budget:** 12–20px backdrop blur; **max 2 glass surfaces per viewport** (backdrop-blur is expensive — §29).
- **Border:** 1px lavender hairline at low alpha to define the edge.
- **Contrast guarantee:** text on glass must independently pass AA — we place a subtle solid scrim behind text if the backdrop risks contrast. Legibility beats effect, always.
- **Where allowed:** Jarvis surface, sticky nav over hero, Unlock gate, toasts, modal peaks. **Where banned:** long-form reading, data tables, PDF (per brand book), anything where contrast is at risk.
- **Fallback:** on weak devices/reduced-transparency, glass flattens to a solid tinted surface — identical hierarchy, zero blur.

---

# 10. MOTION PHILOSOPHY

*Motion is choreography, not decoration.* (Enforces Experience Bible Principle 7.)

- **The 18° law:** meaningful entrances rise and travel along the brand's 18° axis. Growth moves up-and-right along the Edge. Nothing important slides in flat-left without reason.
- **Easing:** confident, weighted, springy-but-controlled — the "sharp operator" gait. Custom StayEdge easing curves (an "Edge ease" for rises, a "settle ease" for the score). Never bouncy-cartoonish, never linear-robotic.
- **Timing:** micro 120–200ms · standard 240–400ms · signature moments 500–900ms. Fast enough to feel responsive, slow enough to feel intentional.
- **Choreography:** staggered reveals cascade along the Edge (children rise in sequence, ~40–60ms apart) so a section "assembles" like the logo's bars.
- **Purpose gate:** every motion improves storytelling or conversion, obeys `prefers-reduced-motion`, and never blocks interactivity. Decorative-only motion is deleted at review.
- **One signature moment per viewport** (Experience Bible + §29).

---

# 11. ICONOGRAPHY

- **Style:** custom line-based set, 1.75px stroke, rounded joins, built on a 24px grid — precise, warm, engineered. Geometry echoes the 18° edge where natural (e.g., arrows and growth glyphs lean at 18°).
- **Two weights:** line (default) and duotone (purple + lavender) for emphasis/active states.
- **Color:** inherit text color; active = purple; on-dark = off-white/lavender. Never multicolor beyond the duotone.
- **The mark as icon:** the three-bar Rising Edge (icon-only logo) is the app/favicon/loading icon — never redrawn, only the real SVG.
- **Rule:** icons clarify, never decorate; every icon pairs with a text label except in the universally-understood nav bar. No emoji in UI chrome (brand voice) — the mode chips 🔥🧠🚀 are the deliberate, sanctioned exception because they *are* the feature's identity.

---

# 12. ILLUSTRATION STYLE

- **Approach:** minimal, geometric, purple-world. Abstract representations of *data, growth, and intelligence* — rising bars, edge lines, diamond sparks, node graphs, occupancy grids — never literal cartoon houses or mascots.
- **Construction:** built from the brand geometry (18° angles, bar ratios, diamond) so illustration and logo share a bloodline.
- **Palette:** charcoal grounds, purple/lavender forms, pale-lavender fills, off-white detail. Semantic green/pink only for gain/loss illustration.
- **Texture:** flat with optional fine grain; subtle purple light for depth (never heavy 3D render in illustration).
- **Rule:** illustration explains a concept (how AI thinks, revenue leaking, before/after) — decorative-only illustration is cut.

---

# 13. PHOTOGRAPHY DIRECTION

*(Governed by the brand book: "warm & unstaged.")*
- **Subject:** real stays, real hosts, real Indian properties — villas, boutique hotels, homestays across South India. Authentic interiors and light.
- **Mood:** warm, natural light; lived-in, aspirational-but-real. Golden-hour and soft daylight over hard flash.
- **Prohibited (brand law):** stock photos with fake smiles, cold flash, HDR gloss, staged perfection, cliché "handshake/laptop" business stock.
- **Treatment:** photos may sit on charcoal grounds with a subtle purple duotone or a lavender light-leak *only* for immersive sections — never so heavy it fights the content. Reading/proof photos stay natural.
- **Before/after:** the hero use of photography — real listing images, honestly labeled, with the AI annotating *why*. Authenticity is the whole point (it proves the roast is real).

---

# 14. COMPONENT DESIGN RULES

Universal rules every component obeys (visual contract; not implementation):
- **Radius:** `--se-radius-card` 10px standard (8–12px range from the brand book); pills 999px for CTAs; inputs 10px. Consistent everywhere.
- **Surfaces:** dark components use the E0–E4 tinted-layer elevation (§8); light components use tint+hairline. No grey shadows.
- **Borders:** 1px lavender/lilac hairline at low alpha for definition.
- **States (mandatory for interactive components):** rest · hover · active/press (slight scale + spring) · focus-visible (lavender ring) · loading (skeleton/streaming, never naked spinner) · disabled · error-soft (collaborative, never "error").
- **Numbers:** any numeric value renders in IBM Plex Serif.
- **Eyebrows:** any label/tag uses Jura uppercase tracked.
- **One primary action** per component cluster.
- **Reusability:** every component is designed to render unchanged inside the future `/app` dashboard shell (§31).

---

# 15. AI VISUAL LANGUAGE

The system that makes "AI is present and thinking" a felt, branded experience.

- **The Diamond = the mind.** The lavender diamond is the atomic unit of AI presence. States: *idle* (slow breathe), *thinking* (pulse + orbiting particles along 18°), *insight* (a single sharp spark), *speaking* (gentle glow synced to streaming text).
- **The Rising Bars = the process.** The three ascending bars visualize analysis stages (Reading → Scanning → Pricing → Reviews → Leaks) — each stage "raises a bar." This is the ThinkingTheater's core motif; it ties directly to the logo.
- **Purple light = intelligence.** AI regions are lit with `--se-glow` purple/lavender — dynamic lighting that follows attention. **Never neon; luminance-capped.**
- **Streaming type:** all AI text streams with a lavender caret in Outfit; data/scores resolve in IBM Plex Serif. Streaming proves realness (Experience Bible "never feel fake").
- **Honesty markers:** the ConfidenceMeter is a small rising-bar glyph; low confidence visibly softens the AI's assertiveness (a design expression of the "specific, not vague / provable claims" brand law).
- **Restraint:** AI visuals are composed and premium — a senior consultant thinking, not a sci-fi HUD. No matrix rain, no fake code, no gimmick.

---

# 16. ROAST VISUAL LANGUAGE

The flagship experience's look, tuned to the three modes without changing the brand.

- **Shared frame:** dark charcoal stage, purple light, the Diamond present, IBM Plex Serif score. Consistent across modes — only *tone* changes, proving one intelligence (Experience Bible mode-morph).
- **The Score:** oversized IBM Plex Serif numeral on the Rising-Edge gauge; the value climbs along the 18° axis, overshoots, settles; a lavender benchmark line slides in. `--se-positive`/`--se-negative` tint the delta subtly, never garishly.
- **Mode expression (typography/color, not new palette):**
  - 🔥 **Roast Me:** slightly bolder rhythm, punchier line breaks, wit in Outfit; the sting lands, the Positive card in `--se-positive` resolves it.
  - 🧠 **Diagnose Me:** calmer spacing, more IBM Plex Serif data, boardroom composure; lavender de-emphasized, purple/charcoal lead.
  - 🚀 **Growth Me:** more `--se-positive` accents, upward motion emphasized, opportunity-framed headings in Italiana.
- **Issue cards:** dark E1 surfaces, an 18° accent edge, Plex Serif for any figure, a "reveal the fix" affordance that gates to the Snapshot.
- **The Positive beat:** always `--se-positive`-accented, always present — the brand's warmth made visible.
- **Share Card:** a proud, poster-grade artifact — charcoal ground, Rising Edge, the score in Plex Serif, one Italiana zinger, `@stayedgeofficial`, the real logo, a QR. Governed by §17/§18 brand-compliance for the static export.

---

# 17. GROWTH SNAPSHOT DESIGN (in-product, in-page)

*(The "Property Growth Snapshot" — the lead deliverable, rendered in-page per UX Decision 4.)*
- **Structure:** a premium report surface — Italiana title, Jura eyebrows, KPI tiles in pale-lavender with big purple Plex-Serif stats (straight from the brand's KPI-card pattern), a Lora-italic insight quote, the RevenueLeakMeter, the CompetitorGapChart, and the QuickWinList.
- **The Unlock (de-frost):** deeper content sits behind a tinted-glass veil (§9); on unlock it de-frosts along the 18° edge — the gate feels like a reward (WOW #8).
- **In-page actions (UX Decision 4):** **Download PDF · Send to WhatsApp · Send to Email · Book Discovery Call** — presented as a single quiet action row so the visitor never feels they left the experience.
- **Data language:** every figure IBM Plex Serif; gains `--se-positive`, leaks `--se-negative`, restrained. Honesty first — no invented numbers (brand law); unknowns shown as "unknown," never faked.
- **Continuity:** this surface is *designed as the logged-out preview of the future dashboard's first screen* (§31) — same layout contract, so no redesign later.

---

# 18. PDF DESIGN LANGUAGE (100% brand-book compliant)

*The one surface where the brand book's document rules apply in full — flat, editorial, no web effects.*
- **Format:** A4, 15mm margins. Header = topic eyebrow left + `StayEdge / NN / Topic` breadcrumb right + hairline rule. Footer = `© 2026 STAYEDGE` left · purple page number centre · `CONFIDENTIAL` right (dropped on public/lead-facing exports).
- **Cover/divider:** Rich Charcoal ground, angled purple 18° shapes, Jura lavender eyebrow, stacked Boldonse title in off-white with the key word in purple, Italiana lavender subtitle, purple left edge-strip.
- **Components:** KPI cards (pale lavender, big purple Boldonse/Plex stat), Lora-italic quote with purple left border, deep-purple promise panel, charcoal-header tables with alternating light rows. Letterhead bottom rule 2.4mm purple.
- **Prohibited (enforced here):** gradients, 3D, drop shadows, neon, off-palette color, body in Boldonse/Jura, exclamation marks, fake-smile stock, AI-generated logo.
- **Governance:** the downloadable Property Growth Snapshot PDF must pass the brand's 8-point pre-export checklist before it can be generated. This is the bridge between the digital product and the client-document standard.

---

# 19. CARD SYSTEM

The card is the primary content atom. Four card families, one language:
1. **Content card** (case study, article): E1 dark or light-lilac, 10px radius, hairline, Italiana title, Outfit body, optional 18° accent edge; hover = subtle lift + purple light (desktop), press feedback (mobile).
2. **Data/KPI card** (metrics, score sub-cards): pale-lavender (light) or dark-plum (dark), big purple **IBM Plex Serif** stat, Jura label. Straight from the brand book.
3. **AI card** (issue, insight, Jarvis message): dark stage, Diamond/glow presence, streaming type, 18° edge, "reveal the fix" affordance.
4. **Action card** (tool, CTA band): pill primary, one action, magnetic on desktop.

**3D tilt cards** (§26): allowed on content/data cards on capable desktops only — tilt on the 18°-aware axis, capped 6–8°, off on touch/reduced-motion. Tactility that serves engagement, not spectacle.

---

# 20. FORM SYSTEM

Forms are **conversational and progressive** (UX Decision 3 + Progressive Intelligence).
- **Progressive capture, never one big form.** A lead accretes across the journey — **WhatsApp → Email → City → Property Type → Source → Consent** — each asked at the natural moment, never all at once, never before value.
- **Field style:** 10px radius, lavender hairline, 16px Outfit, floating/animated labels, generous 44px+ touch targets, thumb-reachable on mobile.
- **Validation:** inline, real-time, friendly, coaching not scolding; soft failures never block (graceful degradation).
- **Primary field emphasis:** one field in focus at a time where possible; the CTA is a pill primary.
- **Consent:** explicit, plain-language, one tap; privacy affordance always visible near contact fields.
- **Progressive Intelligence law:** never ask for anything the Property Passport already knows — pre-fill and confirm instead. The form gets *shorter* as StayEdge learns the visitor.
- **WhatsApp-first:** WhatsApp is the primary identity/channel; email is progressive, not gatekeeping.

---

# 21. NAVIGATION SYSTEM

*(Visual expression of UX_ARCHITECTURE §2.)*
- **Mobile top bar:** compact, transparent over hero → tinted glass on scroll; wordmark left, Jarvis + hamburger right. Condenses on scroll-down, returns on scroll-up.
- **Mobile bottom action bar:** persistent, tinted glass, **Roast (purple pill)** + **WhatsApp (secondary)** — the always-present conversion anchor.
- **Desktop nav:** sticky, 5 items + right CTA cluster (WhatsApp + Roast pill); mega-menus (Services / Who-We-Help) reveal along the 18° edge with an inline proof teaser.
- **Jarvis:** a persistent presence (corner desktop / icon+sheet mobile), never a nav item, never a full takeover.
- **Active state:** purple underline/indicator at 18°; current section subtly lit.
- **Footer nav = final pitch band:** charcoal ground, the line "Your property deserves better than empty nights," three ladder CTAs, trust row, `@stayedgeofficial`. Identical on every page.

---

# 22. MOBILE DESIGN RULES (canonical)

- **Design mobile-first, always.** Every layout is composed at ~390px before any desktop consideration.
- **Thumb zone is sacred:** primary actions live in the bottom third; the bottom action bar never leaves.
- **One idea per viewport;** vertical stacking; no horizontal scroll except intentional carousels (case studies, before/after, share-card variants) with snap + momentum.
- **Touch:** 44px+ targets, generous spacing, haptic feedback on key moments (score reveal, unlock, CTA), long-press → native share on results.
- **Performance-tiered visuals:** heavy 3D/particles/glass are reduced or static on mobile mid/low tiers; the hero input is interactive *first*, ornament loads after.
- **Reading:** 16px min body, comfortable measure, off-white on charcoal or charcoal on off-white — never purple body text.
- **Gestures:** swipe carousels, swipe-down to dismiss Jarvis sheet, pull-to-refresh disabled on tool/result screens (protect results).

---

# 23. DESKTOP DESIGN RULES (enhancement)

- Desktop **enhances** the mobile structure — more parallel information, hover affordances, larger immersive canvas — never a different IA.
- **Hover unlocks:** magnetic CTAs, 3D tilt cards, mega-menus, before/after scrub, cursor-reactive hero presence, dynamic purple light following the pointer.
- **Custom cursor / affinity dot** (reverts to native on inputs/reduced-motion).
- **Split heroes & side-by-side proof** (max two ideas per viewport).
- **Jarvis** as persistent corner presence with more conversational room.
- **The signature moments** (§32) get their full expression on capable desktops; all degrade gracefully.

---

# 24. ACCESSIBILITY RULES

Non-negotiable floor: **WCAG 2.2 AA.**
- **Contrast:** all text ≥ 4.5:1 (≥3:1 large). Purple `#6F2DBD` on charcoal fails for small text → body on dark is off-white/grey-lavender; purple is for large headings, accents, and CTA fills (with off-white text, which passes). Every glass surface guarantees text contrast independently.
- **Color independence:** the Roast Score, deltas, and states are never color-only — always number + label + shape (rising bars).
- **Motion:** full `prefers-reduced-motion` support with meaningful static equivalents; no vestibular-trigger parallax without a reduced path.
- **Keyboard:** everything operable; visible lavender focus rings; logical order; skip links; Jarvis and all tools fully keyboard-usable.
- **Screen readers:** AI streaming and score reveals announced via live regions; the Roast result has a full textual equivalent; decorative motion is `aria-hidden`.
- **Targets & text:** 44px+ targets; 16px+ body; user zoom never blocked.
- **Transparency/data-saver:** respected — reduces glass/blur/particles.

---

# 25. ANIMATION PRINCIPLES

1. **Purpose or delete.** Every animation improves storytelling or conversion (Change 10 law).
2. **The 18° axis.** Growth/entrance moves along the Edge.
3. **Choreographed, staggered, weighted** — the "sharp operator" gait (§10 easing).
4. **One signature moment per viewport.** Restraint = premium.
5. **Never block interactivity.** Above-the-fold is interactive before ornament loads.
6. **Honest theater.** Loading = narrated real work, never fake delay.
7. **Reduced-motion is a first-class path**, not an afterthought.
8. **Performance-budgeted** (§29): transform/opacity only for high-frequency motion; no layout-thrash; off-screen animations pause.

---

# 26. 3D USAGE GUIDELINES

3D is reserved for **signature intelligence moments**, never chrome.
- **Where:** the hero AI-presence field, the Diamond/Rising-Edge in the ThinkingTheater and score, the "How StayEdge Thinks" pipeline, and (lightly) 3D tilt on cards.
- **Look:** matte, purple-world, lit with soft purple light — engineered and premium. **No glossy chrome, no realistic house renders, no neon glow, no sci-fi HUD.** 3D must look like *the brand*, i.e., geometric and restrained.
- **Depth from light, not shadow** (§8) — consistent with the elevation law.
- **Capability-tiered:** full 3D on capable desktops; simplified on mobile high-tier; static SVG/canvas fallback on low tiers and reduced-motion — carrying the same meaning.
- **Rule:** 3D must earn its cost in trust/engagement; if a 2D treatment conveys the same, use 2D.

---

# 27. THREE.JS / SPLINE USAGE STRATEGY

- **Three.js** — for *interactive, data-reactive* moments that must respond to the user in real time: the cursor-reactive hero presence, the Diamond's particle behavior along 18°, the pipeline visualization, the score's dimensional settle. Custom, performant, controllable.
- **Spline** — for *authored hero set-pieces* where art direction speed matters and interactivity is lighter (a signature hero object, a landing-page centerpiece). Faster to iterate; heavier payload → used only above the fold and lazy-loaded after interactivity.
- **Selection rule:** if it must react to live user/data → Three.js. If it's an authored, mostly-ambient showpiece → Spline. Never both on one screen.
- **Hard budget:** at most **one 3D context per page**, lazy-loaded, paused off-screen, disabled on low-tier/reduced-motion/data-saver, and never blocking LCP. Payload caps in §29.
- **Fallback contract:** every 3D scene ships with a static, on-brand poster (charcoal + Rising Edge + Diamond) that renders instantly and satisfies the meaning without the engine.

---

# 28. PREMIUM INTERACTION GUIDELINES

- **Responsiveness first:** every input acknowledged < 100ms (optimistic UI + press physics). Perceived speed is the luxury.
- **Magnetic affinity** on primary CTAs and Jarvis (desktop); haptics on mobile key moments.
- **Progressive disclosure** paces every complex surface — one idea at a time.
- **Continuity:** transitions preserve context (no white flashes); the Passport means no re-entry of known data.
- **Feedback is warm, never noisy:** quiet glass toasts for confirmations; no nag modals, no fake urgency (brand law).
- **The "one more" hooks:** score benchmark, "next 3 issues," revenue-leak reveal, mode-morph — each engineered to earn the next scroll without pressure.
- **Craft details:** cursor-reactive light, 18° stagger, Diamond micro-states, Plex-Serif number ticks — the small things that add up to "I've never seen this."

---

# 29. PERFORMANCE BUDGET

Ambition lives inside hard limits (mobile-first, our audience is on phones).
- **Targets:** Lighthouse **95+** (all four) on mid-tier mobile; **LCP < 2.5s**, **CLS < 0.05** (reveals never shift layout), **INP < 200ms** (main thread protected during AI streaming).
- **Tiering:** three render tiers (Full / Reduced / Static) auto-selected by device, connection, battery, data-saver, and reduced-motion.
- **Above-the-fold sacred:** hero input interactive first; 3D/Spline/particles/glass load *after*.
- **Hard caps per viewport:** ≤1 3D context, ≤2 glass surfaces, capped particle counts, off-screen animations paused.
- **Assets:** fonts subset + `swap` + preload the two ATF faces; images responsive/lazy/next-gen; 3D payloads code-split and lazy; motion via transform/opacity only.
- **Enforcement:** performance is a conversion metric — any signature moment that can't stay in budget is simplified or cut. A slow hero is a failed hero.

---

# 30. REUSABLE DESIGN TOKENS

Extends the existing `--se-*` brand tokens (do not rename brand tokens). New web tokens are additive.

```
COLOR (brand — verbatim)
--se-purple #6F2DBD · --se-lavender #A663CC · --se-charcoal #171123 · --se-offwhite #FBFBFB
--se-deep-purple #3D1568 · --se-dark-plum #2A2040 · --se-pale-lavender #E8D5F5
--se-grey-lavender #9B94AE · --se-light-lilac #E8E4F0
--se-positive #5ED08A · --se-negative #E8768C

COLOR (web functional — additive, on-palette)
--se-ground: var(--se-charcoal) · --se-ground-2: var(--se-dark-plum) · --se-ground-3: var(--se-deep-purple)
--se-line: rgba(166,99,204,0.18) · --se-glow: rgba(111,45,189,0.35) /* luminance-capped, never neon */
--se-focus: var(--se-lavender)

TYPE (brand faces)
--se-font-display 'Boldonse' · --se-font-signature 'Italiana' · --se-font-body 'Outfit'
--se-font-editorial 'Lora' italic · --se-font-label 'Jura' 300 · --se-font-data 'IBM Plex Serif'
--se-scale: displayXL clamp(40,8vw,76) · displayL clamp(32,5vw,56) · title clamp(26,4vw,44)
           · section clamp(16,2vw,22) · bodyL 18 · body 16 · bodyS 14 · eyebrow 12/0.35em

SPACE (8px base) 0·4·8·12·16·24·32·48·64·96·128
RADIUS --se-radius-card 10 · --se-radius-input 10 · --se-radius-pill 999
ELEVATION E0 charcoal · E1 dark-plum · E2 deep-purple · E3 glass+glow · E4 glass+edge-cast
GLASS blur 12–20 · tint 60–75% · hairline --se-line · max 2/viewport
MOTION dur-micro 160 · dur-std 320 · dur-signature 700 · edge-angle 18deg
       ease-edge (rise) · ease-settle (score) · stagger 50
Z-INDEX base 0 · raised 10 · sticky-nav 100 · jarvis 200 · modal 300 · toast 400
BREAKPOINTS sm480 md768 lg1024 xl1280 2xl1536
```
**Token law:** three semantic layers — *primitive* (brand hex/faces) → *semantic* (ground/line/glow/focus, text-on-dark) → *component* (button-bg, card-surface, score-numeral). Components consume semantic tokens, never raw hex. This lets the future dashboard theme (§31) reskin by swapping semantic tokens with zero component changes.

---

# 31. FUTURE DASHBOARD DESIGN LANGUAGE

The authenticated `/app` is the **same design system, logged in** — designed now (UX Decision 5), exposed later.
- **Continuity:** same tokens, type, cards, Jarvis, and the Property Passport. The Property Growth Snapshot surface *is* the dashboard's first screen — identical layout contract.
- **Shell:** charcoal app ground; a left rail (desktop) / bottom tabs (mobile) using the same nav language; the Rising Edge as the persistent brand anchor.
- **Client surfaces (designed-for now):** Continue Audit · **View Dashboard** · **Monthly Report** (PDF via §18) · **Growth Timeline** (the Roast Score becomes point #1 on a purple 18° trend line) · **Referral Rewards** (the Share Card's attribution, rewarded) · **Community.**
- **Data viz language:** IBM Plex Serif numerals, purple/lavender series, `--se-positive`/`--se-negative` deltas, rising-bar motifs, 18° trend lines. Charts must read as StayEdge at a glance (see the `dataviz` standards for accessibility of series color).
- **Rank-aware chrome:** for recognized clients the primary CTA swaps Roast → Open Dashboard; lead gates disappear (a client is never re-sold the free audit).
- **Zero-redesign rule:** no component may assume "anonymous marketing visitor" as a terminal state; every surface is built to also live inside `/app`.

---

# 32. THE 22 SIGNATURE STAYEDGE INTERACTIONS

*Built from the brand's own DNA (the 18° Edge, the Rising Bars, the Lavender Diamond, purple light, Plex-Serif numbers) so that seeing any one of them says "StayEdge." Each notes the recognizability hook and the needle it moves. Designs are for Phase 4; here we define the signature and intent.*

1. **The Living Edge Hero.** Cursor-reactive purple-light field with the Diamond breathing; it *focuses and calms* the instant the input is engaged. → *Curiosity.* (Hook: purple light + Diamond.)
2. **The Rising Bars Load.** Every load/analysis raises the three bars (11:17:23) in sequence instead of a spinner. → *Trust.* (Hook: the logo, animated.)
3. **The 18° Reveal.** Sections and cards rise into place along the 18° axis with staggered children. → *Engagement.* (Hook: the shear angle.)
4. **The Score Climb & Settle.** The Roast Score ascends the Edge gauge in IBM Plex Serif, overshoots, settles; the lavender benchmark line slides in. → *Conversion.* (Hook: Plex numeral + Edge climb.)
5. **The Diamond Mind.** Jarvis's diamond: idle-breathe → thinking-pulse with 18° orbiting particles → insight-spark → speaking-glow. → *Trust.* (Hook: the lavender diamond.)
6. **Mode Morph.** Switching 🔥/🧠/🚀 re-narrates the same findings with a smooth tonal morph — no re-analysis. → *Authority.* (Hook: one intelligence, three registers.)
7. **The De-Frost Unlock.** The Property Growth Snapshot un-veils from tinted glass along the Edge — the gate opens like a gift. → *Lead-gen.* (Hook: 18° de-frost.)
8. **The Leak Counter.** Revenue leak ticks upward in Plex Serif with weight, then flips to `--se-positive` "recoverable." → *Lead-gen.* (Hook: Plex number tick + purple→green flip.)
9. **Before/After Edge-Scrub.** Dragging the comparator moves the seam at 18°; Jarvis annotates *why* as you scrub. → *Conversion.* (Hook: the angled seam.)
10. **The Thinking Pipeline.** "How StayEdge Thinks" nodes light in purple along the Edge, each raising a datum. → *Authority.* (Hook: rising nodes.)
11. **Share-Card Assembly.** The poster builds itself — ground, Rising Edge, score, zinger, QR — ready to post. → *Acquisition.* (Hook: the branded artifact forming.)
12. **Magnetic Purple CTAs.** Primary pills pull the cursor and cast a soft purple light on approach. → *Conversion.* (Hook: purple magnetism.)
13. **The Plex Number Tick.** Any metric resolves with a mechanical IBM Plex Serif count — data feels engineered. → *Trust.* (Hook: the typeface itself.)
14. **Eyebrow Type-On.** Jura eyebrows type in, tracked-wide, before each section title. → *Memorability.* (Hook: the tracked uppercase label.)
15. **Continuity Recognition.** Returning visitors: the Diamond "remembers," greets by property, shows the score delta since last visit. → *Trust/Retention.* (Hook: the remembering Diamond.)
16. **Confidence Softening.** When data is thin, the AI visibly softens (dimmed assertiveness, a rising ConfidenceMeter) and asks for a screenshot — honesty as motion. → *Trust.* (Hook: honest AI expression.)
17. **The Purple Light Follow.** On dark sections, a soft purple light tracks attention/cursor, guiding the eye to the CTA. → *Conversion.* (Hook: purple spotlight, never neon.)
18. **Edge Divider Wipe.** Section-to-section transitions wipe along an 18° charcoal edge (the brand's divider, in motion). → *Engagement.* (Hook: the angled wipe.)
19. **Tilt-to-Life Cards.** Case/data cards tilt subtly on the 18°-aware axis with a purple light sweep on hover. → *Engagement.* (Hook: angled tilt + light.)
20. **The Footer Resolve.** "Your property deserves better than empty nights" reveals cinematically as the page's emotional period. → *Conversion.* (Hook: the closing line.)
21. **Launch Crystal-Ball.** For first-timers, the Launch Readiness reveal assembles a forward-looking market read from the guided inputs — the Diamond "foreseeing." → *Lead-gen.* (Hook: predictive Diamond.)
22. **Haptic Milestones.** On mobile, a crisp haptic marks the three brand milestones — score reveal, unlock, CTA press — a physical StayEdge signature. → *Delight.* (Hook: the felt beat.)

**Governance:** each signature obeys §25/§29 (one per viewport, budgeted, reduced-motion path). Any that can't stay premium *and* performant is simplified, not shipped rough.

---

# 33. THE EXPERIENCE SCORE (rubric + threshold)

*(New requirement.)* Every page/screen receives an internal Experience Score before it may enter implementation. Eight dimensions, 0–10 each, weighted toward the business goal.

| # | Dimension | Weight | What it measures |
|---|---|---|---|
| 1 | **Conversion** | 20% | Does the page drive its primary CTA? Clarity, friction, CTA cadence, one-click adherence. |
| 2 | **Business Value** | 15% | Does it move a needle (Trust/Curiosity/Authority/Lead-gen/Discovery/Revenue)? |
| 3 | **Trust** | 15% | Proof, honesty, brand rigor, no fake urgency, provable claims. |
| 4 | **Emotion** | 12% | Does it hit the intended emotional beat (arc §2 of the bible)? |
| 5 | **Memorability** | 10% | Signature-device presence; would someone screenshot/share it? |
| 6 | **Delight** | 8% | Craft, micro-interactions, the "one more" hooks. |
| 7 | **Performance** | 10% | Budget adherence (§29), CWV, tiering, mobile-first. |
| 8 | **Accessibility** | 10% | AA compliance, reduced-motion, keyboard, contrast. |

**Scoring rules:**
- **Weighted total out of 100.** **Threshold to pass into UI = 85.** Below 85 → redesign before implementation.
- **Hard gates (auto-fail regardless of total):** any Accessibility dimension < 7, any Performance < 7, any *fake urgency / invented data* present (brand law), or Conversion < 7. These cannot be averaged away.
- **Zero-Dead-Ends check (new principle):** every page must pass a binary "is there a clear next best action?" — fail = auto-redesign.
- **One-Click check (new principle):** the primary action reachable without unnecessary clicks — fail = redesign.
- **Progressive-Intelligence check (new principle):** no page asks for data the Passport already holds — fail = redesign.
- **Cadence:** scored at design review (this phase's exit) and re-scored after UI before build. The Home, Roast, and Snapshot pages carry a raised bar of **90** given their funnel weight.

**The three new principles are now first-class, enforced by the score:** Zero Dead Ends, One-Click Rule, Progressive Intelligence.

---

# 34. OPEN DECISIONS FOR APPROVAL

Recommendation bolded; each is a real fork.

- **D1 — Brand-book extension into web motion/depth (§0).** Formally extend the print brand into the interactive medium via the DNA-derived rules above (18° axis, purple-light not neon, tinted glass, depth-from-light), while keeping PDFs/documents fully brand-compliant. **(Recommend: approve — this is the crux; nothing else proceeds without it.)**
- **D2 — Terminology.** Adopt **"Property Growth Snapshot"** everywhere and align the prior three docs. **(Recommend: yes — it's the brand's fixed term.)**
- **D3 — Dark-first default.** Charcoal-grounded product with off-white reading sections (vs. light-first). **(Recommend: dark-first — it's the premium brand mood and best showcases the AI/purple-light language.)**
- **D4 — Mode chips as the sanctioned emoji exception (§11).** Keep 🔥🧠🚀 as the one place emoji appear, since they *are* the feature identity, despite the brand's "no emoji in client docs" rule (which governs documents, not product UI). **(Recommend: yes.)**
- **D5 — Experience Score threshold = 85** (90 for Home/Roast/Snapshot), with the four hard gates. **(Recommend: yes.)**
- **D6 — Spline vs. Three.js split (§27)** as specified (authored showpiece vs. live-reactive), one 3D context per page. **(Recommend: yes.)**
- **D7 — Jarvis persona name.** Still "Jarvis" internally; the brand-owned persona name remains open from Phase 2. **(Recommend: name it before UI so the Diamond/voice can be designed around the real name.)**

---

## STATUS

Complete design system delivered, extending the real StayEdge Brand Operating System (verbatim tokens, faces, logo geometry, voice) into an interactive product: philosophy, visual language, layout/grid/type/spacing/color/elevation, glass rules, motion philosophy, iconography, illustration, photography, component rules, the AI/Roast/Snapshot/PDF visual languages, card/form/navigation systems, mobile and desktop rules, accessibility, animation/3D/Three.js-Spline strategy, premium interaction guidelines, the performance budget, the full token layer, the future dashboard language, **22 signature StayEdge interactions**, and the **Experience Score** rubric — with the three new principles (Zero Dead Ends, One-Click, Progressive Intelligence) made enforceable.

**No React, no components, no implementation code produced.**

**Awaiting your approval.** Reply "approved" with any calls on the seven decisions in §34 — especially **D1** (the brand-into-web extension) and **D7** (the persona name) — and I'll proceed to Phase 4 (UI design). Until then, this document, together with the Brand Operating System it extends, is the source of truth for how StayEdge looks and moves.
