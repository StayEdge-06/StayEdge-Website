import { Suspense } from "react";
import type { Metadata } from "next";
import { RoastEngine } from "@/components/ai/RoastEngine";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, roastToolSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Roast My Listing — Free AI Airbnb Listing Check",
  description:
    "Paste your Airbnb listing and Vira shows you what's quietly costing you bookings — a Roast Score, your top issues and one genuine strength. Free, in seconds.",
  alternates: { canonical: "/roast" },
};

export default function RoastPage() {
  return (
    <>
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <RoastEngine />
      </Suspense>
      <JsonLd
        schemas={[roastToolSchema(), breadcrumbSchema([{ name: "Roast My Listing", path: "/roast" }])]}
      />
    </>
  );
}
