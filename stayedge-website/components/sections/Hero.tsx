import { Button } from "@/components/ui/Button";
import { PERSONA } from "@/lib/config/persona";
import { ROUTES } from "@/lib/config/site";

/**
 * Homepage hero — the AI experience entry point (Experience Bible §3).
 * Milestone 1 renders the on-brand structure + the live-analysis input, which
 * navigates to the Roast Engine. The cursor-reactive AI-presence field, thinking
 * theater and in-place reveal are built in milestones 2–3.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-se-ground">
      {/* Ambient purple light — the brand's dynamic lighting, never neon */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full opacity-60 blur-[120px]"
        style={{ background: "radial-gradient(closest-side, var(--se-glow), transparent)" }}
      />

      <div className="relative mx-auto max-w-[1100px] px-5 pb-20 pt-20 text-center md:px-8 md:pt-28">
        <p className="se-eyebrow mb-6">AI-Powered Airbnb Growth</p>

        {/* Emphasis on charcoal grounds uses Soft Lavender for AA contrast (~5:1);
            solid Purple is reserved for CTA fills + light grounds where it passes. */}
        {/* Explicit display utilities (not .se-display) so line-height is fully
            controlled here — Boldonse needs generous leading when it wraps. */}
        <h1 className="mx-auto max-w-4xl font-display uppercase tracking-[-0.01em] leading-[1.12] text-[clamp(28px,7vw,76px)] text-se-offwhite">
          Your Airbnb should be{" "}
          <span className="text-se-lavender">fully booked.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-balance text-lg text-se-grey-lavender">
          Paste your listing. Our AI finds what&apos;s quietly costing you bookings —
          free, in seconds.
        </p>

        {/* Live-analysis input (submits to the Roast Engine) */}
        <form
          action={ROUTES.roast}
          method="get"
          className="se-glass mx-auto mt-10 flex max-w-xl flex-col gap-3 rounded-[var(--se-radius-lg)] p-3 sm:flex-row sm:items-center sm:pl-5"
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
          <Button type="submit" variant="primary" size="md">
            Roast My Listing
          </Button>
        </form>

        {/* Mode chips — the persona auto-selects; these are the optional override */}
        <div className="mt-5 flex items-center justify-center gap-2 text-sm text-se-grey-lavender">
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

        <p className="mt-8 text-xs text-se-grey-lavender">
          Free · No login · Your first 3 issues on the house.
        </p>
      </div>
    </section>
  );
}
