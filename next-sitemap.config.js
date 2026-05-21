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

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  outDir: "out",
  changefreq: "weekly",
  priority: 0.7,
  exclude: ["/404"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/"
      }
    ]
  }
};
