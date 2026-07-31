// Count words in a blog/guide/compare MDX file (strips frontmatter, MDX/JSX tags,
// and shortcodes). Exits non-zero if below the required minimum.
//
// Usage:
//   node scripts/wordcount.mjs <path-to-mdx> [minWords=800]
//
// Output: prints the word count. Exit code 1 if count < minWords.

import { readFileSync } from "node:fs";

const file = process.argv[2];
const minWords = Number(process.argv[3] ?? 800);

if (!file) {
  console.error("Usage: node scripts/wordcount.mjs <path-to-mdx> [minWords]");
  process.exit(2);
}

const raw = readFileSync(file, "utf8");

// Strip YAML frontmatter if present.
const withoutFrontmatter = raw.replace(/^---\n[\s\S]*?\n---\n/, "");

// Strip MDX/JSX tags and component calls (e.g. <CalculatorCard ... />, <Callout>).
const withoutJsx = withoutFrontmatter
  .replace(/<[A-Za-z][^>]*\/?>/g, " ")
  .replace(/<\/[A-Za-z][^>]*>/g, " ");

// Strip URLs, markdown links/images syntax, and code fences.
const cleaned = withoutJsx
  .replace(/```[\s\S]*?```/g, " ")
  .replace(/`[^`]*`/g, " ")
  .replace(/!?\[[^\]]*\]\([^)]*\)/g, " ")
  .replace(/https?:\/\/\S+/g, " ");

const words = cleaned
  .split(/\s+/)
  .map((w) => w.trim())
  .filter((w) => /[A-Za-z0-9]/.test(w));

const count = words.length;
console.log(`${file}: ${count} words (min ${minWords})`);

if (count < minWords) {
  process.exit(1);
}
