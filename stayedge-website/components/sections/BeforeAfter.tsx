"use client";

import { useState } from "react";
import { Section, SectionHeading } from "@/components/sections/Section";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Interactive Before vs After (signature #9). Drag the seam to reveal the
 * optimised listing; Vira explains why each change earns more bookings. Keyboard
 * + touch accessible via the range control. Uses content cards, not photos, so
 * nothing is fabricated — the copy is the demonstration.
 */
const BEFORE = {
  title: "Nice 2BHK near city",
  price: "₹3,200 · flat, every night",
  note: "No hook, no search terms, one price for every day of the week.",
};
const AFTER = {
  title: "Sunlit 2BHK · 6 min to the temple · fast Wi-Fi, easy check-in",
  price: "₹2,900 weekdays · ₹4,100 weekends",
  note: "A reason to click, terms guests search for, and pricing that reads the week.",
};

export function BeforeAfter() {
  const [pos, setPos] = useState(50);

  return (
    <Section>
      <SectionHeading
        eyebrow="Before vs After"
        title="Same property. Different result."
        intro="Drag to reveal what changes when Vira gets to work — and why it moves bookings."
      />

      <Reveal className="mx-auto mt-12 max-w-2xl">
        <div className="relative overflow-hidden rounded-[var(--se-radius-lg)] border border-[var(--se-line)]">
          {/* BEFORE (base layer) */}
          <ListingCard variant="before" data={BEFORE} />

          {/* AFTER (clipped overlay) */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
            aria-hidden
          >
            <ListingCard variant="after" data={AFTER} />
          </div>

          {/* 18° seam */}
          <div
            className="pointer-events-none absolute inset-y-0 w-[2px] bg-se-lavender"
            style={{ left: `${pos}%`, transform: "skewX(-18deg)" }}
          />
        </div>

        <label className="mt-5 block text-center">
          <span className="se-eyebrow">Drag to reveal the optimised listing</span>
          <input
            type="range"
            min={0}
            max={100}
            value={pos}
            onChange={(e) => setPos(Number(e.target.value))}
            aria-label="Reveal the optimised listing"
            className="mt-3 w-full max-w-md cursor-pointer accent-[var(--se-purple)]"
          />
        </label>
      </Reveal>
    </Section>
  );
}

function ListingCard({
  variant,
  data,
}: {
  variant: "before" | "after";
  data: { title: string; price: string; note: string };
}) {
  const isAfter = variant === "after";
  return (
    <div className={isAfter ? "bg-se-ground-2" : "bg-se-charcoal"}>
      <div className="p-6 md:p-8">
        <span className="se-eyebrow" style={{ color: isAfter ? "var(--se-positive)" : "var(--se-negative)" }}>
          {isAfter ? "After" : "Before"}
        </span>
        <h3 className="mt-3 min-h-[3.5rem] font-body text-lg font-bold text-se-offwhite">
          {data.title}
        </h3>
        <p className="se-num mt-2 text-se-lavender">{data.price}</p>
        <p className="mt-4 border-t border-[var(--se-line)] pt-4 text-sm text-se-grey-lavender">
          {data.note}
        </p>
      </div>
    </div>
  );
}
