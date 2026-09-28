"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { CTA, FULL_NAV } from "@/lib/config/site";

/**
 * Mobile/tablet navigation sheet.
 *
 * Below `lg` (1024px) the header's browse nav (`PRIMARY_NAV`) is hidden, and
 * below `sm` (640px) so is its CTA cluster's video button — until now nothing
 * replaced them, so everything but the Free Audit CTA was reachable only via
 * the footer (a full scroll away). This is a right-side sheet rather than a
 * full-screen takeover so the header — and its theme toggle — stays reachable
 * while it's open.
 */
export function MobileNav() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  // Focus the panel, lock background scroll, and close on Escape — the same
  // bar Vira sets for its own dialog (see components/ai/Vira.tsx).
  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls={panelId}
        className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full border border-[var(--se-line)] text-se-ink transition-colors hover:border-[var(--se-line-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--se-focus)] lg:hidden"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      <AnimatePresence>
        {open && (
          <div className="lg:hidden">
            <motion.div
              key="mobile-nav-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0.01 : 0.2 }}
              onClick={close}
              aria-hidden
              className="fixed inset-0 z-[240] bg-[var(--se-scrim)]"
            />
            <motion.div
              key="mobile-nav-panel"
              id={panelId}
              ref={panelRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: 16 }}
              transition={{ duration: reduce ? 0.01 : 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 right-0 z-[250] flex w-[min(360px,88vw)] flex-col overflow-y-auto border-l border-[var(--se-line-strong)] bg-se-surface p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] shadow-[0_16px_50px_-12px_var(--se-glow)]"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="se-eyebrow !tracking-[0.2em]">Menu</span>
                <button
                  onClick={close}
                  aria-label="Close menu"
                  className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-se-ink-muted hover:text-se-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--se-focus)]"
                >
                  <CloseIcon />
                </button>
              </div>

              <nav aria-label="Primary" className="mt-2 flex flex-col gap-1">
                {FULL_NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className="rounded-[var(--se-radius-card)] px-3 py-3 text-base font-semibold text-se-ink transition-colors hover:bg-[color-mix(in_srgb,var(--se-lavender)_10%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--se-focus)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-6 flex flex-col gap-2 border-t border-[var(--se-line)] pt-6">
                <Button href={CTA.audit.href} variant="primary" onClick={close}>
                  {CTA.audit.short}
                </Button>
                <Button href={CTA.video.href} variant="ghost" onClick={close}>
                  {CTA.video.short}
                </Button>
                <Button href={CTA.whatsapp.href} external variant="whatsapp" onClick={close}>
                  {CTA.whatsapp.short}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={17}
      height={17}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={17}
      height={17}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
