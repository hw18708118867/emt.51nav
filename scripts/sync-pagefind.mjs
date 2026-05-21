import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const source = resolve(root, "out", "pagefind");
const destinationRoot = resolve(root, "public");
const destination = resolve(destinationRoot, "pagefind");

if (!existsSync(source)) {
  console.warn("[sync-pagefind] No generated Pagefind directory found at out/pagefind. Skipping copy.");
  process.exit(0);
}

mkdirSync(destinationRoot, { recursive: true });
rmSync(destination, { recursive: true, force: true });
cpSync(source, destination, { recursive: true });

console.log("[sync-pagefind] Copied Pagefind assets to public/pagefind.");
