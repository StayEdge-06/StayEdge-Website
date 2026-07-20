"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { getMotionTier } from "@/lib/motion/tier";
import { cn } from "@/lib/utils";

/**
 * Tilt-to-Life Cards (Design System signature #19). Case/data cards tilt
 * subtly on the 18°-aware axis with a purple light sweep on hover — rotateY
 * range is roughly double rotateX, echoing the brand's horizontal shear
 * rather than a generic even tilt. Full motion tier only (desktop, fine
 * pointer): on touch/reduced-motion this is a meaningless hover effect, so
 * it renders as a plain passthrough wrapper at zero extra cost.
 */
export function TiltCard({
  children,
  className,
  maxTilt = 7,
  id,
  as: Tag = "div",
  active = true,
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  /** Forwarded to the outer wrapper — for anchor-scroll targets (`scroll-mt-*` cards). */
  id?: string;
  /** Outer wrapper element — preserve semantics (e.g. `article` for a case study). */
  as?: "div" | "article";
  /** Caller-level opt-out (e.g. a section reused on a denser page where tilt
   * would dilute rather than signature) — same plain-wrapper output as the
   * tier-gated disabled path, just forced regardless of motion tier. */
  active?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (reduce || !active) return;
    setEnabled(getMotionTier() === "full");
  }, [reduce, active]);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 20, mass: 0.4 });
  const sry = useSpring(ry, { stiffness: 200, damping: 20, mass: 0.4 });
  const mx = useMotionValue("50%");
  const my = useMotionValue("50%");
  const glow = useMotionValue(0);
  const sGlow = useSpring(glow, { stiffness: 150, damping: 22 });

  if (!enabled) {
    return (
      <Tag id={id} className={className}>
        {children}
      </Tag>
    );
  }

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width; // 0..1
    const py = (e.clientY - r.top) / r.height; // 0..1
    ry.set((px - 0.5) * maxTilt * 2);
    rx.set(-(py - 0.5) * maxTilt);
    mx.set(`${px * 100}%`);
    my.set(`${py * 100}%`);
  }
  function handleEnter() {
    glow.set(1);
  }
  function reset() {
    rx.set(0);
    ry.set(0);
    glow.set(0);
  }

  return (
    <Tag id={id} className={cn(className, "[perspective:900px]")}>
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseEnter={handleEnter}
        onMouseLeave={reset}
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
        className="relative h-full w-full [will-change:transform]"
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-[var(--se-radius-lg)]"
          style={{
            opacity: sGlow,
            background:
              "radial-gradient(circle at var(--tilt-x) var(--tilt-y), color-mix(in srgb, var(--se-lavender) 35%, transparent), transparent 60%)",
            // @ts-expect-error CSS custom properties accept motion values
            "--tilt-x": mx,
            "--tilt-y": my,
          }}
        />
        {children}
      </motion.div>
    </Tag>
  );
}
