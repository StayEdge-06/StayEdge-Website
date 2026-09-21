import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/sections/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { WordReveal } from "@/components/motion/ScrollFX";
import { EyebrowTypeOn } from "@/components/motion/EyebrowTypeOn";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema, pricingStrategyServiceSchema } from "@/lib/seo/schema";
import { CTA, ROUTES, DEFAULT_OG_IMAGE } from "@/lib/config/site";

const TITLE = "Airbnb Pricing Strategy Service";
const DESCRIPTION =
  "Deliberate calendar pricing for Airbnb hosts — weekday vs weekend, seasonality, minimum stays and gap nights — set against what comparable listings near you actually charge.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTES.pricingStrategy },
  openGraph: {
    title: `${TITLE} — StayEdge`,
    description: DESCRIPTION,
    url: ROUTES.pricingStrategy,
    siteName: "StayEdge",
    locale: "en_IN",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} — StayEdge`,
    description: DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

const LEVERS = [
  { title: "Weekday vs weekend spread", body: "One flat rate either overprices your Tuesdays or gives away your Saturdays. Rarely both are worth the same." },
  { title: "Seasonality", body: "Festival weeks, school holidays and off-season lulls each need their own number, set in advance — not reacted to after the calendar goes quiet." },
  { title: "Minimum-stay rules", body: "Too strict and you block bookable gaps; too loose and you fragment the calendar with turnover costs. Set deliberately, not left at default." },
  { title: "Gap nights", body: "The single night stranded between two bookings. Priced and positioned correctly, it fills; ignored, it sits empty." },
];

const PROCESS = [
  { n: "01", title: "Comp-set read", body: "What comparable listings near you actually charge, by day type and season — not a guess." },
  { n: "02", title: "Calendar model", body: "A pricing structure across weekday/weekend, season and minimum-stay rules built for your specific property and market." },
  { n: "03", title: "Review cadence", body: "Pricing isn't set-once. We define how often and on what signal the calendar should be revisited." },
];

const FAQS = [
  {
    q: "Isn't dynamic pricing just a software tool?",
    a: "Pricing tools automate the mechanics once a strategy exists — they don't decide the strategy itself. We set the structure (which nights, which seasons, which minimums) that a tool then executes, or you apply manually.",
  },
  {
    q: "Will you set my prices for me on an ongoing basis?",
    a: "We build the pricing model and the logic behind it, and agree a review cadence with you. Whether you run it yourself from there or want it managed depends on what you ask for — we'll be clear about which before quoting.",
  },
  {
    q: "How do you decide what comparable listings are?",
    a: "Same area, similar capacity and similar guest profile — not just the nearest listing on the map. A studio a street away and a 4BHK villa nearby are not the same comp set even if they're geographically close.",
  },
  {
    q: "What if I don't want to raise prices?",
    a: "Pricing strategy isn't only about charging more — it's about charging the right amount for the right night. That often means lowering some rates (off-season, gap nights) while raising others (peak weekends, festivals).",
  },
  {
    q: "How does this relate to revenue growth?",
    a: "Pricing strategy is the calendar-level mechanics. Revenue growth is the broader picture — occupancy and ADR moved together, plus positioning. See our Revenue Growth service for that layer.",
  },
];

export default function PricingStrategyPage() {
  return (
    <>
      <section id="top" className="relative overflow-hidden bg-se-ground scroll-mt-16">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[760px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-40 blur-[130px]"
          style={{ background: "radial-gradient(closest-side, var(--se-glow), transparent)" }}
        />
        <div className="relative z-10 mx-auto max-w-[900px] px-5 py-24 text-center md:px-8 md:py-32">
          <EyebrowTypeOn text="Pricing Strategy" className="mb-5" />
          <WordReveal
            as="h1"
            text="Price the calendar like it has seasons."
            accentFrom={4}
            className="mx-auto max-w-3xl font-display uppercase leading-[1.12] tracking-[-0.01em] text-[clamp(28px,5.5vw,62px)] text-se-ink [perspective:800px]"
          />
          <RevealGroup>
            <RevealItem>
              <p className="mx-auto mt-6 max-w-xl text-balance text-lg text-se-ink-muted">
                Because it does. A single flat rate all year is the most common way hosts leave
                money on both ends of the calendar at once.
              </p>
            </RevealItem>
            <RevealItem>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Button href={CTA.audit.href} variant="primary" size="lg" haptic>
                  {CTA.audit.label}
                </Button>
                <Button href={ROUTES.services} variant="ghost" size="lg">
                  See all services
                </Button>
              </div>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>

      <Section ground="deep">
        <SectionHeading
          eyebrow="What we price deliberately"
          title="Four levers, priced on purpose."
        />
        <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2">
          {LEVERS.map((l) => (
            <RevealItem key={l.title}>
              <div className="se-edge-strip flex h-full flex-col rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-surface p-6 pl-7">
                <h3 className="font-body text-lg font-bold text-se-ink">{l.title}</h3>
                <p className="mt-3 flex-1 text-sm text-se-ink-muted">{l.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section>
        <SectionHeading eyebrow="How it works" title="From comp set to calendar." />
        <RevealGroup className="mt-14 grid gap-4 md:grid-cols-3">
          {PROCESS.map((p) => (
            <RevealItem key={p.n}>
              <div className="h-full rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-6">
                <span className="se-num text-2xl text-se-accent">{p.n}</span>
                <h3 className="mt-4 font-body text-lg font-bold text-se-ink">{p.title}</h3>
                <p className="mt-2 text-sm text-se-ink-muted">{p.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section ground="deep">
        <SectionHeading eyebrow="Related" title="Pricing works alongside the rest of the listing." />
        <RevealGroup className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
          {[
            { href: ROUTES.revenueGrowth, label: "Revenue Growth", body: "Occupancy and ADR, moved together." },
            { href: ROUTES.listingOptimization, label: "Listing Optimization", body: "So the price matches the presentation." },
            { href: "/knowledge/adr-occupancy-revpar-explained", label: "ADR, Occupancy & RevPAR", body: "The three numbers pricing decisions turn on." },
          ].map((s) => (
            <RevealItem key={s.href}>
              <Link
                href={s.href}
                className="block h-full rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-surface p-5 transition-colors hover:border-[var(--se-line-strong)]"
              >
                <p className="font-body font-semibold text-se-ink">{s.label}</p>
                <p className="mt-1 text-sm text-se-ink-muted">{s.body}</p>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section>
        <SectionHeading eyebrow="Questions" title="Straight answers." />
        <Reveal className="mx-auto mt-12 max-w-2xl">
          <div className="divide-y divide-[var(--se-line)] border-y border-[var(--se-line)]">
            {FAQS.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-body font-semibold text-se-ink">
                  {f.q}
                  <span className="shrink-0 text-se-accent transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-se-ink-muted">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button href={CTA.audit.href} variant="primary" size="lg" haptic>
              See what your calendar is leaving on the table — free
            </Button>
          </div>
        </Reveal>
      </Section>

      <JsonLd
        schemas={[
          pricingStrategyServiceSchema(),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: "Services", path: ROUTES.services },
            { name: TITLE, path: ROUTES.pricingStrategy },
          ]),
        ]}
      />
    </>
  );
}
