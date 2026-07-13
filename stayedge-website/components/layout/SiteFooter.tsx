import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { FULL_NAV, CTA, CONTACT, SITE } from "@/lib/config/site";

/**
 * Footer = the final sales pitch (Experience Bible §11). Not a link graveyard:
 * the emotional close + three ladder CTAs + trust row.
 */
export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-[var(--se-line)] bg-se-charcoal">
      {/* Final pitch band */}
      <div className="mx-auto max-w-[1320px] px-5 py-20 md:px-8">
        <p className="se-eyebrow mb-5">The last empty night</p>
        <h2 className="se-title max-w-3xl text-[clamp(28px,5vw,52px)] text-se-offwhite">
          Your property deserves better than empty nights.
        </h2>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button href={CTA.roast.href} variant="primary" size="lg">
            {CTA.roast.label}
          </Button>
          <Button href={CTA.audit.href} variant="secondary" size="lg">
            {CTA.audit.label}
          </Button>
          <Button href={CTA.whatsapp.href} external variant="ghost" size="lg">
            {CTA.whatsapp.label}
          </Button>
        </div>
      </div>

      {/* Nav + contact */}
      <div className="mx-auto grid max-w-[1320px] gap-10 border-t border-[var(--se-line)] px-5 py-12 md:grid-cols-[1.5fr_1fr_1fr] md:px-8">
        <div>
          <Logo variant="dark-bg" height={48} withHome={false} />
          <p className="mt-4 max-w-xs text-sm text-se-grey-lavender">{SITE.promise}</p>
          <p className="mt-4 text-xs text-se-grey-lavender">
            Not property managers — Airbnb growth specialists.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-2 text-sm">
          {FULL_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-se-offwhite/75 transition-colors hover:text-se-offwhite"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-2 text-sm text-se-grey-lavender">
          <a href={`mailto:${CONTACT.email}`} className="hover:text-se-offwhite">
            {CONTACT.email}
          </a>
          <a href={`tel:${CONTACT.phone}`} className="hover:text-se-offwhite">
            {CONTACT.phone}
          </a>
          <span>{CONTACT.social}</span>
          <span>{CONTACT.location}</span>
        </div>
      </div>

      <div className="border-t border-[var(--se-line)] px-5 py-5 text-center text-xs text-se-grey-lavender md:px-8">
        {CONTACT.copyright} · {SITE.tagline}
      </div>
    </footer>
  );
}
