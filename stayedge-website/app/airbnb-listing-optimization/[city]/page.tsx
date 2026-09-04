import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section, SectionHeading } from "@/components/sections/Section";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ROUTES, DEFAULT_OG_IMAGE } from "@/lib/config/site";
import { CITIES, getCity } from "@/lib/content/cities";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, cityServiceSchema, faqSchema } from "@/lib/seo/schema";

/**
 * Programmatic city page template (Authority Engine). Scales by adding a
 * CityPage object with REAL local content — never template-swapped filler.
 */
export function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const c = getCity(city);
  if (!c) return {};
  const ogTitle = `Airbnb Listing Optimization in ${c.city} · StayEdge`;
  return {
    title: `Airbnb Listing Optimization in ${c.city}`,
    description: c.intro,
    alternates: { canonical: `/airbnb-listing-optimization/${c.slug}` },
    openGraph: {
      title: ogTitle,
      description: c.intro,
      url: `/airbnb-listing-optimization/${c.slug}`,
      siteName: "StayEdge",
      locale: "en_IN",
      type: "website",
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: c.intro,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const c = getCity(city);
  if (!c) notFound();

  return (
    <>
      <Section>
        <SectionHeading
          eyebrow={`${c.city}, ${c.state}`}
          title={`Airbnb listing optimization in ${c.city}.`}
          center={false}
          as="h1"
        />

        <div className="mx-auto max-w-3xl">
          <p className="mt-6 rounded-[var(--se-radius-lg)] border-l-2 border-se-purple bg-se-ground-2 p-5 text-lg text-se-ink/90">
            {c.intro}
          </p>

          <h2 className="mt-10 font-body text-xl font-bold text-se-ink">
            How demand actually works in {c.city}
          </h2>
          {c.market.map((p) => (
            <p key={p.slice(0, 32)} className="mt-3 text-se-ink-muted">
              {p}
            </p>
          ))}

          <h2 className="mt-10 font-body text-xl font-bold text-se-ink">
            The {c.city} playbook
          </h2>
          <ul className="mt-4 space-y-3">
            {c.playbook.map((p) => (
              <li key={p.slice(0, 32)} className="flex gap-3 text-se-ink/85">
                <span aria-hidden className="text-se-positive">✓</span>
                {p}
              </li>
            ))}
          </ul>

          <section className="mt-12 border-t border-[var(--se-line)] pt-8">
            <h2 className="se-eyebrow">Common questions</h2>
            {c.faqs.map((f) => (
              <details key={f.q} className="group border-b border-[var(--se-line)] py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-body font-semibold text-se-ink">
                  {f.q}
                  <span className="shrink-0 text-se-accent transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-se-ink-muted">{f.a}</p>
              </details>
            ))}
          </section>

          <div className="mt-10 rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-6 text-center">
            <p className="text-se-ink">
              Hosting in {c.city}? See what your listing is leaving on the table.
            </p>
            <div className="mt-4">
              <Button href={ROUTES.freeAudit} variant="primary" size="md" haptic>
                Get your free audit
              </Button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-se-ink-muted">
            This is the {c.city}-specific market read. See the full{" "}
            <Link href={ROUTES.listingOptimization} className="text-se-accent underline-offset-4 hover:underline">
              Airbnb Listing Optimization service
            </Link>{" "}
            for how we approach the title, photos and description themselves.
          </p>
        </div>
      </Section>
      <FinalCTA />
      <JsonLd
        schemas={[
          cityServiceSchema(c),
          faqSchema(c.faqs),
          breadcrumbSchema([
            { name: "Airbnb Listing Optimization", path: `/airbnb-listing-optimization/${c.slug}` },
          ]),
        ]}
      />
    </>
  );
}
