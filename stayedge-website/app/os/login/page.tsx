import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { OSLogin } from "@/components/os/OSLogin";
import { hasOsSession, osConfigured } from "@/lib/server/os/auth";

export const metadata: Metadata = {
  title: "StayEdge OS",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

/**
 * Sign-in for the internal dashboard.
 *
 * When no key is configured the page 404s rather than showing a form that
 * cannot succeed — a deployment without OS_DASHBOARD_KEY simply has no /os.
 */
export default async function OSLoginPage() {
  if (!osConfigured()) notFound();
  if (await hasOsSession()) redirect("/os");
  return <OSLogin />;
}
