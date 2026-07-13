import type { Metadata } from "next";

export const metadata: Metadata = { title: "Roast My Listing" };

/** Placeholder — the full Roast Engine is built in milestone 3. */
export default function RoastPage() {
  return (
    <section className="mx-auto max-w-[900px] px-5 py-28 text-center md:px-8">
      <p className="se-eyebrow mb-4">The Roast Engine</p>
      <h1 className="se-display text-[clamp(32px,6vw,64px)] text-se-offwhite">
        Coming to life <span className="text-se-lavender">next.</span>
      </h1>
      <p className="mx-auto mt-6 max-w-lg text-se-grey-lavender">
        Paste a listing on the homepage and it will land here — thinking theater, your
        Roast Score, three issues and your Property Growth Snapshot. Under construction.
      </p>
    </section>
  );
}
