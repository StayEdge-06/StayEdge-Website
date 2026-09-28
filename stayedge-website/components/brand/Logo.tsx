import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * StayEdge logo — "The Rising Edge".
 * Renders the REAL brand assets synced from the Brand Operating System
 * (public/brand/logos). Per LOGO-RULES the mark is never redrawn or recoloured.
 *
 * Text-bearing lockups use the PNG variants: the SVG lockups render the wordmark
 * and tagline as *live text* that requires the Outfit/Jura fonts, which an
 * <img>-referenced SVG cannot access — so it clips. The PNGs bake the correct
 * fonts in. The icon-only mark is pure vector geometry (no font), so it stays SVG.
 */
type LogoVariant = "dark-bg" | "reverse" | "purple-field" | "icon";

const ASSET: Record<LogoVariant, { src: string; ratio: number }> = {
  // ratios = intrinsic width / height
  "dark-bg": { src: "/brand/logos/stayedge-logo-primary-dark.png", ratio: 1650 / 660 },
  reverse: { src: "/brand/logos/stayedge-logo-light-reverse.png", ratio: 1245 / 435 },
  "purple-field": { src: "/brand/logos/stayedge-logo-purple-field.png", ratio: 825 / 420 },
  icon: { src: "/brand/logos/stayedge-icon.svg", ratio: 570 / 540 },
};

export function Logo({
  variant = "dark-bg",
  className,
  withHome = true,
  height = 44,
  themed = false,
}: {
  variant?: LogoVariant;
  className?: string;
  withHome?: boolean;
  height?: number;
  /**
   * Follow the page theme: the dark-ground lockup on charcoal, the reverse
   * lockup on the light canvas. Both ship in the markup and CSS picks one from
   * `data-theme` (globals.css), which keeps this a server component and puts
   * the right mark in the first painted frame. Costs one extra cached PNG.
   */
  themed?: boolean;
}) {
  const inner = themed ? (
    <>
      <Mark variant="dark-bg" height={height} className={cn("se-logo-dark", className)} />
      <Mark variant="reverse" height={height} className={cn("se-logo-light", className)} />
    </>
  ) : (
    <Mark variant={variant} height={height} className={className} />
  );

  if (!withHome) return inner;
  return (
    <Link href="/" aria-label="StayEdge home" className="inline-flex items-center">
      {inner}
    </Link>
  );
}

function Mark({
  variant,
  height,
  className,
}: {
  variant: LogoVariant;
  height: number;
  className?: string;
}) {
  const { src, ratio } = ASSET[variant];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="StayEdge"
      width={Math.round(height * ratio)}
      height={height}
      className={cn("block select-none", className)}
      draggable={false}
    />
  );
}
