# Phase 4 — SEO, Authority & Conversion — Report

**Branch:** `v2` · **Scope:** stayedge-website/ · **Status:** Complete, not deployed (per instruction — no push, no deploy, no production env changes)

---

## 1. SEO audit findings

Audited every route, `lib/seo/schema.ts`, `lib/config/site.ts`, `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`, `app/llms.txt/route.ts`, `next.config.ts`, and the full content registries (`lib/content/*.ts`) before changing anything.

**Baseline: this is an unusually mature technical-SEO codebase already.** Prior phases (M9 Search Dominance, M11 Authority Engine, Phase 1–3) had already shipped: a real entity graph (`ProfessionalService` + `LocalBusiness` + `Person` + `WebSite`, all `@id`-linked), per-page canonical + OG + Twitter metadata with no duplicates, `llms.txt` for AI-crawler orientation, a validated (never-guessed) GBP URL pipeline (`lib/config/gbp.ts`), 308 redirects retiring `/roast`, `/audit`, `/snapshot` into `/free-audit`, and 11 genuinely differentiated (non-doorway) city pages. This freed Phase 4 to focus on the one structural gap and a set of smaller, real defects rather than rebuilding SEO plumbing.

**Findings:**

| # | Finding | Severity | Status |
|---|---|---|---|
| 1 | **Only 2 of 6 IA-mandated services had dedicated pages** (`/services/ai-property-video` existed; Listing Optimization, Airbnb SEO, Pricing Strategy, Revenue Growth, Photography Guidance did not — only generic, unlinked cards on the `/services` hub). This is the single largest commercial-search gap: zero indexable, intent-matched landing pages for "airbnb pricing strategy," "airbnb seo," "airbnb photography," etc. | **Critical** | **Fixed** — 5 new pages built |
| 2 | **11 of ~20 indexable pages had no `<h1>` at all** (About, Contact, How We Work, How We Think, Who We Help, Results, Knowledge, Glossary, Lab, the `/services` hub, and every city page) — each used `SectionHeading`, which hard-coded `<h2>`. A page with no h1 is a real on-page SEO and accessibility defect. | **High** | **Fixed** — `SectionHeading` now takes an `as="h1"|"h2"` prop; the first heading on every affected page is now `h1` |
| 3 | Card-grid sub-headings on 5 new pages initially used `<h2>` under a `SectionHeading` `<h2>` (would have shipped a broken h2→h2 hierarchy). Caught before commit. | Medium | Fixed in-review (all now `<h3>`) |
| 4 | Homepage `<title>` ("StayEdge — AI-Powered Airbnb Growth") and meta description carried no consultancy/service keywords and undersold "for hosts, villas, boutique hotels." | Medium | Fixed |
| 5 | `SITE.descriptor` (used for every page's fallback OG/meta description and the Organization/WebSite/LocalBusiness schema `description`) was thin ("AI-powered Airbnb growth for hosts across South India.") | Medium | Fixed — now names the specific services and audience |
| 6 | Homepage hero didn't say "consultancy" or name the audience in the first viewport — a 2026-08-08 internal audit (`stayedge-audit-2026-08-08.md`, pre-Phase-1/2/3) had flagged this identity ambiguity; it partially persisted post-redesign. | Medium | Fixed — eyebrow + subcopy now state consultancy + audience |
| 7 | `robots.ts` / `sitemap.ts` / redirects for the retired `/roast`, `/audit`, `/snapshot` routes are correct and intentional (308 permanent, not accidentally serving stale content). Verified live in the build. | — | No action needed (already correct) |
| 8 | Duplicate-content / thin-content risk: **none found**. All 11 city pages carry genuinely unique local-market copy (demand drivers, playbook, FAQs) — not template-swapped filler. All 20 knowledge articles are unique, real guides. | — | No action needed |
| 9 | Apex (`stayedge.co.in`) → `www` redirect: not present in `next.config.ts` or `vercel.json`; this is a hosting/DNS-level concern (Vercel domain settings), not app code, and touching it risks a redirect loop without confirming apex DNS in this environment. | Medium | **Not changed — flagged for Phase 5/6** (see §21) |
| 10 | Default OG image is the bare logo lockup (1650×660) on every page — no headline/visual per-page card. Building new brand imagery is a design-asset task, not a code task, and was out of scope for a no-deploy engineering pass. | Low–Medium | **Not changed — flagged for Phase 5** |
| 11 | `Failed to find font override values for font 'Boldonse'` — a genuine Turbopack/next-font build warning (present before Phase 4 too). Boldonse already loads with `display: "swap"`, so the CLS risk is bounded, but no fallback metrics are generated. | Low | **Not changed** — see §14 |

Indexability, canonicalization, trailing-slash and www/non-www *tag* behavior, HTTP→HTTPS, and mobile rendering were all verified correct in the existing setup (Next.js defaults + `alternates.canonical` on every route + `metadataBase` in `layout.tsx`). No 404s introduced (verified — see §17).

---

## 2. Information architecture changes

Implemented the exact IA the brief specified:

```
StayEdge
├── Services (/services)
│   ├── Airbnb Listing Optimization  (/services/airbnb-listing-optimization) — NEW
│   ├── Airbnb SEO                    (/services/airbnb-seo) — NEW
│   ├── Pricing Strategy              (/services/pricing-strategy) — NEW
│   ├── Revenue Growth                (/services/revenue-growth) — NEW
│   ├── Photography Guidance          (/services/photography-guidance) — NEW
│   └── AI Property Video             (/services/ai-property-video) — existing, unchanged copy
├── Who We Help (/who-we-help)
├── How We Work (/how-we-work)
├── Results (/results) — illustrative examples, honestly labelled (unchanged)
├── Knowledge (/knowledge) — 20 articles + glossary (unchanged, linked into from new pages)
├── About (/about)
└── Free Property Growth Audit (/free-audit) — unchanged, the one conversion destination
```

- **No AI Roast reintroduced.** Confirmed absent from routes, nav, redirects and content registries.
- **AI Property Video treated as a normal, secondary service** — its own page and nav CTA already existed and were left as the second-priority action everywhere (Free Audit remains primary).
- **No speculative services added.** The 5 new pages map 1:1 to disciplines the brief explicitly named; nothing else was invented for SEO's sake (no "Airbnb co-hosting," "guest messaging," etc.).
- City pages (`/airbnb-listing-optimization/[city]`) were kept as a separate route family (local-intent, not service-hub) and cross-linked into the new listing-optimization service page rather than merged.

---

## 3. Service-page changes

Built 5 new pages (`app/services/{airbnb-listing-optimization,airbnb-seo,pricing-strategy,revenue-growth,photography-guidance}/page.tsx`) and restructured the hub (`app/services/page.tsx`). Every new page has:

- Unique `<title>`, meta description, OG/Twitter tags, canonical
- Exactly one `<h1>` (hero), `<h2>` section headings, `<h3>` card titles — verified hierarchy
- A stated target customer/problem, a methodology section ("how it works" / "what we optimise"), and an outcomes framing that never states a numeric promise ("Turn views into bookings," never "+40% occupancy")
- 4–5 real FAQs, tied to `FAQPage` schema
- A "Related services" card row (contextual internal links, not exact-match anchor spam)
- Primary CTA = Free Audit everywhere (`CTA.audit.label`); secondary CTA varies (Services hub / AI Property Video / relevant sibling service)
- A dedicated `Service` schema (`lib/seo/schema.ts`) + `BreadcrumbList` + `FAQPage`, matching the existing `aiPropertyVideoServiceSchema()` pattern exactly — same `@id` convention, same `ProfessionalService` `provider` link

**Deliberate differentiation to avoid content overlap:**
- *Listing Optimization* = the on-listing elements (title, photos, description, amenities) → conversion once found.
- *Airbnb SEO* = ranking factors → being found in Airbnb's own search (explicitly distinguished from Google SEO in its own FAQ).
- *Pricing Strategy* = calendar-level mechanics (weekday/weekend, seasonality, minimums, gap nights).
- *Revenue Growth* = the layer above pricing — positioning, guest-segment targeting, occupancy+ADR moved together toward RevPAR (each page's FAQ explicitly cross-references the other to pre-empt "aren't these the same page" confusion).
- *Photography Guidance* = explicitly **not** a photography shoot ("Do you send a photographer to my property? No.") — protects the HONESTY LAW; StayEdge doesn't claim a service it doesn't deliver.

The `/services` hub's 4 unlinked, generic cards were replaced with 5 cards that link directly to their dedicated pages (`TiltCard` + `Link`, matching the pattern already used on `/knowledge`), plus the existing AI Property Video band.

---

## 4. Keyword / topic architecture

| Topic | Intent | Page | Primary term | Supporting terms | Dedicated page justified? |
|---|---|---|---|---|---|
| Airbnb listing optimization | Commercial | `/services/airbnb-listing-optimization` | airbnb listing optimization | title, photo order, description, amenities | Yes — highest-intent commercial term in the brief |
| Airbnb listing optimization service | Commercial (transactional) | same | airbnb listing optimization service | — | Covered by same page (title includes "Service") |
| Airbnb SEO | Commercial/informational | `/services/airbnb-seo` | airbnb seo | search ranking, response rate, calendar accuracy | Yes |
| Airbnb pricing strategy | Commercial | `/services/pricing-strategy` | airbnb pricing strategy | dynamic pricing, weekday/weekend, gap nights | Yes |
| Airbnb revenue management | Commercial | `/services/revenue-growth` | airbnb revenue growth | RevPAR, occupancy, ADR, positioning | Yes |
| Airbnb photography guidance | Commercial (niche) | `/services/photography-guidance` | airbnb photography guidance | shot list, staging, sequencing | Yes — but scoped honestly (guidance, not a shoot) |
| Airbnb growth consultant / consultancy | Brand/commercial | Homepage, `/about`, layout title | airbnb growth consultancy | — | No new page — reinforced in titles/copy instead (avoids diluting the homepage's authority) |
| Airbnb consultant | Commercial | Homepage | (same as above) | — | Same |
| Airbnb host marketing | Informational | `/knowledge` cluster | — | — | Existing cluster sufficient; no new page |
| Airbnb occupancy improvement | Informational/commercial | `/services/revenue-growth`, `/knowledge/off-season-revenue-playbook` | — | — | Folded into Revenue Growth, not split out |
| Airbnb ADR improvement | Informational/commercial | `/services/pricing-strategy`, `/knowledge/adr-occupancy-revpar-explained` | — | — | Folded into Pricing Strategy |
| Airbnb management (India, general) | Navigational/confusion risk | — | — | — | **Deliberately not targeted** — StayEdge is explicitly not a property manager; chasing this term would blur the brand's sharpest wedge |

No location + keyword combinatorial pages were created (e.g. no `/airbnb-seo/bangalore`) — the brief explicitly warned against this, and the existing 11 city pages already own local long-tail intent for listing optimization specifically.

---

## 5. Local SEO changes

- **Audited all 11 city pages** (`lib/content/cities.ts`, 330 lines) — every one carries real, differentiated local-market analysis (demand drivers, guest segments, seasonal patterns, a city-specific playbook, 2 unique FAQs). **No doorway pages** — confirmed by direct read, not sampling.
- **No new city pages added.** The brief said "do not create hundreds of thin pages" — 11 genuine South Indian markets (Tirupati, Bangalore, Hyderabad, Chennai, Kochi, Visakhapatnam, Mysore, Coimbatore, Madurai, Thiruvananthapuram, Puducherry) is the right footprint; expansion should only happen with real local-market research behind each new city, which is a content task for a future phase, not a code task.
- **Added one cross-link per city page** to the new `/services/airbnb-listing-optimization` hub ("This is the {city}-specific market read. See the full Airbnb Listing Optimization service…") — closes the loop between local intent and the commercial service page.
- **GBP**: confirmed `lib/config/gbp.ts` already does exactly what the brief requires — `NEXT_PUBLIC_GBP_URL` is the only source of truth, validated against an allow-list of real Google Maps/GBP hosts (rejecting the `business.google.com` management console specifically), consumed in `organizationSchema()`/`localBusinessSchema()` (`sameAs`, `hasMap`) and in the footer. **No GBP URL was hardcoded or guessed** — this was already correct and required no Phase 4 change. If `NEXT_PUBLIC_GBP_URL` is not currently set in the environment, that's an operational task (set the env var + redeploy), not a code defect.

---

## 6. Entity / schema changes

Added 5 new `Service` schema builders to `lib/seo/schema.ts` (`listingOptimizationServiceSchema`, `airbnbSeoServiceSchema`, `pricingStrategyServiceSchema`, `revenueGrowthServiceSchema`, `photographyGuidanceServiceSchema`), each:

- `@id`-scoped to its own URL (`{page}#service`)
- `provider` linked to the single `ORG_ID` entity (no duplicate/drifting org identity)
- `areaServed: India` (matches existing services — no fabricated city-level service claims)
- A factual `description` with no numbers, ratings, or client counts

All 5 are included both on their own page (`Service` + `FAQPage` + `BreadcrumbList`) and in the `/services` hub's graph, alongside the existing `servicesCatalogSchema` and `aiPropertyVideoServiceSchema`. No `Review`/`AggregateRating` schema was added anywhere — none exists on-page, so none is claimed in schema (unchanged HONESTY LAW discipline). `LocalBusiness` and `Organization` schema were left untouched — already factually scoped to Tirupati with no invented offices.

---

## 7. Internal-linking changes

- **New service pages ↔ each other**: every new page has a "Related" row linking to 2–3 topically adjacent services and one knowledge article (contextual anchors — "Airbnb Listing Optimization," "Off-Season Revenue Playbook" — never repeated exact-match "airbnb seo" spam).
- **`/services` hub → all 6 services**: previously 4 cards with zero links; now every card is a real `Link` to its page.
- **City pages → Listing Optimization service**: one contextual sentence per city page (11 pages).
- **5 knowledge articles → service pages** (targeted, not blanket): `airbnb-ranking-factors-hosts-control` → Airbnb SEO; `airbnb-listing-audit-checklist` → Listing Optimization; `flat-pricing-costs-both-ways` → Pricing Strategy; `adr-occupancy-revpar-explained` → Revenue Growth; `airbnb-photography-without-a-professional` → Photography Guidance. Used the site's existing `[[/path|text]]` → `InternalParagraph` mechanism (`components/seo/InternalLinks.tsx`), which already supported absolute-path links — no new linking infrastructure needed.
- **GA4 CTA tracking generalized** (`components/analytics/AnalyticsProvider.tsx`) from two hardcoded branches (`/free-audit`, `/services/ai-property-video`) to a generic `/services/*` match, so every current and future service page's CTA clicks are tracked without another code change.

Verified with a build-time link-integrity scan (§17) — zero broken internal links introduced.

---

## 8. Knowledge / content-strategy findings (roadmap, not new content)

Audited `lib/content/{articles,clusters,answers,glossary}.ts`: 20 articles across 10 clusters, 16 glossary terms, 10 quotable answers — all genuinely distinct, checklist-driven, honest (no fabricated stats). Per the brief's explicit instruction, **no new articles were generated**. Findings for a future content phase:

- **Strong, ready-to-compound clusters**: `airbnb-seo` (3 articles), `listing-optimization` (2), `dynamic-pricing` (2), `revenue-optimization` (2), `photography` (2) — these now also have a service page to convert into, closing the content→commerce loop.
- **Thin clusters** (0–1 articles, shown honestly as "Guides publishing soon" per `app/knowledge/page.tsx`): `guest-psychology`, `reviews-reputation` partially, `google-business-profile`, `local-seo`, `ai-for-hosts` — real gaps, not padded with filler. Recommend prioritizing `guest-psychology` and `local-seo` next, since both now have matching commercial pages (Revenue Growth's positioning angle; the city pages) that would benefit from supporting articles.
- **Missing high-value topic**: no article yet ties directly to "Airbnb photography guidance" as a *service* framing (the existing article is DIY-only) — now partially closed by the new service page itself.
- No RSS/newsletter mechanism exists (noted in the pre-Phase prior audit) — still absent; out of scope for a no-deploy SEO/IA pass, flagged for Phase 5.

---

## 9. `/free-audit` conversion-page changes

Reviewed against every checklist item in the brief (what/who/what's-reviewed/what-you-get/credibility/what-happens-after/form/CTA/trust-without-fabrication) — the page already satisfied nearly all of them (coverage cards, 3-step process, honest FAQ, no testimonials). One gap: it stated *what* it does but not explicitly *who* it's for. Added one line under the intro:

> "For first-time hosts, villa owners, boutique hotels and anyone managing more than one Airbnb listing across South India."

No structural changes — the brief was explicit that this page should stay a focused conversion page, not become an SEO article, and it already was one.

---

## 10. Homepage conversion-architecture changes

Applied the 5-second test (WHAT / HOW / FOR WHOM / NEXT STEP) to `components/sections/Hero.tsx`:

- Eyebrow: `"AI-Powered Airbnb Growth"` → `"Airbnb Growth Consultancy · AI-Powered"` (WHAT stated first, HOW second — previously only implied "AI product")
- Subcopy: added `"Strategy plus AI-powered execution for hosts, villas and boutique hotels."` ahead of the existing "paste your listing" line (FOR WHOM, now explicit; HOW reinforced)
- NEXT STEP (Free Audit CTA) was already the hero's primary action — unchanged
- **Visual system untouched** — no component structure, animation, or layout changed; this was a copy-only edit inside existing `RevealItem`/`WordReveal` wrappers

---

## 11. Metadata matrix

Full per-route matrix. Programmatic families (city pages, articles) are summarized as a pattern row since each instance follows the same generator with real, unique per-item title/description (verified in §1).

| URL | Title | Canonical | Indexable | Primary intent | Internal-link role |
|---|---|---|---|---|---|
| `/` | StayEdge — Airbnb Growth Consultancy for Hosts in India | `/` | ✅ | Brand / navigational | Root hub — links to all primary sections |
| `/free-audit` | Free Property Growth Audit | `/free-audit` | ✅ | Highest commercial (conversion) | Universal CTA destination |
| `/services` | What We Do — Airbnb Listing Optimisation, Pricing & SEO | `/services` | ✅ | Commercial hub | Links to all 6 service pages |
| `/services/airbnb-listing-optimization` | Airbnb Listing Optimization Service | same | ✅ | Commercial | NEW |
| `/services/airbnb-seo` | Airbnb SEO Service | same | ✅ | Commercial | NEW |
| `/services/pricing-strategy` | Airbnb Pricing Strategy Service | same | ✅ | Commercial | NEW |
| `/services/revenue-growth` | Airbnb Revenue Growth Service | same | ✅ | Commercial | NEW |
| `/services/photography-guidance` | Airbnb Photography Guidance | same | ✅ | Commercial (niche) | NEW |
| `/services/ai-property-video` | AI Property Video | same | ✅ | Commercial (secondary) | unchanged |
| `/who-we-help` | Who We Help | same | ✅ | Segment qualification | h1 added |
| `/how-we-work` | How We Work | same | ✅ | Process/trust | h1 added |
| `/how-we-think` | How We Think | same | ✅ | Trust/method | h1 added (via `MechanismTimeline headingAs="h1"`) |
| `/results` | Results | same | ✅ | Trust (illustrative, honestly labelled) | h1 added |
| `/about` | About | same | ✅ | E-E-A-T / founder authority | h1 added |
| `/contact` | Contact | same | ✅ | Conversion (secondary) | h1 added |
| `/knowledge` | Airbnb Growth Knowledge — Straight Answers for Hosts | same | ✅ | Informational hub | h1 added |
| `/knowledge/glossary` | Airbnb Host Glossary — ADR, RevPAR, Occupancy & More | same | ✅ | Informational/AEO | h1 added |
| `/knowledge/[slug]` × 20 | per-article, unique | per-slug | ✅ | Informational/topical authority | already had h1; 5 articles gained a service-page link |
| `/airbnb-listing-optimization/[city]` × 11 | Airbnb Listing Optimization in {City} | per-slug | ✅ | Local commercial long-tail | h1 added; now links to Listing Optimization service |
| `/lab` | AI Lab | `/lab` | ✅ | Roadmap/product teaser | h1 added (via `AILabPreview headingAs="h1"`) |
| `/os`, `/os/login` | StayEdge OS | — | ❌ `noindex,nofollow` | Internal tool | Out of scope — already correctly noindexed |
| `/roast`, `/audit`, `/snapshot` | — | → `/free-audit` | 308 redirect | — | Verified not serving stale content |

---

## 12. Sitemap + robots status

- `app/sitemap.ts`: added the 5 new service URLs at priority `0.8` (matching `/services/ai-property-video`'s existing priority). **Verified in the built output**: `sitemap.xml` now contains 49 URLs (was 44), including all 6 `/services/*` pages.
- `app/robots.ts`: unchanged — already `allow: "/"` for all agents with the sitemap declared; no reason to restrict anything new.
- `next.config.ts` redirects (`/roast`, `/roast/:path*`, `/audit`, `/snapshot` → `/free-audit`, all `permanent: true`): unchanged, verified still present and correct. None of the three legacy routes appear in the sitemap or in any internal link.

---

## 13. OG / social metadata

Every new service page carries its own `openGraph` + `twitter` block (title, description, `url`, `type: "website"`, `DEFAULT_OG_IMAGE`) — consistent with the rest of the site. **Not changed**: the shared OG image is still the bare logo lockup (flagged in §1, finding 10) — designing a real per-page or per-category social card is a visual-asset task outside a code-only, no-deploy Phase 4 pass, and is recommended for Phase 5.

---

## 14. Performance findings

- `Boldonse` font-override warning is pre-existing (Turbopack can't compute fallback metrics for this face) and unrelated to Phase 4 changes; `display: "swap"` is already set, bounding CLS risk. Not touched — changing font-loading strategy is a distinct, higher-risk performance initiative that should be scoped and tested on its own, not folded into an SEO/IA pass.
- No new client-side JS was introduced beyond the existing shared components (`WordReveal`, `EyebrowTypeOn`, `RevealGroup`, `TiltCard`, `LeadForm` is *not* used on the new pages — they route to `/free-audit` instead, avoiding 5 new lead-form bundles).
- No new images were added (no OG asset work in this pass — see §13), so no new image-weight cost.
- Motion tiering (`lib/motion/tier.ts`) and `prefers-reduced-motion` handling were not modified and were verified still gating `TiltCard`, `CursorSpotlight`, and the 3D hero correctly — new pages reuse these same tier-aware components rather than introducing new animation.

---

## 15. Accessibility findings

- **Heading order — the one real, sitewide defect found**: 11 pages had zero `<h1>`. Root-caused to `SectionHeading` hard-coding `<h2>`. **Fixed** by adding an `as="h1"|"h2"` prop (`components/sections/Section.tsx`) and setting it on the first heading of every affected page, including two shared components (`MechanismTimeline`, `AILabPreview`) that are reused on both the homepage (where they must stay `h2`, since the Hero already owns the page's `h1`) and their own standalone pages (`/how-we-think`, `/lab`, where they must be `h1`). **Verified programmatically**: every one of the 51 statically rendered pages now has exactly one `<h1>` (script-payload text excluded from the check).
- Card-grid heading rank fixed on the 5 new pages (h2→h3, §1 finding 3) before it shipped.
- FAQ pattern (`<details>/<summary>`) reused unchanged from the existing, already-accessible `ai-property-video` and `free-audit` pages — no new interaction pattern introduced.
- Focus states, contrast tokens, and touch targets: new pages reuse existing `Button`, `Section`, `TiltCard` components verbatim (no new custom-styled interactive elements), so they inherit the site's existing `focus-visible:outline-2 focus-visible:outline-offset-2` treatment and pill-button touch targets (`size="lg"` = `px-8 py-4`) without any new accessibility surface to audit.
- Not independently re-verified in this pass (no regression risk, since no code touched them): screen-reader landmark structure, dialog/modal behavior (Vira widget), dark/light contrast — these were not modified by Phase 4 and were already covered by prior phases' work.

---

## 16. GA4 event architecture

**Audited, not rebuilt** — `lib/analytics.ts` already defines a complete, consent-gated taxonomy: `audit_form_start`, `audit_form_submit`, `audit_lead_captured`, `video_form_submit`, `video_lead_captured`, `form_error`, `cta_click`, `whatsapp_click`, `scroll_depth`, `returning_visitor`. `page_view` fires once via `gtag('config', ...)` — confirmed no duplicate page_view risk introduced (new pages are plain server components with no extra `gtag` calls).

**One change**: `components/analytics/AnalyticsProvider.tsx`'s delegated click listener previously special-cased only `/free-audit` and `/services/ai-property-video` for `cta_click`. Generalized to match any `/services/*` href, so all 5 new service pages (and any future one) get `cta_click` events with `cta` set to the service slug, with zero additional code. No consent-architecture change — still gated behind `getConsent() === "granted"`.

| Event | Fires on | Params |
|---|---|---|
| `page_view` | every route (via `gtag config`) | — |
| `audit_form_start` | first interaction with the `/free-audit` `LeadForm` | `service` |
| `audit_form_submit` / `video_form_submit` | form submission | — |
| `audit_lead_captured` / `video_lead_captured` | successful lead API response | — |
| `form_error` | form validation/API failure | `service`, `reason` |
| `whatsapp_click` | any `wa.me` link, sitewide | `href` |
| `cta_click` | `/free-audit` or any `/services/*` link, sitewide (delegated) | `cta`, `href` |
| `scroll_depth` | 25/50/75/100% thresholds, once per page view | `depth` |
| `returning_visitor` | passport-based repeat-visit detection | — |

---

## 17. Tests performed

- `npx tsc --noEmit` — clean, zero errors
- `npm run lint` (ESLint) — zero errors; 8 pre-existing warnings (`react-hooks/set-state-in-effect`), all in files Phase 4 did not touch (`Vira.tsx`, `FloatingAuditCard.tsx`, `CursorSpotlight.tsx`, `ScrollFX.tsx`, `TiltCard.tsx`, `OSDashboard.tsx`, `AIPresence.tsx`, and one pre-existing line in `AnalyticsProvider.tsx` unrelated to the line I edited)
- `npm run build` (`next build`, Turbopack) — succeeded twice (before and after the heading-hierarchy fix); all 56 routes compiled, all 5 new service pages statically prerendered (`○ Static`)
- **Sitemap validation**: parsed `sitemap.xml` from the build output — 49 URLs, all 6 service pages present with correct absolute `https://www.stayedge.co.in` URLs
- **Structured-data validation**: parsed the JSON-LD `@graph` from a rendered new page (`/services/airbnb-seo`) — confirmed 2 valid script tags (global entity graph + page-specific `Service`/`FAQPage`/`BreadcrumbList`), well-formed JSON, correct `@id` linkage to the org entity
- **Broken-link audit**: scanned every generated `.html` file's `href="/…"` attributes (63 unique internal hrefs) against the known route table — zero broken links (`/manifest.webmanifest`, a valid Next-generated route, was the only initial false positive)
- **Heading-hierarchy audit**: counted real `<h1>` tags (script/RSC-payload text excluded) across all 51 statically rendered HTML files — **exactly 1 per page**, confirmed after the fix
- **Internal-link rendering check**: verified the `[[/services/airbnb-seo|Airbnb SEO service]]` syntax added to `lib/content/articles.ts` renders as a real `<a href="/services/airbnb-seo">` in the built `airbnb-ranking-factors-hosts-control` article page

Not run in this pass (require a live browser/Lighthouse session, not available in this environment): Lighthouse scoring, live viewport testing at 320/375/768/1024/1280/1440/ultrawide, dark/light visual regression, screen-reader walkthrough. These are flagged as remaining validation work before Phase 5/6 (see §22).

---

## 18. Test results

All automated checks above passed. No TypeScript errors, no new lint errors, successful production build, valid sitemap, valid schema, zero broken links, correct heading hierarchy sitewide (a pre-existing defect fixed, not just avoided).

---

## 19. Files changed

**New** (5 pages):
- `app/services/airbnb-listing-optimization/page.tsx`
- `app/services/airbnb-seo/page.tsx`
- `app/services/pricing-strategy/page.tsx`
- `app/services/revenue-growth/page.tsx`
- `app/services/photography-guidance/page.tsx`

**Modified** (23 files):
- `app/layout.tsx` — homepage default title
- `app/sitemap.ts` — 5 new URLs
- `app/llms.txt/route.ts` — 5 new service entries
- `app/services/page.tsx` — hub restructured to 5 linked cards + schema
- `app/free-audit/page.tsx` — "who it's for" line
- `app/airbnb-listing-optimization/[city]/page.tsx` — h1 + service cross-link
- `app/about/page.tsx`, `app/contact/page.tsx`, `app/how-we-work/page.tsx`, `app/how-we-think/page.tsx`, `app/who-we-help/page.tsx`, `app/results/page.tsx`, `app/knowledge/page.tsx`, `app/knowledge/glossary/page.tsx`, `app/lab/page.tsx` — h1 fix
- `components/sections/Section.tsx` — `SectionHeading` `as` prop
- `components/sections/MechanismTimeline.tsx`, `components/sections/AILabPreview.tsx` — `headingAs` passthrough
- `components/sections/Hero.tsx` — homepage 5-second-clarity copy
- `components/analytics/AnalyticsProvider.tsx` — generalized service CTA tracking
- `lib/config/site.ts` — 5 new `ROUTES`, richer `SITE.descriptor`
- `lib/seo/schema.ts` — 5 new `Service` schema builders
- `lib/content/articles.ts` — 5 contextual service links added to existing articles

---

## 20. Commit hash

Committed separately as a dedicated Phase 4 commit — see the commit immediately following this report in `git log`. Not pushed, not deployed, per instruction.

---

## 21. Remaining risks

1. **Apex → www redirect** is still unresolved at the DNS/hosting level (§1 #9). Canonical tags mitigate the SEO impact, but link-equity splitting persists until a Vercel domain redirect is configured. This is explicitly a Phase 5/6 deployment task, not app code.
2. **Shared OG image is still a bare logo** (§1 #10, §13) — every link shared on WhatsApp/Instagram (the actual distribution channels per `lib/config/site.ts`'s own comments) previews identically. Needs a design pass, not a code pass.
3. **`GBP_URL` env-dependent**: if `NEXT_PUBLIC_GBP_URL` isn't set in the deployed environment, `sameAs`/`hasMap`/footer link silently omit the GBP profile (by design — honest absence over a guessed link). Confirm it's set before Phase 5/6 deployment.
4. **Boldonse font-override warning** unresolved — low risk, but worth a dedicated performance pass (trim font families, per the 2026-08-08 pre-Phase audit's still-valid recommendation) before paid-traffic scale.
5. **No newsletter/email capture** exists — WhatsApp remains the only lead channel. Out of scope for Phase 4 (an IA/SEO pass, not a lead-gen infrastructure pass) but a real constraint on compounding organic content into a retained audience.

## 22. Remaining blockers (before Phase 5)

- Live browser/Lighthouse/viewport/screen-reader testing (§17) should be run in an environment with a running dev server and browser access, which wasn't available here — recommend running `npm run dev` + manual pass at the 7 specified breakpoints, plus a Lighthouse run against a preview deploy, before treating Phase 4 as fully validated end-to-end.
- Confirm `NEXT_PUBLIC_GBP_URL` and GA4/Clarity IDs are actually set in the target environment (not verifiable from this repo alone).

## 23. Recommendations for Phase 5

1. Real per-page/per-category OG social cards (design task).
2. Vercel apex→www redirect configuration (hosting task).
3. Content roadmap execution: `guest-psychology` and `local-seo` clusters next (§8), now that matching commercial pages exist to convert into.
4. Live performance pass: font-family trim, Lighthouse mobile scoring, CrUX field-data check (carried over from the 2026-08-08 audit, still valid).
5. First real client case study → replace one illustrative example on `/results` the moment one is client-approved (structure already supports this cleanly).

## 24. GO/NO-GO for Phase 5

**GO**, conditional on completing the live-environment validation in §22 (browser/Lighthouse/viewport pass) before or alongside Phase 5 work. All code-level SEO, IA, schema, internal-linking, metadata, accessibility (heading-hierarchy) and GA4-instrumentation work for Phase 4 is complete, typechecked, linted, and build-verified. Nothing in Phase 4 touched production configuration, secrets, or deployment.
