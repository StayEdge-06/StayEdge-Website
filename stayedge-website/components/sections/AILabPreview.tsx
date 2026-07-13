import { Section, SectionHeading } from "@/components/sections/Section";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/config/site";

/**
 * AI Lab preview — the long-term organic acquisition engine. Free tools that
 * each solve one specific thing, then route into the ladder. Includes the Roast
 * Battle concept (you vs a competitor). Tools marked "soon" until built — no
 * pretending something works that doesn't.
 */
const TOOLS = [
  { title: "Roast My Listing", body: "Your score, three issues, one strength.", live: true },
  { title: "Rewrite My Title", body: "A title guests click and the algorithm reads.", live: false },
  { title: "SEO Checker", body: "Are you findable for the searches that matter?", live: false },
  { title: "Description Analyzer", body: "Where your copy loses the booking.", live: false },
  { title: "Pricing Checker", body: "Weekday, weekend and gap pricing, read at a glance.", live: false },
  { title: "Photo Rating", body: "Which photo should lead — and which should go.", live: false },
  { title: "Growth Predictor", body: "Where a few changes could take your occupancy.", live: false },
];

export function AILabPreview() {
  return (
    <Section>
      <SectionHeading
        eyebrow="AI Lab"
        title="A free tool for every weak spot."
        intro="Fix one thing at a time — or let Vira find them all at once."
      />

      <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((t) => (
          <RevealItem key={t.title}>
            <div className="flex h-full flex-col rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-body font-bold text-se-offwhite">{t.title}</h3>
                <span className="se-eyebrow !text-se-grey-lavender">{t.live ? "Live" : "Soon"}</span>
              </div>
              <p className="mt-2 flex-1 text-sm text-se-grey-lavender">{t.body}</p>
            </div>
          </RevealItem>
        ))}

        {/* Roast Battle — designed now, built later */}
        <RevealItem>
          <div className="se-edge-strip flex h-full flex-col rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-3 p-6 pl-7">
            <div className="flex items-center justify-between">
              <h3 className="font-body font-bold text-se-offwhite">Roast Battle</h3>
              <span className="se-eyebrow !text-se-grey-lavender">Soon</span>
            </div>
            <p className="mt-2 flex-1 text-sm text-se-offwhite/85">
              Your listing vs a competitor. Winner, strengths, weaknesses and the revenue gap
              between you.
            </p>
          </div>
        </RevealItem>
      </RevealGroup>

      <RevealItem>
        <div className="mt-10 text-center">
          <Button href={ROUTES.lab} variant="secondary" size="md">
            Explore the AI Lab
          </Button>
        </div>
      </RevealItem>
    </Section>
  );
}
