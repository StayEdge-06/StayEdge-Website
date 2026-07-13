# UX_ARCHITECTURE.md
### StayEdge — Complete User Experience Architecture
*Version 1.0 · Owner: Lead UX Architect · Status: For approval · Phase 2 · Scope: Experience architecture only — no UI, no code, no Figma*

> This document defines **how the product is structured and how people move through it** — sitemap, journeys, navigation, information hierarchy, page flows, section order, component and CTA hierarchy, and the full set of AI/Roast/Snapshot/Discovery/returning/client/error/empty/loading/future journeys. It is downstream of and obedient to **WEBSITE_EXPERIENCE_SPECIFICATION.md** (the experience bible) and **Strategy v1/v2**. Where this document specifies *where* animation belongs, it names the location and reason only — never the animation design itself. UI design is Phase 3 and must not begin until this is approved.

**Reading key**
`→` = forward flow · `⇄` = reversible/branch · `⟳` = loop/return · **[P]** = Primary CTA · **[S]** = Secondary CTA · **[J]** = Jarvis touchpoint · **[A]** = animation anchor (where/why only) · **[PP]** = Property Passport read/write.

---

## TABLE OF CONTENTS
0. UX Principles for this build
1. Complete Sitemap
2. Global Navigation (mobile-first → desktop)
3. Information Hierarchy
4. CTA Hierarchy
5. Component Inventory
6. The Master Conversion Map (+ alternates)
7. Page-by-Page UX Specification (flow + section order)
8. Journey 11 — AI / Jarvis Journey
9. Journey 12 — Roast Journey
10. Journey 13 — Growth Snapshot Journey
11. Journey 14 — Discovery Call Journey
12. Journey 15 — Returning Visitor Journey
13. Journey 16 — Existing Client Journey
14. Journey 17 — Error Journeys
15. Journey 18 — Empty-State Journeys
16. Journey 19 — Loading Journeys
17. Journey 20 — Future Dashboard Journey
18. Animation Placement Map (where + why only)
19. Jarvis Presence Map (appear / speak / vanish / escalate)
20. Self-Review: Bottlenecks, Risks & Optimizations
21. Open Decisions for Approval

---

# 0. UX PRINCIPLES FOR THIS BUILD

Six operating rules that resolve every layout/flow tradeoff below:

1. **Mobile is the canonical design.** Every flow, section order, and component is specified for a ~390px thumb-first screen first; desktop is an *enhancement layer* (more parallel information, hover affordances, larger canvas), never a different structure.
2. **One primary action per screen.** Every viewport has exactly one loud thing to do. Secondary actions are present but quiet.
3. **The Roast is the spine, not a feature.** Navigation, hierarchy, and CTAs all bend toward starting and completing a Roast.
4. **Value before ask; ask once.** No contact field before the free tier lands; a single, well-earned gate for the Snapshot.
5. **Continuity over pages.** The Property Passport [PP] means a visitor never re-enters what we already know. Flows assume memory.
6. **Every screen must move one of six needles:** Trust · Curiosity · Authority · Lead-gen · Discovery calls · Revenue. If a screen moves none, it's cut.

---

# 1. COMPLETE SITEMAP

```
ROOT (/)
│
├── / ................................ HOME (AI experience, Roast-first)
│
├── /roast ........................... ROAST ENGINE (flagship)
│     ├── /roast/r/{shareId} ......... Shared Roast landing (from a Share Card)
│     └── /roast/launch ............... Launch Readiness Mode (no listing)
│
├── /snapshot ........................ GROWTH SNAPSHOT (gated deliverable)
│     └── /snapshot/{passportId} ...... Personal snapshot view (post-unlock)
│
├── /lab ............................. AI LAB (tool hub)
│     ├── /lab/roast-my-listing
│     ├── /lab/rewrite-my-title
│     ├── /lab/photo-rating
│     ├── /lab/seo-checker
│     ├── /lab/pricing-checker
│     ├── /lab/description-analyzer
│     ├── /lab/revenue-leak-calculator
│     ├── /lab/occupancy-calculator
│     ├── /lab/adr-calculator
│     └── /lab/growth-potential
│
├── /how-we-think .................... HOW STAYEDGE THINKS (process/trust)
│
├── /services ........................ WHAT WE DO (hub)
│     ├── /services/listing-seo
│     ├── /services/pricing-adr
│     ├── /services/occupancy-conversion
│     └── /services/positioning-psychology
│
├── /who-we-help ..................... WHO WE HELP (adaptive hub)
│     ├── /who-we-help/first-time-hosts
│     ├── /who-we-help/villa-owners
│     ├── /who-we-help/boutique-hotels
│     └── /who-we-help/investors-managers
│
├── /results ......................... RESULTS / CASE STUDIES (proof)
│     └── /results/{caseSlug}
│
├── /audit ........................... FREE PROPERTY AUDIT (money conversion)
│     └── /audit/confirmed ........... Booking confirmation
│
├── /knowledge ....................... KNOWLEDGE CENTER (AI-powered)
│     └── /knowledge/{articleSlug}
│
├── /about ........................... ABOUT (trust / why AI + why us)
│
├── /contact ......................... CONTACT / WHATSAPP
│
├── FUTURE (designed-for, not exposed now)
│     ├── /app ....................... Client Dashboard (auth)
│     ├── /app/timeline .............. Growth Timeline
│     ├── /app/reports ............... Monthly Reports
│     ├── /app/referrals ............. Referral System
│     └── /app/community ............. Community
│
└── SYSTEM
      ├── /privacy · /terms
      └── 404 / offline / error states (never dead-ends → §14)
```

**Depth rule:** every value-ladder destination (Roast, Snapshot, Audit) is reachable in **≤1 tap from any page** via persistent nav. Nothing important is more than 2 levels deep.

---

# 2. GLOBAL NAVIGATION

## 2.1 Mobile navigation (canonical)

**Top bar (compact, sticky):**
- Left: StayEdge wordmark (→ Home).
- Right: **[J]** Jarvis icon (opens Jarvis sheet) + hamburger.
- Behaviour: shrinks on scroll-down, returns on scroll-up. **[A: nav condense/reveal — orientation, keeps CTA reachable]**

**Persistent bottom action bar (thumb zone, always visible):**
- **[P] Roast My Listing** (loud, left-primary).
- **[S] WhatsApp** (green, right).
- This bar is the single most important navigation element on the site — it guarantees the primary conversion is always one thumb-tap away.

**Hamburger sheet (full-height overlay):** Home · Roast · AI Lab · How We Think · Who We Help · Results · Services · Knowledge · About · Contact. Sheet footer repeats **[P] Book Free Audit** + **[S] WhatsApp**. **[A: sheet slide-in]**

**Jarvis sheet:** bottom sheet, 60–90% height, dismissible by swipe-down. Never a full takeover.

## 2.2 Desktop navigation (enhancement)

**Top nav (sticky, 5 items + CTA cluster):**
`Home · What We Do · Who We Help · Results · AI Lab` … right cluster: **[S] WhatsApp** · **[P] Roast My Listing** (button).
- "How We Think," "Knowledge," "About," "Contact" live in mega-menu hovers and the footer, not the top row (reduces choice load).
- **Mega-menus** on hover for *What We Do* (4 services + inline before/after teaser) and *Who We Help* (4 segments + matched proof teaser). **[A: mega-menu reveal]**
- Jarvis lives as a **persistent corner presence** (not a nav item) — see §19.

## 2.3 Navigation rules (both)
- The **Roast** primary and **WhatsApp** secondary never disappear on any page (except inside the distraction-minimized Audit booking flow, where only "back" and WhatsApp remain).
- Footer is the universal secondary nav + final pitch (identical on all pages).
- Breadcrumbs only inside `/lab`, `/services`, `/who-we-help`, `/results`, `/knowledge` sub-pages (depth orientation).

---

# 3. INFORMATION HIERARCHY

Global priority order the eye should travel, per page type:

**Conversion pages (Home, Roast, Snapshot, Audit):**
`1 The AI action (input/score/unlock/book) → 2 Proof of value → 3 Reassurance/risk-reversal → 4 Secondary paths`

**Trust/consideration pages (How We Think, Services, Who We Help, Results, About):**
`1 Relevance hook (you/your property) → 2 Mechanism or proof → 3 Quantified evidence → 4 CTA to Roast/Audit`

**Utility pages (AI Lab, Knowledge):**
`1 Immediate free value → 2 The result → 3 Deeper gated value → 4 Cross-sell to next tool/ladder`

**Within any page, three information tiers:**
- **Tier 1 (must land in 5s, no scroll):** the one action + one proof point + one line of who-we-are.
- **Tier 2 (first scroll):** mechanism/proof that earns the click.
- **Tier 3 (deep scroll):** objection handling, FAQ, segment depth, footer close.

**Density rule:** mobile shows one Tier-2 idea per viewport; desktop may show two side-by-side but never more.

---

# 4. CTA HIERARCHY

**Three-tier system, enforced globally:**

| Tier | Purpose | Examples | Placement rule |
|---|---|---|---|
| **Primary [P]** | The money action for that page | Roast My Listing · Unlock Growth Snapshot · Book Free Audit | Exactly one per viewport; loud; magnetic; sticky/repeated |
| **Secondary [S]** | Low-commitment alt path | WhatsApp Us · Share My Roast · Skip to Proof | Present, quiet, never competes visually |
| **Tertiary [T]** | Navigation / exploration | Case study links · tool cross-sell · Ask Jarvis | Text/inline; no button weight |

**Page-level primary CTA map:**
- Home → **Roast My Listing**
- Roast → **Unlock Growth Snapshot**
- Snapshot → **Book Free Audit**
- Audit → **Confirm My Call**
- AI Lab (tool) → tool action → then **Unlock Full Analysis**
- Services/Who-We-Help/How-We-Think/Results → **Roast My Listing** (Book Audit as strong secondary for high-intent)
- Knowledge → **Ask Jarvis** / **Roast My Listing**
- About/Contact → **Book Free Audit** (WhatsApp primary on Contact)

**CTA cadence:** on long pages, the primary CTA recurs every ~1.5 viewports, and every page ends with a full-width CTA band. Never two competing primaries in one viewport.

---

# 5. COMPONENT INVENTORY

Every reusable component, grouped. Each is a UX contract (purpose + states), not a visual spec.

### 5.1 Structural / navigation
1. **TopBar** (mobile compact / desktop full) — states: rest, condensed, transparent-over-hero.
2. **BottomActionBar** (mobile only) — Roast + WhatsApp; always visible.
3. **MegaMenu** (desktop) — Services / Who-We-Help variants.
4. **HamburgerSheet** (mobile) — full nav + CTAs.
5. **Breadcrumbs** — sub-pages only.
6. **Footer / FinalPitchBand** — headline line + 3 ladder CTAs + trust row + lead-magnet catch. Global.
7. **ScrollProgressRail** — long pages.

### 5.2 Hero / entry
8. **AIListingInput** — the paste-URL hero input; states: idle, focused, validating, analyzing, error-soft (guided fallback). **[PP write]**
9. **ModeChips** — 🔥 Roast / 🧠 Diagnose / 🚀 Growth selector + Jarvis-recommended flag.
10. **LiveProofTicker** — "1,847 listings roasted · avg 52 · ₹41k/mo found." Ambient trust ledger.
11. **HeroPresenceCanvas** — the "AI is alive" background surface (tiered). **[A anchor]**

### 5.3 Roast / AI result
12. **ThinkingTheater** — staged, streaming analysis sequence; states: staged, streaming, stalled→guided. **[A anchor]**
13. **RoastScoreGauge** — 0–100 settle + benchmark line; states: counting, settled, low-confidence. **[A anchor]**
14. **IssueCard** — one of Top 3; mode-toned; states: streaming, revealed, expanded ("show the fix" → gated).
15. **PositiveInsightCard** — the mandatory "hope" beat.
16. **OpenLoopBanner** — "N more issues · ₹X/mo" → unlock trigger.
17. **ConfidenceMeter** — subtle trust indicator on analyses.
18. **GuidedInputPanel** — fallback: screenshot upload / manual title-price-desc. **[PP write]**
19. **RoastShareCard** — auto-generated, platform variants, QR + shortlink. **[A anchor]**
20. **RetryControl** — "Next 3 issues" / "Try another listing."

### 5.4 Snapshot / lead
21. **UnlockGate** — email + WhatsApp; framed as delivery channels; single ask. **[PP write: identity]**
22. **GrowthSnapshotCard** — full issues list, revenue-leak estimate, competitor gap, 3 quick wins, projected ceiling.
23. **RevenueLeakMeter** — count-up loss → "recoverable" flip.
24. **CompetitorGapChart** — you-vs-market comparison (data component).
25. **QuickWinList** — prioritized, checkable (seeds dashboard tasks).

### 5.5 Proof / trust
26. **CaseStudyCard** — before/after metrics, quote, property type, filterable.
27. **BeforeAfterSlider** — interactive listing comparison + Jarvis "why." **[A anchor]**
28. **MetricStatTile** — single quantified proof (occupancy, ADR, revenue, reviews).
29. **TestimonialCard** — name + photo + property type; video variant.
30. **Logo/BadgeRow** — Superhost/press/partners.
31. **TrustLedgerStrip** — reusable live-counts element (Home, footer, tools).
32. **NotPropertyManagerCallout** — the differentiator objection-crusher.

### 5.6 Explanatory / content
33. **ProcessPipeline** — "How StayEdge Thinks" scroll-story nodes. **[A anchor]**
34. **ServiceModule** — outcome → problem → method → proof block.
35. **SegmentModule** — adaptive persona block (pain + matched case + tailored CTA).
36. **FAQAccordion** — objection-ordered; each answer re-CTAs.
37. **ComparisonTable** — StayEdge vs DIY vs property managers (objection handling).
38. **KnowledgeAnswerBlock** — Jarvis grounded answer + citation + next step.
39. **ArticleCard** — Knowledge Center listing item.
40. **VideoSection** — testimonial/explainer embeds (lazy).

### 5.7 Tools
41. **CalculatorShell** — shared frame for the 4 calculators; inputs → live result → gated depth. **[PP read/write]**
42. **ToolResultCard** — per-tool output + share + cross-sell.
43. **ToolCrossSellRail** — "next best tool for your weakness."

### 5.8 AI / system
44. **JarvisLauncher** — persistent presence (corner desktop / icon+sheet mobile).
45. **JarvisConversation** — message stream, streaming caret, mode indicator, quick-replies, human-handoff.
46. **JarvisNudge** — single dismissible contextual prompt.
47. **Toast** — quiet confirmations only.
48. **SkeletonBlock** — intentful loading placeholders.
49. **EmptyStatePanel** — value-forward empty states.
50. **SoftErrorPanel** — reframed-as-collaboration failure UI (never "error").

### 5.9 Conversion utility
51. **CTABand** — full-width end-of-page primary.
52. **StickyCTA** — in-page recurring primary (mobile inline / desktop rail).
53. **BookingScheduler** — Audit calendar; states: select, confirm, confirmed, reschedule.
54. **ScarcityIndicator** — "X audits left this month" (honest, real).
55. **ConsentControl** — memory/persistence opt-in + privacy affordance.

*Every component is designed to also render inside the future authenticated `/app` shell without change (§17).*

---

# 6. THE MASTER CONVERSION MAP

## 6.1 Primary path (the spine)
```
Home  →  Roast (score+3 issues+positive, FREE)  →  Open loop
   →  Unlock Growth Snapshot (email+WhatsApp = LEAD)
   →  Snapshot consumed  →  Book Free Audit (Discovery)
   →  Discovery Call held  →  Proposal  →  Client  →  [Future: Dashboard/OS]
```

## 6.2 Alternate entry paths
- **Shared Roast Card → `/roast/r/{id}`** → sees a peer's result → "Roast mine too" → spine. *(Viral loop; warmest cold traffic.)*
- **Search → AI Lab tool** → free result → gate → Roast/Audit. *(Top-of-funnel SEO.)*
- **Search → Knowledge article** → Ask Jarvis → tool/Roast. *(Nurture.)*
- **Ad → `/roast` directly** → spine. *(Paid, highest-intent landing.)*
- **First-timer (no listing) → `/roast/launch`** → Launch Readiness Roast → Snapshot → Audit.
- **High-value buyer → "Skip to proof"/Diagnose** → Results/Services → Audit. *(Investor/hotel bypass of the joke.)*

## 6.3 Alternate exit/rescue paths (no dead ends)
- Roast completed, no unlock → **Share Card** + Jarvis nurture + retargeting seed.
- Snapshot unlocked, no Audit → WhatsApp nudge + "Next 3 issues" + email sequence ⟳ back to Audit.
- Audit page, hesitant → **WhatsApp** human path.
- Any failure → guided fallback → value → ladder (§14).

## 6.4 Cross-sell lattice
Every terminal value moment offers exactly **one** best next step (never a menu): Roast→Snapshot; Tool→related Tool→Roast; Snapshot→Audit; Article→Ask Jarvis→Tool. Jarvis governs "the one next step" using the Passport.

---

# 7. PAGE-BY-PAGE UX SPECIFICATION

Each page: **Purpose · Business Goal · User Goal · Emotion · [P]/[S] · Section order (mobile-first) · Interaction goals · Conversion trigger · Success metric.** Desktop deltas noted where they matter.

---

## 7.1 HOME `/`
- **Purpose:** Convert curiosity into a started Roast in seconds, then convince & route.
- **Business Goal:** Maximize Roast starts (top of ladder).
- **User Goal:** "Show me what's wrong with my listing — fast."
- **Emotion:** Curiosity → surprise → trust.
- **[P]** Roast My Listing · **[S]** WhatsApp / Skip to Proof.
- **Section order (mobile):**
  1. Hero: AIListingInput + ModeChips + LiveProofTicker over HeroPresenceCanvas. **[A: living hero]** **[J: ambient greeting]**
  2. Inline reveal region (if Roast run here): ThinkingTheater → RoastScoreGauge → 3 IssueCards → PositiveInsightCard → OpenLoopBanner. *(In-place; no navigation.)*
  3. NotPropertyManagerCallout (fast differentiation).
  4. ProcessPipeline teaser → link to How We Think. **[A: pipeline reveal]**
  5. BeforeAfterSlider (one hero example). **[A: before/after]**
  6. SegmentModule strip — "Which host are you?" (adaptive begins). **[PP]**
  7. Proof: 3 CaseStudyCards (matched to detected segment).
  8. TrustLedgerStrip + BadgeRow.
  9. FAQAccordion (condensed, top objections).
  10. CTABand → Footer/FinalPitchBand.
- **Interaction goals:** get first paste; sustain through reveal; earn one scroll past the fold.
- **Conversion trigger:** the score reveal's OpenLoopBanner.
- **Success metric:** Roast-start rate; hero→score completion; Snapshot unlock rate.
- **Desktop delta:** hero splits input (left) + live presence/ticker (right); mega-menus available.

## 7.2 ROAST ENGINE `/roast`
- **Purpose:** The flagship experience; primary lead + viral engine.
- **Business Goal:** Snapshot unlocks + Share Cards.
- **User Goal:** "Analyze my listing and tell me the truth."
- **Emotion:** Delight → sting → hope → pride.
- **[P]** Unlock Growth Snapshot · **[S]** Share My Roast / Book Audit.
- **Section order (mobile):**
  1. Focused AIListingInput + ModeChips (Jarvis recommends mode). **[J]**
  2. ThinkingTheater (staged/streaming). **[A]** **[PP write]**
  3. RoastScoreGauge + benchmark + ConfidenceMeter. **[A]**
  4. 3 IssueCards (streamed, mode-toned).
  5. PositiveInsightCard.
  6. OpenLoopBanner → UnlockGate.
  7. Post-unlock inline → GrowthSnapshotCard (or route to `/snapshot`).
  8. RoastShareCard + RetryControl. **[A]**
  9. CTABand (Book Audit) → Footer.
- **Interaction goals:** completion, then unlock, then share.
- **Conversion trigger:** OpenLoopBanner + revenue figure.
- **Success metric:** completion, unlock, share, viral coefficient, retry, mode mix.

### 7.2a Shared Roast landing `/roast/r/{shareId}`
- Shows the referenced result (read-only, tasteful) + **[P] Roast Mine Too** + **[S] Book Audit**. Emotion: social proof + "my turn." **[PP: new]**

### 7.2b Launch Readiness `/roast/launch`
- GuidedInputPanel: City · Property Type · Bedrooms · Stage · Budget → Launch Readiness Roast (same structure, forward-looking). **[P] Unlock Launch Snapshot.** For first-timers with no listing. **[PP write]**

## 7.3 GROWTH SNAPSHOT `/snapshot`
- **Purpose:** Deliver full diagnostic for contact; the lead event.
- **Business Goal:** Qualified lead capture.
- **User Goal:** "Show me everything and what it's costing me."
- **Emotion:** Reciprocity → "worth far more than my email."
- **[P]** Book Free Audit · **[S]** Send to WhatsApp / Share.
- **Section order:**
  1. UnlockGate (if not yet unlocked) — single ask. **[PP identity]**
  2. GrowthSnapshotCard: full IssueList + RevenueLeakMeter + CompetitorGapChart + QuickWinList + projected ceiling. **[A: unlock de-frost]**
  3. Matched CaseStudyCard ("hosts like you").
  4. CTABand → Book Audit. **[J: closer]**
- **Conversion trigger:** the quantified ceiling + prioritized quick wins.
- **Success metric:** unlock rate, Snapshot→Audit rate, WhatsApp opt-in.

## 7.4 FREE PROPERTY AUDIT `/audit`
- **Purpose:** Convert warm lead → booked discovery call.
- **Business Goal:** Qualified pipeline.
- **User Goal:** "Talk to an expert, no pressure."
- **Emotion:** Confidence + low risk.
- **[P]** Confirm My Call · **[S]** WhatsApp.
- **Section order (distraction-minimized):**
  1. Value restatement + what-you-get list + ₹15k-value anchor.
  2. Risk reversal + ScarcityIndicator (real monthly cap).
  3. BookingScheduler (pre-filled from Passport — no re-explaining). **[PP read]**
  4. 2 TestimonialCards (audit-specific) + BadgeRow.
- **Conversion trigger:** low-friction calendar + risk reversal.
- **Success metric:** booking rate, show rate, lead→qualified ratio.
- **`/audit/confirmed`:** confirmation + calendar add + WhatsApp opt-in + "prep by trying a Lab tool." **[Empty→next-action, §15]**

## 7.5 AI LAB hub `/lab` + tools
- **Purpose:** Free useful tools = lead magnets + SEO + return visits.
- **Business Goal:** Multiply capture surfaces; organic entrances.
- **User Goal:** "Fix one specific thing right now."
- **Emotion:** Generosity, competence.
- **[P]** (per tool) tool action → Unlock Full Analysis · **[S]** Roast My Listing.
- **Hub section order:** intro line → tool grid (ToolCards) → TrustLedgerStrip → CTABand.
- **Tool page section order (CalculatorShell/ToolResultCard):**
  1. One-line promise + input(s). **[PP read: prefill]**
  2. Live free result. **[A: result reveal / count-up]**
  3. Gated deeper output (UnlockGate).
  4. ToolCrossSellRail ("your weak point → next tool"). **[J]**
  5. CTABand → Roast/Audit.
- **Conversion trigger:** the free result's "there's more" gate.
- **Success metric:** completions, cross-tool rate, gate conversion, assisted audits, organic entrances.

## 7.6 HOW STAYEDGE THINKS `/how-we-think`
- **Purpose:** Convert via transparency of method.
- **Business Goal:** Trust for high-consideration buyers.
- **User Goal:** "Is there a real system here?"
- **Emotion:** Confidence.
- **[P]** See This Run On My Listing (→ Roast) · **[S]** Case studies / WhatsApp.
- **Section order:** intro → ProcessPipeline scroll-story (7 nodes, each with real example datum) **[A]** → mini before/after proof → CTABand.
- **Conversion trigger:** recognition that this = the Roast they can run.
- **Success metric:** section completion, CTA click-through.

## 7.7 WHAT WE DO `/services` (+ 4 sub-pages)
- **Purpose:** Explain mechanism; justify retainer; SEO.
- **Business Goal:** Authority + service-term search.
- **User Goal:** "How exactly do you grow my revenue?"
- **Emotion:** "Specialists, not generalists."
- **[P]** Book Free Audit · **[S]** Roast My Listing.
- **Hub section order:** outcomes overview → 4 ServiceModule cards → BeforeAfterSlider → proof → CTABand.
- **Sub-page order:** outcome → problem → method → BeforeAfterSlider (that service) **[A]** → matched proof → CTABand.
- **Conversion trigger:** seeing the service *work* on a real listing.
- **Success metric:** service dwell, before/after interaction, CTA conversion.

## 7.8 WHO WE HELP `/who-we-help` (+ 4 segments)
- **Purpose:** Relevance = fastest trust; segment SEO.
- **Business Goal:** Lift conversion via matched proof.
- **User Goal:** "Do you understand *my* kind of property?"
- **Emotion:** "This is literally about me."
- **[P]** Segment-tailored Roast/Audit · **[S]** WhatsApp.
- **Hub:** SegmentModule chooser (adaptive default from Passport). **[PP]**
- **Segment page order:** segment pain → matched case → tailored mechanism → SegmentModule CTA. First-timers route to `/roast/launch`.
- **Conversion trigger:** matched case study.
- **Success metric:** segment conversion vs baseline; adaptation accuracy.

## 7.9 RESULTS `/results` (+ case pages)
- **Purpose:** Quantified proof engine.
- **Business Goal:** Overcome "does it work?".
- **User Goal:** "Prove it with numbers."
- **Emotion:** "That could be me."
- **[P]** Get Results Like These → Book Audit · **[S]** Roast.
- **Section order:** filter bar (by property type) → CaseStudyCard grid → featured MetricStatTiles → TestimonialCards/VideoSection → CTABand.
- **Case page order:** situation → what we changed → BeforeAfterSlider → results MetricStatTiles → quote → CTABand.
- **Conversion trigger:** filtered, self-relevant proof.
- **Success metric:** filter usage, dwell, CTA conversion.

## 7.10 KNOWLEDGE CENTER `/knowledge` (+ articles)
- **Purpose:** Expertise content + SEO + Jarvis RAG source.
- **Business Goal:** Organic acquisition + nurture.
- **User Goal:** "Answer my Airbnb question."
- **Emotion:** "They know this cold."
- **[P]** Ask Jarvis / Roast My Listing · **[S]** Book Audit.
- **Section order:** Ask-Jarvis bar → topic clusters → ArticleCard grid.
- **Article order:** answer-first → depth → KnowledgeAnswerBlock (Ask Jarvis inline) **[J]** → contextual tool/audit CTA.
- **Conversion trigger:** grounded answer → contextual next step.
- **Success metric:** organic entrances, Jarvis queries, answer→tool CTR.

## 7.11 ABOUT `/about`
- **Purpose:** Trust in people + method + "why AI."
- **Business Goal:** De-risk the faceless-agency fear.
- **User Goal:** "Who's behind this?"
- **Emotion:** Human trust.
- **[P]** Book Free Audit · **[S]** WhatsApp.
- **Section order:** founder story → why-not-property-managers → AI-advantage-explained → BadgeRow → CTABand.
- **Success metric:** About→Audit assist rate.

## 7.12 CONTACT `/contact`
- **Purpose:** Capture the "talk to a human" segment; legitimacy.
- **Business Goal:** WhatsApp conversations.
- **User Goal:** "Reach a person."
- **Emotion:** Reassurance.
- **[P]** WhatsApp Us · **[S]** Book Audit.
- **Section order:** WhatsApp-first CTA + response-time promise → minimal fallback form → location/legitimacy.
- **Success metric:** WhatsApp initiations, response→booking.

---

# 8. JOURNEY 11 — AI / JARVIS JOURNEY

*Full presence map in §19; this is the end-to-end narrative.*
```
Arrive → [J] ambient greeting (non-blocking, source/segment-aware)
   → user pastes listing → [J] hands off to Analyst mode (thinking theater)
   → reveal → [J] contextual follow-up ("your title was worst — rewrite it?")
   → question asked → [J] Advisor mode (grounded answer + next step)
   → intent detected → [J] Closer mode (offer Snapshot/Audit, timed)
   → confusion/edge → [J] escalate to human WhatsApp
   → return visit → [J] recognizes Passport, resumes continuity
```
Jarvis is one persona across four modes (Concierge/Analyst/Advisor/Closer), never four bots. It **appears as presence, speaks on signal, and recedes when the user is reading** (§19).

---

# 9. JOURNEY 12 — ROAST JOURNEY (detailed flow)

```
ENTRY: Home hero | /roast | shared card | ad | /roast/launch
  ⇣
Mode select (Jarvis-recommended, user-overridable)  [🔥/🧠/🚀]
  ⇣
Input: paste URL ──(valid)──► live analysis
        │                         │
     (invalid/soft-fail)          ├─ high confidence → full roast
        ▼                         ├─ medium → roast + honest hedges
  GuidedInputPanel                └─ low → request screenshot/guided FIRST
  (screenshot / title-price-desc)          │
        └───────────────► reliable data ◄──┘
  ⇣
ThinkingTheater (staged, streaming, honest)  [A][PP write]
  ⇣
RoastScoreGauge settle + benchmark + confidence  [A]
  ⇣
Top 3 IssueCards (mode-toned, streamed)   ← FREE
  ⇣
PositiveInsightCard (the hope beat)       ← FREE
  ⇣
OpenLoopBanner: "N more issues · ₹X/mo"
  ⇣
┌───────────────┬──────────────────────────────┐
│ UNLOCK        │ NOT NOW                        │
│ → Snapshot    │ → RoastShareCard + Retry loop  │
│ (§10)         │ → Jarvis nurture + retarget    │
└───────────────┴──────────────────────────────┘
  ⇣ (either)
RetryControl: "Next 3 issues" ⟳  |  "Try another listing" ⟳ (multi-property → Passport)
```
**Never a dead end, never an error screen** (§14). Score is **stable on re-run**; retries reward with the *next* issues.

---

# 10. JOURNEY 13 — GROWTH SNAPSHOT JOURNEY

```
Trigger: OpenLoopBanner "Unlock"  OR  any Lab tool's gated depth
  ⇣
UnlockGate: email + WhatsApp (framed as delivery)  ← SINGLE ASK, value already given
  ⇣  [PP: anonymous → identified lead]
De-frost reveal of GrowthSnapshotCard  [A: unlock]
  ├─ Full issue list (prioritized)
  ├─ RevenueLeakMeter (count-up → recoverable)
  ├─ CompetitorGapChart
  ├─ QuickWinList (checkable → seeds future dashboard tasks)
  └─ Projected ceiling ("your realistic ₹ ceiling")
  ⇣
Delivery: also sent to WhatsApp + email (persistence + re-engagement handle)
  ⇣
[J closer] "Want us to fix these with you?" → [P] Book Free Audit (§11)
  ⇣ (if not now)
Nurture ⟳: WhatsApp/email sequence → "Next 3 issues" → back to Audit
```
**Bottleneck guard:** the gate is the biggest drop risk → it is *single-field-light*, value is fully visible-but-blurred behind it (loss aversion), and WhatsApp is offered as the lower-friction identity than email if needed.

---

# 11. JOURNEY 14 — DISCOVERY CALL JOURNEY

```
Entry: Snapshot CTA | Audit page | Jarvis closer | WhatsApp
  ⇣
/audit: value + risk-reversal + ScarcityIndicator
  ⇣
BookingScheduler (Passport-prefilled: property, segment, findings)  [PP read]
  ⇣
Micro-qualify (1–2 questions max: # properties, biggest goal) — inline, not a wall
  ⇣
Confirm → /audit/confirmed
  ├─ Calendar invite + WhatsApp confirmation
  ├─ "What to expect" (removes call anxiety)
  └─ Pre-call value: "try a Lab tool / see your Snapshot again"
  ⇣
Reminder cadence (WhatsApp-first) → reduce no-shows
  ⇣
Call held → Proposal → Client  [PP: lead → client]
```
**No-show mitigation is a UX responsibility:** confirmation clarity, WhatsApp reminders, and a pre-call value touch. **Rescheduling is one tap**, never a re-booking maze.

---

# 12. JOURNEY 15 — RETURNING VISITOR JOURNEY

```
Return detected (Passport present)  [PP read]
  ⇣
[J] "Welcome back — re-check {property}, or look at a new one?"
  ⇣
┌────────────────────────┬───────────────────────────┐
│ Same property          │ New property                │
│ → show delta since last│ → fresh Roast (multi-prop)  │
│   ("score 52 → 58")    │ → Passport adds property     │
└────────────────────────┴───────────────────────────┘
  ⇣
Resume nearest ladder rung (didn't unlock? → Snapshot; unlocked? → Audit)
  ⇣
If lead already: fast-path to Audit; if client: route to /app (§17)
```
**Continuity is the wow (§18 / WOW#9):** we never make a returning user start over. The site remembers, shows *progress*, and previews the dashboard value.

---

# 13. JOURNEY 16 — EXISTING CLIENT JOURNEY

*(Marketing site behavior today; full dashboard in §17.)*
```
Client visits marketing site → detected via Passport/auth  [PP read]
  ⇣
TopBar swaps [P] "Roast My Listing" → [P] "Open Dashboard" (→ /app)
  ⇣
[J] shifts to account-aware: "Your October report is ready" / "3 quick wins pending"
  ⇣
Marketing pages de-emphasize lead CTAs; emphasize expansion:
  ├─ Add another property (multi-property upsell)
  ├─ Referral prompt (share success → /app/referrals)
  └─ Community / Knowledge for retention
```
**Rule:** a paying client must never be re-sold the free audit or hit a lead gate. The site *recognizes rank* and changes its asks.

---

# 14. JOURNEY 17 — ERROR JOURNEYS

**Governing rule (locked, Decision 3):** the user never sees *error / unsupported / failed / could not analyse.* Every failure is reframed as collaboration and always ends in delivered value.

| Failure | UX behavior | Ends in |
|---|---|---|
| Invalid/blocked listing URL | SoftErrorPanel → GuidedInputPanel ("paste your title + price so I nail it") | Value (roast from guided data) |
| Listing fetch timeout | ThinkingTheater masks; if exceeded → guided fallback silently | Value |
| Low-confidence data | ConfidenceMeter + Jarvis requests screenshot *before* committing | Accurate value |
| AI generation error | Retry invisibly once → cheaper model fallback → guided | Value |
| Network offline | Offline panel with cached last result + "we'll finish when you're back" | Re-engagement |
| 404 | "That page wandered off — here's what people actually want" → Roast + top links | Redirect to ladder |
| Rate limit hit | Warm message ("you're on a roll — let's actually talk") → WhatsApp/Audit | Conversion path |
| Booking slot conflict | Auto-suggest nearest slots; never a dead form | Rebooked |
| Payment/gate error (future) | Preserve state, retry, human handoff | Recovered |

**Every error component carries a forward CTA.** No error is a terminal state.

---

# 15. JOURNEY 18 — EMPTY-STATE JOURNEYS

Empty states are **value-forward invitations**, never blank.

| Location | Empty state |
|---|---|
| Hero before input | Living presence + prompt + example ("try it with any Airbnb link") + one sample-listing shortcut |
| `/roast/launch` no data yet | Friendly guided questions, one at a time, progress feel |
| AI Lab tool pre-input | The promise + a "see a sample result" toggle to prove value before effort |
| Results filter → no match | "No exact match yet — here's the closest + Roast yours to be our next case study" |
| Knowledge search → no result | Jarvis offers to answer live + suggests nearest articles |
| Snapshot before unlock | Full value visible-but-blurred (desire) + single gate |
| Future dashboard, no data yet | "Your first Roast starts your timeline" → run Roast |
| Jarvis, no history | Warm first greeting + 3 quick-reply starters |

**Principle:** an empty state should *sell the next action*, using a sample or preview to remove "will this be worth it?" doubt.

---

# 16. JOURNEY 19 — LOADING JOURNEYS

No naked spinners anywhere. Three loading archetypes:

1. **Narrated (AI work):** ThinkingTheater — staged, streaming, honest, teaches method. Used for Roast/tools/Jarvis. Duration adapts to real backend time; never finishes early, never visibly stalls. **[A]**
2. **Skeleton (content/page):** intentful SkeletonBlocks that match final layout → zero layout shift (CLS). Used for Results, Knowledge, Snapshot render.
3. **Optimistic (micro-actions):** instant acknowledgement (press state, toast) while the result streams. Used for mode switch, share, checklist, booking.

**Perceived-performance rules:** stream first token fast; reveal progressively; prioritize above-the-fold; defer heavy visuals until after interactivity. A slow *feel* on the Roast is a conversion failure even at good raw speeds.

---

# 17. JOURNEY 20 — FUTURE DASHBOARD JOURNEY

Designed-for now, exposed later. The dashboard is the **authenticated continuation of the same experience** — same components, same Jarvis, same Passport.

```
Client logs in → /app
  ⇣
Dashboard home = "living Growth Snapshot":
  ├─ Current Roast Score on a Growth Timeline (score's first point = their very first roast)  [PP]
  ├─ Active QuickWinList (carried from Snapshot → now tracked tasks)
  ├─ Monthly Reports (time-series of Passport metrics)
  ├─ Jarvis as account agent (Concierge/Analyst/Advisor/Closer → now acting agents)
  ├─ Add Property (multi-property, each a Passport)
  ├─ Referrals (Share Card attribution graph → rewarded loop)
  └─ Community + Knowledge (retention)
```
**Architectural UX rules that make this zero-redesign:**
- The **GrowthSnapshotCard is literally the logged-out preview of the dashboard's first screen** — same layout contract.
- The **RoastScoreGauge** is designed to live on a timeline from day one.
- The **QuickWinList** items are task-shaped now so they become dashboard to-dos later.
- The **Share Card** carries attribution now so referrals need no rebuild.
- Auth simply *unlocks views of a Passport that already exists.* No new IA, no new nav paradigm — the bottom action bar's primary swaps Roast → Dashboard for clients (§13).

---

# 18. ANIMATION PLACEMENT MAP (WHERE + WHY ONLY)

*No animation design here — only location and justification. Design is Phase 3, governed by the Experience Bible's WOW list and performance contract.*

| # | Location | Why it belongs (needle moved) |
|---|---|---|
| A1 | Hero presence canvas | Signals "living intelligence," drives first action — *Curiosity* |
| A2 | Nav condense/reveal | Keeps primary CTA reachable, shows navigation intent — *Lead-gen* |
| A3 | ThinkingTheater | Masks latency + proves realness + teaches method — *Trust* |
| A4 | RoastScoreGauge settle + benchmark | Manufactures relative desire — *Conversion* |
| A5 | IssueCard streaming reveal | Proves live generation, paces the sting — *Trust* |
| A6 | PositiveInsightCard entrance | Emotional turn (sting→hope) — *Trust* |
| A7 | Mode morph (🔥/🧠/🚀) | Proves intelligence is real not canned — *Authority* |
| A8 | UnlockGate de-frost | Makes the gate feel like a reward — *Lead-gen* |
| A9 | RevenueLeakMeter count-up | Self-generated pain → desire — *Lead-gen* |
| A10 | BeforeAfterSlider + Jarvis why | Shows the product working — *Conversion* |
| A11 | ProcessPipeline scroll-story | Method transparency — *Authority/Trust* |
| A12 | RoastShareCard assembly | Enables the viral loop — *Acquisition* |
| A13 | Segment adapt transition | Relevance feedback — *Trust* |
| A14 | Footer FinalPitch reveal | Emotional close — *Conversion* |
| A15 | Returning-visitor recognition | Continuity wow, previews OS — *Trust/Retention* |
| A16 | Progressive section reveals (global) | Pacing, comprehension — *Engagement* |

**Governance:** max **one signature animation per viewport**; all obey `prefers-reduced-motion`; none blocks above-the-fold interactivity; any decorative-only motion is cut.

---

# 19. JARVIS PRESENCE MAP

**Where Jarvis appears:** persistent corner presence (desktop) / icon in TopBar + swipe-up sheet (mobile) on **every page**; inline within Roast, Tools, Knowledge, and Snapshot.

| Moment | Appears | Says (intent, not script) | Recedes | Escalates |
|---|---|---|---|---|
| Arrival | Ambient, after hero is usable | Source/segment-aware welcome + one action | On first user action (paste/scroll) | — |
| Roast run | Fronts ThinkingTheater | Live micro-observations | Stays quiet during reading | Low-confidence → requests screenshot |
| Post-reveal | Inline follow-up | "Your {weakest} is costing most — fix it?" | If user scrolls to proof | High intent → Closer |
| Tool result | Inline | Cross-sell the one best next tool | After suggestion | Repeat weakness → Snapshot push |
| Knowledge | Inline Ask bar | Grounded answer + next step | After answer | Out-of-scope → human WhatsApp |
| Hesitation/idle | Single nudge | One gentle, dismissible prompt | On dismiss (no repeat) | Confusion → simplify → human |
| Snapshot | Closer | "Fix these with us?" → Audit | If not now → nurture | Booking friction → WhatsApp |
| Returning | Recognizes Passport | Continuity + progress | — | Client → Dashboard handoff |

**Presence rules:** never a full-screen takeover; never blocks the hero; **never asks for contact before value**; at most **one active ask on screen**; a declined ask isn't re-asked (beyond one soft reminder) that session; human handoff always one tap away. Rate-limited and safety-railed per the Experience Bible §5.

---

# 20. SELF-REVIEW: BOTTLENECKS, RISKS & OPTIMIZATIONS

Challenging my own architecture, as required.

**B1 — The Unlock gate is the #1 drop-off.** Everything funnels to one email+WhatsApp ask.
- *Optimizations:* value fully visible-but-blurred behind the gate (loss aversion); WhatsApp-only option as a lower-friction identity than email; a "Next 3 issues" pre-gate loop to deepen investment first; A/B the exact trigger point. **Instrument this relentlessly.**

**B2 — Roast completion depends on live listing data we may not reliably get.** The whole spine risks breaking at the input.
- *Optimizations:* the GuidedInputPanel fallback is designed as a *first-class* path, not an afterthought; ConfidenceMeter sets honest expectations; sample-listing shortcut lets skeptics see value with zero data. (Ties to the flagged infra risk from Strategy v2 §9.1.)

**B3 — Mode choice adds a decision before value.** Asking users to pick 🔥/🧠/🚀 upfront is friction.
- *Optimization:* Jarvis **pre-selects** the best mode; the chips are a visible-but-optional override, not a required step. Default action = paste and go.

**B4 — Too many entry paths can dilute focus.** Lab, Knowledge, segments, shared cards all compete.
- *Optimization:* the Master Conversion Map enforces **exactly one "next best step"** at every terminal moment (Jarvis governs), so breadth of entry never becomes breadth of exit.

**B5 — Home doing double duty (experience + convince) risks length.** Long homepages lose people.
- *Optimization:* the Roast reveal happens *in-place* near the top so value lands before the long scroll; everything below the reveal is skimmable Tier-3 for those who need more.

**B6 — Serious buyers may bounce at the "roast" gimmick.** (Investors, hotels.)
- *Optimization:* explicit **"Skip to proof"** + Jarvis auto-Diagnose for high-value signals; Results/Services reachable in one tap. The joke is a hook, never a toll.

**B7 — Animation ambition vs. mobile performance.** Our audience is mobile; heavy motion could tank CWV and conversion.
- *Optimization:* one signature moment per viewport; capability tiering; above-the-fold sacrosanct; reduced-motion equivalents. Performance is a conversion feature, not a constraint.

**B8 — Jarvis omnipresence risks nagging.** Over-prompting erodes the premium feel.
- *Optimization:* strict "one active ask, no re-ask, recede while reading" rules (§19). Presence ≠ pestering.

**B9 — Snapshot delivered to WhatsApp/email creates an off-site drop.** They leave to read it.
- *Optimization:* deliver **in-page first**, then send a copy; keep the Audit CTA present in the delivered version too, so the ladder continues off-site.

**B10 — Multi-property investors need a different shape.** One-listing flow underserves them.
- *Optimization:* Passport is multi-property from day one; "Try another listing" and a future portfolio view; investor segment page leads with scale/ROI, not a single roast.

**Top 3 to instrument from launch:** Unlock-gate conversion (B1), Roast-completion incl. fallback rate (B2), and Snapshot→Audit rate. These three govern the whole funnel's health.

---

# 21. OPEN DECISIONS FOR APPROVAL

Recommendation bolded; each changes the architecture materially.

1. **Roast reveal placement on Home** — run it **in-place near the hero** (recommended) vs. routing to `/roast`. *(In-place lands value faster; `/roast` keeps Home shorter.)* **(Recommend: in-place, with `/roast` as the deep-link/ad destination.)**
2. **Mode selection** — **Jarvis auto-selects, chips optional override** (recommended) vs. explicit user choice first. **(Recommend: auto-select.)**
3. **Unlock identity** — **email + WhatsApp** (recommended for reach) vs. **WhatsApp-only** (lower friction, India-appropriate). **(Recommend: WhatsApp-primary, email optional — test.)**
4. **Snapshot delivery** — **in-page first, then WhatsApp/email copy** (recommended) vs. WhatsApp/email only. **(Recommend: in-page first.)**
5. **Client CTA swap** — TopBar primary switches Roast→Dashboard for recognized clients now, even pre-dashboard (points to a "coming soon"/WhatsApp). **(Recommend: yes — respects rank.)**
6. **Scarcity mechanism** — show a **real monthly audit cap** on `/audit`. **(Recommend: yes, only if genuinely enforced.)**

---

## STATUS

Complete UX architecture delivered: sitemap; global mobile-first + desktop navigation; information & CTA hierarchy; full component inventory (55 components); the master conversion map with alternates; page-by-page UX specs (purpose/goals/emotion/CTAs/section order/interaction goals/conversion trigger/success metric); and all requested journeys — AI, Roast, Growth Snapshot, Discovery, Returning, Existing Client, Error, Empty-state, Loading, and Future Dashboard. Animation is placement-and-reason only. Jarvis presence is fully mapped. A self-review names the bottlenecks and optimizations.

**No UI, no React, no Figma, no code produced.**

**Awaiting your approval.** Reply "approved" (with any calls on the six decisions in §21) and I'll proceed to Phase 3 (UI design). Until then, this document is the source of truth for how StayEdge is structured and how users move through it.
