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
}: {
  variant?: LogoVariant;
  className?: string;
  withHome?: boolean;
  height?: number;
}) {
  const { src, ratio } = ASSET[variant];
  const width = Math.round(height * ratio);

  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="StayEdge"
      width={width}
      height={height}
      className={cn("block select-none", className)}
      draggable={false}
    />
  );

  if (!withHome) return img;
  return (
    <Link href="/" aria-label="StayEdge home" className="inline-flex items-center">
      {img}
    </Link>
  );
}
