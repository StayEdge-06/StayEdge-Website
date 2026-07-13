import { Section, SectionHeading } from "@/components/sections/Section";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

/**
 * How Vira thinks — the analysis pipeline, shown as a timeline. Trust through
 * transparency of method (Experience Bible §5). Same stages the roast runs, so
 * the process reads as real and repeatable.
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

      <RevealGroup className="mx-auto mt-14 max-w-3xl">
        {STAGES.map((s) => (
          <RevealItem key={s.n}>
            <div className="se-edge-strip flex gap-5 py-5 pl-5">
              <span className="se-num shrink-0 text-2xl text-se-lavender">{s.n}</span>
              <div>
                <h3 className="font-body text-lg font-bold text-se-offwhite">{s.title}</h3>
                <p className="mt-1 text-se-grey-lavender">{s.body}</p>
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
