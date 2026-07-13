import { Section, SectionHeading } from "@/components/sections/Section";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

/**
 * Why StayEdge — the differentiation + trust section. Leads with the biggest
 * objection-crusher: we are not property managers. You keep control.
 */
const PILLARS = [
  {
    title: "Not property managers",
    body: "We don't take over your listing or your keys. You keep full control — we make what you own perform.",
  },
  {
    title: "AI plus operators",
    body: "Vira reads your listing at a scale no human can. Real operators turn that into a plan you can act on.",
  },
  {
    title: "Specialists, not generalists",
    body: "Listings, pricing, positioning, Airbnb SEO and guest psychology. That's all we do, and all day.",
  },
  {
    title: "Proven in the numbers",
    body: "Every recommendation is specific and measurable. If we can't tie it to bookings or revenue, we don't send it.",
  },
];

export function WhyStayEdge() {
  return (
    <Section ground="deep">
      <SectionHeading
        eyebrow="Why StayEdge"
        title="The sharp operator, not the loud guru."
        intro="We turn your listing into the smartest-run stay on your street — and prove it in the numbers."
      />

      <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2">
        {PILLARS.map((p) => (
          <RevealItem key={p.title}>
            <div className="h-full rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-charcoal p-6">
              <h3 className="font-body text-lg font-bold text-se-offwhite">{p.title}</h3>
              <p className="mt-2 text-se-grey-lavender">{p.body}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
