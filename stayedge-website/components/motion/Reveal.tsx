"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_EDGE } from "@/lib/motion/ease";
import { cn } from "@/lib/utils";

/**
 * Scroll-reveal wrapper (signature #3/#16). Content rises into place along a
 * short vertical offset once on viewport entry. Respects reduced-motion by
 * rendering statically. Content is always in the DOM (SEO/crawler-safe).
 */

export function Reveal({
  children,
  className,
  delay = 0,
  y = 22,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "span";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.5, ease: EASE_EDGE, delay }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Staggered reveal for a group of children (max ~8 per group for good feel).
 * Wrap items in <RevealItem/>.
 */
const groupVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_EDGE } },
};

export function RevealGroup({
  children,
  className,
  // data-* passes straight through to the rendered element in both the reduced
  // and animated branches — card grids mark themselves `data-vira-avoid` here.
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
} & Record<`data-${string}`, string | boolean | undefined>) {
  const reduce = useReducedMotion();
  if (reduce)
    return (
      <div className={className} {...rest}>
        {children}
      </div>
    );
  return (
    <motion.div
      className={className}
      variants={groupVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-8% 0px" }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={cn(className)} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
