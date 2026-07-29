import type { Metadata } from "next";
import { AILabPreview } from "@/components/sections/AILabPreview";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { DEFAULT_OG_IMAGE } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "AI Lab",
  description:
    "Free AI tools for Airbnb hosts — roast your listing, and soon: title rewriter, SEO checker, pricing checker, photo rating and more.",
  alternates: { canonical: "/lab" },
  openGraph: {
    title: "AI Lab — StayEdge",
    description:
      "Free AI tools for Airbnb hosts — roast your listing, and soon: title rewriter, SEO checker, pricing checker, photo rating and more.",
    url: "/lab",
    siteName: "StayEdge",
    locale: "en_IN",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Lab — StayEdge",
    description:
      "Free AI tools for Airbnb hosts — roast your listing, and soon: title rewriter, SEO checker, pricing checker, photo rating and more.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function LabPage() {
  return (
    <>
      <AILabPreview tilt />
      <FinalCTA />
      <JsonLd schemas={[breadcrumbSchema([{ name: "AI Lab", path: "/lab" }])]} />
    </>
  );
}
