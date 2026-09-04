import { Button } from "@/components/ui/Button";
import { AIPresence } from "@/components/three/AIPresence";
import { Magnetic } from "@/components/motion/Magnetic";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { WordReveal } from "@/components/motion/ScrollFX";
import { EyebrowTypeOn } from "@/components/motion/EyebrowTypeOn";
import { RisingEdgeBars } from "@/components/brand/RisingEdgeBars";
import { PERSONA } from "@/lib/config/persona";
import { CTA } from "@/lib/config/site";

/**
 * Homepage hero — the AI experience entry point (Experience Bible §3).
 * Live AI presence (3D diamond, cursor-reactive) behind a staggered-reveal
 * content column; the primary CTA is magnetic.
 *
 * V2: the hero form is no longer an in-page AI tool. It is the top of the ONE
 * funnel — a GET to /free-audit carrying the listing link, so the audit form
 * arrives pre-filled and the host has already taken the first step. A GET (not
 * a client fetch) keeps the hero a server component and works without JS.
 */
export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-se-ground">
      {/* AI presence field — pointer-transparent so the form stays clickable */}
      <AIPresence className="pointer-events-none absolute inset-0 z-0" />

      <RevealGroup className="relative z-10 mx-auto max-w-[1100px] px-5 pb-20 pt-20 text-center md:px-8 md:pt-28">
        <RevealItem className="flex justify-center">
          {/* Static brand mark here; the animated loop is reserved for real
              loading / thinking states (justified motion only). */}
          <RisingEdgeBars size={30} playing={false} />
        </RevealItem>

        <RevealItem>
          <EyebrowTypeOn text="AI-Powered Airbnb Growth" className="mt-5 mb-6" />
        </RevealItem>

        {/* Cinematic word-by-word reveal (flagship). Explicit display utilities
            (not .se-display) — Boldonse needs generous leading when it wraps. */}
        <WordReveal
          as="h1"
          text="Your Airbnb should be fully booked."
          accentFrom={4}
          className="mx-auto max-w-4xl font-display uppercase tracking-[-0.01em] leading-[1.12] text-[clamp(28px,7vw,76px)] text-se-ink [perspective:800px]"
        />

        <RevealItem>
          <p className="mx-auto mt-6 max-w-xl text-balance text-lg text-se-ink-muted">
            Paste your listing and we&apos;ll show you what&apos;s quietly costing you
            bookings — free.
          </p>
        </RevealItem>

        {/* Funnel entry: carries the listing link into the audit form */}
        <RevealItem>
          <form
            action={CTA.audit.href}
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
              className="min-w-0 flex-1 bg-transparent py-3 text-se-ink placeholder:text-se-ink-muted/70 focus:outline-none"
            />
            <Magnetic strength={0.35}>
              <Button
                type="submit"
                variant="primary"
                size="md"
                haptic
                aria-label={CTA.audit.label}
              >
                {CTA.audit.short}
              </Button>
            </Magnetic>
          </form>
        </RevealItem>

        {/* The audit's actual scope, stated up front — no vague "AI analysis" */}
        <RevealItem>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm text-se-ink-muted">
            <span className="se-eyebrow !tracking-[0.2em] !text-se-ink-muted">We check</span>
            {PERSONA.modes.map((m) => (
              <span
                key={m.id}
                className="rounded-full border border-[var(--se-line)] px-3 py-1 text-se-ink/80"
              >
                {m.glyph} {m.label}
              </span>
            ))}
          </div>
        </RevealItem>

        <RevealItem>
          <p className="mt-8 text-xs text-se-ink-muted">
            Free · No login · A prioritised list of what to fix first.
          </p>
          <p className="mt-3 text-sm">
            <a
              href={CTA.video.href}
              className="text-se-accent underline-offset-4 hover:underline"
            >
              Or see our AI property video service →
            </a>
          </p>
        </RevealItem>

        <RevealItem className="mt-12 flex justify-center">
          <div className="se-scroll-cue" aria-hidden />
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
