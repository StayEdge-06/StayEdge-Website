import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/sections/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { ROUTES, WHATSAPP_URL } from "@/lib/config/site";
import { PERSONA } from "@/lib/config/persona";

export const metadata: Metadata = {
  title: "Knowledge",
  description:
    "Straight answers on Airbnb growth — occupancy, pricing, SEO and guest psychology. Publishing as we go.",
};

/** Honest pre-launch state: the knowledge base is being published; no fake articles. */
export default function KnowledgePage() {
  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="Knowledge"
          title="Straight answers, published as we go."
          intro={`This becomes ${PERSONA.name}'s knowledge base — guides on occupancy, pricing, Airbnb SEO and guest psychology, written from real work.`}
        />
        <Reveal className="mx-auto mt-12 max-w-xl rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-8 text-center">
          <p className="text-se-offwhite">
            The first guides are being written. Have a question that can&apos;t wait?
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button href={WHATSAPP_URL} external variant="primary" size="md">
              Ask us on WhatsApp
            </Button>
            <Button href={ROUTES.roast} variant="ghost" size="md">
              Or let {PERSONA.name} read your listing
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
