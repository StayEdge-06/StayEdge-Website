"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * The Rising Edge bars (signature #2) — the logo's three ascending bars
 * (ratio 11:17:23, sheared 18°) animated as StayEdge's loading / "thinking"
 * motif instead of a generic spinner. Short bar = lavender, mid/tall = purple
 * (exact iconColors from the brand tokens). Static under reduced-motion or when
 * not playing.
 */
const BARS = [
  { h: 11, fill: "var(--se-lavender)" },
  { h: 17, fill: "var(--se-purple)" },
  { h: 23, fill: "var(--se-purple)" },
];
const W = 6;
const GAP = 4;
const MAX_H = 23;
const TOTAL_W = BARS.length * W + (BARS.length - 1) * GAP;

export function RisingEdgeBars({
  size = 30,
  playing = true,
  className,
}: {
  size?: number;
  playing?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const animated = playing && !reduce;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`-8 0 ${TOTAL_W + 8} ${MAX_H}`}
      className={className}
      role="img"
      aria-label="Analysing"
    >
      {/* 18° shear — the brand's signature axis */}
      <g transform="skewX(-18)">
        {BARS.map((bar, i) => (
          <motion.rect
            key={i}
            x={i * (W + GAP)}
            y={MAX_H - bar.h}
            width={W}
            height={bar.h}
            rx={1.5}
            fill={bar.fill}
            style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
            initial={{ scaleY: animated ? 0.35 : 1 }}
            animate={animated ? { scaleY: [0.35, 1, 0.35] } : { scaleY: 1 }}
            transition={
              animated
                ? { duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: i * 0.14 }
                : undefined
            }
          />
        ))}
      </g>
    </svg>
  );
}
