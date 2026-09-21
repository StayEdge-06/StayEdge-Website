/**
 * The /os gate as a pure decision — no framework imports, unit tested.
 *
 * WHY THIS EXISTS. The pages already call notFound() / redirect(), but by the
 * time a page body runs Next.js has usually started streaming, so the HTTP
 * status is already committed as 200 and the "not found" arrives as page
 * content. Crawlers, uptime probes and scanners read the status line, not the
 * body: an unconfigured /os answered 200 to all of them. Deciding here, in the
 * proxy that runs before any rendering, lets the answer be a genuine 404 (or a
 * genuine 307). The pages keep their own checks as a second layer.
 */

export type OsGate =
  /** Let the request through to the page. */
  | { action: "next" }
  /** No key configured — /os does not exist on this deployment. */
  | { action: "not_found" }
  | { action: "redirect"; to: "/os" | "/os/login" };

export type OsGateInput = {
  pathname: string;
  /** A strong-enough OS_DASHBOARD_KEY is configured. */
  configured: boolean;
  /** The request carries a valid, unexpired session cookie. */
  hasSession: boolean;
};

export function osGate({ pathname, configured, hasSession }: OsGateInput): OsGate {
  // Trailing slashes are normalised by Next before the proxy runs, but this is
  // a security boundary, so it does not lean on that.
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

  if (path !== "/os" && path !== "/os/login") return { action: "next" };
  if (!configured) return { action: "not_found" };

  if (path === "/os") {
    return hasSession ? { action: "next" } : { action: "redirect", to: "/os/login" };
  }
  return hasSession ? { action: "redirect", to: "/os" } : { action: "next" };
}
