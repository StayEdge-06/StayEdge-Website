"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useEnterOnce } from "@/components/motion/ScrollFX";
import { getMotionTier } from "@/lib/motion/tier";
import { cn } from "@/lib/utils";

/**
 * Eyebrow Type-On (Design System signature #14). The Jura eyebrow label
 * types in, tracked-wide, before each section title — priming curiosity for
 * what follows. The real text is always in the DOM (SEO/no-JS safe); only a
 * clip-width reveals it. Static tier / reduced-motion: full width instantly,
 * no animation.
 */
export function EyebrowTypeOn({
  text,
  className,
  as: Tag = "p",
}: {
  text: string;
  className?: string;
  as?: "p" | "span";
}) {
  const wrapRef = useRef<HTMLElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEnterOnce(wrapRef, () => {
    const span = spanRef.current;
    if (!span) return;
    if (getMotionTier() === "static") {
      span.style.width = "auto";
      return;
    }
    const full = span.scrollWidth;
    const steps = Math.max(4, Math.min(text.length, 22));
    span.dataset.typing = "true";
    gsap.fromTo(
      span,
      { width: 0 },
      {
        width: full,
        duration: 0.55,
        ease: `steps(${steps})`,
        onComplete: () => {
          span.style.width = "auto";
          span.dataset.typing = "false";
        },
      },
    );
  });

  return (
    // @ts-expect-error dynamic tag ref
    <Tag ref={wrapRef} className={cn("se-eyebrow", className)}>
      <span
        ref={spanRef}
        data-typing="false"
        className="relative inline-block w-0 overflow-hidden whitespace-nowrap align-bottom after:absolute after:right-0 after:top-0 after:h-full after:w-[2px] after:bg-se-lavender after:opacity-0 after:content-[''] data-[typing=true]:after:animate-[se-cue-caret_0.8s_steps(2)_infinite] data-[typing=true]:after:opacity-100"
      >
        {text}
      </span>
    </Tag>
  );
}
