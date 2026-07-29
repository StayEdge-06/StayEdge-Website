import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/sections/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/config/site";
import { GLOSSARY } from "@/lib/content/glossary";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, glossarySchema } from "@/lib/seo/schema";
import { DEFAULT_OG_IMAGE } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Airbnb Host Glossary — ADR, RevPAR, Occupancy & More",
  description:
    "Plain-language definitions of the terms Airbnb hosts actually meet: ADR, RevPAR, occupancy rate, gap nights, dynamic pricing, Airbnb SEO and more.",
  alternates: { canonical: "/knowledge/glossary" },
  openGraph: {
    title: "Airbnb Host Glossary — ADR, RevPAR, Occupancy & More · StayEdge",
    description:
      "Plain-language definitions of the terms Airbnb hosts actually meet: ADR, RevPAR, occupancy rate, gap nights, dynamic pricing, Airbnb SEO and more.",
    url: "/knowledge/glossary",
    siteName: "StayEdge",
    locale: "en_IN",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Airbnb Host Glossary — ADR, RevPAR, Occupancy & More · StayEdge",
    description:
      "Plain-language definitions of the terms Airbnb hosts actually meet: ADR, RevPAR, occupancy rate, gap nights, dynamic pricing, Airbnb SEO and more.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function GlossaryPage() {
  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="Knowledge · Glossary"
          title="The host glossary."
          intro="The numbers and terms that decide your revenue — defined in plain language."
        />

        <Reveal className="mx-auto mt-12 max-w-3xl">
          <dl className="divide-y divide-[var(--se-line)] border-y border-[var(--se-line)]">
            {GLOSSARY.map((g) => (
              <div key={g.term} className="py-5">
                <dt className="se-num text-lg text-se-lavender">{g.term}</dt>
                <dd className="mt-1 text-se-grey-lavender">{g.definition}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 text-center">
            <Button href={ROUTES.roast} variant="primary" size="md" haptic>
              See these numbers for your listing — free
            </Button>
          </div>
        </Reveal>
      </Section>

      <JsonLd
        schemas={[
          glossarySchema(GLOSSARY),
          breadcrumbSchema([
            { name: "Knowledge", path: "/knowledge" },
            { name: "Glossary", path: "/knowledge/glossary" },
          ]),
        ]}
      />
    </>
  );
}
