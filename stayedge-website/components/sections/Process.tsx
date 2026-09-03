import { Section, SectionHeading } from "@/components/sections/Section";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";

/**
 * The value ladder, made legible — how a visitor goes from a listing link to a
 * growing listing. Every step is free until there's proof it's worth more.
 * V2: the ladder is one funnel (the Property Growth Audit); the old
 * roast → snapshot → audit chain was retired with the AI Roast.
 */
const STEPS = [
  { n: "01", title: "Send your link", body: "Paste your Airbnb listing link. No account, no login, no card.", free: true },
  { n: "02", title: "Property Growth Audit", body: "We read your listing quality, pricing and search visibility the way a guest and the algorithm do.", free: true },
  { n: "03", title: "Your priority plan", body: "A prioritised list of what to fix first, what it's likely costing you, and why.", free: true },
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
            <TiltCard className="se-edge-strip block h-full rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-charcoal p-6 pl-7">
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
            </TiltCard>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
