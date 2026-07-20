import { Section, SectionHeading } from "@/components/sections/Section";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { CONTACT } from "@/lib/config/site";


/**
 * Trust section. We do NOT fabricate testimonials or numbers (brand law: every
 * claim provable). Until real, named case studies exist, this earns trust the
 * honest way — who's behind StayEdge, how we work, and the promise we hold to.
 * Real testimonials/metrics are a founder input (see note in the build report).
 */
const SIGNALS = [
  {
    title: "Founder-led",
    body: `Built and run by ${CONTACT.founder} out of ${CONTACT.location}. You work with an operator, not a call centre.`,
  },
  {
    title: "Honest by default",
    body: "We only send recommendations we can tie to bookings or revenue. If confidence is low, we say so.",
  },
  {
    title: "You stay in control",
    body: "We're not property managers. Your listing, your account, your keys — we make them perform.",
  },
];

export function SocialProof() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Why hosts trust us"
        title="No hype. Just the numbers, done right."
        intro="We'd rather show you the work than sell you a promise."
      />

      <RevealGroup className="mt-14 grid gap-4 md:grid-cols-3">
        {SIGNALS.map((s) => (
          <RevealItem key={s.title}>
            <div className="h-full rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-6">
              <h3 className="font-body text-lg font-bold text-se-offwhite">{s.title}</h3>
              <p className="mt-2 text-se-grey-lavender">{s.body}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>

      {/* Founder — a person, not a portal (trust) */}
      <RevealItem>
        <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-5 rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-6 sm:flex-row sm:items-center md:p-8">
          <div
            aria-hidden
            className="grid h-16 w-16 shrink-0 place-items-center rounded-full text-xl font-bold text-se-offwhite"
            style={{ background: "linear-gradient(135deg, var(--se-purple), var(--se-lavender))" }}
          >
            {CONTACT.founder.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <p className="font-body font-bold text-se-offwhite">
              {CONTACT.founder} · Founder, {CONTACT.location.split(",")[0]}
            </p>
            <blockquote className="mt-2 font-editorial italic text-se-offwhite/90">
              &ldquo;We turn your listing into the smartest-run stay on your street — and prove
              it in the numbers.&rdquo;
            </blockquote>
            <p className="mt-2 text-sm text-se-grey-lavender">
              Your audit is read and replied to by me — not a queue.
            </p>
          </div>
        </div>
      </RevealItem>
    </Section>
  );
}
