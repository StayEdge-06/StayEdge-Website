import { Section, SectionHeading } from "@/components/sections/Section";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";

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
            <TiltCard
              maxTilt={5}
              className="block h-full rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-surface p-6"
            >
              <h3 className="font-body text-lg font-bold text-se-ink">{p.title}</h3>
              <p className="mt-2 text-se-ink-muted">{p.body}</p>
            </TiltCard>
          </RevealItem>
        ))}
      </RevealGroup>

      {/* Honest comparison — the decision most hosts are actually weighing */}
      <RevealItem>
        <div className="mx-auto mt-10 max-w-3xl overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <caption className="sr-only">
              Comparing doing it yourself, hiring a property manager, and working with StayEdge
            </caption>
            <thead>
              <tr className="border-b border-[var(--se-line-strong)] text-left">
                <th scope="col" className="py-3 pr-4 font-body font-normal text-se-ink-muted"></th>
                <th scope="col" className="py-3 pr-4 font-body font-bold text-se-ink">DIY</th>
                <th scope="col" className="py-3 pr-4 font-body font-bold text-se-ink">Property manager</th>
                <th scope="col" className="py-3 font-body font-bold text-se-accent">StayEdge</th>
              </tr>
            </thead>
            <tbody className="text-se-ink/85">
              {[
                ["You keep control of your listing", "Yes", "Usually no", "Always"],
                ["Specialist listing & pricing expertise", "Trial and error", "Varies", "That's all we do"],
                ["Ongoing cost", "Your evenings", "15–25% of revenue*", "Scoped to your property"],
                ["See value before paying", "—", "Rarely", "Free audit first"],
              ].map((row) => (
                <tr key={row[0]} className="border-b border-[var(--se-line)]">
                  <th scope="row" className="py-3 pr-4 text-left font-body font-normal text-se-ink-muted">
                    {row[0]}
                  </th>
                  <td className="py-3 pr-4">{row[1]}</td>
                  <td className="py-3 pr-4">{row[2]}</td>
                  <td className="py-3 font-semibold text-se-ink">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-se-ink-muted">
            *Typical industry range for full-service management; individual managers vary.
          </p>
        </div>
      </RevealItem>
    </Section>
  );
}
