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

  return "https://moneytools.51nav.com";
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
      title: "Mortgage",
      description: "Estimate payments, amortization, refinancing, affordability, PMI costs, and whether renting or buying costs less."
    },
    {
      title: "Debt",
      description: "Estimate payments, compare payoff paths, calculate student loans, and look at the tradeoffs behind borrowing choices."
    },
    {
      title: "Income & Tax",
      description: "Calculate paychecks, taxes, capital gains, and understand how taxes impact your financial decisions."
    },
    {
      title: "Investing",
      description: "Project long-term growth and how inflation changes the value of future goals."
    },
    {
      title: "Retirement",
      description: "Test whether your saving pace supports the retirement timeline and income you want."
    },
    {
      title: "Savings",
      description: "Set savings targets and build a more reliable short-term cushion."
    },
    {
      title: "Budgeting",
      description: "Plan monthly cash flow, track net worth, and protect your family with life insurance estimates."
    }
  ]
};
