import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/sections/Section";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Button } from "@/components/ui/Button";
import { CTA, ROUTES, DEFAULT_OG_IMAGE } from "@/lib/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  aiPropertyVideoServiceSchema,
  breadcrumbSchema,
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
    title: "Listing & Airbnb SEO",
    outcome: "Get found, get clicked.",
    body: "Titles, photos and structure tuned for how guests search and how the algorithm ranks. Your listing becomes easy to find and hard to scroll past.",
  },
  {
    title: "Pricing & ADR growth",
    outcome: "Earn what the week is worth.",
    body: "Weekend lifts, mid-week fills, seasonality and gap nights — priced deliberately instead of one flat number all year.",
  },
  {
    title: "Occupancy & conversion",
    outcome: "Turn views into bookings.",
    body: "We find the exact moments guests hesitate — first photo, reviews, house rules — and remove the friction that costs you the booking.",
  },
  {
    title: "Positioning & guest psychology",
    outcome: "Stop competing on price.",
    body: "Your property gets a clear promise for a clear guest, so you win on fit — not on being the cheapest option nearby.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="What We Do"
          title="Airbnb growth as a system."
          intro="Four disciplines, one goal: more booked nights at better rates — proven in your numbers."
        />
        <RevealGroup data-vira-avoid className="mt-14 grid gap-4 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <RevealItem key={s.title}>
              <TiltCard className="se-edge-strip block h-full rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-6 pl-7">
                <p className="se-eyebrow">{s.outcome}</p>
                <h2 className="mt-2 font-body text-xl font-bold text-se-ink">{s.title}</h2>
                <p className="mt-2 text-se-ink-muted">{s.body}</p>
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
          aiPropertyVideoServiceSchema(),
        ]}
      />
    </>
  );
}
