import type { Metadata } from "next";
import { AILabPreview } from "@/components/sections/AILabPreview";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "AI Lab",
  description:
    "Free AI tools for Airbnb hosts — roast your listing, and soon: title rewriter, SEO checker, pricing checker, photo rating and more.",
};

export default function LabPage() {
  return (
    <>
      <AILabPreview />
      <FinalCTA />
    </>
  );
}
