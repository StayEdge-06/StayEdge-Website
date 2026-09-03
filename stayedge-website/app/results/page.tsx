import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/sections/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { CASE_STUDIES } from "@/lib/content/case-studies";
import { DEFAULT_OG_IMAGE } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Results",
  description:
    "How StayEdge measures growth — occupancy, ADR, revenue and reviews. Case studies published as clients allow.",
  alternates: { canonical: "/results" },
  openGraph: {
    title: "Results — StayEdge",
    description:
      "How StayEdge measures growth — occupancy, ADR, revenue and reviews. Case studies published as clients allow.",
    url: "/results",
    siteName: "StayEdge",
    locale: "en_IN",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Results — StayEdge",
    description:
      "How StayEdge measures growth — occupancy, ADR, revenue and reviews. Case studies published as clients allow.",
    images: [DEFAULT_OG_IMAGE],
  },
};

/**
 * Honest results page. Brand law: every claim provable, no invented numbers.
 * Until named case studies are cleared for publication, this page shows HOW we
 * measure — and the free audit lets a visitor see the method on their own property.
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
              <TiltCard className="block h-full rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-6">
                <p className="se-num text-lg text-se-lavender">{m.label}</p>
                <p className="mt-2 text-se-grey-lavender">{m.body}</p>
              </TiltCard>
            </RevealItem>
          ))}
        </RevealGroup>

        {CASE_STUDIES.length > 0 ? (
          <RevealGroup className="mt-12 grid gap-4 md:grid-cols-2">
            {CASE_STUDIES.map((cs) => (
              <RevealItem key={cs.slug}>
                <TiltCard as="article" className="se-edge-strip block h-full rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-6 pl-7">
                  <p className="se-eyebrow">{cs.propertyLabel}</p>
                  <p className="mt-2 text-se-grey-lavender">{cs.situation}</p>
                  <ul className="mt-3 space-y-1 text-sm text-se-offwhite/85">
                    {cs.changes.map((ch) => (
                      <li key={ch.slice(0, 24)}>· {ch}</li>
                    ))}
                  </ul>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {cs.results.map((r) => (
                      <div key={r.metric} className="rounded-lg bg-se-charcoal p-3">
                        <p className="text-xs uppercase text-se-grey-lavender">{r.metric} · {r.period}</p>
                        <p className="se-num mt-1 text-se-offwhite">
                          {r.before} → <span className="text-se-positive">{r.after}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                  {cs.quote && (
                    <blockquote className="mt-4 border-l-2 border-se-purple pl-3 font-editorial italic text-se-offwhite/90">
                      “{cs.quote.text}” <span className="not-italic text-sm text-se-grey-lavender">— {cs.quote.attribution}</span>
                    </blockquote>
                  )}
                </TiltCard>
              </RevealItem>
            ))}
          </RevealGroup>
        ) : (
          <Reveal className="mx-auto mt-12 max-w-2xl rounded-[var(--se-radius-lg)] border-l-2 border-se-purple bg-se-ground-2 p-6 text-center">
            <p className="text-se-offwhite">
              Named case studies are published here as clients approve them.
            </p>
            <p className="mt-2 text-sm text-se-grey-lavender">
              Until then, the fastest way to judge us is to watch the method run on your own
              listing — free.
            </p>
          </Reveal>
        )}
      </Section>
      <FinalCTA />
      <JsonLd schemas={[breadcrumbSchema([{ name: "Results", path: "/results" }])]} />
    </>
  );
}
