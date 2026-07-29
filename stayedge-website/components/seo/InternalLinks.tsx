import Link from "next/link";
import { Fragment } from "react";

/**
 * Renders a paragraph with inline internal links using [[slug|text]] syntax.
 *
 * Example:
 *   "See our guide on [[airbnb-ranking-factors-hosts-control|ranking factors]] for more."
 *   → "See our guide on <a href='/knowledge/airbnb-ranking-factors-hosts-control'>ranking factors</a> for more."
 *
 * Supports external URLs with [[https://...|text]] syntax for links outside the
 * knowledge base (services, city pages, tools).
 */
export function InternalParagraph({ children, className }: { children: string; className?: string }) {
  const parts = children.split(/(\[\[.+?\]\])/g);

  return (
    <p className={className}>
      {parts.map((part, i) => {
        const match = part.match(/^\[\[(.+?)\|(.+?)\]\]$/);
        if (!match) return <Fragment key={i}>{part}</Fragment>;
        const [, target, text] = match;

        if (target.startsWith("http://") || target.startsWith("https://")) {
          // External URL
          return (
            <Link
              key={i}
              href={target}
              className="text-se-purple underline decoration-se-purple/30 underline-offset-2 transition-colors hover:decoration-se-purple"
            >
              {text}
            </Link>
          );
        }

        if (target.startsWith("/")) {
          // Absolute path — services, city pages, tools
          return (
            <Link
              key={i}
              href={target}
              className="text-se-purple underline decoration-se-purple/30 underline-offset-2 transition-colors hover:decoration-se-purple"
            >
              {text}
            </Link>
          );
        }

        // Internal knowledge base article slug
        return (
          <Link
            key={i}
            href={`/knowledge/${target}`}
            className="text-se-purple underline decoration-se-purple/30 underline-offset-2 transition-colors hover:decoration-se-purple"
          >
            {text}
          </Link>
        );
      })}
    </p>
  );
}
