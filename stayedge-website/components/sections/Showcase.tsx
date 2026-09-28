"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Section, SectionHeading } from "@/components/sections/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { DepthLayer, refreshScrollTriggers } from "@/components/motion/Parallax";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/config/site";
import { SHOWCASE, type ShowcaseExample } from "@/lib/content/showcase";
import { cn } from "@/lib/utils";

/**
 * Illustrative showcase portfolio — educational before/after breakdowns of the
 * StayEdge method on typical Tirupati property types. Clearly labelled as
 * examples (not client claims). Glass is the accent here per the design brief:
 * the cards float; everything else stays calm.
 */
export function Showcase() {
  const [active, setActive] = useState<ShowcaseExample>(SHOWCASE[0]);

  // The Before/After mocks change height when the active example swaps —
  // refresh so any ScrollTrigger positioned below this section (e.g. the
  // Process pins) doesn't desync against stale offsets.
  useEffect(() => {
    refreshScrollTriggers();
  }, [active.slug]);

  return (
    <Section ground="deep" id="showcase">
      <SectionHeading
        eyebrow="The method, shown"
        title="What optimization actually looks like."
        intro="Three illustrative examples of the StayEdge method on typical Tirupati stays — educational breakdowns, not client claims. Your listing gets its own version in the free audit."
      />

      {/* Selector cards */}
      <RevealGroup className="mt-12 grid gap-3 sm:grid-cols-3">
        {SHOWCASE.map((ex) => (
          <RevealItem key={ex.slug}>
            <TiltCard className="block h-full">
              <button
                onClick={() => setActive(ex)}
                aria-pressed={active.slug === ex.slug}
                className={cn(
                  "se-glass h-full w-full cursor-pointer rounded-[var(--se-radius-lg)] p-5 text-left transition-all duration-300",
                  active.slug === ex.slug
                    ? "border-[var(--se-line-strong)] shadow-[0_16px_50px_-18px_var(--se-glow)]"
                    : "opacity-75 hover:opacity-100",
                )}
              >
                <span className="se-eyebrow !text-se-ink-muted">{ex.label}</span>
                <p className="mt-2 font-body font-bold text-se-ink">{ex.propertyType}</p>
              </button>
            </TiltCard>
          </RevealItem>
        ))}
      </RevealGroup>

      {/* Before / After comparison */}
      <Reveal className="mt-8">
        <div key={active.slug} className="grid gap-4 lg:grid-cols-2">
          <ListingMock variant="before" ex={active} />
          <DepthLayer>
            <ListingMock variant="after" ex={active} />
          </DepthLayer>
        </div>

        {/* Improvement breakdown */}
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Breakdown title="Gallery" items={active.gallery} />
          <Breakdown title="Airbnb SEO" items={active.seo} />
          <Breakdown title="Pricing" items={active.pricing} />
          <Breakdown title="Amenities added" items={active.amenities} />
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center font-editorial italic text-se-ink/85">
          {active.positioning}
        </p>

        <div className="mt-8 text-center">
          <Button href={ROUTES.freeAudit} variant="primary" size="lg">
            Get this breakdown for my listing — free
          </Button>
          <p className="mt-3 text-xs text-se-ink-muted">
            Illustrative examples of our method — not real client listings or results.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}

/** Stylized listing mockup — a before/after "screenshot" with illustrated art. */
function ListingMock({ variant, ex }: { variant: "before" | "after"; ex: ShowcaseExample }) {
  const after = variant === "after";
  return (
    <article
      className={cn(
        "overflow-hidden rounded-[var(--se-radius-lg)] border",
        after
          ? "border-[var(--se-line-strong)] bg-se-surface shadow-[0_20px_60px_-24px_var(--se-glow)]"
          : "border-[var(--se-line)] bg-se-surface/60",
      )}
    >
      <div className="flex items-center justify-between border-b border-[var(--se-line)] px-4 py-2">
        <span
          className="se-eyebrow"
          style={{ color: after ? "var(--se-positive)" : "var(--se-negative)" }}
        >
          {after ? "After" : "Before"}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-se-ink-muted">
          Listing mockup
        </span>
      </div>

      {/* Illustrated (not photographic) mockup art — a generic scene of the
          property type, never a real listing photo (brand law: no fake
          photography of a specific real property). The two small side
          blocks stay abstract gradient accents. */}
      <div className="flex h-28 gap-1 p-2" aria-hidden>
        <div className={cn("relative flex-[2] overflow-hidden rounded-md", after ? "opacity-95" : "opacity-70")}>
          <Image
            src={after ? ex.afterImage : ex.beforeImage}
            alt=""
            fill
            sizes="200px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          {[0, 1].map((i) => (
            <div
              key={i}
              className={cn("flex-1 rounded-md", after ? "opacity-80" : "opacity-30")}
              style={{ background: "color-mix(in srgb, var(--se-accent) 30%, transparent)" }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2 px-4 pb-4">
        <h3
          className={cn(
            "font-body font-bold leading-snug",
            after ? "text-se-ink" : "text-se-ink-muted",
          )}
        >
          {after ? ex.afterTitle : ex.beforeTitle}
        </h3>
        <p className="se-num text-sm" style={{ color: after ? "var(--se-accent)" : "var(--se-ink-muted)" }}>
          {after ? ex.afterPrice : ex.beforePrice}
        </p>
      </div>
    </article>
  );
}

function Breakdown({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-surface p-5">
      <h4 className="se-eyebrow">{title}</h4>
      <ul className="mt-3 space-y-2">
        {items.map((it) => (
          <li key={it.slice(0, 24)} className="flex gap-2 text-sm text-se-ink/85">
            <span aria-hidden className="text-se-positive">✓</span>
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
