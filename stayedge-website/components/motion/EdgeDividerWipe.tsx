"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getMotionTier } from "@/lib/motion/tier";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type Ground = "base" | "deep" | "light";

const GROUND_BG: Record<Ground, string> = {
  base: "bg-se-ground",
  deep: "bg-se-ground-2",
  light: "bg-se-offwhite",
};

/**
 * Edge Divider Wipe (Design System signature #18). Section-to-section
 * transitions wipe along the brand's 18° edge instead of just cutting. A
 * short (h-16), NOT pinned, scroll-scrubbed sweep — deliberately bounded
 * height so the skewX() shear stays a tasteful diagonal wipe rather than the
 * unbounded-height bug already fixed in .se-edge-strip (skew displacement
 * scales with element height, so this must stay short by design).
 */
export function EdgeDividerWipe({
  from = "base",
  to = "deep",
  className,
}: {
  from?: Ground;
  to?: Ground;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const wipe = wipeRef.current;
    if (!wrap || !wipe || getMotionTier() !== "full") return;
    setAnimated(true);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        wipe,
        { xPercent: -130 },
        {
          xPercent: 30,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top 90%",
            end: "bottom 10%",
            scrub: true,
          },
        },
      );
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={cn("relative h-16 overflow-hidden", GROUND_BG[from], className)}
    >
      <div
        ref={wipeRef}
        className={cn(
          "absolute inset-y-0 left-0 w-[150%] origin-left",
          GROUND_BG[to],
          // Static/rich tiers: no scrub, just show the destination ground —
          // still transitions the two sections, minus the sweep theatrics.
          !animated && "translate-x-0",
        )}
        style={
          animated
            ? { transform: "skewX(calc(-1 * var(--se-edge-angle))) translateX(-130%)" }
            : undefined
        }
      />
    </div>
  );
}
