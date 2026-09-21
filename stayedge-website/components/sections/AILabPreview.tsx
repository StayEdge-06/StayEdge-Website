import Link from "next/link";
import { Section, SectionHeading } from "@/components/sections/Section";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { Button } from "@/components/ui/Button";
import { ROUTES, CTA } from "@/lib/config/site";

/**
 * AI Lab preview — the long-term organic acquisition engine. Free tools that
 * each solve one specific thing, then route into the funnel. Every tool here is
 * marked "Soon" because none is built yet: HONESTY LAW — we never label
 * something Live that a visitor cannot actually use. The one thing available
 * today is the Property Growth Audit, so that is the card that says Live and
 * the only one that links anywhere.
 */
const TOOLS = [
  { title: "Rewrite My Title", body: "A title guests click and the algorithm reads.", live: false },
  { title: "SEO Checker", body: "Are you findable for the searches that matter?", live: false },
  { title: "Description Analyzer", body: "Where your copy loses the booking.", live: false },
  { title: "Pricing Checker", body: "Weekday, weekend and gap pricing, read at a glance.", live: false },
  { title: "Photo Rating", body: "Which photo should lead — and which should go.", live: false },
  { title: "Growth Predictor", body: "Where a few changes could take your occupancy.", live: false },
];

/**
 * `tilt` opts into Tilt-to-Life Cards (signature #19). Off by default: on
 * the homepage this section is the 10th of 12 stacked sections, where an
 * 8th tilt-card instance would dilute rather than signature (see the
 * homepage redesign plan). On its own dedicated page (/lab) it's the page's
 * one signature moment, so app/lab/page.tsx opts in.
 */
export function AILabPreview({ tilt = false, headingAs }: { tilt?: boolean; headingAs?: "h1" | "h2" }) {
  return (
    <Section>
      <SectionHeading
        eyebrow="AI Lab"
        title="A free tool for every weak spot."
        intro="These are in build. Until they land, a Property Growth Audit finds all of them at once — free."
        as={headingAs}
      />

      <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((t) => (
          <RevealItem key={t.title}>
            {/* TiltCard interposes wrapper divs between its className and
                children, so flex-col/flex-1 lives on an inner div rather
                than on TiltCard's own (box-styling-only) className. */}
            <TiltCard
              active={tilt}
              className="block h-full rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-6"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <h3 className="font-body font-bold text-se-ink">{t.title}</h3>
                  <span className="se-eyebrow !text-se-ink-muted">{t.live ? "Live" : "Soon"}</span>
                </div>
                <p className="mt-2 flex-1 text-sm text-se-ink-muted">{t.body}</p>
              </div>
            </TiltCard>
          </RevealItem>
        ))}

        {/* The one thing that is actually available today */}
        <RevealItem>
          <TiltCard
            active={tilt}
            className="se-edge-strip block h-full rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-3 p-6 pl-7"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between">
                <h3 className="font-body font-bold text-se-ink">Property Growth Audit</h3>
                <span className="se-eyebrow !text-se-ink-muted">Live</span>
              </div>
              <p className="mt-2 flex-1 text-sm text-se-ink/85">
                Listing quality, pricing and search visibility — read together, returned as a
                prioritised list of what to fix first. Free.
              </p>
              <Link
                href={CTA.audit.href}
                className="mt-4 text-sm text-se-accent underline-offset-4 hover:underline"
              >
                Start your free audit →
              </Link>
            </div>
          </TiltCard>
        </RevealItem>
      </RevealGroup>

      <RevealItem>
        <div className="mt-10 text-center">
          <Button href={ROUTES.lab} variant="secondary" size="md">
            Explore the AI Lab
          </Button>
        </div>
      </RevealItem>
    </Section>
  );
}
