# StayEdge OS — Website integration (WEB-HEAD)

The website is a HEAD of StayEdge OS. One workflow gateway, four event types,
zero duplicated intelligence (AI runs only through `StayEdge PROV - AI Generate`).

```
Website /api/roast ──POST {url, guided, mode}──▶ WEB-HEAD ─▶ PROV AI Generate ─▶ roast JSON (sync)
Website /api/lead  ──POST {type:"lead", …}────▶ WEB-HEAD ─▶ CRM append ─▶ Telegram founder notify
                                                             └─ founder pastes URL into CAP-001
                                                                (approval → Snapshot → WhatsApp)
Website /api/os/status ─{type:"metrics"}──────▶ WEB-HEAD ─▶ CRM aggregation (stub → wire)
n8n monitor ─────GET /api/health──────────────▶ website self-check
```

## Install (one time, ~10 minutes)

1. n8n → Workflows → **Import from file** → `web-head-workflow.json`.
2. Open **Ask PROV AI Generate** — re-select the sub-workflow from the list
   (import may need the picker refreshed).
3. Open **CRM Append** — set the Google Sheets credential (same as CAP-001) and
   pick the CRM spreadsheet + a `Website Leads` tab with columns:
   `Timestamp | WhatsApp | Email | Listing | RoastScore | Source | Status`.
4. Open **Telegram Founder Notify** — set the Telegram credential (same as
   CAP-000/CAP-001) and the founder chat id.
5. (Recommended) Pick a bearer token, put it in **Route Input**'s `EXPECTED`
   const AND in the website env `N8N_ROAST_TOKEN`.
6. **Publish**, copy the production webhook URL, then set on the website:
   - `N8N_ROAST_WEBHOOK_URL=<url>`
   - `N8N_LEAD_WEBHOOK_URL=<url>` (same gateway)
   - `N8N_METRICS_WEBHOOK_URL=<url>` (same gateway; stub until step 7)
7. Later: replace the metrics stub with a Sheets-read + aggregate branch to
   light up the `/os` dashboard numbers.

## Contracts

- **Roast response** must match the website's zod schema (see
  `app/api/roast/route.ts` → `resultSchema`). The gateway's *Map To Contract*
  node clamps model output into it; anything invalid degrades to
  `needsGuided:true` and the website falls back to its local heuristic —
  the visitor never sees an error.
- **Honesty laws** are embedded in the prompt: no invented facts, confidence
  always reported, thin input → `needsGuided`.

## Monitoring (next)

Add to the OS: an n8n Schedule (every 5 min) → GET `https://<site>/api/health`
+ n8n Error Trigger workflow → Telegram alert. Covers: website down, workflow
failure, provider failure (PROV already reports `ok:false`).
