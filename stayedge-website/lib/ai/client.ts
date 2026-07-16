import { analyzeListing, type RoastInput, type RoastResult } from "@/lib/ai/roast";

/**
 * Client-side roast request. Prefers the HEAD endpoint (which consults the
 * CAP-001 Brain when configured); falls back to the local heuristic on any
 * network problem, so the experience never fails in public.
 */
export type RoastResponse = RoastResult & { source?: "brain" | "heuristic" };

export async function requestRoast(input: RoastInput): Promise<RoastResponse> {
  try {
    const res = await fetch("/api/roast", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    });
    if (res.ok) return (await res.json()) as RoastResponse;
  } catch {
    /* offline / blocked — degrade below */
  }
  return { ...analyzeListing(input), source: "heuristic" };
}
