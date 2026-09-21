import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/sections/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { WordReveal } from "@/components/motion/ScrollFX";
import { EyebrowTypeOn } from "@/components/motion/EyebrowTypeOn";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema, photographyGuidanceServiceSchema } from "@/lib/seo/schema";
import { CTA, ROUTES, DEFAULT_OG_IMAGE } from "@/lib/config/site";

const TITLE = "Airbnb Photography Guidance";
const DESCRIPTION =
  "A shot list, sequencing and staging review for Airbnb hosts — built for the camera you already have. Which photo leads, what order follows, and what to reshoot before the listing goes live.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTES.photographyGuidance },
  openGraph: {
    title: `${TITLE} — StayEdge`,
    description: DESCRIPTION,
    url: ROUTES.photographyGuidance,
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

const COVERAGE = [
  { title: "Shot list", body: "Which spaces to shoot, in what light, and what to stage first — specific to your property, not a generic checklist." },
  { title: "Sequencing", body: "The order guests actually scroll through. The best photo you have is worthless third from last." },
  { title: "Staging notes", body: "What to move, clear or add before the camera comes out — the difference between a room and a room a guest can picture staying in." },
  { title: "Reshoot list", body: "Which existing photos are actively costing bookings and should come down or be replaced first." },
];

const FAQS = [
  {
    q: "Do you send a photographer to my property?",
    a: "No — this is guidance, not a photography shoot. We review what you have and tell you exactly what to shoot, how to stage it and what order to use, whether you shoot it yourself or brief a local photographer.",
  },
  {
    q: "Do I need a professional camera?",
    a: "No. A modern phone camera in good natural light outperforms a professional camera used badly. Light and staging matter more than equipment for the vast majority of listings.",
  },
  {
    q: "What's the single biggest photo mistake hosts make?",
    a: "Leading with the exterior or a wide room shot instead of the specific thing a guest is deciding on — the bed, the view, the space that sells the stay. First impression should sell the decision, not describe the building.",
  },
  {
    q: "How many photos does a listing actually need?",
    a: "Enough to answer every question a guest would otherwise message you about — usually more than hosts think, and always fewer than a full photo dump of every angle of every room.",
  },
  {
    q: "Will you tell me if I need a professional shoot?",
    a: "Yes, honestly — if your existing material is too thin to work with regardless of guidance, we'll say so rather than force a fix that won't hold.",
  },
];

export default function PhotographyGuidancePage() {
  return (
    <>
      <section id="top" className="relative overflow-hidden bg-se-ground scroll-mt-16">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[760px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-40 blur-[130px]"
          style={{ background: "radial-gradient(closest-side, var(--se-glow), transparent)" }}
        />
        <div className="relative z-10 mx-auto max-w-[900px] px-5 py-24 text-center md:px-8 md:py-32">
          <EyebrowTypeOn text="Photography Guidance" className="mb-5" />
          <WordReveal
            as="h1"
            text="Guidance, not a shoot — your camera, our eye."
            accentFrom={4}
            className="mx-auto max-w-3xl font-display uppercase leading-[1.12] tracking-[-0.01em] text-[clamp(28px,5.5vw,62px)] text-se-ink [perspective:800px]"
          />
          <RevealGroup>
            <RevealItem>
              <p className="mx-auto mt-6 max-w-xl text-balance text-lg text-se-ink-muted">
                Most listings don&apos;t need a professional shoot. They need the right shot
                list, the right order, and the courage to delete a few photos.
              </p>
            </RevealItem>
            <RevealItem>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Button href={CTA.audit.href} variant="primary" size="lg" haptic>
                  {CTA.audit.label}
                </Button>
                <Button href={ROUTES.aiPropertyVideo} variant="ghost" size="lg">
                  See AI Property Video
                </Button>
              </div>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>

      <Section ground="deep">
        <SectionHeading
          eyebrow="What's covered"
          title="Four things, specific to your property."
        />
        <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2">
          {COVERAGE.map((c) => (
            <RevealItem key={c.title}>
              <div className="se-edge-strip flex h-full flex-col rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-surface p-6 pl-7">
                <h3 className="font-body text-lg font-bold text-se-ink">{c.title}</h3>
                <p className="mt-3 flex-1 text-sm text-se-ink-muted">{c.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section>
        <SectionHeading eyebrow="Related" title="Photos feed straight into optimization and video." />
        <RevealGroup className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
          {[
            { href: ROUTES.listingOptimization, label: "Listing Optimization", body: "Where the photos actually get used." },
            { href: ROUTES.aiPropertyVideo, label: "AI Property Video", body: "When photos alone aren't enough." },
            { href: "/knowledge/airbnb-photography-without-a-professional", label: "Photography Without a Professional", body: "The guide version of this service." },
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
              Get your free audit
            </Button>
          </div>
        </Reveal>
      </Section>

      <JsonLd
        schemas={[
          photographyGuidanceServiceSchema(),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: "Services", path: ROUTES.services },
            { name: TITLE, path: ROUTES.photographyGuidance },
          ]),
        ]}
      />
    </>
  );
}
