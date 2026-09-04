import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/sections/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { CONTACT, WHATSAPP_URL, ROUTES, DEFAULT_OG_IMAGE } from "@/lib/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, organizationSchema, localBusinessSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to StayEdge — WhatsApp first, replies from a real person. Tirupati, Andhra Pradesh.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact — StayEdge",
    description:
      "Talk to StayEdge — WhatsApp first, replies from a real person. Tirupati, Andhra Pradesh.",
    url: "/contact",
    siteName: "StayEdge",
    locale: "en_IN",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact — StayEdge",
    description:
      "Talk to StayEdge — WhatsApp first, replies from a real person. Tirupati, Andhra Pradesh.",
    images: [DEFAULT_OG_IMAGE],
  },
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
          <div className="mt-6 space-y-2 text-sm text-se-ink-muted">
            <p>
              <a className="hover:text-se-ink" href={`tel:${CONTACT.phone}`}>
                {CONTACT.phone}
              </a>
            </p>
            <p>
              <a className="hover:text-se-ink" href={`mailto:${CONTACT.email}`}>
                {CONTACT.email}
              </a>
            </p>
            <p className="flex flex-wrap justify-center gap-3">
              <a
                href="https://www.instagram.com/stayedgeofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-se-ink"
              >
                Instagram
              </a>
              <span aria-hidden>·</span>
              <a
                href="https://www.linkedin.com/company/stayedge/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-se-ink"
              >
                LinkedIn
              </a>
            </p>
            <p>{CONTACT.location}</p>
          </div>
          <p className="mt-6 border-t border-[var(--se-line)] pt-5 text-sm text-se-ink-muted">
            Not sure what to ask? Start with the free audit — it gives us both something
            specific to talk about.
          </p>
          <div className="mt-4">
            <Button href={ROUTES.freeAudit} variant="ghost" size="md">
              Get your free audit first
            </Button>
          </div>
        </div>
      </Reveal>
    </Section>
      <JsonLd
        schemas={[
          organizationSchema(),
          localBusinessSchema(),
          breadcrumbSchema([{ name: "Contact", path: "/contact" }]),
        ]}
      />
    </>
  );
}
