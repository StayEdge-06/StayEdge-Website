import { cn } from "@/lib/utils";

/**
 * Loading placeholder. Deliberately a server component with no props beyond
 * shape: a skeleton that needs configuration is usually a sign the real
 * component should have been streamed instead.
 *
 * Always pair it with a `role="status"` container that carries the accessible
 * label — the blocks themselves are decorative and hidden from assistive tech,
 * because a screen reader announcing eight grey rectangles helps nobody.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("se-skeleton rounded-[var(--se-radius-md)]", className)}
    />
  );
}

/**
 * A paragraph's worth of skeleton lines. The last line is short, which is what
 * makes a block of placeholders read as text rather than as a table.
 */
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div aria-hidden className={cn("flex flex-col gap-2.5", className)}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          className={cn("h-3.5", i === lines - 1 ? "w-[62%]" : "w-full")}
        />
      ))}
    </div>
  );
}
