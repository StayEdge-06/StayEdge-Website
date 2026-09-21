# StayEdge OS — Website integration (WEB-HEAD)

**Status: LIVE** (2026-07-17). The website is a HEAD of StayEdge OS. One workflow
gateway, four event types, zero duplicated intelligence — AI runs only through
`StayEdge PROV - AI Generate`.

- Workflow: **StayEdge WEB-HEAD - Website Gateway** (`AfUSUys3rNeClHzF`), published.
  https://stayedge.app.n8n.cloud/workflow/AfUSUys3rNeClHzF
- Production webhook: `https://stayedge.app.n8n.cloud/webhook/stayedge-web-head`
- Auth: bearer token (value inside the workflow's *Route Input* node; the website
  sets the same value as `N8N_WEBHOOK_TOKEN`).

> **V2 (2026-09-03):** the AI Roast was removed from the website. `/api/roast`
> no longer exists, so the gateway's roast branch is orphaned — it is rewritten
> in Phase 3 along with the Google Sheets CRM + Telegram lead pipeline.
> `web-head-workflow.json` in this folder still shows the pre-V2 shape.

```
Website /api/lead  ──{type:"lead",…}────▶ WEB-HEAD ─▶ respond ─▶ CRM Leads append
                                                       └▶ Telegram founder notify
Website /api/os/status ─{type:"metrics"}▶ WEB-HEAD ─▶ live CRM aggregation
n8n monitor (todo) ──GET /api/health────▶ website self-check
```

## Verified end-to-end (2026-07-17)

- roast: routing + prompt build + PROV call + contract clamp (pinned test, exec 552)
- lead: real CRM `Leads` row appended (`Lead Source: Website`) + real Telegram
  message delivered to the founder (exec 570+)
- metrics: live aggregation from the CRM (qualifiedLeads/leadsToday/websiteLeads)
- auth: requests without the bearer token get `ok:false`
- website fallback: when the Brain punts (provider down) but the visitor gave
  input, the site's local heuristic answers — the visitor never sees an error

## Website env (hosting dashboard)

All three URLs are the same gateway:

```
N8N_BRAIN_WEBHOOK_URL=https://stayedge.app.n8n.cloud/webhook/stayedge-web-head
N8N_LEAD_WEBHOOK_URL=https://stayedge.app.n8n.cloud/webhook/stayedge-web-head
N8N_METRICS_WEBHOOK_URL=https://stayedge.app.n8n.cloud/webhook/stayedge-web-head
N8N_WEBHOOK_TOKEN=<the token in Route Input>
N8N_WEBHOOK_SECRET=<HMAC secret; signs the lead webhook body>
OS_DASHBOARD_KEY=<>= 16 chars; the /os login key>
OS_SESSION_SECRET=<optional; signs the /os session cookie>
```

Phase 3 note: `/os` no longer takes `?key=`. The key is typed once at
`/os/login` and exchanged for an httpOnly session cookie (12 hours). A key
shorter than 16 characters is treated as unconfigured and `/os` 404s.

## Reliability layer (added 2026-07-18)

- **Provider failover LIVE** in `PROV AI Generate`: Gemini → gemini-2.0-flash →
  OpenAI → caller fallback (website heuristic). Verified under real failure:
  a full AI roast served via OpenAI while Gemini quota was dead (source:brain,
  contextual Tirupati content). Gemini retries cut to 2×3s (was 4×5s) so a dead
  provider costs seconds, not half a minute. Claude slot ready — needs an
  Anthropic credential in n8n if wanted.
- **Cost short-circuit** in WEB-HEAD: thin roast input (no title/price/desc)
  returns needsGuided WITHOUT calling the AI — zero tokens wasted on bots or
  empty submissions.
- **Monitor & Founder Brief LIVE** (`YgrtjnICRnNLXVYB`): every 10 min probes
  WEB-HEAD + website, Telegram alert on state TRANSITIONS only (no spam; the
  not-yet-deployed website stays silent until first seen healthy). Daily 09:00
  IST action-first brief (verified delivered): website leads waiting w/ URLs,
  AI provider status, today's counts.
- **Stress tested:** 100 concurrent /api/health 100% ok (4.2s); 20 concurrent
  thin roasts 100% correct short-circuit (2.9s, zero AI cost); AI bursts degrade
  gracefully to instant heuristic when n8n/providers throttle. Roast timeout
  35s (theater holds the visitor; AI roast at 30s beats heuristic at 20s).

## Known issues / founder actions

1. **BOTH AI providers billing-constrained (OS-wide):** Gemini free tier is
   `limit: 0` (needs billing) and the OpenAI account rate-limits under modest
   use ("too many requests" = likely no credit). The failover + heuristic keep
   the product alive, but real AI roasts are intermittent until one provider
   gets billing. Fastest fix: enable Google AI billing OR add OpenAI credit.
2. **Test data cleanup:** delete CRM `Leads` rows with WhatsApp
   `+91 90000 00000` (Lead IDs `WEB-*`) and ignore matching Telegram tests.
3. **Optional:** set the OPS monitor workflow as the default *error workflow*
   in each workflow's settings (n8n UI-only) so hard failures also alert.

## Contract

The roast contract is retired with the feature (V2). The remaining live contract
is the lead event: `POST {type:"lead", whatsapp, email?, ref?, city?, source?}`
→ CRM row + Telegram notify. Phase 3 replaces this with the full Google Sheets
CRM schema (Timestamp, Name, Phone, Email, WhatsApp, City, Property Type,
Source, Service Interested, Lead Status, Notes).

`web-head-workflow.json` is the original pre-V2 import draft, kept for
reference; the live workflow is the source of truth.
