// sync-brand.mjs — Inherit StayEdge brand assets from the Brand Operating System.
// Per Design System decision D3: the Brand Assets repo is the ONLY source of truth.
// Colours, type, logos are never recreated by hand — they are synced from source.
//
// Source of truth (StayEdge OS repo):
//   01-Business/Brand/StayEdge/tokens/  -> app/brand/
//   01-Business/Brand/StayEdge/logos/   -> public/brand/logos/
//
// Runs on `predev` / `prebuild`. If the source repo is unavailable (e.g. CI or a
// teammate's machine), it logs a warning and keeps the last synced copy — the build
// never fails because of a missing local brand repo (graceful degradation).

import { existsSync, mkdirSync, copyFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

// Allow override via env; default to the known StayEdge OS brand path.
const BRAND_SRC =
  process.env.STAYEDGE_BRAND_DIR ||
  "C:/Users/sanja/.graphify/repos/StayEdge-06/Stayedge-OS/01-Business/Brand/StayEdge";

const tokensSrc = join(BRAND_SRC, "tokens");
const logosSrc = join(BRAND_SRC, "logos");

const tokensDest = join(projectRoot, "app", "brand");
const logosDest = join(projectRoot, "public", "brand", "logos");

function ensureDir(d) {
  if (!existsSync(d)) mkdirSync(d, { recursive: true });
}

function copyInto(srcDir, destDir, filter = () => true) {
  ensureDir(destDir);
  let count = 0;
  for (const name of readdirSync(srcDir)) {
    const s = join(srcDir, name);
    if (!statSync(s).isFile() || !filter(name)) continue;
    copyFileSync(s, join(destDir, name));
    count++;
  }
  return count;
}

function main() {
  if (!existsSync(BRAND_SRC)) {
    console.warn(
      `\n[brand-sync] Source of truth not found at:\n  ${BRAND_SRC}\n` +
        `[brand-sync] Keeping the last synced brand assets. ` +
        `Set STAYEDGE_BRAND_DIR to re-sync.\n`,
    );
    return;
  }

  const tokenFiles = copyInto(tokensSrc, tokensDest, (n) =>
    /brand-tokens\.(css|json)$/.test(n),
  );
  const logoFiles = copyInto(
    logosSrc,
    logosDest,
    (n) => /\.(svg|png)$/.test(n),
  );

  console.log(
    `[brand-sync] Synced ${tokenFiles} token file(s) -> app/brand/, ` +
      `${logoFiles} logo file(s) -> public/brand/logos/`,
  );
}

main();
