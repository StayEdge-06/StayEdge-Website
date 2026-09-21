"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/motion/Magnetic";
import { EASE_EDGE, EASE_SETTLE } from "@/lib/motion/ease";
import { track } from "@/lib/analytics";
import { rememberLead } from "@/lib/ai/memory";
import { CONTACT, WHATSAPP_URL } from "@/lib/config/site";
import { cn } from "@/lib/utils";
import { PROPERTY_TYPES, leadInputSchema, type LeadInput } from "@/lib/leads/schema";
import { currentAttribution } from "@/lib/leads/attribution-client";

/**
 * The site's only lead form. Two variants share one component so the CRM
 * schema, the spam controls and the success/error states can never drift
 * between the audit funnel and the video funnel.
 *
 * Progressive by design: name + phone are the only required fields, because
 * every extra required field on an Indian mobile form costs completions. The
 * rest is optional context that makes the first reply better.
 *
 * VALIDATION IS THE SAME CODE ON BOTH SIDES. The form parses the submission
 * with `leadInputSchema` — the exact schema the API route enforces — before it
 * sends anything. That is what makes the client checks safe to trust as UX and
 * impossible to trust as security: a visitor gets an instant, specific error
 * with no round trip, and the server re-runs the identical parse on input it
 * never assumes came from this form. The two can't drift, because there is only
 * one schema.
 */
type Variant = "audit" | "video";

type State = "idle" | "sending" | "done" | "error";

const COPY: Record<Variant, { service: string; submit: string; done: string; note: string }> = {
  audit: {
    service: "Free Property Growth Audit",
    submit: "Get my free audit",
    done: "Your audit is booked.",
    note: "We'll read your listing and reply on WhatsApp, usually the same day.",
  },
  video: {
    service: "AI Property Video",
    submit: "Request my video",
    done: "Request received.",
    note: "We'll come back with formats, timelines and pricing for your property.",
  },
};

export function LeadForm({
  variant,
  className,
  prefillFromQuery = false,
}: {
  variant: Variant;
  className?: string;
  /**
   * Read the homepage hero's `?url=` listing-link handoff on the client. Doing
   * it here rather than through the page's `searchParams` keeps the host page
   * statically rendered.
   */
  prefillFromQuery?: boolean;
}) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const copy = COPY[variant];
  const [state, setState] = useState<State>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [leadId, setLeadId] = useState("");
  const startedRef = useRef(false);
  const renderedAtRef = useRef(0);
  const listingRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  /**
   * Hard guard against a second submission of the same lead.
   *
   * The disabled button and the `state === "sending"` check both depend on a
   * React render having happened. A double-tap on a slow phone, or Enter held
   * down in the last field, can fire two submit events inside one frame — this
   * ref is set synchronously in the handler, so the second one never reaches
   * the network. It is cleared only on a failure the visitor can retry.
   */
  const inFlightRef = useRef(false);

  // Both are client-only on purpose. A server-rendered timestamp would be the
  // build time on a static page, which would fail the time-to-fill check for
  // every visitor; and the prefill is written into the uncontrolled input so
  // nothing about it can differ between server and client markup.
  useEffect(() => {
    renderedAtRef.current = Date.now();
    if (!prefillFromQuery) return;
    const handed = new URLSearchParams(window.location.search).get("url");
    if (handed && /^https?:\/\//i.test(handed) && listingRef.current) {
      listingRef.current.value = handed.slice(0, 500);
    }
  }, [prefillFromQuery]);

  /**
   * One start event per visit, on the first real keystroke. Only the audit
   * funnel has a `*_form_start` in the V2 taxonomy — firing the video funnel's
   * submit event here would double-count it against the real submit.
   */
  function handleFirstInput() {
    if (startedRef.current) return;
    startedRef.current = true;
    if (variant === "audit") track("audit_form_start", { service: copy.service });
  }

  /** Put the caret on the first thing the visitor has to fix. */
  function focusFirstError(errors: Record<string, string>) {
    const first = Object.keys(errors)[0];
    if (!first) return;
    const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
    el?.focus();
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  function fail(reason: string, text: string, errors: Record<string, string> = {}) {
    inFlightRef.current = false;
    setFieldErrors(errors);
    setMessage(text);
    setState("error");
    track("form_error", { service: copy.service, reason });
    if (Object.keys(errors).length) focusFirstError(errors);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    setFieldErrors({});
    setMessage("");

    const fd = new FormData(e.currentTarget);
    const raw = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      whatsapp: String(fd.get("whatsapp") ?? ""),
      city: String(fd.get("city") ?? ""),
      propertyType: String(fd.get("propertyType") ?? "") || undefined,
      listingUrl: String(fd.get("listingUrl") ?? ""),
      message: String(fd.get("message") ?? ""),
      service: copy.service,
      attribution: currentAttribution(pathname ?? "/"),
      hp: String(fd.get("company") ?? ""),
      renderedAt: renderedAtRef.current,
    };

    // Client-side pass with the server's own schema: instant, specific errors
    // and one less pointless round trip. The server re-validates regardless.
    const parsed = leadInputSchema.safeParse(raw);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !errors[key]) errors[key] = issue.message;
      }
      fail("client_validation", "Please check the highlighted fields.", errors);
      return;
    }
    const payload: LeadInput = parsed.data;

    setState("sending");
    track(variant === "audit" ? "audit_form_submit" : "video_form_submit", {
      service: copy.service,
    });

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
        // A request that never comes back leaves the visitor staring at
        // "Sending…" forever; 20s is past any realistic cold start.
        signal: AbortSignal.timeout(20_000),
      });

      // A non-JSON body means something upstream answered instead of the route
      // (a proxy error page, an outage splash). Treated as a server failure
      // rather than crashing on the parse.
      let json: {
        ok?: boolean;
        id?: string | null;
        error?: string;
        fields?: Record<string, string>;
      };
      try {
        json = await res.json();
      } catch {
        fail("bad_response", "Something went wrong on our side. WhatsApp us and we'll pick it up there.");
        return;
      }

      if (!res.ok || !json.ok) {
        if (json.error === "rate_limited") {
          const wait = Number(res.headers.get("retry-after"));
          const mins = Number.isFinite(wait) && wait > 0 ? Math.ceil(wait / 60) : 10;
          fail(
            "rate_limited",
            `That's a few requests in a short time. Try again in about ${mins} minute${mins === 1 ? "" : "s"}, or just WhatsApp us.`,
          );
          return;
        }
        fail(
          json.error ?? "server",
          json.fields
            ? "Please check the highlighted fields and try again."
            : "We couldn't record that just now. WhatsApp us and we'll pick it up there.",
          json.fields ?? {},
        );
        return;
      }

      // Kept on-device too, so a delivery outage never loses the visitor's
      // context if they come back.
      rememberLead({ service: copy.service, name: payload.name, phone: payload.phone });
      track(variant === "audit" ? "audit_lead_captured" : "video_lead_captured", {
        service: copy.service,
      });
      setLeadId(json.id ?? "");
      // inFlightRef stays true: this form is finished and unmounts next render.
      setState("done");
    } catch (err) {
      fail(
        err instanceof Error && err.name === "TimeoutError" ? "timeout" : "network",
        "That didn't get through — check your connection, or WhatsApp us and we'll pick it up there.",
      );
    }
  }

  if (state === "done") {
    return <LeadFormSuccess copy={copy} leadId={leadId} className={className} />;
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onInput={handleFirstInput}
      noValidate
      className={cn(
        "rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-6 md:p-8",
        className,
      )}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" required error={fieldErrors.name} autoComplete="name" />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          required
          error={fieldErrors.phone}
          autoComplete="tel"
          placeholder="+91 …"
        />
        <Field
          label="WhatsApp (if different)"
          name="whatsapp"
          type="tel"
          error={fieldErrors.whatsapp}
        />
        <Field label="Email" name="email" type="email" error={fieldErrors.email} autoComplete="email" />
        <Field label="City" name="city" error={fieldErrors.city} placeholder="Tirupati" />
        <label className="block">
          <span className="mb-2 block text-sm text-se-ink-muted">Property type</span>
          <select
            name="propertyType"
            defaultValue=""
            className="w-full rounded-[var(--se-radius-md)] border border-[var(--se-line)] bg-se-surface px-4 py-3 text-se-ink focus:border-[var(--se-line-strong)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--se-focus)]"
          >
            <option value="">Select…</option>
            {PROPERTY_TYPES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5">
        <Field
          label={variant === "audit" ? "Your Airbnb listing link" : "Your listing or website link"}
          name="listingUrl"
          type="url"
          ref={listingRef}
          error={fieldErrors.listingUrl}
          placeholder="https://www.airbnb.co.in/rooms/…"
        />
      </div>

      <label className="mt-5 block">
        <span className="mb-2 block text-sm text-se-ink-muted">
          {variant === "audit"
            ? "Anything you already suspect is wrong? (optional)"
            : "What do you want the video to do? (optional)"}
        </span>
        <textarea
          name="message"
          rows={3}
          className="w-full rounded-[var(--se-radius-md)] border border-[var(--se-line)] bg-se-surface px-4 py-3 text-se-ink placeholder:text-se-ink-muted/60 focus:border-[var(--se-line-strong)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--se-focus)]"
        />
      </label>

      {/* Honeypot — visually and programmatically hidden from real users. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <AnimatePresence initial={false}>
        {state === "error" && message && (
          <motion.p
            role="alert"
            key="lead-error"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: EASE_EDGE }}
            className="mt-5 flex items-start gap-2 rounded-[var(--se-radius-md)] border border-se-negative/40 bg-[color-mix(in_srgb,var(--se-negative-ink)_10%,transparent)] px-4 py-3 text-sm text-se-negative"
          >
            <span aria-hidden className="mt-[2px] leading-none">
              !
            </span>
            <span>{message}</span>
          </motion.p>
        )}
      </AnimatePresence>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <Magnetic strength={0.3}>
          <Button type="submit" variant="primary" size="lg" haptic disabled={state === "sending"}>
            {state === "sending" ? "Sending…" : copy.submit}
          </Button>
        </Magnetic>
        <p className="text-xs text-se-ink-muted">
          No spam, no calls you didn&apos;t ask for. We reply on WhatsApp.
        </p>
      </div>
    </form>
  );
}

/**
 * The success state. This is the single most important frame in the funnel —
 * it is the moment a visitor becomes a lead — so it gets a real, choreographed
 * beat rather than a swapped paragraph: the panel settles in, the tick draws
 * itself, then the copy and the WhatsApp fallback arrive behind it.
 *
 * The `role="status"` + `aria-live="polite"` wrapper is what actually announces
 * the outcome; the animation is decoration on top of an announcement that works
 * with motion switched off entirely.
 */
function LeadFormSuccess({
  copy,
  leadId,
  className,
}: {
  copy: (typeof COPY)[Variant];
  /** Shown so the visitor has something concrete to quote back to us. */
  leadId?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const step = (delay: number) =>
    reduce
      ? { initial: { opacity: 1 }, animate: { opacity: 1 }, transition: { duration: 0 } }
      : {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4, delay, ease: EASE_SETTLE },
        };

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={reduce ? false : { opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: EASE_SETTLE }}
      className={cn(
        "rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-8 text-center",
        className,
      )}
    >
      <motion.svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        aria-hidden
        className="mx-auto mb-5"
        {...step(0.05)}
      >
        <circle
          cx="24"
          cy="24"
          r="21"
          fill="none"
          stroke="var(--se-positive-ink)"
          strokeWidth="1.5"
          opacity="0.4"
        />
        <motion.path
          d="M15 24.5 L21.5 31 L33 19"
          fill="none"
          stroke="var(--se-positive-ink)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, delay: 0.18, ease: EASE_EDGE }}
        />
      </motion.svg>

      <motion.p className="se-eyebrow mb-3 !text-se-positive" {...step(0.12)}>
        Received
      </motion.p>
      <motion.h3 className="se-title text-2xl text-se-ink" {...step(0.18)}>
        {copy.done}
      </motion.h3>
      <motion.p className="mx-auto mt-3 max-w-md text-se-ink-muted" {...step(0.24)}>
        {copy.note}
      </motion.p>
      <motion.div className="mt-7" {...step(0.3)}>
        <Button href={WHATSAPP_URL} external variant="whatsapp" size="md">
          Message us now instead
        </Button>
      </motion.div>
      <motion.p className="mt-4 text-xs text-se-ink-muted" {...step(0.34)}>
        Prefer email? {CONTACT.email}
      </motion.p>
      {leadId && (
        <motion.p className="mt-2 text-xs text-se-ink-muted/70" {...step(0.38)}>
          Reference <span className="font-mono">{leadId}</span>
        </motion.p>
      )}
    </motion.div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  error,
  ...rest
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  /** React 19 passes `ref` as an ordinary prop — no forwardRef needed. */
  ref?: React.Ref<HTMLInputElement>;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "type" | "required">) {
  const id = `lead-${name}`;
  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-sm text-se-ink-muted">
        {label}
        {required && <span className="text-se-accent"> *</span>}
      </span>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "w-full rounded-[var(--se-radius-md)] border bg-se-surface px-4 py-3 text-se-ink placeholder:text-se-ink-muted/60 focus:outline-2 focus:outline-offset-2 focus:outline-[var(--se-focus)]",
          error ? "border-se-negative" : "border-[var(--se-line)] focus:border-[var(--se-line-strong)]",
        )}
        {...rest}
      />
      {error && (
        <span id={`${id}-error`} className="mt-1 block text-xs text-se-negative">
          {error}
        </span>
      )}
    </label>
  );
}
