import { Button } from "@/components/ui/Button";
import { ROUTES, CTA } from "@/lib/config/site";

/** Branded 404 — never a dead end; every exit leads back to the ladder. */
export default function NotFound() {
  return (
    <section className="mx-auto max-w-[700px] px-5 py-28 text-center md:px-8">
      <p className="se-eyebrow mb-4">404</p>
      <h1 className="se-display text-[clamp(28px,5vw,52px)] text-se-offwhite">
        That page wandered off.
      </h1>
      <p className="mx-auto mt-5 max-w-md text-se-grey-lavender">
        Here&apos;s what most hosts came for anyway.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href={CTA.audit.href} variant="primary" size="md">
          {CTA.audit.short}
        </Button>
        <Button href={CTA.video.href} variant="secondary" size="md">
          {CTA.video.short}
        </Button>
        <Button href="/" variant="ghost" size="md">
          Back to home
        </Button>
      </div>
    </section>
  );
}
