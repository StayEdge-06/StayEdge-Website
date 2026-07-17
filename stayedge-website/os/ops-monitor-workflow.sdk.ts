// StayEdge OPS - Monitor & Founder Brief (n8n Workflow SDK source)
// Deploy via n8n MCP: validate_workflow -> create_workflow_from_code -> publish.
// Kept in-repo as the source of truth for the ops workflow.
//
// Branch A (every 10 min): probe WEB-HEAD + website; Telegram alert ONLY on
// state transitions (OK->FAIL / FAIL->OK); never-seen-healthy stays silent so
// the not-yet-deployed website doesn't spam.
// Branch B (daily 09:00 IST): action-first founder brief - website leads
// waiting (with numbers/URLs), AI provider status via tiny PROV probe,
// today's counts. "Tell me what to do", not a dashboard.

import { workflow, node, trigger, expr } from "@n8n/workflow-sdk";

const every10min = trigger({
  type: "n8n-nodes-base.scheduleTrigger",
  version: 1.3,
  config: { name: "Every 10 Min", parameters: { rule: { interval: [{ field: "minutes", minutesInterval: 10 }] } } },
});

const probeWebHead = node({
  type: "n8n-nodes-base.httpRequest",
  version: 4.4,
  config: {
    name: "Probe WEB-HEAD",
    parameters: {
      method: "POST",
      url: "https://stayedge.app.n8n.cloud/webhook/stayedge-web-head",
      sendHeaders: true,
      headerParameters: { parameters: [{ name: "authorization", value: "Bearer se-web-head-7k2m9x4q" }, { name: "content-type", value: "application/json" }] },
      sendBody: true,
      specifyBody: "json",
      jsonBody: '{"type":"health"}',
      options: { response: { response: { neverError: true } }, timeout: 20000 },
    },
  },
});

const probeWebsite = node({
  type: "n8n-nodes-base.httpRequest",
  version: 4.4,
  config: {
    name: "Probe Website",
    parameters: {
      method: "GET",
      url: "https://stayedge.co.in/api/health",
      options: { response: { response: { neverError: true } }, timeout: 15000 },
    },
  },
});

const compareState = node({
  type: "n8n-nodes-base.code",
  version: 2,
  config: {
    name: "Compare State",
    parameters: {
      jsCode:
        "// Alert only on state TRANSITIONS, remembered in workflow static data.\nconst webhead = $('Probe WEB-HEAD').first().json;\nconst site = $('Probe Website').first().json;\nconst now = { webhead: webhead && webhead.ok === true, website: site && site.ok === true };\nconst store = $getWorkflowStaticData('global');\nstore.seen = store.seen || {};\nstore.state = store.state || {};\nconst alerts = [];\nfor (const key of Object.keys(now)) {\n  const healthy = now[key];\n  const label = key === 'webhead' ? 'WEB-HEAD gateway (n8n)' : 'Website (stayedge.co.in)';\n  if (healthy) {\n    if (store.seen[key] && store.state[key] === false) alerts.push('\\u2705 RECOVERED: ' + label + ' is healthy again.');\n    store.seen[key] = true;\n    store.state[key] = true;\n  } else {\n    if (store.seen[key] && store.state[key] === true) alerts.push('\\ud83d\\udea8 DOWN: ' + label + ' failed its health check. Executions and leads may be affected.');\n    if (store.seen[key]) store.state[key] = false;\n  }\n}\nif (!alerts.length) return [];\nreturn [{ json: { text: alerts.join('\\n') } }];",
    },
  },
});

const sendAlert = node({
  type: "n8n-nodes-base.telegram",
  version: 1.2,
  config: {
    name: "Send Alert",
    parameters: { resource: "message", operation: "sendMessage", chatId: "8251602470", text: expr("{{ $json.text }}"), additionalFields: { appendAttribution: false } },
    credentials: { telegramApi: { id: "SqacsaD1QAo9OjsA", name: "Telegram account" } },
  },
});

const daily9amIST = trigger({
  type: "n8n-nodes-base.scheduleTrigger",
  version: 1.3,
  config: { name: "Daily 9am IST", parameters: { rule: { interval: [{ field: "cronExpression", expression: "0 30 3 * * *" }] } } },
});

const readLeadsBrief = node({
  type: "n8n-nodes-base.googleSheets",
  version: 4.7,
  config: {
    name: "Read Leads For Brief",
    executeOnce: true,
    onError: "continueRegularOutput",
    alwaysOutputData: true,
    parameters: {
      documentId: { __rl: true, value: "1NQ0gu3RXrm3d4AJULGG9kDNk3-spcOy0fuCgLfEOefg", mode: "list", cachedResultName: "StayEdge CRM" },
      sheetName: { __rl: true, mode: "name", value: "Leads", cachedResultName: "Leads" },
      options: {},
    },
    credentials: { googleSheetsOAuth2Api: { id: "pzG3Yobrz1UIDESX", name: "Google Sheets account" } },
  },
});

const probeAI = node({
  type: "n8n-nodes-base.executeWorkflow",
  version: 1.2,
  config: {
    name: "Probe AI Provider",
    executeOnce: true,
    onError: "continueRegularOutput",
    parameters: {
      workflowId: { __rl: true, value: "O0ZJhZx7hadVkBwS", mode: "list", cachedResultName: "StayEdge PROV - AI Generate" },
      workflowInputs: {
        mappingMode: "defineBelow",
        value: { instructions: "Reply with the exact JSON only.", content: "ping", schemaExample: '{"pong": true}' },
        matchingColumns: [],
        schema: [],
      },
      options: { waitForSubWorkflow: true },
    },
  },
});

const composeBrief = node({
  type: "n8n-nodes-base.code",
  version: 2,
  config: {
    name: "Compose Brief",
    parameters: {
      jsCode:
        "// Action-first founder brief: what to DO, not a dashboard.\nconst rows = $('Read Leads For Brief').all().map(i => i.json).filter(r => r && r['Lead ID']);\nlet ai = { ok: false, provider: 'unknown', error: 'probe failed' };\ntry { ai = $('Probe AI Provider').first().json; } catch (e) {}\nconst today = new Date().toISOString().slice(0, 10);\nconst isToday = (r) => String(r['Date Found'] || '').slice(0, 10) === today;\nconst webNew = rows.filter(r => String(r['Lead Source'] || '').toLowerCase() === 'website' && String(r['Status'] || 'NEW').toUpperCase() === 'NEW');\nconst actions = [];\nif (webNew.length) {\n  actions.push('\\u2022 ' + webNew.length + ' website lead' + (webNew.length === 1 ? '' : 's') + ' waiting for approval. Paste ' + (webNew.length === 1 ? 'the Airbnb URL' : 'their Airbnb URLs') + ' into CAP-001 to run outreach.');\n  for (const r of webNew.slice(0, 5)) {\n    actions.push('   \\u2192 ' + (r['WhatsApp Number'] || 'no number') + ' \\u00b7 ' + (r['Airbnb URL'] || 'no URL'));\n  }\n}\nif (!ai.ok) {\n  actions.push('\\u2022 AI providers are down (' + String(ai.error || 'unknown').slice(0, 120) + '). Roasts are running on the fallback. Fix Gemini billing or OpenAI credit when you can.');\n}\nif (!actions.length) actions.push('\\u2022 Nothing is waiting on you. The machine is running clean.');\nconst text = '\\u2600\\ufe0f Morning boss \\u2014 StayEdge ops brief\\n\\n' + actions.join('\\n') + '\\n\\nToday so far: ' + rows.filter(isToday).length + ' new lead(s) \\u00b7 ' + rows.length + ' total in CRM.';\nreturn [{ json: { text } }];",
    },
  },
});

const sendBrief = node({
  type: "n8n-nodes-base.telegram",
  version: 1.2,
  config: {
    name: "Send Brief",
    parameters: { resource: "message", operation: "sendMessage", chatId: "8251602470", text: expr("{{ $json.text }}"), additionalFields: { appendAttribution: false } },
    credentials: { telegramApi: { id: "SqacsaD1QAo9OjsA", name: "Telegram account" } },
  },
});

export default workflow("stayedge-ops-monitor", "StayEdge OPS - Monitor & Founder Brief")
  .add(every10min)
  .to(probeWebHead)
  .to(probeWebsite)
  .to(compareState)
  .to(sendAlert)
  .add(daily9amIST)
  .to(readLeadsBrief)
  .to(probeAI)
  .to(composeBrief)
  .to(sendBrief);
