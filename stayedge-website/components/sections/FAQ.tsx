import { Section, SectionHeading } from "@/components/sections/Section";
import { Reveal } from "@/components/motion/Reveal";

/**
 * FAQ = objection handling in disguise, ordered by objection severity. Native
 * <details> so it works without JS and is keyboard-accessible by default.
 */
export const FAQS = [
  {
    q: "Is the Property Growth Audit really free? What's the catch?",
    a: "The audit is free and there's no catch. You get a prioritised list of what's costing you bookings, whether or not you ever work with us — it's how we show you we know Airbnb before asking for anything.",
  },
  {
    q: "Are you property managers?",
    a: "No. We don't take over your listing, account or keys. We optimise what you own so it performs — and you stay fully in control.",
  },
  {
    q: "How is Vira different from a normal consultant?",
    a: "Vira reads your listing, your pricing and your competitors at a scale no human can, in seconds. Our operators turn that into a plan you can act on.",
  },
  {
    q: "Do you need access to my Airbnb account?",
    a: "Not for the audit — a public listing link is enough. If we work together, we only ask for what a specific change needs, with your permission.",
  },
  {
    q: "My listing is new / has few reviews. Can you still help?",
    a: "Yes. Launching right matters most for new listings — that's often where the fastest gains are.",
  },
  {
    q: "What does it cost after the audit?",
    a: "That depends on your property and goals, and we'll only quote once there's a clear return to aim at. The Property Growth Audit itself is free.",
  },
];

export function FAQ() {
  return (
    <Section ground="deep">
      <SectionHeading eyebrow="Questions" title="Straight answers." />

      <Reveal className="mx-auto mt-12 max-w-2xl">
        <div className="divide-y divide-[var(--se-line)] border-y border-[var(--se-line)]">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-body font-semibold text-se-ink">
                {f.q}
                <span className="shrink-0 text-se-accent transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-se-ink-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
