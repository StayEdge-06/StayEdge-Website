import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/sections/Section";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Button } from "@/components/ui/Button";
import { ROUTES, DEFAULT_OG_IMAGE } from "@/lib/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Who We Help",
  description:
    "First-time hosts, villa owners, boutique hotels and multi-property investors — the plan changes with the property.",
  alternates: { canonical: "/who-we-help" },
  openGraph: {
    title: "Who We Help — StayEdge",
    description:
      "First-time hosts, villa owners, boutique hotels and multi-property investors — the plan changes with the property.",
    url: "/who-we-help",
    siteName: "StayEdge",
    locale: "en_IN",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Who We Help — StayEdge",
    description:
      "First-time hosts, villa owners, boutique hotels and multi-property investors — the plan changes with the property.",
    images: [DEFAULT_OG_IMAGE],
  },
};

const SEGMENTS = [
  {
    id: "first-time-hosts",
    title: "First-time hosts",
    pain: "Launching soon or just live, and every decision feels like a guess.",
    how: "We get the launch right — title, photos, pricing posture and the first reviews — so you skip the expensive early mistakes.",
    cta: "Start with a free audit",
  },
  {
    id: "villa-owners",
    title: "Villa owners",
    pain: "A premium property that books like an average one.",
    how: "Positioning, photography direction and pricing that match what your villa is actually worth — so the right guests pay the right rate.",
    cta: "Audit my villa",
  },
  {
    id: "boutique-hotels",
    title: "Boutique hotels",
    pain: "Competing with both hotels and homestays, visible to neither.",
    how: "A sharper Airbnb presence for every room type, tuned to stand out in search and convert the browsers you already get.",
    cta: "Diagnose my property",
  },
  {
    id: "investors-managers",
    title: "Investors & managers",
    pain: "Multiple listings, no single system, results that vary by property.",
    how: "One measurable growth system across the portfolio — same method, every listing, with numbers you can compare.",
    cta: "Talk portfolio",
  },
];

export default function WhoWeHelpPage() {
  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="Who We Help"
          title="The plan changes with the property."
          intro="Find yours. The method is the same — the priorities are not."
        />
        <RevealGroup className="mt-14 space-y-6">
          {SEGMENTS.map((s) => (
            <RevealItem key={s.id}>
              <TiltCard
                id={s.id}
                className="se-edge-strip block scroll-mt-24 rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-6 pl-7 md:p-8 md:pl-9"
              >
                <h2 className="font-body text-xl font-bold text-se-ink">{s.title}</h2>
                <p className="mt-2 font-editorial italic text-se-ink-muted">{s.pain}</p>
                <p className="mt-3 text-se-ink/85">{s.how}</p>
                <div className="mt-5">
                  <Button href={ROUTES.freeAudit} variant="secondary" size="md">
                    {s.cta}
                  </Button>
                </div>
              </TiltCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>
      <FinalCTA />
      <JsonLd schemas={[breadcrumbSchema([{ name: "Who We Help", path: "/who-we-help" }])]} />
    </>
  );
}
