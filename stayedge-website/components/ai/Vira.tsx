"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Diamond } from "@/components/brand/Diamond";
import { PERSONA } from "@/lib/config/persona";
import { ROUTES } from "@/lib/config/site";
import {
  touchVisit,
  mostRecentProperty,
  isReturning,
  type Passport,
  type PropertyRecord,
} from "@/lib/ai/memory";

/**
 * Vira — the StayEdge AI consultant, present across the site (Experience Bible §5).
 * A presence, not a chatbot: it greets once (after a delay so it never interrupts),
 * recognises returning visitors from the Property Passport, offers one contextual
 * next step, and does not re-nag once dismissed. Full conversation lands later.
 */
const SESSION_DISMISS = "stayedge.vira.dismissed";

export function Vira() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [returning, setReturning] = useState(false);
  const [recent, setRecent] = useState<PropertyRecord | null>(null);

  useEffect(() => {
    const p: Passport | null = touchVisit();
    setReturning(isReturning(p));
    setRecent(mostRecentProperty(p));

    const dismissed = sessionStorage.getItem(SESSION_DISMISS) === "1";
    if (dismissed) return;
    const t = setTimeout(() => setOpen(true), 2600); // delayed → never interrupts
    return () => clearTimeout(t);
  }, []);

  function dismiss() {
    setOpen(false);
    try {
      sessionStorage.setItem(SESSION_DISMISS, "1");
    } catch {
      /* ignore */
    }
  }

  const greeting =
    returning && recent
      ? {
          title: "Welcome back.",
          body: recent.label
            ? `Last time we looked at your ${recent.label}. Want to pick up where we left off?`
            : "Want to pick up where we left off, or look at a new listing?",
          cta: { label: "Continue", href: `${ROUTES.roast}?ref=${encodeURIComponent(recent.ref)}` },
        }
      : {
          title: `I'm ${PERSONA.name}.`,
          body: "Paste your listing and I'll show you what's quietly costing you bookings — free.",
          cta: { label: "Roast my listing", href: ROUTES.roast },
        };

  return (
    <div className="fixed bottom-[96px] right-4 z-[200] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="se-glass max-w-[280px] rounded-[var(--se-radius-lg)] p-4 shadow-[0_16px_50px_-12px_var(--se-glow)]"
            role="dialog"
            aria-label={`${PERSONA.name}, StayEdge AI consultant`}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="se-eyebrow !tracking-[0.2em]">{PERSONA.name}</span>
              <button
                onClick={dismiss}
                aria-label="Dismiss"
                className="cursor-pointer rounded-full px-2 text-se-grey-lavender hover:text-se-offwhite"
              >
                ✕
              </button>
            </div>
            <p className="text-sm font-semibold text-se-offwhite">{greeting.title}</p>
            <p className="mt-1 text-sm text-se-grey-lavender">{greeting.body}</p>
            <a
              href={greeting.cta.href}
              className="mt-3 inline-flex cursor-pointer rounded-[var(--se-radius-pill)] bg-se-purple px-4 py-2 text-sm font-bold text-se-offwhite transition-transform active:scale-95"
            >
              {greeting.cta.label}
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar — click to toggle the greeting */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={`Talk to ${PERSONA.name}`}
        className="se-glass grid h-14 w-14 cursor-pointer place-items-center rounded-full shadow-[0_10px_30px_-8px_var(--se-glow)] transition-transform hover:scale-105 active:scale-95"
      >
        <Diamond size={26} state={open ? "insight" : "idle"} />
      </button>
    </div>
  );
}
