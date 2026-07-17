import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/sections/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "How We Work",
  description:
    "Free Property Growth Snapshot → discovery call → personalised growth plan → custom proposal → implementation. Pricing is discussed only after understanding your property.",
  alternates: { canonical: "/how-we-work" },
};

/**
 * The engagement journey (founder decision: no public pricing page — we compete
 * on outcomes, and pricing is discussed only after understanding the property).
 */
const STEPS = [
  {
    n: "01",
    title: "Free Property Growth Snapshot",
    body: "Vira reads your listing and we show you exactly what's costing you bookings — the issues, the leak, the quick wins. Free, no obligation.",
  },
  {
    n: "02",
    title: "Discovery call",
    body: "A no-pressure conversation about your property, your goals and what the snapshot found. You keep every insight either way.",
  },
  {
    n: "03",
    title: "Personalised growth plan",
    body: "Your property's priorities, in order — what to change, why, and what each change is expected to move.",
  },
  {
    n: "04",
    title: "Custom proposal",
    body: "Scope and investment sized to your property and the outcome it can realistically reach. Pricing comes only after we understand what we're pricing.",
  },
  {
    n: "05",
    title: "Implementation",
    body: "We work the plan with you and track occupancy, ADR, revenue and reviews — so the difference shows up in your numbers, not our slides.",
  },
];

export default function HowWeWorkPage() {
  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="How We Work"
          title="Outcomes first. Pricing after understanding."
          intro="We never quote a property we haven't studied — and you see real value from us before spending a rupee."
        />

        <RevealGroup className="mx-auto mt-14 max-w-3xl">
          {STEPS.map((s) => (
            <RevealItem key={s.n}>
              <div className="se-edge-strip flex gap-5 py-6 pl-5">
                <span className="se-num shrink-0 text-2xl text-se-lavender">{s.n}</span>
                <div>
                  <h2 className="font-body text-lg font-bold text-se-offwhite">{s.title}</h2>
                  <p className="mt-1 text-se-grey-lavender">{s.body}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mx-auto mt-10 max-w-2xl rounded-[var(--se-radius-lg)] border-l-2 border-se-purple bg-se-ground-2 p-6 text-center">
          <p className="font-editorial italic text-se-offwhite/90">
            &ldquo;We don&apos;t compete on price. We compete on what your property earns after
            we&apos;ve worked on it.&rdquo;
          </p>
        </Reveal>

        <RevealItem>
          <div className="mt-10 text-center">
            <Button href={ROUTES.roast} variant="primary" size="lg">
              Start with step one — free
            </Button>
          </div>
        </RevealItem>
      </Section>
      <FinalCTA />
      <JsonLd schemas={[breadcrumbSchema([{ name: "How We Work", path: "/how-we-work" }])]} />
    </>
  );
}
