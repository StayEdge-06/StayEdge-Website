import { Hero } from "@/components/sections/Hero";
import { IllustrativeExamples } from "@/components/sections/IllustrativeExamples";
import { MechanismTimeline } from "@/components/sections/MechanismTimeline";
import { Showcase } from "@/components/sections/Showcase";
import { RevenueOpportunity } from "@/components/sections/RevenueOpportunity";
import { WhyStayEdge } from "@/components/sections/WhyStayEdge";
import { HostSegments } from "@/components/sections/HostSegments";
import { SocialProof } from "@/components/sections/SocialProof";
import { Process } from "@/components/sections/Process";
import { VideoService } from "@/components/sections/VideoService";
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
      {/* The case-studies slot sits directly under the Hero (V2 brief). With no
          client-approved case studies yet, it runs as labelled illustrations. */}
      <IllustrativeExamples />
      <EdgeDividerWipe from="deep" to="base" />
      <MechanismTimeline />
      <EdgeDividerWipe from="base" to="deep" />
      <Showcase />
      <RevenueOpportunity />
      <WhyStayEdge />
      <HostSegments />
      <SocialProof />
      <EdgeDividerWipe from="base" to="deep" />
      <Process />
      <VideoService />
      <AILabPreview />
      <FAQ />
      <EdgeDividerWipe from="deep" to="base" />
      <FinalCTA />
      {/* FAQPage schema mirrors the real on-page FAQ content (AEO) */}
      <JsonLd schemas={[faqSchema(FAQS)]} />
    </>
  );
}
