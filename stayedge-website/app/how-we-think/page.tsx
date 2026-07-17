import type { Metadata } from "next";
import { MechanismTimeline } from "@/components/sections/MechanismTimeline";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "How We Think",
  description:
    "The StayEdge analysis pipeline — listing analysis, competitor and revenue intelligence, guest psychology, growth strategy, recommendations.",
  alternates: { canonical: "/how-we-think" },
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
