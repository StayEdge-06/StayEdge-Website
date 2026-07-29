import { Suspense } from "react";
import type { Metadata } from "next";
import { RoastEngine } from "@/components/ai/RoastEngine";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, roastToolSchema } from "@/lib/seo/schema";
import { DEFAULT_OG_IMAGE } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Roast My Listing — Free AI Airbnb Listing Check",
  description:
    "Paste your Airbnb listing and Vira shows you what's quietly costing you bookings — a Roast Score, your top issues and one genuine strength. Free, in seconds.",
  alternates: { canonical: "/roast" },
  openGraph: {
    title: "Roast My Listing — Free AI Airbnb Listing Check · StayEdge",
    description:
      "Paste your Airbnb listing and Vira shows you what's quietly costing you bookings — a Roast Score, your top issues and one genuine strength. Free, in seconds.",
    url: "/roast",
    siteName: "StayEdge",
    locale: "en_IN",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Roast My Listing — Free AI Airbnb Listing Check · StayEdge",
    description:
      "Paste your Airbnb listing and Vira shows you what's quietly costing you bookings — a Roast Score, your top issues and one genuine strength. Free, in seconds.",
    images: [DEFAULT_OG_IMAGE],
  },
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
