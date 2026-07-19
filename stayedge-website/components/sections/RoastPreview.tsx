import { Section, SectionHeading } from "@/components/sections/Section";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/ScrollFX";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/config/site";

/**
 * Roast preview — shows what Vira produces, so visitors feel the product before
 * running it (curiosity → humour → recognition). This is a labelled SAMPLE; the
 * real, live roast runs on the /roast engine. No invented host data.
 */
const SAMPLE_ISSUES = [
  {
    tag: "First photo",
    line: "Your lead photo is the car park. Guests decide in about two seconds — and right now they're deciding to scroll on.",
  },
  {
    tag: "Title",
    line: "“Nice 2BHK near city” tells the algorithm nothing and the guest less. No hook, no search terms, no reason to click.",
  },
  {
    tag: "Pricing",
    line: "Flat price, seven nights a week. Your weekends are underpriced and your Tuesdays are scaring people off.",
  },
];

export function RoastPreview() {
  return (
    <Section ground="deep">
      <SectionHeading
        eyebrow="The Roast"
        title={
          <>
            This is what <span className="text-se-lavender">Vira</span> sees.
          </>
        }
        intro="An honest, specific read on your listing — the good, the costly, and the fixable. Here's a sample."
      />

      <Reveal className="mx-auto mt-12 max-w-2xl">
        <div className="se-edge-strip rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-charcoal p-6 md:p-8">
          <div className="flex items-center justify-between">
            <span className="se-eyebrow">Sample · Roast mode</span>
            <div className="text-right">
              <div className="se-num text-[clamp(40px,7vw,64px)] leading-none text-se-lavender">
                <CountUp value={58} />
              </div>
              <p className="mt-1 text-xs text-se-grey-lavender">
                Roast Score · a strong listing reaches 85+
              </p>
            </div>
          </div>

          <ul className="mt-6 space-y-4">
            {SAMPLE_ISSUES.map((issue) => (
              <li key={issue.tag} className="border-t border-[var(--se-line)] pt-4">
                <span className="se-eyebrow !text-se-grey-lavender">{issue.tag}</span>
                <p className="mt-1 text-se-offwhite/90">{issue.line}</p>
              </li>
            ))}
          </ul>

          <p className="mt-6 rounded-lg bg-[color-mix(in_srgb,var(--se-positive)_12%,transparent)] p-4 text-sm text-se-offwhite/90">
            <span className="font-semibold text-se-positive">The good news:</span> your location
            is a genuine selling point you&apos;re barely using. That&apos;s the fastest win on
            this list.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button href={ROUTES.roast} variant="primary" size="md">
              Roast my listing
            </Button>
            <span className="self-center text-sm text-se-grey-lavender">
              Free · your first 3 issues, no email
            </span>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
