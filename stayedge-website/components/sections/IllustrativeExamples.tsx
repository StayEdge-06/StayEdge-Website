import Link from "next/link";
import { Section, SectionHeading } from "@/components/sections/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { CASE_STUDIES } from "@/lib/content/case-studies";
import { ROUTES } from "@/lib/config/site";

/**
 * The case-studies slot, placed immediately below the Hero (V2 brief).
 *
 * StayEdge has no client-approved case studies to publish yet, and the brand's
 * honesty law forbids inventing them. So this section shows the *method* on
 * named property archetypes rather than on named clients — labelled
 * "Illustrative Examples" in the eyebrow, restated in the intro, and repeated
 * in a caption under the grid, because a label a visitor can miss is not a
 * label. Deliberately there is not a single number on these cards: the moment
 * an illustration carries a figure, it starts being read as a result.
 *
 * When real, approved case studies land in CASE_STUDIES, they take this slot
 * and the illustrations step aside — the honest version of this section is
 * always the one with more evidence in it.
 */
const EXAMPLES = [
  {
    archetype: "The invisible listing",
    property: "2BHK apartment · temple town",
    pattern:
      "Fills on long weekends, empty midweek. Photos shot at noon on a phone, a title that names the building instead of the trip, and one flat price held all year.",
    changes: [
      "Rewrite the listing around the reason people come to the city",
      "Reshoot in the light the rooms actually look best in",
      "Split the calendar by demand instead of pricing it flat",
    ],
    tracked: ["Impressions", "Click-through", "Midweek occupancy"],
  },
  {
    archetype: "The underpriced villa",
    property: "4BR villa · hill station",
    pattern:
      "A genuinely premium property priced against the ordinary flats nearby, because that is what the platform's suggestion said — so it books quickly and earns less than it should.",
    changes: [
      "Position the property against its real peer set, not its postcode",
      "Rebuild the photo order so the best asset is the first frame",
      "Set floors and weekend/event pricing instead of accepting defaults",
    ],
    tracked: ["ADR", "Revenue per available night", "Lead time"],
  },
  {
    archetype: "The plateaued portfolio",
    property: "3 units · one manager",
    pattern:
      "Each unit was set up well once, then drifted. Reviews slowed, one listing quietly out-ranks the other two, and nobody can say which change caused what.",
    changes: [
      "One measurement sheet across all three units, same four numbers",
      "Fix the weakest listing's ranking signals before adding spend",
      "A review request that actually goes out, on a schedule",
    ],
    tracked: ["Occupancy", "Review velocity", "Rank vs. neighbours"],
  },
] as const;

export function IllustrativeExamples() {
  const hasRealCaseStudies = CASE_STUDIES.length > 0;

  return (
    <Section ground="deep" id="examples">
      <SectionHeading
        eyebrow={hasRealCaseStudies ? "Case Studies" : "Illustrative Examples"}
        title={
          hasRealCaseStudies ? "Real properties, real numbers." : "What the method looks like."
        }
        intro={
          hasRealCaseStudies
            ? "Published with the client's approval, with the figures they agreed to share."
            : "These are illustrations of how we work — property archetypes, not clients, and no numbers we have not earned. Named case studies get published on the Results page as clients approve them."
        }
      />

      <RevealGroup data-vira-avoid className="mt-14 grid gap-4 md:grid-cols-3">
        {EXAMPLES.map((ex) => (
          <RevealItem key={ex.archetype}>
            <TiltCard
              as="article"
              className="se-edge-strip flex h-full flex-col rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground p-6 pl-7"
            >
              <p className="se-eyebrow">Illustrative</p>
              <h3 className="mt-3 font-body text-lg font-bold text-se-ink">{ex.archetype}</h3>
              <p className="mt-1 text-sm text-se-ink-muted">{ex.property}</p>

              <p className="mt-4 text-sm leading-relaxed text-se-ink/85">{ex.pattern}</p>

              <p className="se-eyebrow mt-6">What we change</p>
              <ul className="mt-2 space-y-1.5 text-sm text-se-ink/85">
                {ex.changes.map((c) => (
                  <li key={c} className="flex gap-2">
                    <span aria-hidden className="mt-[7px] size-1 shrink-0 rounded-full bg-se-accent" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>

              <p className="se-eyebrow mt-6">What we track</p>
              <ul className="mt-2 flex flex-1 flex-wrap content-start gap-2">
                {ex.tracked.map((t) => (
                  <li
                    key={t}
                    className="rounded-[var(--se-radius-pill)] border border-[var(--se-line)] px-2.5 py-1 text-xs text-se-ink-muted"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </TiltCard>
          </RevealItem>
        ))}
      </RevealGroup>

      {/* The label, restated where the eye lands after reading the cards. */}
      <Reveal className="mx-auto mt-8 max-w-2xl text-center text-sm text-se-ink-muted">
        <p>
          Illustrative examples — composite scenarios that show the method, not the results of a
          named client engagement.{" "}
          <Link
            href={ROUTES.results}
            className="text-se-accent underline decoration-[var(--se-line-strong)] underline-offset-4 transition-colors hover:decoration-current"
          >
            See how we measure real work
          </Link>
          .
        </p>
      </Reveal>
    </Section>
  );
}
