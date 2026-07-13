import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * StayEdge button — pill CTAs per the brand (primary = Primary Purple fill,
 * Off-White text). Magnetic hover behaviour is layered in the interaction pass;
 * this defines the visual contract + states.
 */
const button = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-[var(--se-radius-pill)] font-body font-bold whitespace-nowrap transition-[transform,background-color,box-shadow] duration-[var(--se-dur-std)] ease-[cubic-bezier(0.2,0.8,0.2,1)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-se-lavender",
  {
    variants: {
      variant: {
        primary:
          "bg-se-purple text-se-offwhite hover:shadow-[0_0_0_1px_var(--se-line-strong),0_10px_40px_-12px_var(--se-glow)]",
        secondary:
          "bg-se-deep-purple text-se-offwhite hover:bg-[color-mix(in_srgb,var(--se-deep-purple)_82%,white)]",
        ghost:
          "bg-transparent text-se-offwhite border border-[var(--se-line-strong)] hover:bg-[color-mix(in_srgb,var(--se-lavender)_10%,transparent)]",
        whatsapp:
          "bg-[#25D366] text-[#0b3d1e] hover:brightness-105",
      },
      size: {
        sm: "text-sm px-4 py-2",
        md: "text-[0.95rem] px-6 py-3",
        lg: "text-base px-8 py-4",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonBaseProps = VariantProps<typeof button> & {
  className?: string;
  children: React.ReactNode;
};

type ButtonAsLink = ButtonBaseProps & {
  href: string;
  external?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">;

type ButtonAsButton = ButtonBaseProps & {
  href?: undefined;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export type ButtonProps = ButtonAsLink | ButtonAsButton;

export function Button(props: ButtonProps) {
  const { variant, size, className, children } = props;
  const classes = cn(button({ variant, size }), className);

  if (props.href !== undefined) {
    const { href, external, ...rest } = props as ButtonAsLink;
    if (external) {
      return (
        <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...rest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props as ButtonAsButton &
    ButtonBaseProps;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
