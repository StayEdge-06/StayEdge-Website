"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

/**
 * /os sign-in. One field, because there is one operator.
 *
 * The key is sent in a POST body and exchanged for an httpOnly cookie — it is
 * never placed in the URL, never written to localStorage, and never held in
 * component state after the request resolves.
 */
export function OSLogin() {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "error" | "throttled">("idle");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (state === "sending" || !key) return;
    setState("sending");
    try {
      const res = await fetch("/api/os/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ key }),
        signal: AbortSignal.timeout(15_000),
      });
      if (res.ok) {
        setKey("");
        // refresh() re-runs the server component, which now sees the cookie.
        router.replace("/os");
        router.refresh();
        return;
      }
      setState(res.status === 429 ? "throttled" : "error");
    } catch {
      setState("error");
    }
  }

  const message =
    state === "throttled"
      ? "Too many attempts. Try again in 15 minutes."
      : state === "error"
        ? "That key was not accepted."
        : "";

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5">
      <p className="se-eyebrow mb-2">StayEdge OS</p>
      <h1 className="se-title text-[clamp(22px,4vw,30px)] text-se-ink">Internal access</h1>

      <form onSubmit={onSubmit} className="mt-6" noValidate>
        <label htmlFor="os-key" className="block text-sm font-bold text-se-ink">
          Dashboard key
        </label>
        <input
          id="os-key"
          name="os-key"
          type="password"
          autoComplete="current-password"
          value={key}
          onChange={(e) => {
            setKey(e.target.value);
            if (state === "error") setState("idle");
          }}
          aria-invalid={state === "error" || state === "throttled"}
          aria-describedby={message ? "os-key-error" : undefined}
          className="mt-2 w-full rounded-[var(--se-radius-md)] border border-[var(--se-line-strong)] bg-se-ground-2 px-4 py-3 text-se-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--se-focus)]"
        />

        {/* role="alert" so a screen reader announces the failure without the
            founder having to hunt for it. */}
        {message && (
          <p id="os-key-error" role="alert" className="mt-2 text-sm text-[var(--se-negative)]">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={state === "sending" || !key}
          className="mt-5 w-full cursor-pointer rounded-[var(--se-radius-pill)] bg-se-purple px-5 py-3 font-bold text-se-on-accent transition-shadow hover:shadow-[0_10px_30px_-12px_var(--se-glow)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--se-focus)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {state === "sending" ? "Checking…" : "Open dashboard"}
        </button>
      </form>

      <p className="mt-6 text-xs text-se-ink-muted">
        Sessions last 12 hours. This page is not indexed and is not linked from the site.
      </p>
    </div>
  );
}
