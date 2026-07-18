# AUTHORITY_ENGINE.md
### StayEdge — Authority Roadmap, Cluster Map, Linking Strategy & Editorial Guidelines
*Owner: Chief Growth Engineer · 2026-07-18 · Milestone 11*

Objective: make stayedge.co.in the definitive online resource for Airbnb listing
optimization in India — through expertise, evidence and usefulness, never
keyword volume.

---

## 1. AUTHORITY ROADMAP

| Phase | What | Status |
|---|---|---|
| 1. Architecture | Typed content system: clusters, articles, glossary, city pages, case-study framework — all schema-wired | ✅ built |
| 2. Cornerstones | First deep guides in the 3 highest-intent clusters + 15-term glossary + Tirupati city page | ✅ published |
| 3. Cluster fill | 2–4 supporting articles per pillar, in the order below | ⏳ next |
| 4. Evidence | Real case studies (framework ready, renders automatically when data lands) | ⏳ awaiting client approval |
| 5. Expansion | New city pages (Hyderabad, Bangalore, Chennai) — each with genuinely local content | ⏳ after Tirupati proof |
| 6. Off-site | Founder bylines, host-community presence, local citations, backlinks | ⏳ founder-led |

**Definition of authority here:** a host lands on any page and thinks "these
people obviously do this work." Every artefact must survive that test.

## 2. TOPIC CLUSTER MAP (10 pillars)

Implemented in `lib/content/clusters.ts`; hub at `/knowledge`.

| Pillar | Published | Next supporting articles (priority order) |
|---|---|---|
| Airbnb SEO | Ranking factors hosts control | Instant Book trade-offs · search placement diagnostics · new-listing boost |
| Listing Optimization | The listing audit checklist | Amenity strategy · title formulas by property type · description rewrites |
| Dynamic Pricing | Flat pricing costs both ways | Festival pricing calendar (India) · gap-night playbook · min-stay tuning |
| Revenue Optimization | — | Occupancy vs ADR decisions · RevPAR for single hosts · monthly review ritual |
| Guest Psychology | — | The 5 hesitations · trust cues that convert · pre-booking questions |
| Photography | — | Which photo leads · phone-shoot guide · caption strategy |
| Reviews & Reputation | — | Responding to bad reviews · review velocity · guest-review habit |
| Google Business Profile | — | GBP for homestays · maps + Airbnb together |
| Local SEO | Tirupati city page | City pages per expansion; local landmark language |
| AI for Airbnb Hosts | — | What Vira reads in a listing · AI limits & honesty · roast methodology |

Publishing order: fill pillars top-to-bottom (search intent + product proximity),
one article per pillar before seconds — breadth of authority beats depth in one.

## 3. INTERNAL LINKING STRATEGY

Implemented mechanics:
- **Hub → spokes:** `/knowledge` lists every cluster; clusters link their articles.
- **Spoke → spoke:** every article carries `related[]` (2 siblings) + glossary.
- **Everything → product:** every article/city/glossary page ends in exactly one
  roast CTA ("apply this to your listing") — the ladder, never a dead end.
- **Entity reinforcement:** articles carry Article schema with `author` = founder
  `@id`, `publisher` = org `@id`, `about` = cluster; city pages carry Service
  schema with `areaServed`; glossary carries DefinedTermSet. One connected graph.

Rules for future content: min 2, max 5 internal links per article body; link on
meaningful phrases (never "click here"); every new article must be linked FROM
at least one existing page in the same cluster (no orphans).

## 4. CONTENT TEMPLATES (implemented as code)

- **Article** (`app/knowledge/[slug]/page.tsx`): answer-first lede → structured
  H2 sections → optional checklist → FAQ (schema-mirrored) → roast CTA →
  related reading. Adding an article = one object in `lib/content/articles.ts`.
- **City page** (`app/airbnb-listing-optimization/[city]/page.tsx`): local-market
  answer → demand dynamics → city playbook → FAQ → CTA. Adding a city = one
  object in `lib/content/cities.ts` **with genuinely local knowledge only**.
- **Case study** (`lib/content/case-studies.ts` + `/results` renderer): property
  label, situation, changes, before→after metrics with periods, approved quote.
  Typed with `approvedByClient: true` required. **Array intentionally empty.**
- **Glossary term**: term + plain-language definition; DefinedTerm schema.

## 5. EDITORIAL GUIDELINES (binding for all future content)

1. **Answer a real host question.** If nobody asks it, don't write it.
2. **Answer first.** The opening paragraph must stand alone as a complete,
   quotable answer (AI engines lift ledes; hosts skim).
3. **Original insight over aggregation.** At least one observation per article
   that generic content mills wouldn't write.
4. **No invented numbers.** General industry practice may be stated as practice;
   statistics require a source or our own measured data. StayEdge results
   require client approval. (Brand law — non-negotiable.)
5. **Structure:** one H1, sequential H2s, ≤300-word sections, checklist where
   action is possible, FAQ where questions are natural.
6. **Voice:** clear not clever, confident not loud, warm not casual, specific
   not vague. No exclamation marks, no hype adjectives.
7. **Every article links:** 2+ related pieces, the glossary where terms appear,
   and exactly one product CTA.
8. **Entity discipline:** author = founder entity, cluster = `about`, terms used
   consistently ("Property Growth Snapshot", never variants).
9. **India-first examples** (pilgrim cities, festival demand, family groups) —
   this is the differentiation no US content site can copy.
10. **Quality gate:** would a working host bookmark it? If not, cut or improve.

## 6. REMAINING OPPORTUNITIES

1. **Cluster fill** (phase 3) — ~24 supporting articles; can be drafted in
   batches with founder review, published on a weekly cadence for freshness.
2. **Case-study pipeline** — the framework renders the moment the first
   client-approved entry is added; make approval a standard offboarding step.
3. **City expansion** — Hyderabad/Bangalore/Chennai pages need real local
   research (demand anchors, guest mix, event calendars) before writing.
4. **Comparison & decision pages** — "Airbnb vs direct bookings", "pricing tool
   vs manual", "photographer vs phone shoot" — high-intent formats, template fits.
5. **Founder bylines off-site** — host-community posts and local press linking
   back; the strongest authority signal we can't generate on-site.
6. **HowTo schema** — for checklist-heavy articles once content settles.
7. **Hindi/Telugu variants** — hreflang becomes relevant only then.
