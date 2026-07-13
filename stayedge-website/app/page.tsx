import { Hero } from "@/components/sections/Hero";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Below-the-fold sections (mechanism, before/after, proof, segments, FAQ)
          are built in the Homepage milestone. This anchor keeps the page whole. */}
      <section className="mx-auto max-w-[1100px] px-5 py-24 text-center md:px-8">
        <p className="se-eyebrow mb-4">How StayEdge thinks</p>
        <h2 className="se-title text-[clamp(24px,4vw,40px)] text-se-offwhite">
          We don&apos;t guess. We read your listing the way a guest does — then the way the
          algorithm does.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-se-grey-lavender">
          Listing analysis, competitor intelligence, revenue modelling and guest psychology —
          combined into one Property Growth Snapshot.
        </p>
      </section>
    </>
  );
}
