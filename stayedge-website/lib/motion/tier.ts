"use client";

/**
 * Motion tiering (founder decision: full on desktop, rich-but-lighter mobile).
 *   full    — desktop, fine pointer, no reduced-motion: pins, particles, spotlight
 *   rich    — touch/mobile capable devices: reveals, counters, ambient light
 *   static  — reduced-motion or forced static: everything readable, no motion
 */
export type MotionTier = "full" | "rich" | "static";

export function getMotionTier(): MotionTier {
  if (typeof window === "undefined") return "static";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "static";
  if (new URLSearchParams(window.location.search).has("static")) return "static";
  const desktop =
    window.matchMedia("(min-width: 1024px)").matches &&
    window.matchMedia("(pointer: fine)").matches;
  return desktop ? "full" : "rich";
}
