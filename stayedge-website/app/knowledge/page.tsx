import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/sections/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { CLUSTERS } from "@/lib/content/clusters";
import { articlesByCluster } from "@/lib/content/articles";
import { ANSWERS, answerSlug } from "@/lib/content/answers";
import { Button } from "@/components/ui/Button";
import { ROUTES, WHATSAPP_URL } from "@/lib/config/site";
import { PERSONA } from "@/lib/config/persona";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";
import { DEFAULT_OG_IMAGE } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Airbnb Growth Knowledge — Straight Answers for Hosts",
  description:
    "What is Airbnb SEO? How does dynamic pricing work? How do you increase bookings and occupancy? Straight, factual answers for Airbnb hosts — no hype.",
  alternates: { canonical: "/knowledge" },
  openGraph: {
    title: "Airbnb Growth Knowledge — Straight Answers for Hosts · StayEdge",
    description:
      "What is Airbnb SEO? How does dynamic pricing work? How do you increase bookings and occupancy? Straight, factual answers for Airbnb hosts — no hype.",
    url: "/knowledge",
    siteName: "StayEdge",
    locale: "en_IN",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Airbnb Growth Knowledge — Straight Answers for Hosts · StayEdge",
    description:
      "What is Airbnb SEO? How does dynamic pricing work? How do you increase bookings and occupancy? Straight, factual answers for Airbnb hosts — no hype.",
    images: [DEFAULT_OG_IMAGE],
  },
};

const FAQ_FOR_SCHEMA = ANSWERS.map(({ q, a }) => ({ q, a }));

export default function KnowledgePage() {
  const withArticles = CLUSTERS.map((c) => ({ ...c, articles: articlesByCluster(c.id) }));

  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="Knowledge"
          title="The Airbnb growth library."
          intro="Guides, answers and definitions for hosts — written from real work, no hype."
        />

        {/* Topic clusters (Authority Engine) */}
        <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2">
          {withArticles.map((c) => (
            <RevealItem key={c.id}>
              <TiltCard className="block h-full rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-6">
                <h2 className="font-body text-lg font-bold text-se-offwhite">{c.title}</h2>
                <p className="mt-1 text-sm text-se-grey-lavender">{c.blurb}</p>
                {c.articles.length > 0 ? (
                  <ul className="mt-4 space-y-2 border-t border-[var(--se-line)] pt-4">
                    {c.articles.map((a) => (
                      <li key={a.slug}>
                        <Link
                          href={`/knowledge/${a.slug}`}
                          className="text-se-lavender underline-offset-4 hover:underline"
                        >
                          {a.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 border-t border-[var(--se-line)] pt-4 text-xs text-se-grey-lavender">
                    Guides publishing soon.
                  </p>
                )}
              </TiltCard>
            </RevealItem>
          ))}

          <RevealItem>
            <TiltCard className="block h-full">
              <Link
                href="/knowledge/glossary"
                className="flex h-full flex-col rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-3 p-6 transition-colors hover:border-[var(--se-line-strong)]"
              >
                <h2 className="font-body text-lg font-bold text-se-offwhite">Host Glossary</h2>
                <p className="mt-1 flex-1 text-sm text-se-offwhite/80">
                  ADR, RevPAR, occupancy, gap nights — the numbers that decide your revenue,
                  in plain language.
                </p>
                <span className="mt-4 text-sm font-semibold text-se-lavender">Open the glossary →</span>
              </Link>
            </TiltCard>
          </RevealItem>
        </RevealGroup>

        <div className="mx-auto mt-16 max-w-3xl border-t border-[var(--se-line)] pt-10 text-center">
          <h2 className="se-title text-[clamp(22px,3vw,32px)] text-se-offwhite">Quick answers</h2>
          <p className="mt-2 text-se-grey-lavender">The questions hosts ask most, answered in a paragraph.</p>
        </div>

        <RevealGroup className="mx-auto mt-14 max-w-3xl space-y-4">
          {ANSWERS.map((item) => (
            <RevealItem key={item.q}>
              <article
                id={answerSlug(item.q)}
                className="se-edge-strip scroll-mt-24 rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-6 pl-7 md:p-8 md:pl-9"
              >
                <h2 className="font-body text-lg font-bold text-se-offwhite">{item.q}</h2>
                <p className="mt-3 text-se-offwhite/90">{item.a}</p>
                {item.detail.map((d) => (
                  <p key={d.slice(0, 24)} className="mt-2 text-sm text-se-grey-lavender">
                    {d}
                  </p>
                ))}
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mx-auto mt-12 max-w-xl rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-8 text-center">
          <p className="text-se-offwhite">
            Reading is slower than knowing. {PERSONA.name} can read your listing and tell you
            which of these actually applies to you — free.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button href={ROUTES.freeAudit} variant="primary" size="md" haptic>
              Get your free audit
            </Button>
            <Button href={WHATSAPP_URL} external variant="ghost" size="md">
              Ask us on WhatsApp
            </Button>
          </div>
        </Reveal>
      </Section>

      <JsonLd
        schemas={[
          faqSchema(FAQ_FOR_SCHEMA),
          breadcrumbSchema([{ name: "Knowledge", path: "/knowledge" }]),
        ]}
      />
    </>
  );
}
