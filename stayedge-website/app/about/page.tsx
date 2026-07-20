import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/sections/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { CONTACT, SITE } from "@/lib/config/site";
import { PERSONA } from "@/lib/config/persona";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "About",
  description:
    "StayEdge — an Airbnb growth consultancy from Tirupati, South India. AI-powered analysis, operator judgement, honest numbers.",
  alternates: { canonical: "/about" },
};

const BELIEFS = [
  {
    title: "Hosts deserve operators, not lectures",
    body: "Most advice for hosts is generic and loud. Useful help is specific, measured, and shows its working.",
  },
  {
    title: "AI sees more, people decide better",
    body: `${PERSONA.name} reads listings, pricing and competitors at a scale no human can. Then a human turns that into judgement you can act on. Both matter.`,
  },
  {
    title: "Prove it in the numbers",
    body: "Occupancy, ADR, revenue, reviews. If a recommendation can't be tied to one of those, we don't send it.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="About StayEdge"
          title="The sharp operator, not the loud guru."
          intro={SITE.promise}
        />

        <Reveal className="mx-auto mt-12 max-w-2xl">
          <div className="se-edge-strip rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-6 pl-7 md:p-8 md:pl-9">
            <p className="se-eyebrow">The founder</p>
            <h2 className="mt-2 font-body text-xl font-bold text-se-offwhite">
              {CONTACT.founder}
            </h2>
            <p className="mt-3 text-se-grey-lavender">
              StayEdge was founded in 2024 in {CONTACT.location.split(",")[0]}, built on a simple
              observation: most Airbnb listings in India underperform not because the properties
              are weak, but because the listings are. Titles that say nothing, one price for every
              night, photos in the wrong order — fixable things, costing real money every week.
            </p>
            <p className="mt-3 text-se-grey-lavender">
              So we built {PERSONA.name} — an AI that reads a listing the way a guest does, then
              the way the algorithm does — and paired it with operator judgement. You get the
              scale of software with the accountability of a person whose name is on the work.
            </p>
          </div>
        </Reveal>

        <RevealGroup className="mt-10 grid gap-4 md:grid-cols-3">
          {BELIEFS.map((b) => (
            <RevealItem key={b.title}>
              <TiltCard className="block h-full rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-6">
                <h3 className="font-body font-bold text-se-offwhite">{b.title}</h3>
                <p className="mt-2 text-sm text-se-grey-lavender">{b.body}</p>
              </TiltCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>
      <FinalCTA />
      <JsonLd schemas={[breadcrumbSchema([{ name: "About", path: "/about" }])]} />
    </>
  );
}
