import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/motion/Magnetic";
import { ROUTES, CTA } from "@/lib/config/site";

/**
 * The closer — one last, low-friction chance to start the roast, plus the two
 * ladder alternatives. Sits just above the footer's emotional sign-off.
 */
export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-se-ground">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-[120px]"
        style={{ background: "radial-gradient(closest-side, var(--se-glow), transparent)" }}
      />
      <Reveal className="relative z-10 mx-auto max-w-[900px] px-5 py-24 text-center md:px-8 md:py-32">
        <p className="se-eyebrow mb-5">See it for yourself</p>
        <h2 className="mx-auto max-w-3xl font-display uppercase leading-[1.12] tracking-[-0.01em] text-[clamp(26px,5vw,56px)] text-se-offwhite">
          Find out what your listing is{" "}
          <span className="text-se-lavender">really</span> worth.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-se-grey-lavender">
          One paste. A few seconds. Three things you can fix today — free.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Magnetic strength={0.35}>
            <Button href={ROUTES.roast} variant="primary" size="lg">
              Roast my listing
            </Button>
          </Magnetic>
          <Button href={CTA.audit.href} variant="secondary" size="lg">
            {CTA.audit.label}
          </Button>
          <Button href={CTA.whatsapp.href} external variant="ghost" size="lg">
            {CTA.whatsapp.label}
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
