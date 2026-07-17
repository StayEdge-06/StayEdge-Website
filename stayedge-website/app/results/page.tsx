import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/sections/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Results",
  description:
    "How StayEdge measures growth — occupancy, ADR, revenue and reviews. Case studies published as clients allow.",
  alternates: { canonical: "/results" },
};

/**
 * Honest results page. Brand law: every claim provable, no invented numbers.
 * Until named case studies are cleared for publication, this page shows HOW we
 * measure — and the roast lets a visitor see the method on their own property.
 */
const METRICS = [
  { label: "Occupancy", body: "Booked nights vs available nights — the first number we move." },
  { label: "ADR", body: "Average daily rate — what each booked night actually earns you." },
  { label: "Revenue", body: "The number the other two exist for. Tracked monthly, compared honestly." },
  { label: "Review velocity", body: "Fresh, strong reviews compound your ranking and your rate." },
];

export default function ResultsPage() {
  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="Results"
          title="We measure. We don't embellish."
          intro="Every engagement is tracked on the same four numbers, and we only publish case studies our clients approve — with real figures, or not at all."
        />
        <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2">
          {METRICS.map((m) => (
            <RevealItem key={m.label}>
              <div className="h-full rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-6">
                <p className="se-num text-lg text-se-lavender">{m.label}</p>
                <p className="mt-2 text-se-grey-lavender">{m.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mx-auto mt-12 max-w-2xl rounded-[var(--se-radius-lg)] border-l-2 border-se-purple bg-se-ground-2 p-6 text-center">
          <p className="text-se-offwhite">
            Named case studies are published here as clients approve them.
          </p>
          <p className="mt-2 text-sm text-se-grey-lavender">
            Until then, the fastest way to judge us is to watch the method run on your own
            listing — free.
          </p>
        </Reveal>
      </Section>
      <FinalCTA />
      <JsonLd schemas={[breadcrumbSchema([{ name: "Results", path: "/results" }])]} />
    </>
  );
}
