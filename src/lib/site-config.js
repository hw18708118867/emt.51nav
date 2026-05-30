function normalizeDomain(value) {
  return value ? value.replace(/\/+$/, "") : "";
}

function resolveSiteDomain() {
  const explicitDomain = normalizeDomain(process.env.NEXT_PUBLIC_SITE_URL);

  if (explicitDomain) {
    return explicitDomain;
  }

  const repository = process.env.GITHUB_REPOSITORY || "";
  const repositoryOwner = process.env.GITHUB_REPOSITORY_OWNER || repository.split("/")[0];
  const repositoryName = repository.split("/")[1];

  if (repositoryOwner && repositoryName) {
    return `https://${repositoryOwner}.github.io/${repositoryName}`;
  }

  return "http://localhost:3000";
}

export const siteConfig = {
  name: "Everyday Money Tools",
  abbreviation: "EMT",
  brandLines: ["Everyday Money", "Tools"],
  domain: resolveSiteDomain(),
  ogImagePath: "/og-default.png",
  description:
    "Money calculators, guides, and comparison pages for budgeting, debt payoff, saving, housing, and long-term planning.",
  defaultAuthor: "Everyday Money Tools Editorial Team",
  hero: {
    title: "Money calculators and planning tools for the budget, debt, and savings decisions that come up in real life.",
    eyebrow: "Tools and guides for everyday money choices"
  },
  navigation: [
    { href: "/calculators", label: "Calculators" },
    { href: "/guides", label: "Guides" },
    { href: "/compare", label: "Compare" },
    { href: "/resources", label: "Resources" },
    { href: "/blog", label: "Blog" }
  ],
  categories: [
    {
      title: "Investing",
      description: "Project long-term growth, retirement savings, and how inflation changes the value of future goals."
    },
    {
      title: "Debt",
      description: "Estimate payments, compare payoff paths, and look at the tradeoffs behind borrowing choices."
    },
    {
      title: "Budgeting",
      description: "Plan monthly cash flow, set savings targets, and build a more reliable short-term cushion."
    }
  ]
};
