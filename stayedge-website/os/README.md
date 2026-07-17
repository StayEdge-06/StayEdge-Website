# StayEdge OS — Website integration (WEB-HEAD)

**Status: LIVE** (2026-07-17). The website is a HEAD of StayEdge OS. One workflow
gateway, four event types, zero duplicated intelligence — AI runs only through
`StayEdge PROV - AI Generate`.

- Workflow: **StayEdge WEB-HEAD - Website Gateway** (`AfUSUys3rNeClHzF`), published.
  https://stayedge.app.n8n.cloud/workflow/AfUSUys3rNeClHzF
- Production webhook: `https://stayedge.app.n8n.cloud/webhook/stayedge-web-head`
- Auth: bearer token (value inside the workflow's *Route Input* node; the website
  sets the same value as `N8N_ROAST_TOKEN`).

```
Website /api/roast ──{mode,url,guided}──▶ WEB-HEAD ─▶ PROV AI Generate ─▶ roast JSON (sync)
Website /api/lead  ──{type:"lead",…}────▶ WEB-HEAD ─▶ respond ─▶ CRM Leads append
                                                       └▶ Telegram founder notify
                                                          (approve = paste URL into CAP-001)
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
N8N_ROAST_WEBHOOK_URL=https://stayedge.app.n8n.cloud/webhook/stayedge-web-head
N8N_LEAD_WEBHOOK_URL=https://stayedge.app.n8n.cloud/webhook/stayedge-web-head
N8N_METRICS_WEBHOOK_URL=https://stayedge.app.n8n.cloud/webhook/stayedge-web-head
N8N_ROAST_TOKEN=<the token in Route Input>
OS_DASHBOARD_KEY=<choose a private key for /os>
```

## Known issues / founder actions

1. **AI provider quota (OS-wide):** the Gemini key's free tier reports
   `limit: 0` — PROV AI Generate currently fails for ALL workflows (incl.
   CAP-001 snapshots). Fix either by enabling billing on the Google AI key or
   switching PROV's Config node to `provider: openai` (existing credential,
   pay-per-use). Until then the website roast uses its honest local heuristic
   automatically.
2. **Test data cleanup:** delete CRM `Leads` rows with WhatsApp
   `+91 90000 00000` (Lead IDs `WEB-*`, e2e test) and ignore the matching
   Telegram test notifications.
3. **Monitoring (next build step):** n8n Schedule (5 min) → GET
   `https://<site>/api/health` + Error Trigger workflow → Telegram alert.

## Contract

The roast response must match `app/api/roast/route.ts` → `resultSchema`. The
gateway's *Map To Contract* node clamps model output into it; anything invalid
degrades to `needsGuided:true`. Honesty laws live in the *Build Roast Prompt*
node: no invented facts, confidence always reported, thin input → needsGuided.

`web-head-workflow.json` is the original import draft, kept for reference; the
live workflow is the source of truth.
