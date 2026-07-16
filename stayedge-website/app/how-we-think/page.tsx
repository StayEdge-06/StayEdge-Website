import type { Metadata } from "next";
import { MechanismTimeline } from "@/components/sections/MechanismTimeline";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "How We Think",
  description:
    "The StayEdge analysis pipeline — listing analysis, competitor and revenue intelligence, guest psychology, growth strategy, recommendations.",
};

export default function HowWeThinkPage() {
  return (
    <>
      <MechanismTimeline />
      <FinalCTA />
    </>
  );
}
