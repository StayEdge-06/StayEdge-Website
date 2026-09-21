import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/sections/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { WordReveal } from "@/components/motion/ScrollFX";
import { EyebrowTypeOn } from "@/components/motion/EyebrowTypeOn";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema, revenueGrowthServiceSchema } from "@/lib/seo/schema";
import { CTA, ROUTES, DEFAULT_OG_IMAGE } from "@/lib/config/site";

const TITLE = "Airbnb Revenue Growth Service";
const DESCRIPTION =
  "Occupancy and ADR moved together, not traded off — positioning, guest-segment targeting and a reporting cadence built around RevPAR for Airbnb hosts, villas and boutique hotels.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTES.revenueGrowth },
  openGraph: {
    title: `${TITLE} — StayEdge`,
    description: DESCRIPTION,
    url: ROUTES.revenueGrowth,
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

const PILLARS = [
  { title: "Positioning", body: "A clear promise for a clear guest. Properties that try to suit everyone tend to win on price alone — and price alone is a race to the bottom." },
  { title: "Guest-segment targeting", body: "Business travellers, pilgrimage families, weekend leisure, medical tourism — each books differently. Revenue strategy starts with naming which one you're actually serving." },
  { title: "Occupancy & ADR, together", body: "Chasing occupancy alone drives rates down; chasing ADR alone leaves nights empty. The goal is RevPAR — the two moved in the same direction." },
  { title: "Reporting cadence", body: "A regular, honest read of what's actually happening in the numbers — not a dashboard nobody opens." },
];

const FAQS = [
  {
    q: "What's the difference between revenue growth and pricing strategy?",
    a: "Pricing strategy is the calendar-level mechanics — what a given night should cost. Revenue growth is the layer above it: who you're positioning for, which guest segment you're actually winning, and whether occupancy and ADR are moving together toward RevPAR, not being traded off against each other.",
  },
  {
    q: "What is RevPAR and why does it matter more than occupancy?",
    a: "Revenue per available night — occupancy multiplied by ADR. A listing at 90% occupancy and a low rate can earn less than one at 65% occupancy and a well-set rate. Optimising occupancy alone, without watching RevPAR, is a common way hosts work hard for less money.",
  },
  {
    q: "Can you guarantee revenue growth?",
    a: "No — and any consultancy promising a guaranteed number without seeing your listing, market and comp set first isn't being straight with you. What we commit to is a clear read of where the gap is and a plan tied to your specific numbers.",
  },
  {
    q: "Do you manage the property, or just advise?",
    a: "We're not property managers — we don't take over your account, your keys, or your guest communication. This is growth consulting: strategy, positioning and pricing structure you keep control of.",
  },
  {
    q: "Is this only for underperforming listings?",
    a: "No. Established listings with strong occupancy are often the ones leaving the most on the table on ADR — occupancy alone can mask a pricing gap that's been there for years.",
  },
];

export default function RevenueGrowthPage() {
  return (
    <>
      <section id="top" className="relative overflow-hidden bg-se-ground scroll-mt-16">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[760px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-40 blur-[130px]"
          style={{ background: "radial-gradient(closest-side, var(--se-glow), transparent)" }}
        />
        <div className="relative z-10 mx-auto max-w-[900px] px-5 py-24 text-center md:px-8 md:py-32">
          <EyebrowTypeOn text="Revenue Growth" className="mb-5" />
          <WordReveal
            as="h1"
            text="Occupancy and ADR, moved together."
            accentFrom={4}
            className="mx-auto max-w-3xl font-display uppercase leading-[1.12] tracking-[-0.01em] text-[clamp(28px,5.5vw,62px)] text-se-ink [perspective:800px]"
          />
          <RevealGroup>
            <RevealItem>
              <p className="mx-auto mt-6 max-w-xl text-balance text-lg text-se-ink-muted">
                Not traded off. Full nights at low rates and empty nights at high ones are both
                revenue problems — we work the number that actually matters: RevPAR.
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
          eyebrow="How we grow revenue"
          title="Four pillars, one number they all serve."
        />
        <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2">
          {PILLARS.map((p) => (
            <RevealItem key={p.title}>
              <div className="se-edge-strip flex h-full flex-col rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-surface p-6 pl-7">
                <h3 className="font-body text-lg font-bold text-se-ink">{p.title}</h3>
                <p className="mt-3 flex-1 text-sm text-se-ink-muted">{p.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section>
        <SectionHeading eyebrow="Related" title="Revenue growth is built on the layers below it." />
        <RevealGroup className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
          {[
            { href: ROUTES.pricingStrategy, label: "Pricing Strategy", body: "The calendar-level mechanics." },
            { href: ROUTES.listingOptimization, label: "Listing Optimization", body: "Positioning starts with the listing itself." },
            { href: "/knowledge/off-season-revenue-playbook", label: "Off-Season Revenue Playbook", body: "Keeping RevPAR up when demand drops." },
          ].map((s) => (
            <RevealItem key={s.href}>
              <Link
                href={s.href}
                className="block h-full rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-5 transition-colors hover:border-[var(--se-line-strong)]"
              >
                <p className="font-body font-semibold text-se-ink">{s.label}</p>
                <p className="mt-1 text-sm text-se-ink-muted">{s.body}</p>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section ground="deep">
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
              Find your RevPAR gap — free
            </Button>
          </div>
        </Reveal>
      </Section>

      <JsonLd
        schemas={[
          revenueGrowthServiceSchema(),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: "Services", path: ROUTES.services },
            { name: TITLE, path: ROUTES.revenueGrowth },
          ]),
        ]}
      />
    </>
  );
}
