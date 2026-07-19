import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { PRIMARY_NAV, CTA } from "@/lib/config/site";

/**
 * Global header. Logo left, browse nav (desktop), CTA cluster right.
 * Scroll-aware condense + glass and the mobile sheet are layered in milestone 2;
 * mobile CTAs are always reachable via the persistent MobileActionBar.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-[100] w-full border-b border-[var(--se-line)] bg-[color-mix(in_srgb,var(--se-charcoal)_92%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-5 md:px-8">
        <Logo variant="dark-bg" height={44} />

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-se-offwhite/80 transition-colors hover:text-se-offwhite"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA hierarchy: Free Audit is the one primary; the roast supports it. */}
        <div className="flex items-center gap-2">
          <Button href={CTA.roast.href} variant="ghost" size="sm" className="hidden sm:inline-flex">
            {CTA.roast.label}
          </Button>
          <Button href={CTA.audit.href} variant="primary" size="sm" className="hidden sm:inline-flex">
            Get Free Audit
          </Button>
        </div>
      </div>
    </header>
  );
}
