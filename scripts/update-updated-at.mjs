// One-off script: bump updatedAt to today for articles whose content was expanded.
// Usage: node scripts/update-updated-at.mjs
import { readFileSync, writeFileSync } from "node:fs";

const file = "src/lib/articles.js";
const targetSlugs = [
  // compare
  "roth-vs-traditional-ira",
  "avalanche-vs-snowball",
  "renting-vs-buying",
  // blog
  "review-social-security-earnings-record",
  "use-cpi-before-setting-savings-goal",
  "claim-2025-home-energy-credit-on-2026-return",
  "ira-limit-shared-across-accounts",
  "2026-hsa-contribution-limits",
  "fdic-insurance-high-yield-savings",
  "bnpl-fees-and-pay-in-four-risks",
  "midyear-paycheck-checkup",
  "2026-retirement-contribution-limits",
  "check-credit-reports-for-free",
  "cash-buffer-before-extra-debt-payment",
  "401k-vesting-before-you-leave-job",
  // guides
  "the-50-30-20-budget-rule",
  "how-cds-work",
  "what-drives-your-car-payment",
  "paying-off-credit-card-debt",
  "debt-to-income-ratio-explained",
  "how-sales-tax-works",
  "understanding-your-paycheck",
  "when-refinancing-is-worth-it",
  "federal-income-tax-explained",
  "what-is-pmi-and-how-to-avoid-it",
  "mortgage-guide",
  "how-to-build-an-emergency-fund"
];

const NEW_DATE = "July 31, 2026";
let source = readFileSync(file, "utf8");
let updated = 0;

for (const slug of targetSlugs) {
  const slugPattern = new RegExp(`slug:\\s*"${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`);
  const slugMatch = slugPattern.exec(source);
  if (!slugMatch) {
    console.warn(`slug not found: ${slug}`);
    continue;
  }

  // From the slug position, find the next updatedAt occurrence (non-greedy).
  const remainder = source.slice(slugMatch.index);
  const updatedPattern = /updatedAt:\s*"([^"]*)"/;
  const updatedMatch = updatedPattern.exec(remainder);
  if (!updatedMatch) {
    console.warn(`updatedAt not found for: ${slug}`);
    continue;
  }

  const oldValue = updatedMatch[0];
  const newValue = `updatedAt: "${NEW_DATE}"`;
  if (oldValue === newValue) {
    continue;
  }

  const absoluteIndex = slugMatch.index + updatedMatch.index;
  source =
    source.slice(0, absoluteIndex) +
    newValue +
    source.slice(absoluteIndex + oldValue.length);
  updated += 1;
  console.log(`updated ${slug}: ${updatedMatch[1]} -> ${NEW_DATE}`);
}

writeFileSync(file, source, "utf8");
console.log(`\nDone. ${updated} article(s) updated to ${NEW_DATE}.`);
