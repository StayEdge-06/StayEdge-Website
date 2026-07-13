"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * AI-presence field for the hero (Design System §26/§27). Renders the 3D diamond
 * on capable devices; degrades to a static SVG diamond + ambient light on weak
 * devices, data-saver, or reduced-motion. The scene is lazy-loaded (ssr:false)
 * so it never blocks first interaction / LCP, and its render loop pauses when the
 * hero scrolls off-screen (perf budget §29). Append ?static to force the fallback.
 */
const DiamondScene = dynamic(() => import("./DiamondScene"), { ssr: false });

export function AIPresence({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [enable3D, setEnable3D] = useState(false);
  const [visible, setVisible] = useState(true);
  const [forceStatic, setForceStatic] = useState(false);

  useEffect(() => {
    // Escape hatches for the static fallback: build-time flag (low-power hosts /
    // headless preview environments) or a ?static URL override.
    if (
      process.env.NEXT_PUBLIC_DISABLE_3D === "1" ||
      new URLSearchParams(window.location.search).has("static")
    ) {
      setForceStatic(true);
      return;
    }
    if (reduce) return;
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    const weakCPU = (nav.hardwareConcurrency ?? 8) < 4;
    const weakMem = (nav.deviceMemory ?? 8) < 4;
    const saveData = nav.connection?.saveData ?? false;
    if (!weakCPU && !weakMem && !saveData) setEnable3D(true);
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

  const show3D = enable3D && !forceStatic;

  return (
    <div ref={ref} className={className} aria-hidden>
      {/* Ambient purple light — animated drift unless reduced-motion */}
      <div className="se-ambient-blob" />
      <div className="absolute inset-0 grid place-items-center">
        {show3D ? (
          <div className="h-[300px] w-[300px] opacity-70 md:h-[400px] md:w-[400px]">
            <DiamondScene active={visible} />
          </div>
        ) : (
          <StaticDiamond />
        )}
      </div>
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
