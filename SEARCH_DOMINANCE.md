# SEARCH_DOMINANCE.md
### StayEdge — Technical SEO / AEO / GEO Audit, Implementation & Roadmap
*Owner: Chief Growth Engineer · 2026-07-18 · Canonical domain: https://stayedge.co.in*

---

## 1. TECHNICAL AUDIT (before → after)

| Area | Before | Now | Status |
|---|---|---|---|
| Canonical domain | `stayedge.in` placeholder | `stayedge.co.in` default, env-overridable | ✅ |
| Canonical URLs | none | per-page `alternates.canonical` on all 12 pages | ✅ |
| Metadata | title/description per page | + sharpened, keyword-bearing titles on money pages | ✅ |
| Open Graph / Twitter | basic, no image | + OG image (brand lockup), locale en_IN | ✅ |
| robots.txt | ✅ | unchanged (allow all + sitemap) | ✅ |
| sitemap.xml | ✅ 12 routes | unchanged; single sitemap is correct at this size | ✅ |
| Organization schema | flat ProfessionalService | full entity graph: Organization (+offers, knowsAbout, areaServed) ⇄ Founder Person ⇄ WebSite, all `@id`-linked | ✅ |
| LocalBusiness | partial | ProfessionalService w/ Tirupati address, City/State/Country areaServed | ✅ |
| Breadcrumb schema | none | BreadcrumbList on all 11 sub-pages | ✅ |
| FAQ schema | none | FAQPage on Home (6 real Q&As) + Knowledge (8 answers) | ✅ |
| Software/app schema | none | WebApplication for the Roast tool (free, real) | ✅ |
| Review schema | none | **deliberately absent** — no genuine reviews yet (honesty law) | ✅ by design |
| Web manifest | none | app/manifest.ts (name, icons, theme) | ✅ |
| hreflang | none | N/A — single-locale site (en-IN); revisit if a second language ships | ✅ N/A |
| Image sitemap | none | N/A — no indexable content imagery yet; add with case studies | ⏳ future |
| Heading hierarchy | verified M2 (1 h1/page, sequential h2s) | unchanged | ✅ |
| Core Web Vitals | fonts self-hosted, AVIF/WebP, static prerender, budgeted JS | unchanged | ✅ |
| Indexability | all pages static, crawlable, zero dead ends; /os noindex + key-gated | ✅ |
| Duplicate/thin content | /audit is thin (placeholder booking page) | flagged | ⚠ roadmap #2 |
| Orphan pages | none — every page reachable from nav/footer | ✅ |
| Keyword cannibalization | none — one intent per page | ✅ |

**AEO (Answer Engine Optimization) — implemented:** `/knowledge` is now an Answer
Center: the 8 founder-specified questions, each opening with a concise, quotable,
factually-grounded definition (no invented statistics), then actionable detail.
Mirrored 1:1 in FAQPage schema so AI engines can extract answers directly.
Entity-dense but written for hosts first (quality rule respected).

**GEO (Generative Engine Optimization) — implemented:** one reusable entity graph
(`lib/seo/schema.ts`) with stable `@id`s connecting StayEdge ⇄ Founder ⇄ WebSite ⇄
services ⇄ Tirupati/AP/India ⇄ topic entities (`knowsAbout`: Airbnb listing
optimization, Airbnb SEO, dynamic pricing, revenue management, guest psychology…).
Every page reinforces the same entities through breadcrumbs + graph references.
Local SEO: Tirupati/Andhra Pradesh/India as structured areaServed — extensible to
new cities by appending to one array (no restructuring).

## 2. VALIDATION PERFORMED

- Production build green: 16 routes + manifest compile, all static except API/os.
- JSON-LD verified in rendered HTML on every page (single `@graph` document).
- Canonicals verified in rendered `<head>` (absolute, on stayedge.co.in).
- Old-domain sweep: zero references to the placeholder domain remain in the repo.
- FAQ schema content matches visible on-page content exactly (no schema-only text
  — Google's #1 FAQ-schema penalty avoided).
- Recommend post-deploy: Google Rich Results Test + Schema.org validator on
  live URLs, then submit sitemap in Search Console (founder: needs GSC account).

## 3. TOPICAL AUTHORITY MAP & PUBLISHING ORDER

Hub: **/knowledge** (Answer Center) → clusters, in recommended publishing order:

| # | Cluster | Why this order | Cornerstone piece |
|---|---|---|---|
| 1 | Airbnb SEO | Highest search intent + closest to the product | "The Airbnb ranking factors hosts control" |
| 2 | Listing Optimization | The core service; feeds the roast | "The listing audit checklist (photo order, title, description)" |
| 3 | Pricing Strategy | Direct revenue topic; strong AEO questions | "Flat pricing is costing you both ways" |
| 4 | Photography | High-engagement, shareable | "Which photo should be first (and why)" |
| 5 | Guest Reviews & Psychology | Trust + differentiation topic | "What guests hesitate on (and how to remove it)" |
| 6 | Occupancy & Revenue Management | Investor/multi-property segment | "Occupancy vs ADR: which to fix first" |
| 7 | Airbnb Algorithm updates | Recurring/newsworthy → return visits | "How Airbnb decides who ranks" |
| 8 | Local: Tirupati/AP host guides | Local SEO moat; low competition | "Hosting near Tirumala: what pilgrims book" |
| 9 | Google Business Profile + Local SEO | Adjacent service surface | "Your stay on Google Maps" |
| 10 | AI for Airbnb hosts | Brand-defining; GEO magnet | "What an AI actually sees in your listing" |

Rules: one intent per article; answer-first structure (definition → detail →
checklist); every piece internally links to the roast + one sibling article;
Article schema + author entity (founder Person `@id`) on each.

## 4. REMAINING OPPORTUNITIES (prioritized roadmap)

1. **Deploy + Search Console + Bing Webmaster** — nothing indexes until live
   (founder: hosting + GSC/Bing accounts; I wire sitemap submission after).
2. **Rebuild /audit as a real booking page** — currently thin; add scheduling,
   audit-specific FAQ schema, testimonial slots. Highest-converting page deserves
   the most depth.
3. **Publish cluster #1–3 articles** (6–9 pieces) with Article + author schema —
   the actual authority engine; everything above is plumbing for this.
4. **Image strategy** — real property/before-after imagery with descriptive alt +
   image sitemap once case studies exist.
5. **SEO dashboard in /os** — after GSC is connected: impressions, CTR, position,
   indexed pages via Search Console API through the OS (single data plane).
6. **llms.txt** — emerging convention for AI-crawler guidance; cheap to add,
   revisit once stabilized.
7. **Backlink seeding** — directory + community presence (host forums, local
   business listings, Instagram → site links). Founder-led, checklist available.
8. **Review schema** — the moment the first genuine public reviews exist.

## 5. QUALITY RULE COMPLIANCE

Every change above is visible, useful content or truthful markup describing it.
No schema-only text, no invented reviews/ratings/stats, no keyword stuffing.
Conflicts resolved in favour of the host-reader every time.
