"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { RisingEdgeBars } from "@/components/brand/RisingEdgeBars";

/**
 * The thinking theater — honest staged analysis (Experience Bible §6.2). Each
 * stage maps to a real step the roast performs, so the wait itself teaches the
 * method. Announced to screen readers; faster under reduced-motion.
 */
const STAGES = [
  "Reading your listing",
  "Checking your title and search terms",
  "Looking at how you price the week",
  "Reading the guest's first impression",
  "Finding your quick wins",
];

export function ThinkingTheater({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    const per = reduce ? 220 : 680;
    if (i >= STAGES.length) {
      const t = setTimeout(onDone, 250);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setI((v) => v + 1), per);
    return () => clearTimeout(t);
  }, [i, reduce, onDone]);

  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="flex justify-center">
        <RisingEdgeBars size={46} playing />
      </div>
      <div aria-live="polite" className="mt-8 space-y-2">
        {STAGES.slice(0, i).map((s, idx) => (
          <p
            key={s}
            className={idx === i - 1 ? "text-se-offwhite" : "text-se-grey-lavender/50"}
          >
            {s}…
          </p>
        ))}
      </div>
    </div>
  );
}
