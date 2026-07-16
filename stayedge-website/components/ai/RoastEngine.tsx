"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ThinkingTheater } from "@/components/ai/ThinkingTheater";
import { Button } from "@/components/ui/Button";
import { PERSONA, type PersonaModeId } from "@/lib/config/persona";
import { WHATSAPP_URL, ROUTES } from "@/lib/config/site";
import type { GuidedInput, RoastResult } from "@/lib/ai/roast";
import { requestRoast, type RoastResponse } from "@/lib/ai/client";
import { rememberProperty, rememberLead } from "@/lib/ai/memory";
import { track } from "@/lib/analytics";

type Phase = "form" | "thinking" | "result";

/**
 * The Roast Engine experience (Milestone 3). Guided-input-first: we take the
 * URL, then ask for just enough to be specific — never inventing facts. The
 * analysis runs through the pluggable provider (lib/ai/roast); the real AI brain
 * swaps in later without touching this UI. Mode switches re-tone the SAME
 * analysis with no re-run.
 */
export function RoastEngine() {
  const params = useSearchParams();
  const reduce = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("form");
  const [mode, setMode] = useState<PersonaModeId>(PERSONA.defaultModeId);
  const [url, setUrl] = useState("");
  const [guided, setGuided] = useState<GuidedInput>({ weekendPricing: false });
  const [result, setResult] = useState<RoastResult | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  // The Brain request runs in parallel with the thinking theater.
  const pendingRef = useRef<Promise<RoastResponse> | null>(null);

  useEffect(() => {
    const u = params.get("url") ?? params.get("ref") ?? "";
    if (u) setUrl(u);
  }, [params]);

  function run() {
    track("roast_started", { mode });
    pendingRef.current = requestRoast({ url: url || undefined, guided, mode });
    setPhase("thinking");
  }

  async function finishThinking() {
    const r = await (pendingRef.current ??
      requestRoast({ url: url || undefined, guided, mode }));
    setResult(r);
    setPhase("result");
    if (r.score != null) {
      track("roast_completed", {
        score: r.score,
        confidence: r.confidence,
        mode,
        source: r.source ?? "heuristic",
      });
      rememberProperty({
        ref: url || guided.title || "listing",
        label: guided.city ? `${guided.city} stay` : guided.title?.slice(0, 24),
        city: guided.city,
        score: r.score,
      });
    }
  }

  // Mode switch on the result re-tones the same inputs — no new "thinking".
  function switchMode(next: PersonaModeId) {
    setMode(next);
    if (phase === "result") {
      requestRoast({ url: url || undefined, guided, mode: next }).then(setResult);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 md:px-8 md:py-24">
      <div className="text-center">
        <p className="se-eyebrow mb-4">The Roast · powered by {PERSONA.name}</p>
        <h1 className="font-display uppercase leading-[1.12] tracking-[-0.01em] text-[clamp(28px,6vw,56px)] text-se-offwhite">
          What&apos;s your listing <span className="text-se-lavender">really</span> worth?
        </h1>
      </div>

      <ModeChips mode={mode} onChange={switchMode} />

      {phase === "form" && (
        <GuidedForm
          url={url}
          setUrl={setUrl}
          guided={guided}
          setGuided={setGuided}
          onSubmit={run}
        />
      )}

      {phase === "thinking" && <ThinkingTheater onDone={finishThinking} />}

      {phase === "result" && result && (
        <ResultView
          result={result}
          refId={url || guided.title || "listing"}
          unlocked={unlocked}
          onUnlock={() => setUnlocked(true)}
          onRetry={() => {
            setResult(null);
            setUnlocked(false);
            setGuided({ weekendPricing: false });
            setUrl("");
            setPhase("form");
          }}
          reduce={!!reduce}
        />
      )}
    </div>
  );
}

function ModeChips({
  mode,
  onChange,
}: {
  mode: PersonaModeId;
  onChange: (m: PersonaModeId) => void;
}) {
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-2">
      {PERSONA.modes.map((m) => {
        const active = m.id === mode;
        return (
          <button
            key={m.id}
            onClick={() => onChange(m.id)}
            aria-pressed={active}
            className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors ${
              active
                ? "border-se-purple bg-[color-mix(in_srgb,var(--se-purple)_22%,transparent)] text-se-offwhite"
                : "border-[var(--se-line)] text-se-grey-lavender hover:text-se-offwhite"
            }`}
          >
            {m.glyph} {m.label}
          </button>
        );
      })}
    </div>
  );
}

function GuidedForm({
  url,
  setUrl,
  guided,
  setGuided,
  onSubmit,
}: {
  url: string;
  setUrl: (v: string) => void;
  guided: GuidedInput;
  setGuided: (g: GuidedInput) => void;
  onSubmit: () => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="mt-10 space-y-5 rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-6 md:p-8"
    >
      <p className="text-sm text-se-grey-lavender">
        Paste your listing and give me a little to work with — so I&apos;m specific, not generic.
      </p>

      <TextField label="Airbnb listing link (optional)" value={url} onChange={setUrl} type="url" placeholder="https://airbnb.com/rooms/…" />
      <TextField
        label="Your listing title"
        value={guided.title ?? ""}
        onChange={(v) => setGuided({ ...guided, title: v })}
        placeholder="e.g. Sunlit 2BHK, 6 min to the temple"
        required
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <NumberField
          label="Nightly price (₹)"
          value={guided.price}
          onChange={(v) => setGuided({ ...guided, price: v })}
          placeholder="3500"
        />
        <TextField
          label="City"
          value={guided.city ?? ""}
          onChange={(v) => setGuided({ ...guided, city: v })}
          placeholder="Tirupati"
        />
      </div>
      <label className="flex cursor-pointer items-center gap-3 text-sm text-se-offwhite/90">
        <input
          type="checkbox"
          checked={!!guided.weekendPricing}
          onChange={(e) => setGuided({ ...guided, weekendPricing: e.target.checked })}
          className="h-5 w-5 cursor-pointer accent-[var(--se-purple)]"
        />
        I already charge more on weekends
      </label>

      <Button type="submit" variant="primary" size="lg" className="w-full">
        Roast my listing
      </Button>
      <p className="text-center text-xs text-se-grey-lavender">
        Free · your first 3 issues, no email
      </p>
    </form>
  );
}

function ResultView({
  result,
  refId,
  unlocked,
  onUnlock,
  onRetry,
  reduce,
}: {
  result: RoastResult;
  refId: string;
  unlocked: boolean;
  onUnlock: () => void;
  onRetry: () => void;
  reduce: boolean;
}) {
  if (result.needsGuided || result.score == null) {
    return (
      <div className="mt-10 rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-8 text-center">
        <p className="text-se-offwhite">{result.note}</p>
        <p className="mt-2 text-sm text-se-grey-lavender">
          Add your title and price above and I&apos;ll give you a real read.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="se-edge-strip rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-charcoal p-6 md:p-8">
        <div className="flex items-start justify-between">
          <div>
            <span className="se-eyebrow">Roast Score</span>
            <ConfidenceBadge confidence={result.confidence} />
          </div>
          <div className="text-right">
            <ScoreNumber value={result.score} reduce={reduce} />
            <p className="mt-1 text-xs text-se-grey-lavender">
              A strong listing reaches {result.benchmark}+
            </p>
          </div>
        </div>

        <ul className="mt-6 space-y-4">
          {result.issues.slice(0, 3).map((issue) => (
            <li key={issue.tag} className="border-t border-[var(--se-line)] pt-4">
              <span className="se-eyebrow !text-se-grey-lavender">{issue.tag}</span>
              <p className="mt-1 text-se-offwhite/90">{issue.line}</p>
            </li>
          ))}
        </ul>

        {result.positive && (
          <p className="mt-6 rounded-lg bg-[color-mix(in_srgb,var(--se-positive)_12%,transparent)] p-4 text-sm text-se-offwhite/90">
            <span className="font-semibold text-se-positive">The good news:</span>{" "}
            {result.positive.line}
          </p>
        )}

        {result.note && (
          <p className="mt-3 text-center text-xs text-se-grey-lavender">{result.note}</p>
        )}
      </div>

      {/* Open loop → unlock */}
      {!unlocked ? (
        <UnlockGate moreCount={result.moreCount} refId={refId} onUnlock={onUnlock} />
      ) : (
        <div className="mt-6 space-y-4">
          {result.issues.length > 3 && (
            <div className="rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-charcoal p-6">
              <span className="se-eyebrow">The rest of what I found</span>
              <ul className="mt-4 space-y-4">
                {result.issues.slice(3).map((issue) => (
                  <li key={issue.tag} className="border-t border-[var(--se-line)] pt-4">
                    <span className="se-eyebrow !text-se-grey-lavender">{issue.tag}</span>
                    <p className="mt-1 text-se-offwhite/90">{issue.line}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-6 text-center">
            <p className="text-se-offwhite">
              That&apos;s your quick read. For the complete Property Growth Snapshot — every issue,
              your revenue leak and a plan for your property — let&apos;s talk.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Button href={ROUTES.audit} variant="primary" size="md">
                Book my free audit
              </Button>
              <Button href={WHATSAPP_URL} external variant="ghost" size="md">
                Continue on WhatsApp
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={onRetry}
          className="cursor-pointer text-sm text-se-grey-lavender underline-offset-4 hover:text-se-offwhite hover:underline"
        >
          Roast a different listing
        </button>
      </div>
    </div>
  );
}

function UnlockGate({
  moreCount,
  refId,
  onUnlock,
}: {
  moreCount: number;
  refId: string;
  onUnlock: () => void;
}) {
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // Stored on-device for now; CRM/delivery wiring is the deferred backend.
        rememberLead({ whatsapp, email, ref: refId });
        track("snapshot_unlocked", { hasEmail: Boolean(email) });
        onUnlock();
      }}
      className="mt-6 rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-3 p-6"
    >
      <p className="text-center text-se-offwhite">
        {moreCount > 0 ? (
          <>
            I found <span className="se-num text-se-lavender">{moreCount} more</span>{" "}
            {moreCount === 1 ? "thing" : "things"} worth fixing. Unlock the rest of your read.
          </>
        ) : (
          <>Want the complete Property Growth Snapshot for your property?</>
        )}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <TextField label="WhatsApp number" value={whatsapp} onChange={setWhatsapp} type="tel" placeholder="+91…" required />
        <TextField label="Email" value={email} onChange={setEmail} type="email" placeholder="you@email.com" />
      </div>
      <Button type="submit" variant="primary" size="lg" className="mt-4 w-full">
        Unlock my Growth Snapshot
      </Button>
      <p className="mt-2 text-center text-xs text-se-grey-lavender">
        No spam. We use WhatsApp to send your snapshot and nothing else without asking.
      </p>
    </form>
  );
}

/* --- small field + display helpers --- */

function ScoreNumber({ value, reduce }: { value: number; reduce: boolean }) {
  const [display, setDisplay] = useState(reduce ? value : 0);
  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 900;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // Failsafe: rAF can stall on throttled/low-power renderers — the final
    // value must land regardless.
    const failsafe = setTimeout(() => setDisplay(value), dur + 300);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(failsafe);
    };
  }, [value, reduce]);
  return (
    <motion.div className="se-num text-[clamp(44px,9vw,72px)] leading-none text-se-lavender">
      {display}
    </motion.div>
  );
}

function ConfidenceBadge({ confidence }: { confidence: RoastResult["confidence"] }) {
  const label = confidence === "high" ? "High confidence" : confidence === "medium" ? "Medium confidence" : "Low confidence";
  return <p className="mt-2 text-xs text-se-grey-lavender">{label}</p>;
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-left">
      <span className="mb-1 block text-sm text-se-grey-lavender">
        {label} {required && <span className="text-se-lavender">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-[var(--se-radius-input)] border border-[var(--se-line)] bg-se-charcoal px-4 py-3 text-se-offwhite placeholder:text-se-grey-lavender/60 focus:border-[var(--se-line-strong)] focus:outline-none"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value?: number;
  onChange: (v: number | undefined) => void;
  placeholder?: string;
}) {
  return (
    <label className="block text-left">
      <span className="mb-1 block text-sm text-se-grey-lavender">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
        placeholder={placeholder}
        className="w-full rounded-[var(--se-radius-input)] border border-[var(--se-line)] bg-se-charcoal px-4 py-3 text-se-offwhite placeholder:text-se-grey-lavender/60 focus:border-[var(--se-line-strong)] focus:outline-none"
      />
    </label>
  );
}
