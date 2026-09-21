/**
 * Route-level loading UI. Shown while a dynamic segment's server work is in
 * flight (the OS dashboard and the API-backed routes); static pages stream
 * straight past it.
 *
 * Zero JavaScript by design — this is the screen that exists precisely because
 * the page's own JS has not arrived yet, so the mark animates in CSS.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6"
    >
      <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden>
        <rect
          className="se-loading-diamond"
          x="12"
          y="12"
          width="20"
          height="20"
          rx="3"
          fill="var(--se-accent)"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      </svg>
      <p className="se-eyebrow">Loading</p>
    </div>
  );
}
