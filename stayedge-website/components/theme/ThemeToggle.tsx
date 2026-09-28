"use client";

import { useTheme } from "@/components/theme/ThemeProvider";
import { cn } from "@/lib/utils";

/**
 * Theme control. Shows the theme you are switching TO, which is the
 * convention visitors read fastest on a control this small.
 *
 * Which icon is visible is decided in CSS by the document's `data-theme`
 * attribute (see globals.css), not by React state. That matters: the attribute
 * is set by the blocking head script, so a light-theme visitor sees the correct
 * icon in the first painted frame instead of watching it swap at hydration.
 * React state is used only for the click handler and the label.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Light theme" : "Dark theme"}
      className={cn(
        "se-theme-toggle relative grid h-9 w-9 shrink-0 place-items-center rounded-full",
        "border border-[var(--se-line)] text-se-ink-muted",
        "transition-colors duration-[var(--se-dur-micro)]",
        "hover:border-[var(--se-line-strong)] hover:text-se-ink",
        className,
      )}
    >
      {/* Both marks are always in the DOM; CSS reveals one. */}
      <SunIcon className="se-theme-icon se-theme-icon--sun" />
      <MoonIcon className="se-theme-icon se-theme-icon--moon" />
    </button>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={17}
      height={17}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4L17 7M7 17l-1.6 1.6" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={17}
      height={17}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20.2 14.4A8.6 8.6 0 0 1 9.6 3.8a8.6 8.6 0 1 0 10.6 10.6Z" />
    </svg>
  );
}
