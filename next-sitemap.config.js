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

  console.warn("[next-sitemap] NEXT_PUBLIC_SITE_URL is not set. Falling back to https://moneytools.51nav.com for local builds.");
  return "https://moneytools.51nav.com";
}

const siteUrl = resolveSiteUrl();

const fs = require("fs");
const path = require("path");

function dirSlugs(dir) {
  const base = path.join("out", dir);
  if (!fs.existsSync(base)) return [];
  return fs
    .readdirSync(base)
    .filter((name) => {
      try {
        return fs.statSync(path.join(base, name)).isDirectory();
      } catch {
        return false;
      }
    });
}

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

// Guides are statically generated, but next-sitemap's automatic scan has
// missed the /guides/* routes in practice, so we list them explicitly from
// the built output to guarantee they appear in the sitemap.
const GUIDE_LOCS = dirSlugs("guides").map((slug) => ({
  loc: `/guides/${slug}`,
  changefreq: "weekly",
  priority: 0.7,
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
  additionalPaths: async () => [...CALCULATOR_LOCS, ...GUIDE_LOCS],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/"
      }
    ]
  }
};
