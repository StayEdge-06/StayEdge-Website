import { Hero } from "@/components/sections/Hero";
import { RoastPreview } from "@/components/sections/RoastPreview";
import { MechanismTimeline } from "@/components/sections/MechanismTimeline";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { RevenueOpportunity } from "@/components/sections/RevenueOpportunity";
import { WhyStayEdge } from "@/components/sections/WhyStayEdge";
import { HostSegments } from "@/components/sections/HostSegments";
import { SocialProof } from "@/components/sections/SocialProof";
import { Process } from "@/components/sections/Process";
import { AILabPreview } from "@/components/sections/AILabPreview";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";

/**
 * Homepage — the product experience, ordered as an emotional journey:
 * curiosity → excitement → humour → recognition → trust → hope → action.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <RoastPreview />
      <MechanismTimeline />
      <BeforeAfter />
      <RevenueOpportunity />
      <WhyStayEdge />
      <HostSegments />
      <SocialProof />
      <Process />
      <AILabPreview />
      <FAQ />
      <FinalCTA />
    </>
  );
}
