import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/sections/Section";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "What We Do",
  description:
    "Listing optimisation, dynamic pricing, occupancy growth and positioning — Airbnb growth as a system, not guesswork.",
};

const SERVICES = [
  {
    title: "Listing & Airbnb SEO",
    outcome: "Get found, get clicked.",
    body: "Titles, photos and structure tuned for how guests search and how the algorithm ranks. Your listing becomes easy to find and hard to scroll past.",
  },
  {
    title: "Pricing & ADR growth",
    outcome: "Earn what the week is worth.",
    body: "Weekend lifts, mid-week fills, seasonality and gap nights — priced deliberately instead of one flat number all year.",
  },
  {
    title: "Occupancy & conversion",
    outcome: "Turn views into bookings.",
    body: "We find the exact moments guests hesitate — first photo, reviews, house rules — and remove the friction that costs you the booking.",
  },
  {
    title: "Positioning & guest psychology",
    outcome: "Stop competing on price.",
    body: "Your property gets a clear promise for a clear guest, so you win on fit — not on being the cheapest option nearby.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="What We Do"
          title="Airbnb growth as a system."
          intro="Four disciplines, one goal: more booked nights at better rates — proven in your numbers."
        />
        <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <RevealItem key={s.title}>
              <div className="se-edge-strip h-full rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-6 pl-7">
                <p className="se-eyebrow">{s.outcome}</p>
                <h2 className="mt-2 font-body text-xl font-bold text-se-offwhite">{s.title}</h2>
                <p className="mt-2 text-se-grey-lavender">{s.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
        <RevealItem>
          <div className="mt-10 text-center">
            <Button href={ROUTES.roast} variant="primary" size="lg">
              See what we'd fix first — free
            </Button>
          </div>
        </RevealItem>
      </Section>
      <FinalCTA />
    </>
  );
}
