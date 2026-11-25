import { ImageResponse } from "next/og";

/**
 * Branded 1200×630 social card — the image link previews and AI answer cards
 * show when a StayEdge URL is shared. Replaces the bare logo PNG (1650×660,
 * the wrong aspect ratio for every platform) that every page used before.
 *
 *   /og                 → default card (brand line)
 *   /og?title=Some+Page → card with that page's title
 *
 * Pages get the right URL from ogImage(title) in lib/config/site.ts.
 * Pure shapes and text — no font or image fetches — so it can't fail on a
 * network hiccup, and the CDN caches each title for a year.
 */

const PURPLE = "#6F2DBD";
const LAVENDER = "#A663CC";
const INK = "#171123";
const PAPER = "#FBFBFB";
const MUTED = "#9B94AE";

export function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("title") ?? "";
  const title = raw.trim().slice(0, 110);
  const headline = title || "Your Airbnb should be fully booked.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: `linear-gradient(135deg, ${INK} 0%, ${INK} 55%, #2A1748 100%)`,
          color: PAPER,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 34,
              height: 34,
              background: PURPLE,
              borderRadius: 6,
              transform: "rotate(45deg)",
              display: "flex",
            }}
          />
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: 6 }}>STAYEDGE</div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: headline.length > 60 ? 58 : 70,
            fontWeight: 800,
            lineHeight: 1.08,
            maxWidth: 1020,
          }}
        >
          {headline}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 26, color: LAVENDER, fontWeight: 700 }}>
              Airbnb growth consultancy · India
            </div>
            <div style={{ fontSize: 22, color: MUTED }}>
              Listing optimization · Pricing · Airbnb SEO · Tirupati, Andhra Pradesh
            </div>
          </div>
          <div style={{ fontSize: 24, color: MUTED }}>stayedge.co.in</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
    },
  );
}
