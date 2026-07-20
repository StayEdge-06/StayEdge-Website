#!/usr/bin/env node
/**
 * Pings the IndexNow API (Bing, Yandex, Naver, Seznam) with every URL in the
 * live sitemap, so new/updated content is picked up faster than waiting for
 * organic re-crawl (SEO audit, 2026-07-20).
 *
 * Run manually after a deploy that changes content:
 *   node scripts/indexnow-ping.mjs
 * Or wire into a post-deploy step (Vercel deploy hook / GitHub Action).
 *
 * Google does not participate in IndexNow — this doesn't affect Google
 * indexing speed, only Bing/Yandex/Naver/Seznam.
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.stayedge.co.in";
const HOST = new URL(SITE_URL).host;
const KEY = "30f9b467e06565a4e1fc15f4c39145c1"; // matches public/<key>.txt
const KEY_LOCATION = `${SITE_URL}/${KEY}.txt`;

async function main() {
  const sitemapRes = await fetch(`${SITE_URL}/sitemap.xml`);
  if (!sitemapRes.ok) {
    console.error(`Failed to fetch sitemap: ${sitemapRes.status}`);
    process.exit(1);
  }
  const xml = await sitemapRes.text();
  const urlList = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

  if (urlList.length === 0) {
    console.error("No URLs found in sitemap — aborting.");
    process.exit(1);
  }

  console.log(`Pinging IndexNow with ${urlList.length} URLs for ${HOST}...`);

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
  });

  if (res.ok) {
    console.log(`IndexNow accepted the submission (${res.status}).`);
  } else {
    console.error(`IndexNow rejected the submission: ${res.status} ${await res.text()}`);
    process.exit(1);
  }
}

main();
