"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * The Lavender Diamond — the atomic unit of AI presence (Design System §15).
 * A lightweight 2D SVG marker (used where a full 3D scene is overkill: nav,
 * inline Jarvis, buttons). States: idle (breathe), thinking (pulse), insight
 * (spark). Built from the brand's diamond accent; purple/lavender only.
 */
type DiamondState = "idle" | "thinking" | "insight";

export function Diamond({
  size = 22,
  state = "idle",
  className,
}: {
  size?: number;
  state?: DiamondState;
  className?: string;
}) {
  const reduce = useReducedMotion();

  const animate =
    reduce || state === "idle"
      ? { scale: 1, opacity: 1 }
      : state === "thinking"
        ? { scale: [1, 1.15, 1], opacity: [0.85, 1, 0.85] }
        : { scale: [1, 1.35, 1], opacity: [1, 1, 1] };

  const transition =
    reduce || state === "idle"
      ? undefined
      : state === "thinking"
        ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" as const }
        : { duration: 0.5, ease: "easeOut" as const };

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      animate={animate}
      transition={transition}
      style={{ filter: "drop-shadow(0 0 6px color-mix(in srgb, var(--se-lavender) 60%, transparent))" }}
    >
      {/* Diamond (rotated square) — brand lavender accent */}
      <rect
        x="12"
        y="2"
        width="14.14"
        height="14.14"
        rx="2"
        transform="rotate(45 12 2)"
        fill="var(--se-lavender)"
      />
    </motion.svg>
  );
}
