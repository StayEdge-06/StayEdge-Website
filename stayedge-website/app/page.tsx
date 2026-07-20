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
import { EdgeDividerWipe } from "@/components/motion/EdgeDividerWipe";
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
      <EdgeDividerWipe from="base" to="deep" />
      <RoastPreview />
      <MechanismTimeline />
      <EdgeDividerWipe from="base" to="deep" />
      <Showcase />
      <RevenueOpportunity />
      <WhyStayEdge />
      <HostSegments />
      <SocialProof />
      <EdgeDividerWipe from="base" to="deep" />
      <Process />
      <AILabPreview />
      <FAQ />
      <EdgeDividerWipe from="deep" to="base" />
      <FinalCTA />
      {/* FAQPage schema mirrors the real on-page FAQ content (AEO) */}
      <JsonLd schemas={[faqSchema(FAQS)]} />
    </>
  );
}
