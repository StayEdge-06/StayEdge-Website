import Link from "next/link";
import { Section } from "@/components/sections/Section";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { CTA } from "@/lib/config/site";

/**
 * The homepage landing section for the AI Property Video service — the premium
 * offer that replaced the AI Roast tool in V2.
 *
 * Deliberately understated: this is the *secondary* offer. The audit is the one
 * primary CTA site-wide, so this section sells the idea and hands off to the
 * service page rather than opening a second competing funnel on the homepage.
 */
const FORMATS = [
  "Instagram Reels",
  "YouTube Shorts",
  "Property walkthrough",
  "Promotional video",
  "Website hero video",
];

export function VideoService() {
  return (
    <Section ground="deep">
      <RevealGroup className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16">
        <div>
          <RevealItem>
            <p className="se-eyebrow">AI Property Video</p>
          </RevealItem>
          <RevealItem>
            <h2 className="mt-3 se-title text-3xl leading-[1.15] text-se-ink md:text-[42px]">
              Your property, filmed the way it deserves.
            </h2>
          </RevealItem>
          <RevealItem>
            <p className="mt-5 max-w-lg text-lg text-se-ink-muted">
              Cinematic video produced with AI from the photos and clips you already have.
              No shoot, no crew, no travel days — you receive finished files, sized and
              captioned for where they&apos;re going.
            </p>
          </RevealItem>
          <RevealItem>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Button href={CTA.video.href} variant="secondary" size="lg">
                {CTA.video.label}
              </Button>
              <Link
                href={CTA.video.href}
                className="text-sm text-se-accent underline-offset-4 hover:underline"
              >
                See the formats →
              </Link>
            </div>
          </RevealItem>
        </div>

        <RevealItem>
          <ul className="grid gap-2">
            {FORMATS.map((f) => (
              <li
                key={f}
                className="se-edge-strip rounded-[var(--se-radius-md)] border border-[var(--se-line)] bg-se-surface px-5 py-4 pl-6 text-sm text-se-ink/85"
              >
                {f}
              </li>
            ))}
          </ul>
        </RevealItem>
      </RevealGroup>
    </Section>
  );
}
