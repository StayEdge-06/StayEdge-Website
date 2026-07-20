import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/sections/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { CONTACT, WHATSAPP_URL, ROUTES } from "@/lib/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to StayEdge — WhatsApp first, replies from a real person. Tirupati, Andhra Pradesh.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
    <Section>
      <SectionHeading
        eyebrow="Contact"
        title="Talk to a person."
        intro="WhatsApp is fastest — you'll get a reply from a real operator, not a queue."
      />

      <Reveal className="mx-auto mt-12 max-w-xl">
        <div className="rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-8 text-center">
          <Button href={WHATSAPP_URL} external variant="whatsapp" size="lg" haptic className="w-full">
            WhatsApp us
          </Button>
          <div className="mt-6 space-y-2 text-sm text-se-grey-lavender">
            <p>
              <a className="hover:text-se-offwhite" href={`tel:${CONTACT.phone}`}>
                {CONTACT.phone}
              </a>
            </p>
            <p>
              <a className="hover:text-se-offwhite" href={`mailto:${CONTACT.email}`}>
                {CONTACT.email}
              </a>
            </p>
            <p>{CONTACT.social}</p>
            <p>{CONTACT.location}</p>
          </div>
          <p className="mt-6 border-t border-[var(--se-line)] pt-5 text-sm text-se-grey-lavender">
            Not sure what to ask? Start with the free roast — it gives us both something
            specific to talk about.
          </p>
          <div className="mt-4">
            <Button href={ROUTES.roast} variant="ghost" size="md">
              Roast my listing first
            </Button>
          </div>
        </div>
      </Reveal>
    </Section>
      <JsonLd schemas={[breadcrumbSchema([{ name: "Contact", path: "/contact" }])]} />
    </>
  );
}
