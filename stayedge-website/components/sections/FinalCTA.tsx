import { Reveal } from "@/components/motion/Reveal";
import { WordReveal } from "@/components/motion/ScrollFX";
import { EyebrowTypeOn } from "@/components/motion/EyebrowTypeOn";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/motion/Magnetic";
import { CTA } from "@/lib/config/site";

/**
 * The closer — one last, low-friction chance to start the free audit, plus the
 * two alternatives (video service, WhatsApp). Sits just above the footer's
 * emotional sign-off.
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
        <EyebrowTypeOn text="See it for yourself" className="mb-5" />
        <WordReveal
          as="h2"
          text="Find out what your listing is really worth."
          accentFrom={6}
          className="mx-auto max-w-3xl font-display uppercase leading-[1.12] tracking-[-0.01em] text-[clamp(26px,5vw,56px)] text-se-ink [perspective:800px]"
        />
        <p className="mx-auto mt-5 max-w-xl text-se-ink-muted">
          One link. One reply. A prioritised list of what to fix first — free.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Magnetic strength={0.35}>
            <Button href={CTA.audit.href} variant="primary" size="lg" haptic>
              {CTA.audit.label}
            </Button>
          </Magnetic>
          <Button href={CTA.video.href} variant="secondary" size="lg">
            {CTA.video.label}
          </Button>
          <Button href={CTA.whatsapp.href} external variant="ghost" size="lg">
            {CTA.whatsapp.label}
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
