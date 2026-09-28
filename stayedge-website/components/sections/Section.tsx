import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";
import { EyebrowTypeOn } from "@/components/motion/EyebrowTypeOn";

/**
 * Consistent section shell — alternating charcoal / deeper grounds create the
 * brand's cinematic rhythm. Generous vertical breathing per the Design System.
 */
export function Section({
  children,
  className,
  ground = "base",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  ground?: "base" | "deep" | "light";
  id?: string;
}) {
  const bg =
    ground === "deep"
      ? "bg-se-ground-2"
      : ground === "light"
        ? "bg-se-invert-ground text-se-invert-ink"
        : "bg-se-ground";
  return (
    <section id={id} className={cn("relative", bg)}>
      <div className={cn("mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28", className)}>
        {children}
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  center = true,
  light = false,
  as: Tag = "h2",
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  center?: boolean;
  light?: boolean;
  /** Page-level heading rank — defaults to h2 (a section inside a page that
   * already has its own h1). Set "h1" on a page's first SectionHeading when
   * the page has no hero-style h1 elsewhere (accessibility/SEO audit,
   * Phase 4: every indexable page needs exactly one h1). */
  as?: "h1" | "h2";
}) {
  return (
    <Reveal className={cn(center && "text-center", "mx-auto max-w-3xl")}>
      <EyebrowTypeOn text={eyebrow} className="mb-4" />
      <Tag
        className={cn(
          "se-title text-[clamp(26px,4vw,44px)]",
          light ? "text-se-invert-ink" : "text-se-ink",
        )}
      >
        {title}
      </Tag>
      {intro && (
        <p
          className={cn(
            "mt-4 text-lg",
            light ? "text-se-invert-ink/70" : "text-se-ink-muted",
          )}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}
