import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Lead HEAD endpoint — forwards unlock leads into StayEdge OS (n8n), which owns
 * CRM append + Telegram founder notify + the approval → WhatsApp pipeline.
 * The website never duplicates that intelligence; it only delivers the event.
 *
 * Env: N8N_LEAD_WEBHOOK_URL (+ optional N8N_ROAST_TOKEN reused as bearer).
 * Unconfigured/unreachable = graceful no-op (the client also stores the lead
 * on-device, so nothing is lost while the OS side is being wired).
 */
const LEAD_URL = process.env.N8N_LEAD_WEBHOOK_URL;
const TOKEN = process.env.N8N_ROAST_TOKEN;

const leadSchema = z.object({
  whatsapp: z.string().min(5).max(30),
  email: z.string().email().max(200).optional().or(z.literal("")),
  ref: z.string().max(500).optional(),
  score: z.number().min(0).max(100).optional(),
  city: z.string().max(120).optional(),
  source: z.string().max(60).optional(),
});

export async function POST(req: Request) {
  let forwarded = false;
  try {
    const parsed = leadSchema.safeParse(await req.json());
    if (parsed.success && LEAD_URL) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 6_000);
      const res = await fetch(LEAD_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(TOKEN ? { authorization: `Bearer ${TOKEN}` } : {}),
        },
        body: JSON.stringify({ type: "lead", ...parsed.data, ts: Date.now() }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      forwarded = res.ok;
    }
  } catch {
    /* never block the visitor on delivery problems */
  }
  return NextResponse.json({ ok: true, forwarded });
}
