import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/sections/Section";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Button } from "@/components/ui/Button";
import { CTA, ROUTES, DEFAULT_OG_IMAGE } from "@/lib/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  aiPropertyVideoServiceSchema,
  airbnbSeoServiceSchema,
  breadcrumbSchema,
  listingOptimizationServiceSchema,
  photographyGuidanceServiceSchema,
  pricingStrategyServiceSchema,
  revenueGrowthServiceSchema,
  servicesCatalogSchema,
} from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "What We Do — Airbnb Listing Optimisation, Pricing & SEO",
  description:
    "Listing optimisation, dynamic pricing, occupancy growth and positioning — Airbnb growth as a system, not guesswork.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "What We Do — Airbnb Listing Optimisation, Pricing & SEO · StayEdge",
    description:
      "Listing optimisation, dynamic pricing, occupancy growth and positioning — Airbnb growth as a system, not guesswork.",
    url: "/services",
    siteName: "StayEdge",
    locale: "en_IN",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "What We Do — Airbnb Listing Optimisation, Pricing & SEO · StayEdge",
    description:
      "Listing optimisation, dynamic pricing, occupancy growth and positioning — Airbnb growth as a system, not guesswork.",
    images: [DEFAULT_OG_IMAGE],
  },
};

const SERVICES = [
  {
    title: "Airbnb Listing Optimization",
    outcome: "Turn views into bookings.",
    body: "Title, photo order, description and amenities — rewritten so a guest scrolling past understands the value in seconds, not paragraphs.",
    href: ROUTES.listingOptimization,
  },
  {
    title: "Airbnb SEO",
    outcome: "Get found, get clicked.",
    body: "The signals Airbnb's own search ranking actually rewards — response behaviour, completeness, review velocity, calendar accuracy.",
    href: ROUTES.airbnbSeo,
  },
  {
    title: "Pricing Strategy",
    outcome: "Earn what the week is worth.",
    body: "Weekend lifts, mid-week fills, seasonality and gap nights — priced deliberately instead of one flat number all year.",
    href: ROUTES.pricingStrategy,
  },
  {
    title: "Revenue Growth",
    outcome: "Stop trading occupancy for rate.",
    body: "Occupancy and ADR moved together toward RevPAR — plus the positioning that lets you win on fit, not on being the cheapest option nearby.",
    href: ROUTES.revenueGrowth,
  },
  {
    title: "Photography Guidance",
    outcome: "The photo that earns the click.",
    body: "A shot list, sequencing and staging review built for the camera you already have — no shoot required.",
    href: ROUTES.photographyGuidance,
  },
];

export default function ServicesPage() {
  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="What We Do"
          title="Airbnb growth as a system."
          intro="Five disciplines, one goal: more booked nights at better rates — proven in your numbers."
          as="h1"
        />
        <RevealGroup data-vira-avoid className="mt-14 grid gap-4 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <RevealItem key={s.title}>
              <TiltCard className="block h-full">
                <Link
                  href={s.href}
                  className="se-edge-strip block h-full rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-6 pl-7 transition-colors hover:border-[var(--se-line-strong)]"
                >
                  <p className="se-eyebrow">{s.outcome}</p>
                  <h2 className="mt-2 font-body text-xl font-bold text-se-ink">{s.title}</h2>
                  <p className="mt-2 text-se-ink-muted">{s.body}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-se-accent">
                    Learn more →
                  </span>
                </Link>
              </TiltCard>
            </RevealItem>
          ))}
        </RevealGroup>
        <RevealItem>
          <div className="mt-10 text-center">
            <Button href={ROUTES.freeAudit} variant="primary" size="lg" haptic>
              See what we&apos;d fix first — free
            </Button>
          </div>
        </RevealItem>
      </Section>

      {/* The video service is a separate discipline with its own page, so it
          gets a band rather than a fifth grid card — and the link keeps the
          child route inside the internal link graph. */}
      <Section ground="deep">
        <RevealGroup className="mx-auto grid max-w-4xl gap-8 md:grid-cols-[1.1fr_1fr] md:items-center">
          <RevealItem>
            <p className="se-eyebrow">Also from StayEdge</p>
            <h2 className="mt-3 se-title text-3xl text-se-ink md:text-4xl">
              AI Property Video
            </h2>
            <p className="mt-4 text-se-ink-muted">
              Cinematic video produced with AI from the photos and clips your property already
              has — Reels, Shorts, walkthroughs, promos and website hero loops. A production
              service, not a tool: you receive finished files.
            </p>
            <div className="mt-7">
              <Button href={ROUTES.aiPropertyVideo} variant="secondary" size="lg">
                {CTA.video.label}
              </Button>
            </div>
          </RevealItem>
          <RevealItem>
            <ul className="grid gap-2">
              {[
                "Instagram Reels",
                "YouTube Shorts",
                "Property walkthrough",
                "Promotional video",
                "Website hero video",
              ].map((f) => (
                <li
                  key={f}
                  className="rounded-[var(--se-radius-md)] border border-[var(--se-line)] bg-se-surface px-4 py-3 text-sm text-se-ink/85"
                >
                  {f}
                </li>
              ))}
            </ul>
          </RevealItem>
        </RevealGroup>
      </Section>

      <FinalCTA />
      <JsonLd
        schemas={[
          breadcrumbSchema([{ name: "What We Do", path: "/services" }]),
          servicesCatalogSchema(SERVICES),
          listingOptimizationServiceSchema(),
          airbnbSeoServiceSchema(),
          pricingStrategyServiceSchema(),
          revenueGrowthServiceSchema(),
          photographyGuidanceServiceSchema(),
          aiPropertyVideoServiceSchema(),
        ]}
      />
    </>
  );
}
