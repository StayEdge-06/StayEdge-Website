"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { EASE_EDGE } from "@/lib/motion/ease";

/**
 * Reading progress, drawn on the header's bottom edge so it costs no vertical
 * space and no second horizontal rule. Two things share that 2px line:
 *
 *  - the progress fill, scaled from the document's scroll position;
 *  - a one-shot sweep on route change, which is the site's page transition
 *    tell — it confirms the new route has committed without the content
 *    itself having to animate in.
 *
 * Both are pure `transform`, so the whole thing stays on the compositor and
 * never triggers layout. Decorative and duplicated by the browser's own
 * scrollbar, so it is hidden from assistive tech.
 */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();

  // A light spring stops the fill from jittering on trackpads and gives it the
  // brand's settle. Under reduced motion it tracks the scroll position exactly.
  const smooth = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] overflow-hidden">
      <motion.div
        className="h-full w-full origin-left bg-se-accent"
        style={{ scaleX: reduce ? scrollYProgress : smooth }}
      />
      {!reduce && (
        <motion.div
          // Keyed on the route so it replays on every navigation. On the first
          // load `pathname` is stable, so this plays once as the page settles.
          key={pathname}
          className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-se-accent to-transparent"
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: "400%", opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.75, ease: EASE_EDGE }}
        />
      )}
    </div>
  );
}
