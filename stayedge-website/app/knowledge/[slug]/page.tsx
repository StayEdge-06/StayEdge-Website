import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/sections/Section";
import { Button } from "@/components/ui/Button";
import { ROUTES, CONTACT } from "@/lib/config/site";
import { PERSONA } from "@/lib/config/persona";
import { ARTICLES, getArticle } from "@/lib/content/articles";
import { CLUSTERS } from "@/lib/content/clusters";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/seo/schema";

/**
 * Article template (Authority Engine): answer-first lede, structured sections,
 * checklists, FAQ, related reading — with Article + FAQPage + Breadcrumb schema
 * and the founder as author entity.
 */
export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.description,
    alternates: { canonical: `/knowledge/${a.slug}` },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();

  const cluster = CLUSTERS.find((c) => c.id === a.cluster)!;
  const related = a.related.map(getArticle).filter(Boolean);

  return (
    <>
      <Section>
        <article className="mx-auto max-w-3xl">
          <p className="se-eyebrow mb-4">
            <Link href={ROUTES.knowledge} className="hover:text-se-offwhite">
              Knowledge
            </Link>{" "}
            · {cluster.title}
          </p>
          <h1 className="se-title text-[clamp(26px,4.5vw,44px)] text-se-offwhite">{a.title}</h1>

          {/* Visible byline/date — on-page trust signal to match the
              author/dateModified already in Article schema (E-E-A-T). */}
          <p className="mt-3 text-sm text-se-grey-lavender">
            By {CONTACT.founder} · Published{" "}
            <time dateTime={a.publishedAt}>
              {new Date(a.publishedAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            {a.updatedAt && a.updatedAt !== a.publishedAt && (
              <>
                {" "}
                · Updated{" "}
                <time dateTime={a.updatedAt}>
                  {new Date(a.updatedAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </>
            )}
          </p>

          {/* Answer-first lede (AEO) */}
          <p className="mt-6 rounded-[var(--se-radius-lg)] border-l-2 border-se-purple bg-se-ground-2 p-5 text-lg text-se-offwhite/90">
            {a.answer}
          </p>

          {a.sections.map((s) => (
            <section key={s.h2} className="mt-10">
              <h2 className="font-body text-xl font-bold text-se-offwhite">{s.h2}</h2>
              {s.paras.map((p) => (
                <p key={p.slice(0, 32)} className="mt-3 text-se-grey-lavender">
                  {p}
                </p>
              ))}
              {s.checklist && (
                <ul className="mt-4 space-y-2">
                  {s.checklist.map((item) => (
                    <li key={item} className="flex gap-3 text-se-offwhite/85">
                      <span aria-hidden className="text-se-positive">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {/* FAQ */}
          <section className="mt-12 border-t border-[var(--se-line)] pt-8">
            <h2 className="se-eyebrow">Common questions</h2>
            {a.faqs.map((f) => (
              <details key={f.q} className="group border-b border-[var(--se-line)] py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-body font-semibold text-se-offwhite">
                  {f.q}
                  <span className="shrink-0 text-se-lavender transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-se-grey-lavender">{f.a}</p>
              </details>
            ))}
          </section>

          {/* Apply-it CTA */}
          <div className="mt-10 rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-6 text-center">
            <p className="text-se-offwhite">
              Want to know which of this applies to <em>your</em> listing?
            </p>
            <div className="mt-4">
              <Button href={ROUTES.roast} variant="primary" size="md" haptic>
                Let {PERSONA.name} read it — free
              </Button>
            </div>
          </div>

          {/* Related reading */}
          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="se-eyebrow mb-4">Related reading</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {related.map((r) => (
                  <Link
                    key={r!.slug}
                    href={`/knowledge/${r!.slug}`}
                    className="rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-4 transition-colors hover:border-[var(--se-line-strong)]"
                  >
                    <p className="font-body font-semibold text-se-offwhite">{r!.title}</p>
                    <p className="mt-1 text-sm text-se-grey-lavender">{r!.description}</p>
                  </Link>
                ))}
                <Link
                  href="/knowledge/glossary"
                  className="rounded-[var(--se-radius-lg)] border border-[var(--se-line)] bg-se-ground-2 p-4 transition-colors hover:border-[var(--se-line-strong)]"
                >
                  <p className="font-body font-semibold text-se-offwhite">Airbnb Host Glossary</p>
                  <p className="mt-1 text-sm text-se-grey-lavender">
                    ADR, RevPAR, gap nights and the rest — in plain language.
                  </p>
                </Link>
              </div>
            </section>
          )}
        </article>
      </Section>

      <JsonLd
        schemas={[
          articleSchema({ ...a, clusterTitle: cluster.title }),
          faqSchema(a.faqs),
          breadcrumbSchema([
            { name: "Knowledge", path: "/knowledge" },
            { name: a.title, path: `/knowledge/${a.slug}` },
          ]),
        ]}
      />
    </>
  );
}
