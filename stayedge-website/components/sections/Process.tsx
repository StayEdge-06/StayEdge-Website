import { Section, SectionHeading } from "@/components/sections/Section";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

/**
 * The value ladder, made legible — how a visitor goes from a free roast to a
 * growing listing. Every step is free until there's proof it's worth more.
 */
const STEPS = [
  { n: "01", title: "Roast", body: "Paste your listing. Get your score, three real issues and one genuine strength — free, no email.", free: true },
  { n: "02", title: "Growth Snapshot", body: "Unlock the full picture: every issue, the revenue you're leaking, and your prioritised quick wins.", free: true },
  { n: "03", title: "Free Audit", body: "A no-pressure call with a specialist to turn the snapshot into a plan for your property.", free: true },
  { n: "04", title: "Growth", body: "We work the plan with you and prove the difference in your occupancy, ADR and revenue.", free: false },
];

export function Process() {
  return (
    <Section ground="deep">
      <SectionHeading
        eyebrow="How it works"
        title="Free until it's worth more."
        intro="You see the value before you ever pay for it. That's the whole idea."
      />

      <RevealGroup className="mt-14 grid gap-4 md:grid-cols-4">
        {STEPS.map((s) => (
          <RevealItem key={s.n}>
            <div className="se-edge-strip h-full rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-charcoal p-6 pl-7">
              <div className="flex items-center justify-between">
                <span className="se-num text-2xl text-se-lavender">{s.n}</span>
                <span
                  className="rounded-full px-2 py-0.5 text-xs"
                  style={{
                    color: s.free ? "var(--se-positive)" : "var(--se-lavender)",
                    background: s.free
                      ? "color-mix(in srgb, var(--se-positive) 14%, transparent)"
                      : "color-mix(in srgb, var(--se-lavender) 14%, transparent)",
                  }}
                >
                  {s.free ? "Free" : "Paid"}
                </span>
              </div>
              <h3 className="mt-4 font-body text-lg font-bold text-se-offwhite">{s.title}</h3>
              <p className="mt-2 text-sm text-se-grey-lavender">{s.body}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
