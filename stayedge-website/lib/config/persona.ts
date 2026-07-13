/**
 * The StayEdge AI persona.
 *
 * NOTE (Design System decision D7): the permanent, brand-owned persona name is
 * being chosen by the founder from 25 proposals. Until then, `PERSONA.name` holds
 * an interim label. Swapping the final name is a ONE-LINE change here — every
 * surface reads from this config, never a hard-coded string. Do not use "Jarvis".
 */
export const PERSONA = {
  /** TODO: replace with the chosen name (D7). Interim placeholder only. */
  name: "StayEdge AI",
  /** Short, lowercase handle used in system/log contexts. */
  handle: "stayedge-ai",
  /** The three roast/analysis registers (UX Decision 2). */
  modes: [
    { id: "roast", label: "Roast Me", glyph: "🔥", tone: "funny, cheeky, memorable" },
    { id: "diagnose", label: "Diagnose Me", glyph: "🧠", tone: "professional, data-led" },
    { id: "growth", label: "Growth Me", glyph: "🚀", tone: "positive, opportunity-first" },
  ],
  defaultModeId: "roast",
} as const;

export type PersonaModeId = (typeof PERSONA.modes)[number]["id"];
