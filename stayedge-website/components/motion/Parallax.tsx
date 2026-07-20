"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getMotionTier } from "@/lib/motion/tier";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-linked depth primitives — the layered-parallax / perspective /
 * floating-card work the brief calls for, distinct from the 22 numbered
 * signatures. Full motion tier only: on rich/static tiers, both render
 * children with zero transform (the vestibular-safe, required path).
 */

/** Continuous scroll-linked vertical offset (transform/opacity only, scrubbed). */
export function Parallax({
  children,
  speed = 0.2,
  className,
}: {
  children: React.ReactNode;
  /** Fraction of the element's own travel distance to offset by. Positive = drifts up as you scroll past it. */
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || getMotionTier() !== "full") return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: () => -el.offsetHeight * speed,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, el);
    return () => ctx.revert();
  }, [speed]);

  return (
    <div ref={ref} className={cn("[will-change:transform]", className)}>
      {children}
    </div>
  );
}

/** One-shot depth entrance (scale + rise) for floating cards, not a continuous scrub. */
export function DepthLayer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || getMotionTier() !== "full") return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scale: 0.94, y: 30, opacity: 0.6 },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={cn("[will-change:transform,opacity]", className)}>
      {children}
    </div>
  );
}

/**
 * Call after any client-side layout shift that could desync an active
 * ScrollTrigger's start/end offsets (e.g. Showcase's card-height swap).
 */
export function refreshScrollTriggers() {
  ScrollTrigger.refresh();
}
