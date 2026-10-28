import { cpSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "out");
const destDir = join(root, "..", "caisse-sim");
const pagesRoot = join(root, "..");

mkdirSync(destDir, { recursive: true });

for (const name of readdirSync(destDir)) {
  if (name === ".git" || name === ".nojekyll") continue;
  rmSync(join(destDir, name), { recursive: true, force: true });
}

for (const name of readdirSync(outDir)) {
  cpSync(join(outDir, name), join(destDir, name), { recursive: true });
}

// GitHub Pages (Jekyll) ignores folders starting with "_" such as Next's `_next/`.
writeFileSync(join(pagesRoot, ".nojekyll"), "");
writeFileSync(join(destDir, ".nojekyll"), "");

console.log(`Synced ${outDir} → ${destDir}`);
console.log("Entries:", readdirSync(destDir).join(", "));
