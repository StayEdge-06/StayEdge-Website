import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { OSDashboard } from "@/components/os/OSDashboard";
import { hasOsSession, osConfigured } from "@/lib/server/os/auth";

export const metadata: Metadata = {
  title: "StayEdge OS",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

/**
 * Internal operations dashboard (founder-only).
 *
 * Gate order matters: an unconfigured deployment 404s, so /os does not exist at
 * all; a configured one without a session redirects to the sign-in page. The
 * Phase 1 `?key=` scheme is gone — see lib/server/os/auth.ts for why.
 */
export default async function OSPage() {
  if (!osConfigured()) notFound();
  if (!(await hasOsSession())) redirect("/os/login");
  return <OSDashboard />;
}
