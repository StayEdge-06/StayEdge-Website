import { Section, SectionHeading } from "@/components/sections/Section";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { ROUTES } from "@/lib/config/site";

/**
 * Host segments — relevance is the fastest trust-builder. Each visitor should
 * see themselves and find the tailored path (recognition).
 */
const SEGMENTS = [
  { title: "First-time hosts", body: "Launching soon or just live? Start right and skip the expensive early mistakes.", href: `${ROUTES.whoWeHelp}#first-time-hosts` },
  { title: "Villa owners", body: "Premium property, premium positioning — priced and presented to match.", href: `${ROUTES.whoWeHelp}#villa-owners` },
  { title: "Boutique hotels", body: "Stand out on Airbnb and win more direct-feeling bookings.", href: `${ROUTES.whoWeHelp}#boutique-hotels` },
  { title: "Investors & managers", body: "Multiple properties, one system — growth you can measure across the portfolio.", href: `${ROUTES.whoWeHelp}#investors-managers` },
];

export function HostSegments() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Who We Help"
        title="Which host are you?"
        intro="The plan changes with the property. Find the one that sounds like yours."
      />

      <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SEGMENTS.map((s) => (
          <RevealItem key={s.title}>
            <TiltCard className="block h-full">
              <a
                href={s.href}
                className="group flex h-full flex-col rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-6 transition-colors hover:border-[var(--se-line-strong)]"
              >
                <h3 className="font-body text-lg font-bold text-se-ink">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm text-se-ink-muted">{s.body}</p>
                <span className="mt-4 text-sm font-semibold text-se-accent transition-transform group-hover:translate-x-1">
                  See how →
                </span>
              </a>
            </TiltCard>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
