"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getMotionTier } from "@/lib/motion/tier";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/**
 * GSAP scroll-storytelling primitives (flagship rebuild).
 * All effects no-op gracefully under the "static" tier; pins are full-tier only.
 */

/** Fire once when the element enters the viewport (robust across renderers). */
export function useEnterOnce(ref: React.RefObject<HTMLElement | null>, onEnter: () => void) {
  const fired = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true;
          io.disconnect();
          onEnter();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** Animated number that counts up when it enters the viewport. */
export function CountUp({
  value,
  className,
  prefix = "",
  suffix = "",
  duration = 1.4,
}: {
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const final = `${prefix}${value.toLocaleString("en-IN")}${suffix}`;

  useEnterOnce(ref, () => {
    const el = ref.current;
    if (!el) return;
    if (getMotionTier() === "static") {
      el.textContent = final;
      return;
    }
    const obj = { v: 0 };
    gsap.to(obj, {
      v: value,
      duration,
      ease: "power3.out",
      onUpdate: () => {
        el.textContent = `${prefix}${Math.round(obj.v).toLocaleString("en-IN")}${suffix}`;
      },
      onComplete: () => {
        el.textContent = final;
      },
    });
  });

  // SSR/prerender shows the real value (SEO + no-JS); the tween restarts from 0 on entry.
  return (
    <span ref={ref} className={className}>
      {final}
    </span>
  );
}

/** Cinematic word-by-word reveal for headlines (free-plugin split; no SplitText). */
export function WordReveal({
  text,
  accentFrom,
  className,
  as: Tag = "h2",
}: {
  text: string;
  /** Words from this index onward get the lavender accent. */
  accentFrom?: number;
  className?: string;
  as?: "h1" | "h2" | "p";
}) {
  const ref = useRef<HTMLElement>(null);
  const words = text.split(" ");

  useEnterOnce(ref, () => {
    const el = ref.current;
    if (!el || getMotionTier() === "static") return;
    const spans = el.querySelectorAll<HTMLElement>("[data-word]");
    gsap.fromTo(
      spans,
      { yPercent: 110, opacity: 0, rotateX: -35 },
      { yPercent: 0, opacity: 1, rotateX: 0, duration: 0.7, stagger: 0.055, ease: "expo.out" },
    );
  });

  return (
    // @ts-expect-error dynamic tag ref
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <span
            data-word
            className={cn("inline-block [will-change:transform]", accentFrom != null && i >= accentFrom && "text-se-accent")}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}

/**
 * Pinned pipeline (Design System signature #10): on the full tier the section
 * pins while stages ignite one by one and a progress line draws down. On
 * rich/static tiers it renders as the normal stacked list with simple reveals.
 */
export function PinnedStages({
  stages,
  className,
}: {
  stages: { n: string; title: string; body: string }[];
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const tier = getMotionTier();
    if (tier !== "full") return;
    setPinned(true);

    const ctx = gsap.context(() => {
      const items = el.querySelectorAll<HTMLElement>("[data-stage]");
      const line = el.querySelector<HTMLElement>("[data-line]");
      // Pre-dim everything so nothing can flash fully-lit before the first scrub render.
      gsap.set(items, { opacity: 0.18, x: -14 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 18%",
          end: `+=${stages.length * 320}`,
          pin: true,
          scrub: 0.6,
        },
      });
      if (line) tl.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: "none", duration: stages.length }, 0);
      items.forEach((item, i) => {
        tl.fromTo(
          item,
          { opacity: 0.18, x: -14 },
          { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" },
          i * 1 + 0.15,
        );
        const dot = item.querySelector<HTMLElement>("[data-dot]");
        if (dot)
          tl.fromTo(
            dot,
            // Fades the accent up rather than tweening between two literal
            // colours: a colour tween would bake the current theme's hex into
            // the timeline at build time and go stale the moment the visitor
            // switches. Opacity also keeps the dot on the compositor.
            { scale: 0.4, opacity: 0.32 },
            { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2)" },
            i * 1 + 0.15,
          );
      });
    }, el);
    return () => ctx.revert();
  }, [stages.length]);

  return (
    <div ref={wrap} className={cn("relative", className)}>
      {/* progress line (full tier only) */}
      <div
        aria-hidden
        className={cn("absolute bottom-2 left-[7px] top-2 w-[2px] origin-top bg-[var(--se-line)]", !pinned && "hidden")}
      >
        <div data-line className="h-full w-full origin-top scale-y-0 bg-se-accent" />
      </div>
      <div className={cn(pinned && "pl-8")}>
        {stages.map((s) => (
          <div key={s.n} data-stage className="relative flex gap-5 py-5">
            {pinned && (
              <span
                data-dot
                aria-hidden
                className="absolute -left-8 top-7 h-3.5 w-3.5 -translate-x-[-1px] rounded-full bg-se-accent"
                style={{ opacity: 0.32 }}
              />
            )}
            <span className="se-num shrink-0 text-2xl text-se-accent">{s.n}</span>
            <div>
              <h3 className="font-body text-lg font-bold text-se-ink">{s.title}</h3>
              <p className="mt-1 text-se-ink-muted">{s.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
