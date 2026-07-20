"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Section, SectionHeading } from "@/components/sections/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { getMotionTier } from "@/lib/motion/tier";
import { ROUTES } from "@/lib/config/site";

/**
 * Revenue opportunity — the visitor's own numbers, not ours. The maths is theirs;
 * we only show what a modest, self-chosen lift looks like. Honest by design
 * (labelled illustrative, never a guarantee) and it manufactures desire from
 * numbers the visitor already believes.
 */
function inr(n: number) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export function RevenueOpportunity() {
  const [rate, setRate] = useState(3500);
  const [occ, setOcc] = useState(45);
  const [lift, setLift] = useState(12); // percentage-point occupancy lift, user-set

  const nights = 30;
  const current = rate * (occ / 100) * nights;
  const improved = rate * (Math.min(occ + lift, 95) / 100) * nights;
  const gap = improved - current;

  // The Leak Counter (signature #8): the upside figure resolves with a
  // mechanical Plex Serif tick — debounced so it settles once per drag, not
  // once per pixel — then pulses on completion. Static tier: instant, no tween.
  const gapRef = useRef<HTMLParagraphElement>(null);
  const shown = useRef(gap);

  useEffect(() => {
    const el = gapRef.current;
    if (!el) return;
    if (getMotionTier() === "static") {
      shown.current = gap;
      el.textContent = `+${inr(gap)}`;
      return;
    }
    const t = setTimeout(() => {
      const obj = { v: shown.current };
      gsap.to(obj, {
        v: gap,
        duration: 0.5,
        ease: "power3.out",
        onUpdate: () => {
          el.textContent = `+${inr(obj.v)}`;
        },
        onComplete: () => {
          shown.current = gap;
          el.textContent = `+${inr(gap)}`;
          gsap.fromTo(el, { scale: 1 }, { scale: 1.06, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" });
        },
      });
    }, 180);
    return () => clearTimeout(t);
  }, [gap]);

  return (
    <Section ground="deep">
      <SectionHeading
        eyebrow="Revenue Opportunity"
        title="What are the empty nights costing you?"
        intro="Enter your own numbers. This is your maths — not a promise — but it shows where the room to grow is."
      />

      <Reveal className="mx-auto mt-12 max-w-3xl">
        <div className="grid gap-8 rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-charcoal p-6 md:grid-cols-2 md:p-8">
          <div className="space-y-6">
            <Field label="Your nightly rate" value={inr(rate)}>
              <input type="range" min={1000} max={20000} step={100} value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                aria-label="Nightly rate" className="w-full cursor-pointer accent-[var(--se-purple)]" />
            </Field>
            <Field label="Current occupancy" value={`${occ}%`}>
              <input type="range" min={10} max={90} value={occ}
                onChange={(e) => setOcc(Number(e.target.value))}
                aria-label="Current occupancy" className="w-full cursor-pointer accent-[var(--se-purple)]" />
            </Field>
            <Field label="If occupancy rose by" value={`${lift} points`}>
              <input type="range" min={3} max={30} value={lift}
                onChange={(e) => setLift(Number(e.target.value))}
                aria-label="Occupancy lift" className="w-full cursor-pointer accent-[var(--se-lavender)]" />
            </Field>
          </div>

          <div className="flex flex-col justify-center rounded-[var(--se-radius-lg)] bg-se-ground-2 p-6 text-center">
            <p className="se-eyebrow">Illustrative monthly upside</p>
            <p
              ref={gapRef}
              className="se-num mt-3 text-[clamp(36px,7vw,60px)] leading-none text-se-positive [will-change:transform]"
            >
              +{inr(gap)}
            </p>
            <p className="mt-2 text-sm text-se-grey-lavender">
              {inr(current)} → {inr(improved)} per month
            </p>
            <div className="mt-6">
              <Button href={ROUTES.roast} variant="primary" size="md">
                Find my real gaps
              </Button>
            </div>
            <p className="mt-3 text-xs text-se-grey-lavender">
              Illustrative only — based on the numbers you entered.
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

function Field({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-se-grey-lavender">{label}</span>
        <span className="se-num text-se-offwhite">{value}</span>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}
