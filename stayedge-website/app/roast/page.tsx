import { Suspense } from "react";
import type { Metadata } from "next";
import { RoastEngine } from "@/components/ai/RoastEngine";

export const metadata: Metadata = {
  title: "Roast My Listing",
  description:
    "Paste your Airbnb listing and Vira shows you what's quietly costing you bookings — free, in seconds.",
};

export default function RoastPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <RoastEngine />
    </Suspense>
  );
}
