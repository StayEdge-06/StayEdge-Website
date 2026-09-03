import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/sections/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { WordReveal } from "@/components/motion/ScrollFX";
import { EyebrowTypeOn } from "@/components/motion/EyebrowTypeOn";
import { Button } from "@/components/ui/Button";
import { LeadForm } from "@/components/forms/LeadForm";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  faqSchema,
  freeAuditServiceSchema,
  localBusinessSchema,
  organizationSchema,
} from "@/lib/seo/schema";
import { CONTACT, DEFAULT_OG_IMAGE, WHATSAPP_URL } from "@/lib/config/site";

const TITLE = "Free Property Growth Audit";
const DESCRIPTION =
  "A free review of your Airbnb listing — listing quality, pricing and search visibility — returned as a prioritised list of what to fix first. No login, no card, reply on WhatsApp.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/free-audit" },
  openGraph: {
    title: `${TITLE} — StayEdge`,
    description: DESCRIPTION,
    url: "/free-audit",
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

/** What the audit actually covers. Scope, not promises — nothing here implies
 *  a result we cannot control. */
const COVERAGE = [
  {
    title: "Listing quality",
    body: "First photo, photo order, title, description, amenities — read the way a guest scrolling past reads them.",
  },
  {
    title: "Pricing",
    body: "Weekday vs weekend, seasonality, minimum stays and gap nights, against what comparable listings near you charge.",
  },
  {
    title: "Search visibility",
    body: "The signals Airbnb's ranking actually rewards, and which of them your listing is currently losing on.",
  },
];

const STEPS = [
  { n: "01", title: "You send the link", body: "Your name, a number to reach you on, and your listing URL. That's it." },
  { n: "02", title: "We read the listing", body: "A structured read across all three areas above — the same process behind our paid work." },
  { n: "03", title: "You get the list", body: "What to fix first, what it's likely costing you, and why — in plain language, on WhatsApp." },
];

/** Objection handling specific to this page, mirrored into FAQPage schema. */
const AUDIT_FAQS = [
  {
    q: "Is the Property Growth Audit really free?",
    a: "Yes. There's no card, no login and no obligation. You get the prioritised list whether or not you ever work with us — it's how we show you we know Airbnb before asking for anything.",
  },
  {
    q: "Do you need access to my Airbnb account?",
    a: "No. A public listing link is enough for the audit. If we later work together, we only ask for what a specific change needs, with your permission.",
  },
  {
    q: "How long does it take?",
    a: "We usually reply the same day, and always within two working days. A person reads your listing — this isn't an instant automated score.",
  },
  {
    q: "My listing is new and has few reviews. Is it worth auditing?",
    a: "Yes — launching right matters most for new listings, and that's often where the fastest gains are.",
  },
  {
    q: "What happens after the audit?",
    a: "Nothing you don't ask for. If you want help implementing the list, we'll quote for it once there's a clear return to aim at. If you'd rather do it yourself, the list is yours.",
  },
];

/**
 * Reading `?url=` here (via `searchParams`) would opt the whole page out of
 * static rendering — a needless cost on the site's single most important
 * route. The hero's listing-link handoff is a convenience, so `LeadForm`
 * picks it up on the client instead and the page stays prerendered.
 */
export default function FreeAuditPage() {
  return (
    <>
      {/* Conversion block — form above the fold on desktop, no competing CTA */}
      <section id="top" className="relative overflow-hidden bg-se-ground scroll-mt-16">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[760px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-40 blur-[130px]"
          style={{ background: "radial-gradient(closest-side, var(--se-glow), transparent)" }}
        />
        <div className="relative z-10 mx-auto grid max-w-[1200px] gap-12 px-5 py-20 md:px-8 md:py-24 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-16">
          <div>
            <EyebrowTypeOn text="Free Property Growth Audit" className="mb-5" />
            <WordReveal
              as="h1"
              text="Find out what your listing is quietly costing you."
              accentFrom={5}
              className="max-w-2xl font-display uppercase leading-[1.12] tracking-[-0.01em] text-[clamp(28px,5.5vw,60px)] text-se-offwhite [perspective:800px]"
            />
            <RevealGroup>
              <RevealItem>
                <p className="mt-6 max-w-xl text-lg text-se-grey-lavender">
                  Send us your Airbnb listing link. We&apos;ll read it across listing quality,
                  pricing and search visibility, and send back a prioritised list of what to
                  fix first — free.
                </p>
              </RevealItem>
              <RevealItem>
                <ul className="mt-8 space-y-3 text-se-offwhite/85">
                  {[
                    "No login, no card, no obligation",
                    "A real person reads your listing — not an instant score",
                    "Reply on WhatsApp, usually the same day",
                  ].map((line) => (
                    <li key={line} className="flex gap-3">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-se-lavender" />
                      {line}
                    </li>
                  ))}
                </ul>
              </RevealItem>
              <RevealItem>
                <p className="mt-8 text-sm text-se-grey-lavender">
                  Rather just talk?{" "}
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-se-lavender underline-offset-4 hover:underline"
                  >
                    WhatsApp {CONTACT.founder.split(" ")[0]} directly →
                  </a>
                </p>
              </RevealItem>
            </RevealGroup>
          </div>

          <Reveal>
            <LeadForm variant="audit" prefillFromQuery />
          </Reveal>
        </div>
      </section>

      {/* What's covered */}
      <Section ground="deep">
        <SectionHeading
          eyebrow="What's covered"
          title="Three lenses, one listing."
          intro="Most hosts change the wrong thing because they never diagnosed the right one. The audit reads all three together."
        />
        <RevealGroup className="mt-14 grid gap-4 md:grid-cols-3">
          {COVERAGE.map((c) => (
            <RevealItem key={c.title}>
              <div className="se-edge-strip h-full rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-charcoal p-6 pl-7">
                <h3 className="font-body text-lg font-bold text-se-offwhite">{c.title}</h3>
                <p className="mt-2 text-sm text-se-grey-lavender">{c.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* How it works */}
      <Section>
        <SectionHeading eyebrow="How it works" title="Three steps. One message from you." />
        <RevealGroup className="mt-14 grid gap-4 md:grid-cols-3">
          {STEPS.map((s) => (
            <RevealItem key={s.n}>
              <div className="h-full rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-6">
                <span className="se-num text-2xl text-se-lavender">{s.n}</span>
                <h3 className="mt-4 font-body text-lg font-bold text-se-offwhite">{s.title}</h3>
                <p className="mt-2 text-sm text-se-grey-lavender">{s.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Objections */}
      <Section ground="deep">
        <SectionHeading eyebrow="Before you ask" title="Straight answers." />
        <Reveal className="mx-auto mt-12 max-w-2xl">
          <div className="divide-y divide-[var(--se-line)] border-y border-[var(--se-line)]">
            {AUDIT_FAQS.map((f) => (
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
          <div className="mt-10 text-center">
            <Button href="#top" variant="primary" size="lg" haptic>
              Get my free audit
            </Button>
          </div>
        </Reveal>
      </Section>

      <JsonLd
        schemas={[
          organizationSchema(),
          localBusinessSchema(),
          freeAuditServiceSchema(),
          faqSchema(AUDIT_FAQS),
          breadcrumbSchema([{ name: TITLE, path: "/free-audit" }]),
        ]}
      />
    </>
  );
}
