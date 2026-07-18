import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/sections/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { CLUSTERS } from "@/lib/content/clusters";
import { articlesByCluster } from "@/lib/content/articles";
import { Button } from "@/components/ui/Button";
import { ROUTES, WHATSAPP_URL } from "@/lib/config/site";
import { PERSONA } from "@/lib/config/persona";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Airbnb Growth Knowledge — Straight Answers for Hosts",
  description:
    "What is Airbnb SEO? How does dynamic pricing work? How do you increase bookings and occupancy? Straight, factual answers for Airbnb hosts — no hype.",
  alternates: { canonical: "/knowledge" },
};

/**
 * The Answer Center (AEO core). Every answer opens with a concise, quotable
 * definition, then a short actionable expansion. All claims are general
 * industry best practice — factual, no invented statistics (brand law).
 */
const ANSWERS: { q: string; a: string; detail: string[] }[] = [
  {
    q: "What is Airbnb SEO?",
    a: "Airbnb SEO is the practice of improving how an Airbnb listing ranks inside Airbnb's own search results. Airbnb's algorithm weighs listing quality, guest engagement, pricing competitiveness, availability and review signals to decide which listings appear first for a guest's search.",
    detail: [
      "The biggest levers a host controls are the title, the first photo, the description, response time, calendar availability and price positioning.",
      "Because ranking reflects guest engagement, improvements that earn more clicks and wishlist saves compound: better presentation leads to better ranking, which leads to more bookings.",
    ],
  },
  {
    q: "What is Airbnb listing optimization?",
    a: "Airbnb listing optimization is the systematic improvement of every element a guest sees — title, photos, description, amenities, pricing and reviews — so that more of the people who view the listing actually book it.",
    detail: [
      "It treats a listing like a product page: each element either earns the click, builds trust, or removes a reason to hesitate.",
      "Typical work includes reordering photos so the strongest image leads, rewriting the title around what guests actually search, and matching the description to the guests the property suits best.",
    ],
  },
  {
    q: "How does dynamic pricing work for Airbnb?",
    a: "Dynamic pricing means adjusting a listing's nightly rate based on demand instead of charging one flat price. Rates typically rise for weekends, festivals and high season, and ease on quiet weekdays to keep occupancy healthy.",
    detail: [
      "A flat price all year almost always loses money in both directions: weekends sell below what guests would pay, and slow Tuesdays sit empty at a rate nobody accepts.",
      "Good pricing also manages gap nights, minimum-stay rules and last-minute discounts deliberately rather than by default.",
    ],
  },
  {
    q: "How do I increase my Airbnb bookings?",
    a: "Bookings increase when more guests find the listing (visibility), more of them click it (first photo and title), and more of those who click actually reserve (description, reviews, pricing and trust signals). Fixing the weakest of those three stages first produces the fastest gains.",
    detail: [
      "Diagnose before changing anything: low views is a visibility problem; views without clicks is a first-impression problem; clicks without bookings is a conversion problem.",
      "Each stage has different fixes — treating them as one problem wastes effort on the wrong lever.",
    ],
  },
  {
    q: "How can I rank higher on Airbnb search?",
    a: "To rank higher on Airbnb, improve the signals the algorithm rewards: fast responses, high acceptance, an open and accurate calendar, competitive pricing, complete listing details and steady positive reviews. Listings that convert views into bookings get shown more.",
    detail: [
      "Quick wins: respond within an hour, keep the calendar current, and make the first photo the strongest interior shot rather than an exterior or street view.",
      "Ranking is earned gradually — consistency over weeks beats one-off changes.",
    ],
  },
  {
    q: "How can I improve my occupancy rate?",
    a: "Occupancy improves by widening who the listing appeals to on weak days: weekday-friendly pricing, flexible minimum stays, amenities that attract work travellers, and filling gap nights between bookings with targeted discounts.",
    detail: [
      "High weekend occupancy with empty weekdays is a pricing-structure problem, not a marketing problem.",
      "Occupancy should be balanced against rate: 100% occupancy usually means the price is too low.",
    ],
  },
  {
    q: "How do I optimize an Airbnb listing?",
    a: "Optimize in this order: first photo, title, price structure, description, photo order, amenities, and review responses. That order follows how guests actually decide — image first, headline second, price third, detail last.",
    detail: [
      "The first photo does more work than everything else combined; guests decide in seconds whether to keep scrolling.",
      "A title should say what the stay is, where it is, and why it's different — in the words a guest would search.",
    ],
  },
  {
    q: "Why are my Airbnb bookings low?",
    a: "Low bookings almost always trace to one of five causes: weak first photo, a title that says nothing, uncompetitive or flat pricing, thin or unanswered reviews, or a listing that guests can't find because of calendar and response issues. Identifying which one applies is the first real step.",
    detail: [
      "Most hosts guess at the cause and change the wrong thing; a structured read of the listing removes the guesswork.",
      `That diagnosis is exactly what ${PERSONA.name}'s free roast does — it reads the listing and names the specific issues, in minutes.`,
    ],
  },
];

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
              <div className="flex h-full flex-col rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-6">
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
              </div>
            </RevealItem>
          ))}

          <RevealItem>
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
                id={item.q.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}
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
            <Button href={ROUTES.roast} variant="primary" size="md">
              Roast my listing
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
