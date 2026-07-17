import { jsonLd } from "@/lib/seo/schema";

/** Render schema objects as a single @graph JSON-LD script tag. */
export function JsonLd({ schemas }: { schemas: object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(...schemas) }}
    />
  );
}
