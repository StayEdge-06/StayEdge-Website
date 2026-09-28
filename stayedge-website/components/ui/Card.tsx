import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * The card "shell" repeated, byte-for-byte, across all six service pages and
 * the services hub: a bordered, radiused surface with an optional accent edge
 * strip (Design System's Rising Edge accent) and an optional hover state for
 * the interactive/link variant. Extracted so the shell has one source of
 * truth — previously a spacing or radius change needed find-and-replace
 * across 6+ files (StayEdge V2 UI/UX Audit §3).
 *
 * This owns the shell only, not layout: callers still add their own `h-full`,
 * `flex flex-col`, grid placement, etc. via `className` (merged via `cn()`,
 * not replaced), same contract as Button.
 */
const card = cva(
  "rounded-[var(--se-radius-lg)] border border-[var(--se-line)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--se-focus)]",
  {
    variants: {
      tone: {
        surface: "bg-se-surface",
        ground2: "bg-se-ground-2",
      },
      padding: {
        sm: "p-4",
        md: "p-5",
        lg: "p-6",
      },
      /** The Rising Edge accent bar; `pl-7` compensates the left padding for it. */
      edge: {
        true: "se-edge-strip pl-7",
        false: "",
      },
      interactive: {
        true: "transition-colors hover:border-[var(--se-line-strong)]",
        false: "",
      },
    },
    defaultVariants: { tone: "ground2", padding: "lg", edge: false, interactive: false },
});

export type CardVariants = VariantProps<typeof card>;

/**
 * The class recipe alone, for a caller that needs to apply it to an element
 * Card itself doesn't render — e.g. inside TiltCard, which owns the tilt
 * wrapper and expects the bordered content as its child.
 */
export function cardClassName(variants?: CardVariants, className?: string) {
  return cn(card(variants), className);
}

type CardBaseProps = CardVariants & {
  className?: string;
  children: React.ReactNode;
};

type CardAsLink = CardBaseProps & {
  href: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">;

type CardAsDiv = CardBaseProps & {
  href?: undefined;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children">;

export type CardProps = CardAsLink | CardAsDiv;

/**
 * A bordered content card — a `<Link>` when `href` is given (and interactive
 * by default, since a link with no hover state reads as broken), a plain
 * `<div>` otherwise.
 */
export function Card(props: CardProps) {
  const { tone, padding, edge, interactive, className, children } = props;
  const classes = cardClassName(
    { tone, padding, edge, interactive: interactive ?? Boolean(props.href) },
    className,
  );

  if (props.href !== undefined) {
    const {
      href,
      tone: _t,
      padding: _p,
      edge: _e,
      interactive: _i,
      className: _c,
      children: _ch,
      ...rest
    } = props as CardAsLink;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const {
    tone: _t2,
    padding: _p2,
    edge: _e2,
    interactive: _i2,
    className: _c2,
    children: _ch2,
    ...rest
  } = props as CardAsDiv;
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
