"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { getMotionTier } from "@/lib/motion/tier";

/**
 * AI-presence field for the hero (flagship tiering):
 *   full  — full-bleed particle constellation + 3D diamond, cursor-reactive
 *   rich  — 3D diamond + light particle field (capable phones/tablets)
 *   static— lit SVG diamond, zero WebGL (weak devices, data-saver, reduced-motion)
 * Lazy-loaded (ssr:false), never blocks first interaction; render loop pauses
 * off-screen (perf budget §29). ?static forces the fallback.
 */
const DiamondScene = dynamic(() => import("./DiamondScene"), { ssr: false });

export function AIPresence({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"none" | "full" | "rich">("none");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DISABLE_3D === "1") return;
    if (reduce) return;
    const tier = getMotionTier();
    if (tier === "static") return;
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    const weakCPU = (nav.hardwareConcurrency ?? 8) < 4;
    const weakMem = (nav.deviceMemory ?? 8) < 4;
    const saveData = nav.connection?.saveData ?? false;
    if (weakCPU || weakMem || saveData) return;
    setMode(tier === "full" ? "full" : "rich");
  }, [reduce]);

  // Pause the render loop when the hero is out of view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.01,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} aria-hidden>
      <div className="se-ambient-blob" />
      {mode === "none" ? (
        <div className="absolute inset-0 grid place-items-center">
          <StaticDiamond />
        </div>
      ) : mode === "full" ? (
        // Full-bleed constellation — the whole hero is the scene
        <div className="absolute inset-0 opacity-80">
          <DiamondScene active={visible} particles={1100} />
        </div>
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <div className="h-[300px] w-full max-w-[420px] opacity-70">
            <DiamondScene active={visible} particles={250} />
          </div>
        </div>
      )}
    </div>
  );
}

/** Static, dependency-free fallback: a lit lavender diamond. */
function StaticDiamond() {
  return (
    <svg
      width={190}
      height={190}
      viewBox="0 0 200 200"
      className="opacity-45"
      style={{ filter: "drop-shadow(0 0 40px color-mix(in srgb, var(--se-purple) 55%, transparent))" }}
    >
      <defs>
        <linearGradient id="se-gem" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--se-lavender)" />
          <stop offset="100%" stopColor="var(--se-purple)" />
        </linearGradient>
      </defs>
      <rect
        x="100"
        y="40"
        width="84.85"
        height="84.85"
        rx="8"
        transform="rotate(45 100 40)"
        fill="url(#se-gem)"
      />
    </svg>
  );
}
