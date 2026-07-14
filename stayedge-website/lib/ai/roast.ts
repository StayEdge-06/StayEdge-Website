/**
 * Roast provider — the seam where the real AI brain plugs in later (Claude API
 * or the StayEdge n8n backend). Today it runs an HONEST heuristic: it only makes
 * claims it can verify from what the visitor actually gives us, reports its own
 * confidence, and asks for guided input rather than inventing facts. It never
 * fabricates a specific claim about a real listing (brand law).
 */
import type { PersonaModeId } from "@/lib/config/persona";

export type GuidedInput = {
  title?: string;
  /** nightly price in INR */
  price?: number;
  weekendPricing?: boolean;
  description?: string;
  photoCount?: number;
  city?: string;
};

export type RoastInput = {
  url?: string;
  guided?: GuidedInput;
  mode: PersonaModeId;
};

export type RoastFinding = {
  tag: string;
  line: string;
  /** true = a strength, false = an issue */
  positive?: boolean;
};

export type RoastResult = {
  /** null when we need guided input before we can say anything honest */
  score: number | null;
  /** target a strong listing reaches — a standard, not a fabricated local average */
  benchmark: number;
  issues: RoastFinding[];
  positive: RoastFinding | null;
  moreCount: number;
  confidence: "high" | "medium" | "low";
  /** when true, the UI must collect guided input before showing a roast */
  needsGuided: boolean;
  note?: string;
};

const BENCHMARK = 85;

/** Detect whether a title carries a location/landmark cue (verifiable). */
function hasLocationCue(title: string) {
  return /\b(near|walk|min|beach|lake|temple|city|centre|center|station|airport|hills?|view)\b/i.test(
    title,
  );
}
function hasHook(title: string) {
  return /\b(sunlit|cosy|cozy|spacious|private|luxury|boutique|quiet|modern|scenic|rooftop|pool|garden)\b/i.test(
    title,
  );
}

/** Mode-toned phrasing for the same verified finding. */
function phrase(mode: PersonaModeId, roast: string, diagnose: string, growth: string) {
  return mode === "roast" ? roast : mode === "diagnose" ? diagnose : growth;
}

export function analyzeListing(input: RoastInput): RoastResult {
  const g = input.guided;
  const mode = input.mode;

  // Guided-input-first: with no details we don't invent — we ask.
  if (!g || (!g.title && g.price == null && !g.description)) {
    return {
      score: null,
      benchmark: BENCHMARK,
      issues: [],
      positive: null,
      moreCount: 0,
      confidence: "low",
      needsGuided: true,
      note: "Give me a little to work with and I'll be specific — not generic.",
    };
  }

  const issues: RoastFinding[] = [];
  const strengths: RoastFinding[] = [];
  let score = 100;

  // --- Title checks (verifiable from the text) ---
  if (g.title) {
    const t = g.title.trim();
    if (t.length < 30) {
      score -= 16;
      issues.push({
        tag: "Title",
        line: phrase(
          mode,
          `Your title is ${t.length} characters of "meh". Guests skim dozens of these — give them a reason to stop.`,
          `Your title is short (${t.length} chars) and light on searchable detail, which limits click-through.`,
          `A richer title is your fastest win — more reasons to click, more searches you show up in.`,
        ),
      });
    }
    if (!hasLocationCue(t)) {
      score -= 12;
      issues.push({
        tag: "Search terms",
        line: phrase(
          mode,
          `No landmark, no distance, no "near" anything. The algorithm can't place you and neither can the guest.`,
          `The title lacks location cues guests search for, which weakens discovery.`,
          `Add what you're near — it's how a lot of guests find and choose a stay.`,
        ),
      });
    } else {
      strengths.push({ tag: "Location", line: "Your title points at where you are — guests search exactly that.", positive: true });
    }
    if (hasHook(t)) {
      strengths.push({ tag: "Hook", line: "There's a hook in your title doing real work. Good.", positive: true });
    }
  } else {
    score -= 10;
  }

  // --- Pricing checks ---
  if (g.price != null && g.weekendPricing === false) {
    score -= 14;
    issues.push({
      tag: "Pricing",
      line: phrase(
        mode,
        `One flat price, seven days a week? Your weekends are basically on sale and your Tuesdays are overpriced.`,
        `A single flat rate leaves weekend demand uncaptured and can deter mid-week bookings.`,
        `Price the week: lift weekends, ease mid-week, and watch both occupancy and ADR move.`,
      ),
    });
  } else if (g.price != null && g.weekendPricing) {
    strengths.push({ tag: "Pricing", line: "You already flex weekend vs weekday pricing — most hosts don't.", positive: true });
  }

  // --- Description check ---
  if (g.description != null && g.description.trim().length < 120) {
    score -= 10;
    issues.push({
      tag: "Description",
      line: phrase(
        mode,
        `Your description could fit on a napkin. Guests booking a stay want to picture themselves in it.`,
        `The description is brief; it under-sells the experience and misses booking-driving detail.`,
        `A fuller description helps guests say yes — paint the stay, not just the specs.`,
      ),
    });
  }

  // --- Photos ---
  if (g.photoCount != null && g.photoCount < 8) {
    score -= 12;
    issues.push({
      tag: "Photos",
      line: phrase(
        mode,
        `${g.photoCount} photos. Guests want to snoop — give them the full tour or they'll book the host who did.`,
        `Only ${g.photoCount} photos; listings with fuller galleries convert notably better.`,
        `More photos, better order — it's one of the biggest levers on click-through.`,
      ),
    });
  }

  score = Math.max(20, Math.min(98, Math.round(score)));

  // The mandatory "hope" beat — always a genuine strength.
  const positive: RoastFinding =
    strengths[0] ??
    { tag: "Foundation", line: "You've done the hard part — you're live. Now we make it perform.", positive: true };

  // Return ALL verified issues; the UI shows the first 3 free and reveals the
  // rest on unlock. moreCount is the REAL number held back — never padded.
  const moreCount = Math.max(0, issues.length - 3);

  const confidence: RoastResult["confidence"] =
    g.title && g.price != null && g.description ? "high" : g.title || g.price != null ? "medium" : "low";

  return {
    score,
    benchmark: BENCHMARK,
    issues,
    positive,
    moreCount,
    confidence,
    needsGuided: false,
    note:
      confidence === "high"
        ? undefined
        : "Based on what you shared so far — add more for a sharper read.",
  };
}
