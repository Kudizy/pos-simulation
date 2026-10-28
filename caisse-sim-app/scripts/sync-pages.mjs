import { cpSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "out");
const destDir = join(root, "..", "caisse-sim");

mkdirSync(destDir, { recursive: true });

for (const name of readdirSync(destDir)) {
  if (name === ".git") continue;
  rmSync(join(destDir, name), { recursive: true, force: true });
}

for (const name of readdirSync(outDir)) {
  cpSync(join(outDir, name), join(destDir, name), { recursive: true });
}

console.log(`Synced ${outDir} → ${destDir}`);
console.log("Entries:", readdirSync(destDir).join(", "));
