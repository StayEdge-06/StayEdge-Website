import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { CTA } from "@/lib/config/site";

export const metadata: Metadata = { title: "Book a Free Property Audit" };

/** Placeholder — the full booking experience is built in a later milestone. */
export default function AuditPage() {
  return (
    <section className="mx-auto max-w-[900px] px-5 py-28 text-center md:px-8">
      <p className="se-eyebrow mb-4">Free Property Growth Audit</p>
      <h1 className="se-display text-[clamp(32px,6vw,64px)] text-se-offwhite">
        Let&apos;s find your <span className="text-se-lavender">lost revenue.</span>
      </h1>
      <p className="mx-auto mt-6 max-w-lg text-se-grey-lavender">
        A free, no-pressure audit with a StayEdge specialist. Booking flow under construction —
        message us on WhatsApp in the meantime.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button href={CTA.whatsapp.href} external variant="primary" size="lg">
          {CTA.whatsapp.label}
        </Button>
      </div>
    </section>
  );
}
