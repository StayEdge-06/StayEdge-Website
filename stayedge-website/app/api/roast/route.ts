import { NextResponse } from "next/server";
import { z } from "zod";
import "@/lib/server/net";
import { analyzeListing, type RoastInput, type RoastResult } from "@/lib/ai/roast";

/**
 * The Roast HEAD endpoint — the website is a client of the CAP-001 Brain
 * (founder decision: one intelligence layer, always).
 *
 *   HEAD (this route) → CAP-001 Brain (n8n webhook) → TAIL
 *
 * Env (server-side only, never exposed to the client):
 *   N8N_ROAST_WEBHOOK_URL  — the n8n webhook that runs the Brain
 *   N8N_ROAST_TOKEN        — optional bearer token for that webhook
 *
 * Graceful degradation (approved rule): if the Brain is unconfigured, slow,
 * down, or returns an invalid shape, we fall back to the honest local
 * heuristic. The visitor NEVER sees a failure.
 */
const BRAIN_URL = process.env.N8N_ROAST_WEBHOOK_URL;
const BRAIN_TOKEN = process.env.N8N_ROAST_TOKEN;
// n8n cloud latency: ~2.5s warm, ~15s cold, + AI generation (can exceed 15s
// when the provider chain fails over). The thinking theater holds the visitor;
// an AI roast at 30s beats a heuristic at 20s.
const BRAIN_TIMEOUT_MS = 35_000;

const inputSchema = z.object({
  url: z.string().max(500).optional(),
  mode: z.enum(["roast", "diagnose", "growth"]),
  guided: z
    .object({
      title: z.string().max(300).optional(),
      price: z.number().min(0).max(10_000_000).optional(),
      weekendPricing: z.boolean().optional(),
      description: z.string().max(5_000).optional(),
      photoCount: z.number().min(0).max(500).optional(),
      city: z.string().max(120).optional(),
    })
    .optional(),
});

const findingSchema = z.object({
  tag: z.string().max(60),
  line: z.string().max(600),
  positive: z.boolean().optional(),
});

/** The Brain must speak the same contract as the local provider. */
const resultSchema = z.object({
  score: z.number().min(0).max(100).nullable(),
  benchmark: z.number(),
  issues: z.array(findingSchema).max(20),
  positive: findingSchema.nullable(),
  moreCount: z.number().min(0),
  confidence: z.enum(["high", "medium", "low"]),
  needsGuided: z.boolean(),
  note: z.string().max(400).optional(),
});

async function askBrain(input: RoastInput): Promise<RoastResult | null> {
  if (!BRAIN_URL) return null;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), BRAIN_TIMEOUT_MS);
    const res = await fetch(BRAIN_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(BRAIN_TOKEN ? { authorization: `Bearer ${BRAIN_TOKEN}` } : {}),
      },
      body: JSON.stringify(input),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const parsed = resultSchema.safeParse(await res.json());
    return parsed.success ? (parsed.data as RoastResult) : null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  let input: RoastInput;
  try {
    const parsed = inputSchema.safeParse(await req.json());
    if (!parsed.success) {
      // Invalid input still gets a helpful, guided response — never a raw 400 wall.
      return NextResponse.json(
        { ...analyzeListing({ mode: "roast" }), source: "heuristic" },
        { status: 200 },
      );
    }
    input = parsed.data as RoastInput;
  } catch {
    return NextResponse.json(
      { ...analyzeListing({ mode: "roast" }), source: "heuristic" },
      { status: 200 },
    );
  }

  const brain = await askBrain(input);
  if (brain) {
    // If the Brain punts (needsGuided — e.g. its AI provider is down) but the
    // visitor DID give us analysable input, the local heuristic serves better
    // than a "give me more" reply. Prefer whichever can actually roast.
    const hasInput = Boolean(input.guided?.title || input.guided?.price != null);
    if (!(brain.needsGuided && hasInput)) {
      return NextResponse.json({ ...brain, source: "brain" });
    }
  }

  return NextResponse.json({ ...analyzeListing(input), source: "heuristic" });
}
