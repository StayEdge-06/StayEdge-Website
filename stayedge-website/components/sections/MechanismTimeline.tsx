import { Section, SectionHeading } from "@/components/sections/Section";
import { PinnedStages } from "@/components/motion/ScrollFX";

/**
 * How Vira thinks — the analysis pipeline as scroll-storytelling (signature
 * #10): on desktop the section pins while the six stages ignite in sequence
 * and a progress line draws down; on mobile/reduced-motion it reads as a
 * clean stacked list. Trust through transparency of method.
 */
const STAGES = [
  { n: "01", title: "Listing analysis", body: "Photos, title, description and structure — read the way a guest reads them." },
  { n: "02", title: "Competitor intelligence", body: "How you stack up against the listings winning the bookings you want." },
  { n: "03", title: "Revenue intelligence", body: "Where pricing, gaps and length-of-stay rules are leaving money on the table." },
  { n: "04", title: "Guest psychology", body: "The moments of hesitation that quietly cost you the click and the booking." },
  { n: "05", title: "Growth strategy", body: "The few changes that move occupancy and ADR the most, in priority order." },
  { n: "06", title: "Recommendations", body: "A clear, specific plan — what to change, why, and what to expect." },
];

export function MechanismTimeline() {
  return (
    <Section id="how-we-think">
      <SectionHeading
        eyebrow="How Vira Thinks"
        title="We don't guess. We run a process."
        intro="The same analysis behind every roast and every Property Growth Snapshot — so the numbers are earned, not invented."
      />
      <PinnedStages stages={STAGES} className="mx-auto mt-14 max-w-3xl" />
    </Section>
  );
}
