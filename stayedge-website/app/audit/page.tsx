import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { CTA } from "@/lib/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Book a Free Property Audit",
  description:
    "A free, no-pressure audit of your Airbnb with a StayEdge specialist — occupancy, pricing and listing quality, explained in plain numbers.",
  alternates: { canonical: "/audit" },
};

/**
 * The self-serve calendar booking flow is built in a later milestone; until
 * then WhatsApp IS the real, working booking process (not a stand-in for a
 * missing feature) — copy is written accordingly so this reads as a
 * deliberate page, not an unfinished one (SEO/E-E-A-T audit, 2026-07-20).
 */
export default function AuditPage() {
  return (
    <>
    <section className="mx-auto max-w-[900px] px-5 py-28 text-center md:px-8">
      <p className="se-eyebrow mb-4">Free Property Growth Audit</p>
      <h1 className="se-display text-[clamp(32px,6vw,64px)] text-se-offwhite">
        Let&apos;s find your <span className="text-se-lavender">lost revenue.</span>
      </h1>
      <p className="mx-auto mt-6 max-w-lg text-se-grey-lavender">
        A free, no-pressure audit with a StayEdge specialist — occupancy, pricing and listing
        quality, explained in plain numbers. Message us on WhatsApp with your listing link and
        we&apos;ll reply personally, usually within a few hours.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button href={CTA.whatsapp.href} external variant="primary" size="lg" haptic>
          {CTA.whatsapp.label}
        </Button>
      </div>
    </section>
    <JsonLd schemas={[breadcrumbSchema([{ name: "Free Property Audit", path: "/audit" }])]} />
    </>
  );
}
