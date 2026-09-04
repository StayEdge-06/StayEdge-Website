"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_EDGE } from "@/lib/motion/ease";

/**
 * Route-change transition for the main column.
 *
 * Two constraints shaped this, and they rule out the usual implementation:
 *
 * 1. It must not animate on first paint. A template that starts at opacity 0
 *    is server-rendered at opacity 0, so the LCP element is invisible until
 *    hydration finishes — on a mid-range phone that is a measurable CWV
 *    regression for an effect nobody asked for. `initial={false}` on the very
 *    first render means the document paints exactly as the server sent it.
 *
 * 2. It animates opacity only, never transform. A transformed ancestor becomes
 *    the containing block for `position: fixed` descendants, and Framer leaves
 *    `transform: translateY(0px)` behind when a tween ends — which would
 *    silently break any fixed or GSAP-pinned element inside the page for the
 *    rest of the visit. Opacity settles at exactly 1 and leaves no trace.
 *
 * The brand's "rise" is not lost: it lives in the section-level <Reveal/>
 * components, which run on entry and are already tuned to the same curve.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  // React's documented "adjust state during render" pattern for comparing
  // against the previous props. `isNavigation` is true on exactly the render
  // where the route changed — which is the render that mounts the new keyed
  // element below, and therefore the only render whose `initial` is read.
  const [seen, setSeen] = useState(pathname);
  const isNavigation = seen !== pathname;
  if (isNavigation) setSeen(pathname);

  if (reduce) return <>{children}</>;

  return (
    <motion.div
      key={pathname}
      initial={isNavigation ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.32, ease: EASE_EDGE }}
    >
      {children}
    </motion.div>
  );
}
