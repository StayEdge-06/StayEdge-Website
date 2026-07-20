/**
 * Haptic Milestones (Design System signature #22). Marks the three brand
 * milestones — score reveal, unlock, CTA press — with a felt beat on mobile.
 * Silently a no-op wherever the Vibration API is unsupported (desktop,
 * iOS Safari) — no feature detection needed beyond the optional chain.
 */
export function fireHaptic(pattern: number | number[] = 12) {
  if (typeof navigator === "undefined") return;
  navigator.vibrate?.(pattern);
}
