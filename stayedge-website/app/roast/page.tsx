import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { RoastEngine } from "@/components/ai/RoastEngine";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, roastToolSchema, faqSchema } from "@/lib/seo/schema";
import { DEFAULT_OG_IMAGE, ROUTES } from "@/lib/config/site";
import { InternalParagraph } from "@/components/seo/InternalLinks";

export const metadata: Metadata = {
  title: "Airbnb Listing Roast — Free AI Audit & Listing Analyzer",
  description:
    "Get a free AI-powered Airbnb listing roast: Vira analyzes your listing, pinpoints revenue leaks, and gives you a Roast Score. The fastest free Airbnb listing audit for hosts who want more bookings.",
  alternates: { canonical: "/roast" },
  openGraph: {
    title: "Airbnb Listing Roast — Free AI Audit & Listing Analyzer · StayEdge",
    description:
      "Get a free AI-powered Airbnb listing roast: Vira analyzes your listing, pinpoints revenue leaks, and gives you a Roast Score. The fastest free Airbnb listing audit for hosts who want more bookings.",
    url: "/roast",
    siteName: "StayEdge",
    locale: "en_IN",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Airbnb Listing Roast — Free AI Audit & Listing Analyzer · StayEdge",
    description:
      "Get a free AI-powered Airbnb listing roast: Vira analyzes your listing, pinpoints revenue leaks, and gives you a Roast Score. The fastest free Airbnb listing audit for hosts who want more bookings.",
    images: [DEFAULT_OG_IMAGE],
  },
};

const ROAST_FAQS = [
  {
    q: "What is an Airbnb listing roast?",
    a: "An Airbnb listing roast is a free AI-powered audit of your Airbnb listing. Vira, StayEdge's analysis engine, reviews your listing URL, title, pricing, and location to score your listing and identify issues quietly costing you bookings — from weak descriptions and poor photos to pricing missteps and missing guest psychology signals.",
  },
  {
    q: "Is the Airbnb listing roast really free?",
    a: "Yes — your first three issues and Roast Score are completely free with no email required. To unlock the full report including all revenue-leak issues and a personalised Property Growth Snapshot, you share your WhatsApp number so StayEdge can send you the complete breakdown.",
  },
  {
    q: "How does the AI Airbnb audit work?",
    a: "Vira evaluates your listing across multiple dimensions: listing quality, pricing strategy, guest-experience signals, photography clues, and competitive positioning. Each issue is tagged with severity, and you get a numeric Roast Score benchmarked against top-performing listings in similar markets.",
  },
  {
    q: "What kind of issues does the Airbnb listing analyzer find?",
    a: "Common issues include weak listing titles, missing or generic descriptions, pricing that leaves money on the table, weekend-pricing gaps, poor photo sequencing clues, slow response-time indicators, and missing amenities that guests in your market expect. Each issue comes with a specific, actionable observation.",
  },
  {
    q: "Who is behind the Airbnb SEO audit tool?",
    a: "The tool is built by StayEdge, a Tirupati-based Airbnb growth consultancy founded by Sanjay Stephen. StayEdge specialises in listing optimisation, revenue management, and guest-psychology-driven improvements for hosts, villas, and boutique hotels across India.",
  },
];

export default function RoastPage() {
  return (
    <>
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <RoastEngine />
      </Suspense>

      {/* SEO content block — below-the-fold for AI search visibility,
          keyword-rich entity context and internal links. */}
      <section className="mx-auto max-w-3xl px-5 pb-24 md:px-8">
        <div className="mt-20 border-t border-[var(--se-line)] pt-12">
          <h2 className="font-display text-2xl font-bold text-se-offwhite">
            Free Airbnb Listing Audit — How It Works
          </h2>
          <InternalParagraph className="mt-4 text-se-grey-lavender">
            Vira is an [[/|AI Airbnb listing analyzer]] that acts like a
            revenue-management consultant reviewing your property for the first
            time. Paste your listing URL and answer a few quick questions (title,
            price, city), and Vira returns a Roast Score with your top three
            issues — things like weak [[airbnb-ranking-factors-hosts-control|
            Airbnb SEO]], pricing that doesn&apos;t match guest expectations, or
            listing-photo clues that signal lower conversion. The full audit
            unlocks every issue and a personalised growth plan.
          </InternalParagraph>

          <h3 className="mt-10 font-display text-xl font-bold text-se-offwhite">
            Why hosts use the Airbnb Listing Analyzer
          </h3>
          <ul className="mt-4 space-y-3 text-se-grey-lavender">
            <li className="flex gap-3">
              <span aria-hidden className="text-se-positive shrink-0">✓</span>
              <span><strong className="text-se-offwhite">Pinpoint revenue leaks</strong> — discover the specific issues that stop guests from booking, ranked by impact.</span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden className="text-se-positive shrink-0">✓</span>
              <span><strong className="text-se-offwhite">Benchmark your listing</strong> — see how your score compares to top listings in your market and what separates a good score from a great one.</span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden className="text-se-positive shrink-0">✓</span>
              <span><strong className="text-se-offwhite">Get a free growth plan</strong> — unlock the full [[/audit|Property Growth Snapshot]] with every issue, your revenue leak, and a step-by-step plan.</span>
            </li>
          </ul>

          <p className="mt-6 text-sm text-se-grey-lavender">
            Already know your listing needs work?{" "}
            <Link href={ROUTES.audit} className="text-se-purple underline decoration-se-purple/30 underline-offset-2 hover:decoration-se-purple">
              Book a free discovery call
            </Link>{" "}
            with StayEdge&apos;s team, or explore our{" "}
            <Link href={ROUTES.services} className="text-se-purple underline decoration-se-purple/30 underline-offset-2 hover:decoration-se-purple">
              Airbnb growth services
            </Link>
            {" "}for hands-on optimisation, dynamic pricing, and guest-psychology work.
          </p>
        </div>

        {/* FAQ — on-page content + structured data */}
        <div className="mt-12 border-t border-[var(--se-line)] pt-8">
          <h2 className="font-display text-xl font-bold text-se-offwhite">
            Frequently asked questions
          </h2>
          {ROAST_FAQS.map((f) => (
            <details key={f.q} className="group border-b border-[var(--se-line)] py-4">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-body font-semibold text-se-offwhite">
                {f.q}
                <span className="shrink-0 text-se-lavender transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-se-grey-lavender">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <JsonLd
        schemas={[
          roastToolSchema(),
          breadcrumbSchema([{ name: "Roast My Listing", path: "/roast" }]),
          faqSchema(ROAST_FAQS),
        ]}
      />
    </>
  );
}
