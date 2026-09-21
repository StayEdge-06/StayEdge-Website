import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { ROUTES, CTA } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Page not found",
  // A 404 that gets indexed is a 404 that competes with the real pages.
  robots: { index: false, follow: true },
};

/**
 * Branded 404 — never a dead end.
 *
 * Two jobs, in this order: tell the visitor plainly that the URL is wrong, then
 * put the three routes most 404 arrivals actually wanted within one click. The
 * oversized ghost numeral is the only decoration, and it is `aria-hidden` — the
 * heading carries the message for anyone who cannot see it.
 */
const DESTINATIONS = [
  { label: "What we do", body: "The services, and what each one changes.", href: ROUTES.services },
  { label: "Who we help", body: "Find the host that sounds like you.", href: ROUTES.whoWeHelp },
  { label: "Knowledge", body: "How we think about Airbnb growth, written down.", href: ROUTES.knowledge },
] as const;

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* The numeral sits behind everything, clipped by the section, and is
          sized in vw so it stays a backdrop rather than a headline. */}
      <span
        aria-hidden
        className="se-display pointer-events-none absolute inset-x-0 top-8 -z-10 select-none text-center text-se-ink opacity-[0.05] [--se-display-leading:1] [--se-display-size:clamp(140px,34vw,420px)]"
      >
        404
      </span>

      <div className="mx-auto max-w-[760px] px-5 py-28 text-center md:px-8 md:py-36">
        <p className="se-eyebrow mb-4">Page not found</p>
        <h1 className="se-display text-se-ink [--se-display-size:clamp(28px,5vw,52px)]">
          That page wandered off.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-se-ink-muted">
          The link is wrong or the page has moved. Here is what most hosts came for anyway.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button href={CTA.audit.href} variant="primary" size="md" aria-label={CTA.audit.label}>
            {CTA.audit.short}
          </Button>
          <Button href="/" variant="ghost" size="md">
            Back to home
          </Button>
        </div>

        <ul className="mt-14 grid gap-3 text-left sm:grid-cols-3">
          {DESTINATIONS.map((d) => (
            <li key={d.href}>
              <Link
                href={d.href}
                className="group flex h-full flex-col rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-5 transition-colors hover:border-[var(--se-line-strong)]"
              >
                <span className="font-body font-bold text-se-ink">{d.label}</span>
                <span className="mt-1.5 flex-1 text-sm text-se-ink-muted">{d.body}</span>
                <span
                  aria-hidden
                  className="mt-3 text-sm font-semibold text-se-accent transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
