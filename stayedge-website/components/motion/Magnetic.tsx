"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Magnetic hover (signature #12). The element is gently pulled toward the cursor
 * with a spring, clamped so it never leaves its hit box, and casts a soft purple
 * light on approach (closer cursor = brighter, capped + blurred, never neon).
 * Pointer-only (mousemove doesn't fire on touch) and disabled under
 * reduced-motion. Use on 1–2 focal elements per screen max — beyond that it
 * reads as noise.
 */
export function Magnetic({
  children,
  className,
  strength = 0.3,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 160, damping: 15, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 160, damping: 15, mass: 0.3 });
  // Nearer the pointer (small |x|,|y|) -> stronger glow. Distances beyond
  // ~60px (pre-`strength` scaling) fade the glow to 0.
  const dist = useTransform([x, y], ([lx, ly]: number[]) => Math.hypot(lx, ly));
  const glow = useSpring(useTransform(dist, [0, 60 * strength], [0.5, 0]), {
    stiffness: 150,
    damping: 22,
  });

  if (reduce) return <span className={cn("inline-block", className)}>{children}</span>;

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={cn("relative inline-block [will-change:transform]", className)}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-3 -z-10 rounded-[inherit] blur-md"
        style={{
          opacity: glow,
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--se-lavender) 55%, transparent), transparent 70%)",
        }}
      />
      {children}
    </motion.div>
  );
}
