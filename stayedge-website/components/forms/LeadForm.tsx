"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/motion/Magnetic";
import { track } from "@/lib/analytics";
import { rememberLead } from "@/lib/ai/memory";
import { CONTACT, WHATSAPP_URL } from "@/lib/config/site";
import { cn } from "@/lib/utils";

/**
 * The site's only lead form. Two variants share one component so the CRM
 * schema, the spam controls and the success/error states can never drift
 * between the audit funnel and the video funnel.
 *
 * Progressive by design: name + phone are the only required fields, because
 * every extra required field on an Indian mobile form costs completions. The
 * rest is optional context that makes the first reply better.
 */
export const PROPERTY_TYPES = [
  "Apartment",
  "Villa",
  "Homestay",
  "Boutique hotel",
  "Serviced apartment",
  "Other",
] as const;

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
  const copy = COPY[variant];
  const [state, setState] = useState<State>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const startedRef = useRef(false);
  const renderedAtRef = useRef(0);
  const listingRef = useRef<HTMLInputElement>(null);

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    setFieldErrors({});
    setMessage("");

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      whatsapp: String(fd.get("whatsapp") ?? ""),
      city: String(fd.get("city") ?? ""),
      propertyType: (String(fd.get("propertyType") ?? "") || undefined) as
        | (typeof PROPERTY_TYPES)[number]
        | undefined,
      listingUrl: String(fd.get("listingUrl") ?? ""),
      message: String(fd.get("message") ?? ""),
      service: copy.service,
      source: pathname ?? "/",
      hp: String(fd.get("company") ?? ""),
      renderedAt: renderedAtRef.current,
    };

    track(variant === "audit" ? "audit_form_submit" : "video_form_submit", {
      service: copy.service,
    });

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as {
        ok: boolean;
        error?: string;
        fields?: Record<string, string>;
      };

      if (!json.ok) {
        if (json.fields) setFieldErrors(json.fields);
        setMessage(
          json.error === "rate_limited"
            ? "That's a few requests in a short time. Give it ten minutes, or just WhatsApp us."
            : "Please check the highlighted fields and try again.",
        );
        setState("error");
        track("form_error", { service: copy.service, reason: json.error ?? "invalid" });
        return;
      }

      // Kept on-device too, so a delivery outage never loses the visitor's
      // context if they come back.
      rememberLead({ service: copy.service, name: payload.name, phone: payload.phone });
      track(variant === "audit" ? "audit_lead_captured" : "video_lead_captured", {
        service: copy.service,
      });
      setState("done");
    } catch {
      setMessage("Something went wrong on our side. WhatsApp us and we'll pick it up there.");
      setState("error");
      track("form_error", { service: copy.service, reason: "network" });
    }
  }

  if (state === "done") {
    return (
      <div
        className={cn(
          "rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-8 text-center",
          className,
        )}
        role="status"
        aria-live="polite"
      >
        <p className="se-eyebrow mb-3 !text-se-positive">Received</p>
        <h3 className="se-title text-2xl text-se-offwhite">{copy.done}</h3>
        <p className="mx-auto mt-3 max-w-md text-se-grey-lavender">{copy.note}</p>
        <div className="mt-7">
          <Button href={WHATSAPP_URL} external variant="whatsapp" size="md">
            Message us now instead
          </Button>
        </div>
        <p className="mt-4 text-xs text-se-grey-lavender">
          Prefer email? {CONTACT.email}
        </p>
      </div>
    );
  }

  return (
    <form
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
          <span className="mb-2 block text-sm text-se-grey-lavender">Property type</span>
          <select
            name="propertyType"
            defaultValue=""
            className="w-full rounded-[var(--se-radius-md)] border border-[var(--se-line)] bg-se-charcoal px-4 py-3 text-se-offwhite focus:border-[var(--se-line-strong)] focus:outline-2 focus:outline-offset-2 focus:outline-se-lavender"
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
        <span className="mb-2 block text-sm text-se-grey-lavender">
          {variant === "audit"
            ? "Anything you already suspect is wrong? (optional)"
            : "What do you want the video to do? (optional)"}
        </span>
        <textarea
          name="message"
          rows={3}
          className="w-full rounded-[var(--se-radius-md)] border border-[var(--se-line)] bg-se-charcoal px-4 py-3 text-se-offwhite placeholder:text-se-grey-lavender/60 focus:border-[var(--se-line-strong)] focus:outline-2 focus:outline-offset-2 focus:outline-se-lavender"
        />
      </label>

      {/* Honeypot — visually and programmatically hidden from real users. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state === "error" && message && (
        <p role="alert" className="mt-5 text-sm text-se-negative">
          {message}
        </p>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <Magnetic strength={0.3}>
          <Button type="submit" variant="primary" size="lg" haptic disabled={state === "sending"}>
            {state === "sending" ? "Sending…" : copy.submit}
          </Button>
        </Magnetic>
        <p className="text-xs text-se-grey-lavender">
          No spam, no calls you didn&apos;t ask for. We reply on WhatsApp.
        </p>
      </div>
    </form>
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
      <span className="mb-2 block text-sm text-se-grey-lavender">
        {label}
        {required && <span className="text-se-lavender"> *</span>}
      </span>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "w-full rounded-[var(--se-radius-md)] border bg-se-charcoal px-4 py-3 text-se-offwhite placeholder:text-se-grey-lavender/60 focus:outline-2 focus:outline-offset-2 focus:outline-se-lavender",
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
