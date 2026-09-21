"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Diamond } from "@/components/brand/Diamond";
import { PERSONA } from "@/lib/config/persona";
import { CTA } from "@/lib/config/site";
import { touchVisit, isReturning, type Passport } from "@/lib/ai/memory";

/**
 * Vira — the StayEdge AI consultant, present across the site (Experience Bible §5).
 * A presence, not a chatbot: it recognises returning visitors from the Property
 * Passport and offers one contextual next step. Full conversation lands later.
 *
 * P2.1 rules this component now guarantees, in priority order:
 *
 * 1. It NEVER opens itself. The greeting used to auto-open on a 2.6s timer,
 *    which meant an uninvited 280px panel landed on whatever the visitor had
 *    scrolled to — the third Illustrative Examples card and the footer contact
 *    column were both routinely covered. A first-time visitor now gets a single
 *    unread dot on the launcher instead; the panel is user-initiated, always.
 * 2. The launcher hides itself rather than covering protected content. On every
 *    animation frame of a scroll it hit-tests the five points around its own
 *    box (`document.elementsFromPoint`) and fades out if anything underneath is
 *    a form, the footer, an article/card, an interactive control, or is
 *    explicitly marked `data-vira-avoid` (hero CTA cluster, service and example
 *    grids). Hiding is immediate; returning waits for 300ms of continuous
 *    clearance, which is what stops it strobing as bands of content pass under.
 * 3. Because the launcher is gone over protected regions, the panel can never
 *    be opened over one — and it closes on scroll, so it cannot drift over one
 *    either. That is what makes "never obscures" true at rest, which is the
 *    state every screenshot, reader and screen capture actually sees.
 * 4. Below 640px the panel is a bottom sheet (viewport-width minus gutters, max
 *    320px) over a scrim, so it reads as something the visitor opened. Above
 *    that it is an anchored card. No JS breakpoint — pure CSS, so SSR and
 *    hydration agree.
 * 5. Safe-area insets on both axes, a smaller launcher on phones, Escape to
 *    close with focus returned to the launcher, and full reduced-motion support.
 */
const SESSION_DISMISS = "stayedge.vira.dismissed";

/**
 * What Vira must never sit on top of. `article` covers the example/result
 * cards, the interactive selectors cover CTAs and inputs wherever they live,
 * and `data-vira-avoid` is the explicit escape hatch for regions that are
 * none of those (a hero CTA cluster, a card grid's gutters).
 */
const PROTECTED = [
  "form",
  "footer",
  "article",
  "[data-vira-avoid]",
  "a[href]",
  "button",
  "input",
  "select",
  "textarea",
  '[role="button"]',
].join(",");

/** Milliseconds of continuous clearance before the launcher comes back. */
const REVEAL_DELAY = 300;

/** True if anything protected sits under (or within 8px of) the launcher. */
function isObstructed(root: HTMLElement, launcher: HTMLElement): boolean {
  const r = launcher.getBoundingClientRect();
  if (r.width === 0) return false;
  const m = 8;
  const points: Array<[number, number]> = [
    [r.left - m, r.top - m],
    [r.right + m, r.top - m],
    [r.left - m, r.bottom + m],
    [r.right + m, r.bottom + m],
    [r.left + r.width / 2, r.top + r.height / 2],
  ];
  for (const [x, y] of points) {
    if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) continue;
    for (const node of document.elementsFromPoint(x, y)) {
      // Vira's own subtree is always under these points — ignore it.
      if (root.contains(node)) continue;
      if (node.closest(PROTECTED)) return true;
    }
  }
  return false;
}

export function Vira() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [returning, setReturning] = useState(false);
  const [unread, setUnread] = useState(false);
  const [obstructed, setObstructed] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // ── Passport + unread dot ────────────────────────────────────────────
  useEffect(() => {
    const p: Passport | null = touchVisit();
    setReturning(isReturning(p));
    try {
      setUnread(sessionStorage.getItem(SESSION_DISMISS) !== "1");
    } catch {
      setUnread(true);
    }
  }, []);

  // ── Obstruction guard ────────────────────────────────────────────────
  // Runs while the panel is closed. While it is open the launcher anchors a
  // dialog the visitor deliberately opened, so it stays put — and the panel
  // closes on scroll anyway (see below), which returns us to this guard.
  useEffect(() => {
    if (open) return;
    const root = rootRef.current;
    const launcher = launcherRef.current;
    if (!root || !launcher) return;

    let frame = 0;
    let revealTimer = 0;

    const apply = (covering: boolean) => {
      if (covering) {
        if (revealTimer) {
          clearTimeout(revealTimer);
          revealTimer = 0;
        }
        setObstructed(true);
      } else if (!revealTimer) {
        revealTimer = window.setTimeout(() => {
          revealTimer = 0;
          setObstructed(false);
        }, REVEAL_DELAY);
      }
    };

    const probe = () => {
      frame = 0;
      apply(isObstructed(root, launcher));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(probe);
    };

    probe();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      if (revealTimer) clearTimeout(revealTimer);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [open]);

  const close = useCallback((remember = true) => {
    setOpen(false);
    if (remember) {
      setUnread(false);
      try {
        sessionStorage.setItem(SESSION_DISMISS, "1");
      } catch {
        /* private mode — the dot simply returns next navigation */
      }
    }
    launcherRef.current?.focus();
  }, []);

  // ── Open-state behaviour: Escape closes, scrolling closes ────────────
  // Closing on scroll is what guarantees the panel cannot drift over a form,
  // a card or the footer after it was opened somewhere clear.
  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onScroll = () => setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open, close]);

  const greeting = returning
    ? {
        title: "Welcome back.",
        body: "Still weighing it up? A Property Growth Audit is free and takes one message.",
        cta: { label: CTA.audit.short, href: CTA.audit.href },
      }
    : {
        title: `I'm ${PERSONA.name}.`,
        body: "Send me your listing and I'll show you what's quietly costing you bookings — free.",
        cta: { label: CTA.audit.short, href: CTA.audit.href },
      };

  return (
    <>
      {/* Scrim, phones only — the sheet is wide enough there to read as modal. */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="vira-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.01 : 0.24 }}
            onClick={() => close()}
            aria-hidden
            className="fixed inset-0 z-[199] bg-[var(--se-scrim)] sm:hidden"
          />
        )}
      </AnimatePresence>

      <div
        ref={rootRef}
        className="fixed bottom-[calc(96px+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))] z-[200] flex flex-col items-end gap-3 sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] sm:right-[calc(1.5rem+env(safe-area-inset-right))]"
      >
        <AnimatePresence>
          {open && (
            <motion.div
              ref={panelRef}
              tabIndex={-1}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: reduce ? 0.01 : 0.32, ease: [0.16, 1, 0.3, 1] }}
              // w-[min(320px,100vw-2rem)]: a real bottom sheet at 320px, an
              // anchored card from 640px up. No JS breakpoint, so the server
              // and the client render the same thing.
              className="w-[min(320px,calc(100vw-2rem))] rounded-[var(--se-radius-lg)] border border-[var(--se-line-strong)] bg-se-surface p-4 shadow-[0_16px_50px_-12px_var(--se-glow)] sm:w-[280px]"
              role="dialog"
              aria-label={`${PERSONA.name}, StayEdge AI consultant`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="se-eyebrow !tracking-[0.2em]">{PERSONA.name}</span>
                <button
                  onClick={() => close()}
                  aria-label="Dismiss"
                  className="cursor-pointer rounded-full px-2 text-se-ink-muted hover:text-se-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--se-focus)]"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm font-semibold text-se-ink">{greeting.title}</p>
              <p className="mt-1 text-sm text-se-ink-muted">{greeting.body}</p>
              <a
                href={greeting.cta.href}
                className="mt-3 inline-flex cursor-pointer rounded-[var(--se-radius-pill)] bg-se-purple px-4 py-2 text-sm font-bold text-se-on-accent transition-transform active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--se-focus)]"
              >
                {greeting.cta.label}
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Launcher — user-initiated, and removed from the tab order and the
            hit area entirely while it would cover protected content. */}
        <button
          ref={launcherRef}
          onClick={() =>
            setOpen((v) => {
              if (!v) setUnread(false);
              return !v;
            })
          }
          aria-label={`Talk to ${PERSONA.name}`}
          aria-expanded={open}
          aria-haspopup="dialog"
          tabIndex={obstructed && !open ? -1 : 0}
          className={`relative grid h-12 w-12 cursor-pointer place-items-center rounded-full border border-[var(--se-line-strong)] bg-se-deep-purple shadow-[0_10px_30px_-8px_var(--se-glow)] transition-[transform,opacity] duration-[var(--se-dur-std)] hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--se-focus)] sm:h-14 sm:w-14 ${
            obstructed && !open ? "pointer-events-none scale-90 opacity-0" : "opacity-100"
          }`}
        >
          <Diamond size={24} state={open ? "insight" : "idle"} />
          {/* One unread dot is the whole invitation — no timer, no interruption. */}
          {unread && !open && (
            <span
              aria-hidden
              className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[var(--se-ground)] bg-se-accent"
            />
          )}
        </button>
      </div>
    </>
  );
}
