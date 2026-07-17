import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OSDashboard } from "@/components/os/OSDashboard";

export const metadata: Metadata = {
  title: "StayEdge OS",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Internal CEO dashboard (founder-only). Token-gated: /os?key=<OS_DASHBOARD_KEY>.
 * Wrong or missing key renders 404 so the surface is invisible from outside.
 */
export default async function OSPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;
  const expected = process.env.OS_DASHBOARD_KEY;
  if (!expected || key !== expected) notFound();

  return <OSDashboard dashKey={key!} />;
}
