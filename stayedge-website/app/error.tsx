"use client";

import { Button } from "@/components/ui/Button";
import { CTA } from "@/lib/config/site";

/**
 * Global error boundary — "never fail in public" (approved rule). The visitor
 * never sees a stack trace or the word "error"; they get a warm recovery path.
 */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="mx-auto max-w-[700px] px-5 py-28 text-center md:px-8">
      <p className="se-eyebrow mb-4">A brief hiccup</p>
      <h1 className="se-display text-[clamp(28px,5vw,52px)] text-se-offwhite">
        That wasn&apos;t supposed to happen.
      </h1>
      <p className="mx-auto mt-5 max-w-md text-se-grey-lavender">
        Let&apos;s pick up where you left off — or talk to a person who can help right now.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset} variant="primary" size="md">
          Try that again
        </Button>
        <Button href="/" variant="secondary" size="md">
          Back to home
        </Button>
        <Button href={CTA.whatsapp.href} external variant="ghost" size="md">
          {CTA.whatsapp.label}
        </Button>
      </div>
    </section>
  );
}
