import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/sections/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { WordReveal } from "@/components/motion/ScrollFX";
import { EyebrowTypeOn } from "@/components/motion/EyebrowTypeOn";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { airbnbSeoServiceSchema, breadcrumbSchema, faqSchema } from "@/lib/seo/schema";
import { CTA, ROUTES, DEFAULT_OG_IMAGE } from "@/lib/config/site";

const TITLE = "Airbnb SEO Service";
const DESCRIPTION =
  "Ranking inside Airbnb's own search — response behaviour, listing completeness, review velocity, calendar accuracy and price competitiveness — for hosts who want to be found without paying for placement.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTES.airbnbSeo },
  openGraph: {
    title: `${TITLE} — StayEdge`,
    description: DESCRIPTION,
    url: ROUTES.airbnbSeo,
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

const FACTORS = [
  { title: "Response behaviour", body: "How fast and how consistently you reply. Airbnb rewards hosts guests can rely on before they even book." },
  { title: "Listing completeness", body: "Every field filled accurately — amenities, house rules, description length — signals a listing worth surfacing." },
  { title: "Review velocity & quality", body: "Not just star rating — how recently and how often you're earning reviews at all." },
  { title: "Calendar accuracy", body: "An up-to-date, realistic calendar is a ranking signal in itself, separate from occupancy." },
  { title: "Price competitiveness", body: "Priced sensibly against your comp set — not cheapest, but not so far out that search demotes you." },
  { title: "Instant Book & booking friction", body: "Fewer steps between a guest finding you and confirming — friction that costs both bookings and rank." },
];

const FAQS = [
  {
    q: "Is Airbnb SEO the same as Google SEO?",
    a: "No. This is about ranking inside Airbnb's own internal search — the algorithm that decides which listings surface for a guest's dates and location. It shares some logic with web SEO (relevance, engagement signals) but the specific factors are Airbnb's own.",
  },
  {
    q: "Can you guarantee a ranking position?",
    a: "No, and any consultant who claims to is not being straight with you. Airbnb's ranking model is not public and changes over time. What we do is work the factors known to matter, consistently, and track how your listing's visibility responds.",
  },
  {
    q: "Does a new listing rank lower automatically?",
    a: "New listings get a temporary visibility boost in most markets, which fades. What replaces it is the accumulated signal above — this is exactly the window where early habits (response speed, calendar accuracy) matter most.",
  },
  {
    q: "How does pricing affect search ranking?",
    a: "Price competitiveness is one factor among several, not the deciding one. A well-optimised, responsive listing priced sensibly usually outperforms a cheaper listing that's inconsistent on the other signals.",
  },
  {
    q: "How is this different from listing optimization?",
    a: "Airbnb SEO is about being found — surfacing in search results at all. Listing optimization is about conversion once you're found — turning that impression into a booking. Most hosts need both.",
  },
];

export default function AirbnbSeoPage() {
  return (
    <>
      <section id="top" className="relative overflow-hidden bg-se-ground scroll-mt-16">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[760px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-40 blur-[130px]"
          style={{ background: "radial-gradient(closest-side, var(--se-glow), transparent)" }}
        />
        <div className="relative z-10 mx-auto max-w-[900px] px-5 py-24 text-center md:px-8 md:py-32">
          <EyebrowTypeOn text="Airbnb SEO" className="mb-5" />
          <WordReveal
            as="h1"
            text="Rank inside Airbnb's search, not just Google's."
            accentFrom={5}
            className="mx-auto max-w-3xl font-display uppercase leading-[1.12] tracking-[-0.01em] text-[clamp(28px,5.5vw,62px)] text-se-ink [perspective:800px]"
          />
          <RevealGroup>
            <RevealItem>
              <p className="mx-auto mt-6 max-w-xl text-balance text-lg text-se-ink-muted">
                A well-written listing that never surfaces in search doesn&apos;t get read.
                We work the signals Airbnb&apos;s ranking actually rewards.
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
          eyebrow="What decides rank"
          title="Six signals we work, in order of leverage."
          intro="No public formula exists, but industry-observed patterns are consistent across hosts and markets."
        />
        <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FACTORS.map((f) => (
            <RevealItem key={f.title}>
              <div className="se-edge-strip flex h-full flex-col rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-surface p-6 pl-7">
                <h3 className="font-body text-lg font-bold text-se-ink">{f.title}</h3>
                <p className="mt-3 flex-1 text-sm text-se-ink-muted">{f.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section>
        <SectionHeading eyebrow="Related" title="Search visibility works with what's behind it." />
        <RevealGroup className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
          {[
            { href: ROUTES.listingOptimization, label: "Listing Optimization", body: "Convert the guests search sends you." },
            { href: ROUTES.pricingStrategy, label: "Pricing Strategy", body: "Priced to compete, not just to rank." },
            { href: "/knowledge/local-seo-for-short-term-rentals", label: "Local SEO Guide", body: "Being found beyond Airbnb itself." },
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
              See what&apos;s costing us search visibility — free
            </Button>
          </div>
        </Reveal>
      </Section>

      <JsonLd
        schemas={[
          airbnbSeoServiceSchema(),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: "Services", path: ROUTES.services },
            { name: TITLE, path: ROUTES.airbnbSeo },
          ]),
        ]}
      />
    </>
  );
}
