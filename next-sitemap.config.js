function normalizeDomain(value) {
  return value ? value.replace(/\/+$/, "") : "";
}

function resolveSiteUrl() {
  const explicitSiteUrl = normalizeDomain(process.env.NEXT_PUBLIC_SITE_URL);

  if (explicitSiteUrl) {
    return explicitSiteUrl;
  }

  const repository = process.env.GITHUB_REPOSITORY || "";
  const repositoryOwner = process.env.GITHUB_REPOSITORY_OWNER || repository.split("/")[0];
  const repositoryName = repository.split("/")[1];

  if (repositoryOwner && repositoryName) {
    return `https://${repositoryOwner}.github.io/${repositoryName}`;
  }

  console.warn("[next-sitemap] NEXT_PUBLIC_SITE_URL is not set. Falling back to http://localhost:3000 for local builds.");
  return "http://localhost:3000";
}

const siteUrl = resolveSiteUrl();

// Canonical list of every calculator slug. This is a safety net for the
// sitemap: next-sitemap scans the exported /calculators/* pages, but we also
// emit each calculator URL explicitly so none can ever be dropped from the
// sitemap. Keep this list in sync with calculatorCategories in
// src/lib/calculator-registry.js when adding or removing a calculator.
const calculatorSlugs = require("./src/lib/calculator-slugs.json");

const CALCULATOR_LOCS = calculatorSlugs.map((slug) => ({
  loc: `/calculators/${slug}`,
  changefreq: "weekly",
  priority: 0.8,
  lastmod: new Date().toISOString(),
}));

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  outDir: "out",
  changefreq: "weekly",
  priority: 0.7,
  exclude: ["/404"],
  // Fallback for dynamic calculator routes. next-sitemap merges these with the
  // pages it discovers while scanning /out; entries that already exist are
  // merged (priority/changefreq enriched) instead of duplicated.
  additionalPaths: async () => CALCULATOR_LOCS,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/"
      }
    ]
  }
};
