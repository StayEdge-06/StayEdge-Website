import type { Metadata } from "next";
import { MechanismTimeline } from "@/components/sections/MechanismTimeline";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { DEFAULT_OG_IMAGE } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "How We Think",
  description:
    "The StayEdge analysis pipeline — listing analysis, competitor and revenue intelligence, guest psychology, growth strategy, recommendations.",
  alternates: { canonical: "/how-we-think" },
  openGraph: {
    title: "How We Think — StayEdge",
    description:
      "The StayEdge analysis pipeline — listing analysis, competitor and revenue intelligence, guest psychology, growth strategy, recommendations.",
    url: "/how-we-think",
    siteName: "StayEdge",
    locale: "en_IN",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "How We Think — StayEdge",
    description:
      "The StayEdge analysis pipeline — listing analysis, competitor and revenue intelligence, guest psychology, growth strategy, recommendations.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function HowWeThinkPage() {
  return (
    <>
      <MechanismTimeline />
      <FinalCTA />
      <JsonLd schemas={[breadcrumbSchema([{ name: "How We Think", path: "/how-we-think" }])]} />
    </>
  );
}
