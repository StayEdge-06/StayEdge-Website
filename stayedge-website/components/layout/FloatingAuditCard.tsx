"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Magnetic } from "@/components/motion/Magnetic";
import { Button } from "@/components/ui/Button";
import { Diamond } from "@/components/brand/Diamond";
import { CTA, ROUTES } from "@/lib/config/site";

/**
 * Floating audit card — one of the brief's five approved glass surfaces
 * (nav / floating audit card / showcase cards / pricing cards / CTA panels).
 * Site-wide (mounted in the root layout); desktop-only; appears once the
 * visitor has scrolled about a viewport's worth down any page (so it never
 * competes with whatever's above the fold — a hero, a tool, a form),
 * collapsed to a slim tab that expands on hover/click. Mirrors Vira.tsx's
 * session-dismiss pattern. Hidden on /free-audit itself (redundant) and /os
 * (internal dashboard, not part of the marketing site).
 */
const SESSION_DISMISS = "stayedge.auditCard.dismissed";
const HIDDEN_ON = [ROUTES.freeAudit, "/os"];

export function FloatingAuditCard() {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const [pastFold, setPastFold] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(SESSION_DISMISS) === "1");
    } catch {
      /* ignore */
    }
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setPastFold(window.scrollY > window.innerHeight * 0.6));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  function dismiss() {
    setDismissed(true);
    try {
      sessionStorage.setItem(SESSION_DISMISS, "1");
    } catch {
      /* ignore */
    }
  }

  const hiddenHere = HIDDEN_ON.some((p) => pathname === p);
  const visible = pastFold && !dismissed && !hiddenHere;

  return (
    <div className="fixed right-4 top-[40%] z-[150] hidden lg:block md:right-6">
      <AnimatePresence>
        {visible && (
          <motion.aside
            aria-label="Free property audit"
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: 16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
          >
            {expanded ? (
              <div className="se-glass w-[260px] rounded-[var(--se-radius-lg)] p-5 shadow-[0_20px_60px_-16px_var(--se-glow)]">
                <div className="mb-2 flex items-start justify-between">
                  <Diamond size={20} state="idle" />
                  <button
                    onClick={dismiss}
                    aria-label="Dismiss"
                    className="cursor-pointer rounded-full px-1 text-se-grey-lavender hover:text-se-offwhite"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm font-semibold text-se-offwhite">
                  Skip straight to a real audit.
                </p>
                <p className="mt-1 text-sm text-se-grey-lavender">
                  A specialist reviews your listing and hands you a prioritized plan — free.
                </p>
                <Magnetic strength={0.3} className="mt-3 block">
                  <Button href={CTA.audit.href} variant="primary" size="sm" haptic className="w-full">
                    {CTA.audit.label}
                  </Button>
                </Magnetic>
              </div>
            ) : (
              <button
                onClick={() => setExpanded(true)}
                aria-label="Book a free audit"
                className="se-glass flex items-center gap-2 rounded-l-[var(--se-radius-lg)] rounded-r-none py-3 pl-3 pr-2 shadow-[0_10px_30px_-8px_var(--se-glow)]"
              >
                <Diamond size={18} state="idle" />
                <span className="se-eyebrow !tracking-[0.15em] [writing-mode:vertical-rl]">
                  {CTA.audit.label}
                </span>
              </button>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
