import { Button } from "@/components/ui/Button";
import { AIPresence } from "@/components/three/AIPresence";
import { Magnetic } from "@/components/motion/Magnetic";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { WordReveal } from "@/components/motion/ScrollFX";
import { RisingEdgeBars } from "@/components/brand/RisingEdgeBars";
import { PERSONA } from "@/lib/config/persona";
import { ROUTES } from "@/lib/config/site";

/**
 * Homepage hero — the AI experience entry point (Experience Bible §3).
 * Live AI presence (3D diamond, cursor-reactive) behind a staggered-reveal
 * content column; the primary CTA is magnetic. The thinking theater + in-place
 * roast reveal are built in milestone 3.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-se-ground">
      {/* AI presence field — pointer-transparent so the form stays clickable */}
      <AIPresence className="pointer-events-none absolute inset-0 z-0" />

      <RevealGroup className="relative z-10 mx-auto max-w-[1100px] px-5 pb-20 pt-20 text-center md:px-8 md:pt-28">
        <RevealItem className="flex justify-center">
          {/* Static brand mark here; the animated loop is reserved for real
              loading / thinking states (justified motion only). */}
          <RisingEdgeBars size={30} playing={false} />
        </RevealItem>

        <RevealItem>
          <p className="se-eyebrow mt-5 mb-6">AI-Powered Airbnb Growth</p>
        </RevealItem>

        {/* Cinematic word-by-word reveal (flagship). Explicit display utilities
            (not .se-display) — Boldonse needs generous leading when it wraps. */}
        <WordReveal
          as="h1"
          text="Your Airbnb should be fully booked."
          accentFrom={4}
          className="mx-auto max-w-4xl font-display uppercase tracking-[-0.01em] leading-[1.12] text-[clamp(28px,7vw,76px)] text-se-offwhite [perspective:800px]"
        />

        <RevealItem>
          <p className="mx-auto mt-6 max-w-xl text-balance text-lg text-se-grey-lavender">
            Paste your listing. Our AI finds what&apos;s quietly costing you bookings —
            free, in seconds.
          </p>
        </RevealItem>

        {/* Live-analysis input (submits to the Roast Engine) */}
        <RevealItem>
          <form
            action={ROUTES.roast}
            method="get"
            className="se-glass se-float mx-auto mt-10 flex max-w-xl flex-col gap-3 rounded-[var(--se-radius-lg)] p-3 sm:flex-row sm:items-center sm:pl-5"
          >
            <label htmlFor="listing-url" className="sr-only">
              Your Airbnb listing link
            </label>
            <input
              id="listing-url"
              name="url"
              type="url"
              inputMode="url"
              placeholder="Paste your Airbnb listing link…"
              className="min-w-0 flex-1 bg-transparent py-3 text-se-offwhite placeholder:text-se-grey-lavender/70 focus:outline-none"
            />
            <Magnetic strength={0.35}>
              <Button type="submit" variant="primary" size="md">
                Roast My Listing
              </Button>
            </Magnetic>
          </form>
        </RevealItem>

        {/* Mode chips — the persona auto-selects; these are the optional override */}
        <RevealItem>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm text-se-grey-lavender">
            <span className="se-eyebrow !tracking-[0.2em] !text-se-grey-lavender">Modes</span>
            {PERSONA.modes.map((m) => (
              <span
                key={m.id}
                className="rounded-full border border-[var(--se-line)] px-3 py-1 text-se-offwhite/80"
              >
                {m.glyph} {m.label}
              </span>
            ))}
          </div>
        </RevealItem>

        <RevealItem>
          <p className="mt-8 text-xs text-se-grey-lavender">
            Free · No login · Your first 3 issues on the house.
          </p>
        </RevealItem>

        <RevealItem className="mt-12 flex justify-center">
          <div className="se-scroll-cue" aria-hidden />
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
