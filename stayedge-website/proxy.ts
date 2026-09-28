import { NextResponse, type NextRequest } from "next/server";
import { OS_COOKIE, osConfigured, osSessionValid } from "@/lib/server/os/auth";
import { osGate } from "@/lib/server/os/gate";

/**
 * Runs before rendering, only for /os and /os/login (see `config.matcher`).
 *
 * It exists so the founder dashboard answers with real HTTP statuses: a
 * deployment without OS_DASHBOARD_KEY returns 404, an unauthenticated visit to
 * /os returns 307 → /os/login. The decision itself is in lib/server/os/gate.ts.
 * The pages repeat the same checks, so removing this file degrades the status
 * codes but never exposes the dashboard.
 */
export function proxy(request: NextRequest) {
  const decision = osGate({
    pathname: request.nextUrl.pathname,
    configured: osConfigured(),
    hasSession: osSessionValid(request.cookies.get(OS_COOKIE)?.value),
  });

  if (decision.action === "not_found") {
    // Rewriting to a path that does not exist renders the site's normal
    // not-found page with a genuine 404 status.
    const res = NextResponse.rewrite(new URL("/__os-not-found", request.url), { status: 404 });
    res.headers.set("x-robots-tag", "noindex, nofollow");
    return res;
  }
  if (decision.action === "redirect") {
    return NextResponse.redirect(new URL(decision.to, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/os", "/os/login"],
};
