import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { WordReveal } from "@/components/motion/ScrollFX";
import { FULL_NAV, CTA, CONTACT, SITE } from "@/lib/config/site";
import { GBP_URL } from "@/lib/config/gbp";

/**
 * Footer = the final sales pitch (Experience Bible §11). Not a link graveyard:
 * the emotional close + three ladder CTAs + trust row.
 */
export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-[var(--se-line)] bg-se-surface">
      {/* Final pitch band */}
      <div className="mx-auto max-w-[1320px] px-5 py-20 md:px-8">
        <p className="se-eyebrow mb-5">The last empty night</p>
        {/* The Footer Resolve (signature #20) — the emotional period on the page */}
        <WordReveal
          as="h2"
          text="Your property deserves better than empty nights."
          accentFrom={5}
          className="se-title max-w-3xl text-[clamp(28px,5vw,52px)] text-se-ink"
        />

        <div className="mt-10 flex flex-wrap gap-3">
          <Button href={CTA.audit.href} variant="primary" size="lg">
            {CTA.audit.label}
          </Button>
          <Button href={CTA.video.href} variant="secondary" size="lg">
            {CTA.video.label}
          </Button>
          <Button href={CTA.whatsapp.href} external variant="ghost" size="lg">
            {CTA.whatsapp.label}
          </Button>
        </div>
      </div>

      {/* Nav + contact */}
      <div className="mx-auto grid max-w-[1320px] gap-10 border-t border-[var(--se-line)] px-5 py-12 md:grid-cols-[1.5fr_1fr_1fr] md:px-8">
        <div>
          <Logo themed height={48} withHome={false} />
          <p className="mt-4 max-w-xs text-sm text-se-ink-muted">{SITE.promise}</p>
          <p className="mt-4 text-xs text-se-ink-muted">
            Not property managers — Airbnb growth specialists.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-2 text-sm">
          {FULL_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-se-ink/75 transition-colors hover:text-se-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-2 text-sm text-se-ink-muted">
          <a href={`mailto:${CONTACT.email}`} className="hover:text-se-ink">
            {CONTACT.email}
          </a>
          <a href={`tel:${CONTACT.phone}`} className="hover:text-se-ink">
            {CONTACT.phone}
          </a>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.instagram.com/stayedgeofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-se-ink"
              aria-label="Instagram"
            >
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/company/stayedge/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-se-ink"
              aria-label="LinkedIn"
            >
              LinkedIn
            </a>
            <a
              href="https://wa.me/916309348354"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-se-ink"
              aria-label="WhatsApp"
            >
              WhatsApp
            </a>
            {/* Renders only once a validated NEXT_PUBLIC_GBP_URL exists. A link
                to a guessed profile would be a false identity claim, and the
                whole point of the validation in lib/config/gbp.ts is that the
                honest failure state is "no link at all". */}
            {GBP_URL && (
              <a
                href={GBP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-se-ink"
                aria-label="StayEdge on Google"
              >
                Google
              </a>
            )}
          </div>
          <span>{CONTACT.location}</span>
        </div>
      </div>

      <div className="border-t border-[var(--se-line)] px-5 py-5 text-center text-xs text-se-ink-muted md:px-8">
        {CONTACT.copyright} · {SITE.tagline}
      </div>
    </footer>
  );
}
