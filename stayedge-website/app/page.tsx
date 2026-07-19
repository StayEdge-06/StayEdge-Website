import { Hero } from "@/components/sections/Hero";
import { RoastPreview } from "@/components/sections/RoastPreview";
import { MechanismTimeline } from "@/components/sections/MechanismTimeline";
import { Showcase } from "@/components/sections/Showcase";
import { RevenueOpportunity } from "@/components/sections/RevenueOpportunity";
import { WhyStayEdge } from "@/components/sections/WhyStayEdge";
import { HostSegments } from "@/components/sections/HostSegments";
import { SocialProof } from "@/components/sections/SocialProof";
import { Process } from "@/components/sections/Process";
import { AILabPreview } from "@/components/sections/AILabPreview";
import { FAQ, FAQS } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema } from "@/lib/seo/schema";

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
      <Showcase />
      <RevenueOpportunity />
      <WhyStayEdge />
      <HostSegments />
      <SocialProof />
      <Process />
      <AILabPreview />
      <FAQ />
      <FinalCTA />
      {/* FAQPage schema mirrors the real on-page FAQ content (AEO) */}
      <JsonLd schemas={[faqSchema(FAQS)]} />
    </>
  );
}
