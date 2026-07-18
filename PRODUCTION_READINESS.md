# StayEdge — Version 1 Production Readiness Report
*Chief Growth Engineer · 2026-07-18 · Covers milestones M1–M11 (11 commits, all verified)*

---

## 1. ARCHITECTURE SUMMARY

```
Visitor ──▶ Website (Next.js 16, static-first, stayedge.co.in)
              ├─ /api/roast ───▶ WEB-HEAD gateway (n8n) ─▶ PROV AI Generate
              │                   (Gemini → 2.0-flash → OpenAI → heuristic fallback)
              ├─ /api/lead ────▶ WEB-HEAD ─▶ CRM (Sheets) + Telegram founder notify
              │                   └─ founder approves → CAP-001 → Snapshot + WhatsApp
              ├─ /api/os/status ▶ WEB-HEAD metrics (live CRM aggregation) → /os dashboard
              └─ /api/health ◀── OPS Monitor (n8n, 10-min probes + daily 9am IST brief)
```

- **One intelligence layer** (founder law): all AI flows through PROV AI Generate;
  the website never duplicates prompts. Contract validated with zod at the seam.
- **Graceful degradation everywhere:** provider failover proven under real
  failure; thin input short-circuits (zero AI cost); any Brain failure falls back
  to the honest local heuristic. No visitor-facing error states exist.
- **Brand inheritance:** tokens + logos sync from the Brand OS repo at every
  build (`scripts/sync-brand.mjs`); nothing brand-critical is hand-copied.
- **24 routes:** 19 static/SSG (content, tools, articles), 5 dynamic (APIs + /os).

## 2. FEATURES COMPLETED (V1)

| Area | Shipped |
|---|---|
| Homepage experience | Cinematic hero + 3D AI presence (capability-tiered), roast preview, mechanism, interactive before/after, revenue calculator, segments, process, FAQ |
| Roast Engine | Guided-input flow, thinking theater, 3 modes (🔥🧠🚀) re-toning one analysis, score + confidence, honest unlock, live AI via CAP-001 Brain |
| Vira | Site-wide non-interrupting consultant; returning-visitor memory (Property Passport, localStorage) |
| Lead pipeline | Unlock → /api/lead → CRM row + Telegram approve prompt → (founder) → CAP-001 outreach. E2E verified with real deliveries |
| Pages | Services, Who We Help, Results (case-study framework), How We Work (no pricing page), How We Think, About, Contact, AI Lab, Audit |
| Authority Engine | 10-cluster Knowledge hub, 3 cornerstone articles, 15-term glossary, Tirupati city page, editorial guidelines |
| SEO/AEO/GEO | Canonicals, entity graph (@id-linked Org/Founder/WebSite), Breadcrumb/FAQ/Article/DefinedTermSet/Service/WebApplication schema, sitemap (17 URLs), robots, manifest, OG |
| Analytics | GA4 + Clarity, consent-gated, full event taxonomy (no-op until IDs set) |
| Reliability | Provider failover, OPS monitor (state-transition alerts), daily founder brief (verified delivered), stress-tested |
| Security | Bearer-token gateway, security headers, key-gated /os (404 without key), no secrets client-side |

## 3. OUTSTANDING FOUNDER ACTIONS (launch blockers marked ●)

1. ● **Hosting + deploy** — choose a platform (Vercel recommended for this
   stack), connect the repo, set env vars from `stayedge-website/.env.example`
   (webhook URLs + token are documented in `stayedge-website/os/README.md`).
2. ● **DNS** — point stayedge.co.in at the host.
3. ● **AI provider billing** — Gemini quota is 0 and OpenAI throttles (no
   credit). Product works on heuristic, but the wow is the AI roast. Fix one.
4. **Search Console + Bing Webmaster** — verify domain, submit sitemap.
5. **GA4 + Clarity IDs** — create properties, set the two env vars.
6. **CRM cleanup** — delete test rows (WhatsApp `+91 90000 00000`).
7. **n8n error workflow** — select the OPS monitor as error workflow in each
   workflow's settings (UI-only, 2 minutes).
8. **Content cadence** — approve the publishing order in AUTHORITY_ENGINE.md §2.

## 4. KNOWN LIMITATIONS (honest register)

- **AI roast latency:** 15–35s through n8n cloud + provider failover. The
  thinking theater holds attention; the 35s timeout then falls back gracefully.
- **Roast inputs are guest-supplied**, not scraped from Airbnb (deliberate:
  Airbnb blocks scraping; guided-input-first was the approved decision).
- **Leads pre-forwarding also persist on-device only** if the gateway is down
  (no server-side queue yet); the monitor alerts within 10 minutes.
- **Metrics on /os** cover CRM-derived numbers only until GA4 is connected
  (visitors/scroll metrics need analytics IDs).
- **No case studies/testimonials yet** — framework renders the moment real,
  client-approved data exists; until then trust is earned via method + roast.
- **Preview-environment quirk (dev only):** local software-WebGL can't
  screenshot the 3D hero; `?static` or `NEXT_PUBLIC_DISABLE_3D=1` for testing.
- **500-scale stress** was deliberately not run against paid AI/live Telegram;
  run post-deploy with a test flag if desired.

## 5. PRODUCTION CHECKLIST (pre-launch)

- [x] Production build green (24 routes)
- [x] All routes 200, zero broken internal links (crawled)
- [x] Structured data present + honest (no fabricated reviews/stats)
- [x] Canonicals + sitemap + robots + manifest on stayedge.co.in
- [x] A11y: 1 h1/page, labelled inputs, alt coverage, reduced-motion, focus rings
- [x] Security headers, gated internal surfaces
- [x] Error/404 pages route back to the ladder
- [x] E2E: roast (AI + fallback), lead → CRM + Telegram, metrics, monitor, brief
- [ ] Founder actions ●1–●3 above
- [ ] Post-deploy smoke test (§6)

## 6. DEPLOYMENT CHECKLIST (day of)

1. Import repo to host; root directory `stayedge-website`; build `npm run build`.
2. Set env: `NEXT_PUBLIC_SITE_URL`, 3× `N8N_*_WEBHOOK_URL`, `N8N_ROAST_TOKEN`,
   `OS_DASHBOARD_KEY` (+ GA/Clarity when ready). Note: brand-sync warns and
   reuses committed assets on CI (expected — assets are in the repo).
3. Deploy → verify: `/` renders, `/api/health` ok, `/roast` completes a guided
   roast, an unlock lands in CRM + Telegram, `/os?key=…` shows all green.
4. Point DNS; confirm https + canonical host.
5. The OPS monitor will begin passing website probes automatically (first
   healthy sighting arms down-alerts).
6. Submit sitemap in Search Console/Bing.

## 7. ROLLBACK PLAN

- **Website:** hosts keep previous deployments — one-click rollback; git tags
  per milestone allow `git revert` to any verified commit (M1–M11 all green).
- **n8n:** every workflow is versioned; republishing a prior version restores
  it (workflow IDs and roles documented in os/README.md). The website tolerates
  gateway absence by design (heuristic + on-device lead storage), so a bad n8n
  change never takes the site down.
- **Env kill-switches:** unset `N8N_*` → pure-heuristic mode; unset analytics
  IDs → tracking off; unset `OS_DASHBOARD_KEY` → /os disappears (404).

## 8. RISK ASSESSMENT

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| AI providers stay unfunded | High (current) | Medium — heuristic roasts convert worse | Founder action ●3; failover already built |
| n8n cloud limits under burst | Medium | Low — graceful heuristic, leads stored on device | Monitor alerts; upgrade plan if volume grows |
| Telegram approve step becomes bottleneck | Medium | Medium — leads wait on founder | Daily brief lists waiting leads; consider auto-outreach later (business decision) |
| SEO takes months to compound | Certain | Low — roast + WhatsApp are the near-term channels | Authority roadmap running in parallel |
| Single-founder ops | High | Medium | Monitor + brief designed for exactly this; everything documented in-repo |
| Local-machine IPv6 quirk on self-hosting | Low | Low | Fixed in code (ipv4first); irrelevant on cloud hosts |

## 9. RECOMMENDED LAUNCH PLAN

**Week 0 (now):** founder actions ●1–●3 → deploy → smoke test → DNS.
**Week 1 (soft launch):** share the roast link in 2–3 host communities +
Instagram bio; watch /os and the daily brief; fix friction, not features.
**Week 2:** Search Console submission settles; publish 2 articles from the
cluster map (SEO + Listing Optimization pillars); first WhatsApp follow-ups
through CAP-001.
**Week 3–4:** first discovery calls → first client → first REAL case study
enters the framework → /results comes alive → that case study becomes the
strongest asset on the site.
**North star:** qualified leads per week on the /os dashboard; everything else
is instrumentation.

---
*Version 1 is feature-complete, verified, and blocked only on founder-side
accounts (hosting, DNS, AI billing). The machine is built; it needs keys.*
