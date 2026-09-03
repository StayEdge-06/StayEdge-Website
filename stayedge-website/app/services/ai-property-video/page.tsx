import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/sections/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { WordReveal } from "@/components/motion/ScrollFX";
import { EyebrowTypeOn } from "@/components/motion/EyebrowTypeOn";
import { Button } from "@/components/ui/Button";
import { LeadForm } from "@/components/forms/LeadForm";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  aiPropertyVideoServiceSchema,
  breadcrumbSchema,
  faqSchema,
  localBusinessSchema,
  organizationSchema,
} from "@/lib/seo/schema";
import { CTA, DEFAULT_OG_IMAGE } from "@/lib/config/site";

const TITLE = "AI Property Video";
const DESCRIPTION =
  "Cinematic AI-produced video for short-term rental properties — Instagram Reels, YouTube Shorts, walkthroughs, promotional films and website hero video. Produced by StayEdge for hosts, villas and boutique hotels in India.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/services/ai-property-video" },
  openGraph: {
    title: `${TITLE} — StayEdge`,
    description: DESCRIPTION,
    url: "/services/ai-property-video",
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

/** The five formats. These are what we produce — a service menu, not a tool. */
const FORMATS = [
  {
    title: "Instagram Reels",
    body: "Vertical, fast, built for the first two seconds. The format that actually travels for stays.",
    spec: "9:16 · 15–30s",
  },
  {
    title: "YouTube Shorts",
    body: "The same story cut for a platform where people search for places rather than scroll past them.",
    spec: "9:16 · up to 60s",
  },
  {
    title: "Property walkthrough",
    body: "A calm, continuous read of the space — what a guest wants before they commit to a booking.",
    spec: "16:9 · 60–90s",
  },
  {
    title: "Promotional video",
    body: "Season, offer or launch. Built around one message and one thing you want the viewer to do.",
    spec: "16:9 or 1:1 · 30–60s",
  },
  {
    title: "Website hero video",
    body: "A silent, looping backdrop for your own site or direct-booking page. Light enough not to cost you load time.",
    spec: "16:9 · 8–15s loop",
  },
];

const PROCESS = [
  {
    n: "01",
    title: "Your material",
    body: "You send photos, existing clips and the listing link. No shoot, no crew, no travel — we work from what the property already has.",
  },
  {
    n: "02",
    title: "The story",
    body: "We decide what the video is for: the scroll-stopper, the reassurance, or the direct-booking pitch. One job per video.",
  },
  {
    n: "03",
    title: "AI production",
    body: "Motion, pacing, grade, captions and sound designed around that job — produced with AI tooling and finished by a person.",
  },
  {
    n: "04",
    title: "Delivery",
    body: "Master file plus the platform cuts you need, sized and captioned, ready to post.",
  },
];

const VIDEO_FAQS = [
  {
    q: "Do you need to visit the property?",
    a: "No. We produce from the photos and clips you already have. If the existing material is too thin to work with, we'll say so before quoting rather than deliver something weak.",
  },
  {
    q: "Is this an AI tool I use myself?",
    a: "No — it's a production service. We use AI tooling to produce the video; you receive finished files. There's nothing for you to learn or operate.",
  },
  {
    q: "How long does it take?",
    a: "Typically a few working days from receiving your material, depending on the format and how many cuts you need.",
  },
  {
    q: "What does it cost?",
    a: "It depends on the format, the number of cuts and the state of your existing material, so we quote per property rather than publish a rate card. Send your listing and we'll come back with a number.",
  },
  {
    q: "Can I use the video in ads?",
    a: "Yes. The delivered files are yours to use on your listing, your social channels, your website and paid placements.",
  },
];

export default function AIPropertyVideoPage() {
  return (
    <>
      <section id="top" className="relative overflow-hidden bg-se-ground scroll-mt-16">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[760px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-40 blur-[130px]"
          style={{ background: "radial-gradient(closest-side, var(--se-glow), transparent)" }}
        />
        <div className="relative z-10 mx-auto max-w-[900px] px-5 py-24 text-center md:px-8 md:py-32">
          <EyebrowTypeOn text="AI Property Video" className="mb-5" />
          <WordReveal
            as="h1"
            text="Your property, filmed the way it deserves."
            accentFrom={4}
            className="mx-auto max-w-3xl font-display uppercase leading-[1.12] tracking-[-0.01em] text-[clamp(28px,5.5vw,62px)] text-se-offwhite [perspective:800px]"
          />
          <RevealGroup>
            <RevealItem>
              <p className="mx-auto mt-6 max-w-xl text-balance text-lg text-se-grey-lavender">
                Cinematic video produced with AI — from the photos and clips you already have.
                No shoot, no crew, no travel days.
              </p>
            </RevealItem>
            <RevealItem>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Button href="#request" variant="primary" size="lg" haptic>
                  {CTA.video.label}
                </Button>
                <Button href={CTA.audit.href} variant="ghost" size="lg">
                  {CTA.audit.short}
                </Button>
              </div>
            </RevealItem>
            <RevealItem>
              <p className="mt-5 text-xs text-se-grey-lavender">
                A production service, not a tool — you receive finished files.
              </p>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>

      {/* Formats */}
      <Section ground="deep">
        <SectionHeading
          eyebrow="Formats"
          title="One property. Five ways to show it."
          intro="Each format does a different job. We'll tell you which one your property actually needs."
        />
        <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FORMATS.map((f) => (
            <RevealItem key={f.title}>
              <div className="se-edge-strip flex h-full flex-col rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-charcoal p-6 pl-7">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-body text-lg font-bold text-se-offwhite">{f.title}</h3>
                  <span className="se-eyebrow shrink-0 !text-se-grey-lavender">{f.spec}</span>
                </div>
                <p className="mt-3 flex-1 text-sm text-se-grey-lavender">{f.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Process */}
      <Section>
        <SectionHeading
          eyebrow="How it's made"
          title="From your photos to a finished cut."
          intro="AI does the production work. A person decides what the video is for — and that's the part that makes it convert."
        />
        <RevealGroup className="mt-14 grid gap-4 md:grid-cols-4">
          {PROCESS.map((p) => (
            <RevealItem key={p.n}>
              <div className="h-full rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-6">
                <span className="se-num text-2xl text-se-lavender">{p.n}</span>
                <h3 className="mt-4 font-body text-lg font-bold text-se-offwhite">{p.title}</h3>
                <p className="mt-2 text-sm text-se-grey-lavender">{p.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Request */}
      <Section ground="deep" id="request">
        <SectionHeading
          eyebrow="Request"
          title="Tell us about the property."
          intro="Send the listing and what you want the video to do. We'll come back with formats, timeline and price."
        />
        <Reveal className="mx-auto mt-12 max-w-3xl">
          <LeadForm variant="video" />
        </Reveal>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHeading eyebrow="Questions" title="Straight answers." />
        <Reveal className="mx-auto mt-12 max-w-2xl">
          <div className="divide-y divide-[var(--se-line)] border-y border-[var(--se-line)]">
            {VIDEO_FAQS.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-body font-semibold text-se-offwhite">
                  {f.q}
                  <span className="shrink-0 text-se-lavender transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-se-grey-lavender">{f.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </Section>

      <JsonLd
        schemas={[
          organizationSchema(),
          localBusinessSchema(),
          aiPropertyVideoServiceSchema(),
          faqSchema(VIDEO_FAQS),
          breadcrumbSchema([
            { name: "Services", path: "/services" },
            { name: TITLE, path: "/services/ai-property-video" },
          ]),
        ]}
      />
    </>
  );
}
