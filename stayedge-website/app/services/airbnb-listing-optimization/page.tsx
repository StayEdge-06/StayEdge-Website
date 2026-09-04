import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/sections/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { WordReveal } from "@/components/motion/ScrollFX";
import { EyebrowTypeOn } from "@/components/motion/EyebrowTypeOn";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  faqSchema,
  listingOptimizationServiceSchema,
} from "@/lib/seo/schema";
import { CTA, ROUTES, DEFAULT_OG_IMAGE } from "@/lib/config/site";
import Link from "next/link";

const TITLE = "Airbnb Listing Optimization Service";
const DESCRIPTION =
  "A structured review of your Airbnb listing's title, photo order, description, amenities and house rules — rewritten so a guest scrolling past understands the value in seconds, not paragraphs.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTES.listingOptimization },
  openGraph: {
    title: `${TITLE} — StayEdge`,
    description: DESCRIPTION,
    url: ROUTES.listingOptimization,
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

const ELEMENTS = [
  {
    title: "Title & first photo",
    body: "The two things a guest sees before they've clicked anything. Most listings waste both on the building instead of the reason to book.",
  },
  {
    title: "Photo order",
    body: "The sequence a guest actually scrolls through — leading with what they're buying, not what's easiest to photograph.",
  },
  {
    title: "Description structure",
    body: "Written for a guest deciding in ten seconds, not a brochure read end to end. Answers the questions that would otherwise become messages.",
  },
  {
    title: "Amenities & house rules",
    body: "The details that quietly cost bookings when they're missing, buried, or contradict the photos.",
  },
];

const PROCESS = [
  { n: "01", title: "We read the listing", body: "Title, photos, description, amenities, reviews and pricing — read the way a guest scrolling past reads them." },
  { n: "02", title: "We prioritise", body: "Not a 40-point checklist. The handful of changes most likely to change guest behaviour first." },
  { n: "03", title: "You implement, or we do", body: "A written list you can action yourself, or we make the changes with you if you'd rather hand it off." },
];

const FAQS = [
  {
    q: "What does Airbnb listing optimization actually mean?",
    a: "Rewriting and restructuring the elements a guest sees before booking — title, photo order, description, amenities and house rules — so they communicate the property's value quickly and accurately, rather than assuming a guest will read everything.",
  },
  {
    q: "Is this different from Airbnb SEO?",
    a: "Related but distinct. Listing optimization is about conversion — turning a view into a booking once a guest has found you. Airbnb SEO is about visibility — being found in search in the first place. Most listings need both.",
  },
  {
    q: "Do I need new photos first?",
    a: "Not always. Photo order and selection from what you already have often unlocks most of the gain before a reshoot is worth the cost. If new photos are genuinely needed, we'll say so.",
  },
  {
    q: "How long does an optimization take?",
    a: "The review and prioritised list is typically ready within a few days. Implementation timing depends on whether you action it yourself or we do.",
  },
  {
    q: "Does this work for a brand-new listing with no reviews?",
    a: "Yes — arguably it matters most there. A new listing has no review history to lean on, so the listing itself has to do all the persuading.",
  },
];

export default function ListingOptimizationPage() {
  return (
    <>
      <section id="top" className="relative overflow-hidden bg-se-ground scroll-mt-16">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[760px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-40 blur-[130px]"
          style={{ background: "radial-gradient(closest-side, var(--se-glow), transparent)" }}
        />
        <div className="relative z-10 mx-auto max-w-[900px] px-5 py-24 text-center md:px-8 md:py-32">
          <EyebrowTypeOn text="Airbnb Listing Optimization" className="mb-5" />
          <WordReveal
            as="h1"
            text="Turn a scrolled-past listing into a booked one."
            accentFrom={5}
            className="mx-auto max-w-3xl font-display uppercase leading-[1.12] tracking-[-0.01em] text-[clamp(28px,5.5vw,62px)] text-se-ink [perspective:800px]"
          />
          <RevealGroup>
            <RevealItem>
              <p className="mx-auto mt-6 max-w-xl text-balance text-lg text-se-ink-muted">
                Most listings lose bookings before a guest ever messages — in the title, the
                first photo, or the third paragraph nobody reads. We find where, and fix it.
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
          eyebrow="What we optimise"
          title="Four elements, one job each."
          intro="Every part of a listing is either helping a guest decide or costing you the booking. Nothing in between."
        />
        <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2">
          {ELEMENTS.map((e) => (
            <RevealItem key={e.title}>
              <div className="se-edge-strip flex h-full flex-col rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-surface p-6 pl-7">
                <h3 className="font-body text-lg font-bold text-se-ink">{e.title}</h3>
                <p className="mt-3 flex-1 text-sm text-se-ink-muted">{e.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section>
        <SectionHeading eyebrow="How it works" title="A structured read, not a guess." />
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
        <SectionHeading eyebrow="Related" title="Optimization works alongside pricing and search." />
        <RevealGroup className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
          {[
            { href: ROUTES.airbnbSeo, label: "Airbnb SEO", body: "Get found before you get chosen." },
            { href: ROUTES.pricingStrategy, label: "Pricing Strategy", body: "Price the calendar deliberately." },
            { href: ROUTES.photographyGuidance, label: "Photography Guidance", body: "The photos behind the order." },
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
              See what we&apos;d fix first — free
            </Button>
          </div>
        </Reveal>
      </Section>

      <JsonLd
        schemas={[
          listingOptimizationServiceSchema(),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: "Services", path: ROUTES.services },
            { name: TITLE, path: ROUTES.listingOptimization },
          ]),
        ]}
      />
    </>
  );
}
