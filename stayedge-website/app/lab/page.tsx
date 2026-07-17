import type { Metadata } from "next";
import { AILabPreview } from "@/components/sections/AILabPreview";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "AI Lab",
  description:
    "Free AI tools for Airbnb hosts — roast your listing, and soon: title rewriter, SEO checker, pricing checker, photo rating and more.",
  alternates: { canonical: "/lab" },
};

export default function LabPage() {
  return (
    <>
      <AILabPreview />
      <FinalCTA />
      <JsonLd schemas={[breadcrumbSchema([{ name: "AI Lab", path: "/lab" }])]} />
    </>
  );
}
