import { cn } from "@/lib/utils";

/**
 * The premium empty state.
 *
 * StayEdge has more genuinely-empty surfaces than most sites its size, because
 * the brand's honesty law forbids filling them with invented material: no
 * fabricated case studies, no placeholder testimonials, no sample numbers. That
 * makes the empty state a first-class design object here rather than an
 * afterthought — it is what a visitor actually sees on /results today.
 *
 * So it is built to read as a deliberate statement, not as a failure: a hairline
 * panel, a lit diamond mark, and a route onward. The `action` slot is where that
 * route goes; an empty state with no next step is just a dead end with padding.
 *
 * Server component by design — nothing here needs the client, and these panels
 * are frequently the largest thing on a route.
 */
export function EmptyState({
  eyebrow,
  title,
  body,
  action,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative isolate mx-auto max-w-2xl overflow-hidden rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 px-6 py-12 text-center md:px-10",
        className,
      )}
    >
      {/* Ambient lift so the panel reads as lit rather than as a hole in the
          page. Decorative, non-interactive, and behind the content. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-48 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, var(--se-glow-soft), transparent 70%)",
        }}
      />

      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        aria-hidden
        className="mx-auto mb-5 opacity-80"
      >
        <rect
          x="12"
          y="2"
          width="14.14"
          height="14.14"
          rx="2"
          transform="rotate(45 12 2)"
          fill="none"
          stroke="var(--se-accent)"
          strokeWidth="1.25"
        />
      </svg>

      {eyebrow && <p className="se-eyebrow mb-3">{eyebrow}</p>}
      <p className="se-title text-[clamp(20px,2.6vw,26px)] text-se-ink">{title}</p>
      {body && (
        <div className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-se-ink-muted">
          {body}
        </div>
      )}
      {action && <div className="mt-7 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  );
}
