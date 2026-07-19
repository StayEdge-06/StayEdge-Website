"use client";

import { useEffect, useRef, useState } from "react";
import { getMotionTier } from "@/lib/motion/tier";

/**
 * Purple Light Follow (Design System signature #17): a soft purple spotlight
 * tracks the cursor across dark sections, guiding the eye. Desktop-only
 * ("full" tier); pure transform on a fixed element — compositor-cheap.
 */
export function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (getMotionTier() !== "full") return;
    setEnabled(true);
    let raf = 0;
    let tx = -600, ty = -600, x = tx, y = ty;
    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const tick = () => {
      // gentle lag makes the light feel physical
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      if (ref.current) ref.current.style.transform = `translate3d(${x - 300}px, ${y - 300}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[5] h-[600px] w-[600px] rounded-full opacity-[0.14] blur-[80px] [will-change:transform]"
      style={{ background: "radial-gradient(closest-side, var(--se-purple), transparent 70%)" }}
    />
  );
}
