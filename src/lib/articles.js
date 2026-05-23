import EmergencyFundGuide from "@/content/guides/how-to-build-an-emergency-fund.mdx";
import SaveMoneyGuide from "@/content/guides/how-to-save-money.mdx";
import DebtGuide from "@/content/guides/how-to-pay-off-debt-fast.mdx";
import BudgetGuide from "@/content/guides/budgeting-for-beginners.mdx";
import MortgageGuide from "@/content/guides/mortgage-guide.mdx";
import HsaLimitsBlog from "@/content/blog/2026-hsa-contribution-limits.mdx";
import RetirementLimitsBlog from "@/content/blog/2026-retirement-contribution-limits.mdx";
import CreditReportsBlog from "@/content/blog/check-credit-reports-for-free.mdx";
import FdicInsuranceBlog from "@/content/blog/fdic-insurance-high-yield-savings.mdx";
import EnergyCreditBlog from "@/content/blog/claim-2025-home-energy-credit-on-2026-return.mdx";
import BnplRisksBlog from "@/content/blog/bnpl-fees-and-pay-in-four-risks.mdx";
import IraSharedLimitBlog from "@/content/blog/ira-limit-shared-across-accounts.mdx";
import InflationGoalBlog from "@/content/blog/use-cpi-before-setting-savings-goal.mdx";
import PaycheckCheckupBlog from "@/content/blog/midyear-paycheck-checkup.mdx";
import SocialSecurityRecordBlog from "@/content/blog/review-social-security-earnings-record.mdx";
import CashBufferBlog from "@/content/blog/cash-buffer-before-extra-debt-payment.mdx";
import RothVsTraditional from "@/content/compare/roth-vs-traditional-ira.mdx";
import AvalancheVsSnowball from "@/content/compare/avalanche-vs-snowball.mdx";
import RentingVsBuying from "@/content/compare/renting-vs-buying.mdx";

export const guides = [
  {
    slug: "how-to-build-an-emergency-fund",
    title: "How To Build An Emergency Fund",
    description: "How to choose an emergency fund target, where to keep the cash, and how to build it without knocking everything else off track.",
    readingTime: "6 min read",
    publishedAt: "May 6, 2026",
    updatedAt: "May 18, 2026",
    category: "Savings",
    audience: "Households building their first real cash cushion",
    takeaway: "Set the target from essential expenses, then build it in stages you can actually maintain.",
    relatedCalculators: ["emergency-fund-calculator", "budget-calculator", "savings-goal-calculator"],
    Content: EmergencyFundGuide
  },
  {
    slug: "how-to-save-money",
    title: "How To Save Money Without Burning Out",
    description: "A realistic saving system built around automation, bigger spending changes, and habits you can keep using.",
    readingTime: "5 min read",
    publishedAt: "May 8, 2026",
    updatedAt: "May 18, 2026",
    category: "Budgeting",
    audience: "Readers trying to save more without extreme budgeting",
    takeaway: "Automate first, cut large fixed costs where possible, and give each savings dollar a specific job.",
    relatedCalculators: ["budget-calculator", "savings-goal-calculator", "net-worth-calculator"],
    Content: SaveMoneyGuide
  },
  {
    slug: "how-to-pay-off-debt-fast",
    title: "How To Pay Off Debt Fast",
    description: "Learn how to pay off debt faster by improving payment consistency, choosing the right payoff order, and reducing relapse risk.",
    readingTime: "7 min read",
    publishedAt: "May 9, 2026",
    updatedAt: "May 18, 2026",
    category: "Debt",
    audience: "Readers carrying high-interest balances and trying to speed up payoff",
    takeaway: "A good debt plan combines the math of faster payments with enough cash buffer to avoid starting over.",
    relatedCalculators: ["debt-payoff-calculator", "loan-calculator", "budget-calculator"],
    Content: DebtGuide
  },
  {
    slug: "budgeting-for-beginners",
    title: "Budgeting For Beginners",
    description: "A beginner-friendly way to build a monthly budget around take-home pay, core spending buckets, and honest leftover cash flow.",
    readingTime: "6 min read",
    publishedAt: "May 11, 2026",
    updatedAt: "May 18, 2026",
    category: "Budgeting",
    audience: "Readers setting up a budget or restarting one that never stuck",
    takeaway: "Use simple categories, start from take-home pay, and focus on whether the leftover number is real.",
    relatedCalculators: ["budget-calculator", "emergency-fund-calculator", "mortgage-calculator"],
    Content: BudgetGuide
  },
  {
    slug: "mortgage-guide",
    title: "Mortgage Guide For First-Time Buyers",
    description: "A guide to mortgage affordability, term length, down payment tradeoffs, and the costs buyers often underestimate.",
    readingTime: "7 min read",
    publishedAt: "May 13, 2026",
    updatedAt: "May 18, 2026",
    category: "Housing",
    audience: "First-time buyers comparing affordability before house hunting seriously",
    takeaway: "Approval is not the same as affordability, and the safest payment is the one your monthly life can still support.",
    relatedCalculators: ["mortgage-calculator", "loan-calculator", "budget-calculator"],
    Content: MortgageGuide
  }
];

export const compareArticles = [
  {
    slug: "roth-vs-traditional-ira",
    title: "Roth vs Traditional IRA",
    description: "Compare Roth and Traditional IRA choices by tax timing, withdrawal flexibility, and the kind of future income you expect.",
    readingTime: "5 min read",
    publishedAt: "May 7, 2026",
    updatedAt: "May 18, 2026",
    category: "Retirement",
    audience: "Savers deciding whether taxes are likely to be better now or later",
    takeaway: "The core decision is whether the upfront deduction or future tax-free withdrawals are more valuable for your situation.",
    relatedCalculators: ["retirement-calculator", "compound-interest-calculator", "net-worth-calculator"],
    Content: RothVsTraditional
  },
  {
    slug: "avalanche-vs-snowball",
    title: "Debt Avalanche vs Debt Snowball",
    description: "Compare debt avalanche and debt snowball based on interest savings, motivation, and the kind of payoff system you are likely to maintain.",
    readingTime: "5 min read",
    publishedAt: "May 10, 2026",
    updatedAt: "May 18, 2026",
    category: "Debt",
    audience: "Readers choosing a structured payoff method for multiple balances",
    takeaway: "Avalanche usually wins on cost, while snowball can win on momentum if motivation has been the main blocker.",
    relatedCalculators: ["debt-payoff-calculator", "budget-calculator", "loan-calculator"],
    Content: AvalancheVsSnowball
  },
  {
    slug: "renting-vs-buying",
    title: "Renting vs Buying",
    description: "Look past social pressure and compare renting versus buying through the lens of flexibility, cost, maintenance risk, and time horizon.",
    readingTime: "6 min read",
    publishedAt: "May 12, 2026",
    updatedAt: "May 18, 2026",
    category: "Housing",
    audience: "Readers deciding whether homeownership fits their timeline and cash flow",
    takeaway: "The better option depends less on identity and more on time horizon, monthly margin, and risk tolerance.",
    relatedCalculators: ["mortgage-calculator", "budget-calculator", "emergency-fund-calculator"],
    Content: RentingVsBuying
  }
];

export const blogArticles = [
  {
    slug: "cash-buffer-before-extra-debt-payment",
    title: "Why A Small Cash Buffer Can Matter More Than One More Extra Debt Payment",
    description: "Why sending every spare dollar to debt can backfire when you do not have enough cash to absorb ordinary surprises.",
    readingTime: "4 min read",
    publishedAt: "May 23, 2026",
    updatedAt: "May 23, 2026",
    category: "Debt",
    audience: "Readers trying to pay down balances without sliding back after the next surprise expense",
    takeaway: "A starter cash buffer often makes extra debt payments more durable because it reduces the odds of having to borrow again right after paying.",
    relatedCalculators: ["debt-payoff-calculator", "budget-calculator", "emergency-fund-calculator"],
    Content: CashBufferBlog
  },
  {
    slug: "2026-hsa-contribution-limits",
    title: "2026 HSA Contribution Limits And The HDHP Numbers To Check First",
    description: "What the 2026 HSA contribution limits are and which HDHP thresholds still need to line up before the account works the way you expect.",
    readingTime: "5 min read",
    publishedAt: "May 14, 2026",
    updatedAt: "May 19, 2026",
    category: "Health",
    audience: "Workers comparing HSA-eligible health plans or revisiting paycheck deductions",
    takeaway: "The contribution limit matters, but the first question is whether your plan still qualifies as HSA-eligible under the 2026 thresholds.",
    relatedCalculators: ["budget-calculator", "net-worth-calculator", "savings-goal-calculator"],
    Content: HsaLimitsBlog
  },
  {
    slug: "2026-retirement-contribution-limits",
    title: "2026 IRA And 401(k) Contribution Limits: What Actually Changed",
    description: "What changed in the 2026 retirement contribution limits and how ordinary savers can use those numbers without turning the year into an all-or-nothing max-out exercise.",
    readingTime: "5 min read",
    publishedAt: "May 15, 2026",
    updatedAt: "May 19, 2026",
    category: "Retirement",
    audience: "Workers deciding whether to increase 2026 retirement contributions",
    takeaway: "The 2026 limits matter even if you will not max them, because they give you a clean ceiling for pacing and automation.",
    relatedCalculators: ["retirement-calculator", "compound-interest-calculator", "net-worth-calculator"],
    Content: RetirementLimitsBlog
  },
  {
    slug: "ira-limit-shared-across-accounts",
    title: "Why Your IRA Contribution Limit Is Shared Across Multiple Accounts",
    description: "Why opening more than one IRA does not create extra annual contribution room and what else can cap your contribution before you hit the headline limit.",
    readingTime: "5 min read",
    publishedAt: "May 15, 2026",
    updatedAt: "May 19, 2026",
    category: "Retirement",
    audience: "Savers splitting money between traditional and Roth IRAs or contributing with uneven income",
    takeaway: "The annual IRA cap is a shared bucket across accounts, and compensation or income rules can shrink the room even further.",
    relatedCalculators: ["retirement-calculator", "compound-interest-calculator", "net-worth-calculator"],
    Content: IraSharedLimitBlog
  },
  {
    slug: "check-credit-reports-for-free",
    title: "How To Check Your Credit Reports For Free And What To Review First",
    description: "Where to get legitimate free credit reports, when to review them, and which errors are worth checking first.",
    readingTime: "6 min read",
    publishedAt: "May 16, 2026",
    updatedAt: "May 19, 2026",
    category: "Credit",
    audience: "Readers preparing for a loan, apartment search, job screening, or identity-theft check",
    takeaway: "Pulling the report is easy; the real value comes from reviewing identity details, account status, balances, and duplicate or suspicious items.",
    relatedCalculators: ["mortgage-calculator", "loan-calculator", "budget-calculator"],
    Content: CreditReportsBlog
  },
  {
    slug: "bnpl-fees-and-pay-in-four-risks",
    title: "Buy Now, Pay Later Fees: What To Check Before Using Pay-In-Four",
    description: "What BNPL loans are, where the real fees show up, and why a no-interest offer can still create a budget problem.",
    readingTime: "4 min read",
    publishedAt: "May 16, 2026",
    updatedAt: "May 19, 2026",
    category: "Credit",
    audience: "Shoppers using pay-in-four products to smooth out short-term purchases",
    takeaway: "The real risk is not only interest; it is late fees, overdraft exposure, stacked payment plans, and treating convenience like affordability.",
    relatedCalculators: ["budget-calculator", "debt-payoff-calculator", "loan-calculator"],
    Content: BnplRisksBlog
  },
  {
    slug: "fdic-insurance-high-yield-savings",
    title: "What FDIC Insurance Actually Covers In A High-Yield Savings Setup",
    description: "What FDIC insurance covers, what it does not cover, and why bank charter and ownership category matter before you park a large cash balance.",
    readingTime: "5 min read",
    publishedAt: "May 17, 2026",
    updatedAt: "May 19, 2026",
    category: "Savings",
    audience: "Readers holding a larger emergency fund or cash reserve in bank deposit accounts",
    takeaway: "The key question is not only yield; it is whether the money is in an insured deposit product and within your actual coverage limits.",
    relatedCalculators: ["emergency-fund-calculator", "savings-goal-calculator", "budget-calculator"],
    Content: FdicInsuranceBlog
  },
  {
    slug: "review-social-security-earnings-record",
    title: "Why It Is Worth Checking Your Social Security Earnings Record In August",
    description: "Why the SSA points people to August for an earnings-record check and how that review supports better retirement planning.",
    readingTime: "4 min read",
    publishedAt: "May 17, 2026",
    updatedAt: "May 19, 2026",
    category: "Retirement",
    audience: "Workers who want cleaner Social Security estimates before retirement is close",
    takeaway: "Checking the record annually after new wages should be reflected is one of the easiest ways to catch benefit-affecting errors early.",
    relatedCalculators: ["retirement-calculator", "net-worth-calculator", "budget-calculator"],
    Content: SocialSecurityRecordBlog
  },
  {
    slug: "use-cpi-before-setting-savings-goal",
    title: "Use CPI Before You Set A Long-Term Savings Goal",
    description: "Why long-term goals should be priced in future dollars, not today's dollars, with CPI-based inflation data as a reality check.",
    readingTime: "4 min read",
    publishedAt: "May 18, 2026",
    updatedAt: "May 19, 2026",
    category: "Inflation",
    audience: "Readers saving toward goals that are still several years away",
    takeaway: "A savings goal that ignores inflation can look fully funded on paper while still falling short in purchasing power.",
    relatedCalculators: ["inflation-calculator", "savings-goal-calculator", "compound-interest-calculator"],
    Content: InflationGoalBlog
  },
  {
    slug: "midyear-paycheck-checkup",
    title: "Midyear Paycheck Checkup: When The IRS Withholding Estimator Is Worth Using",
    description: "How to decide whether a withholding checkup is worth your time and when a recent refund or tax bill is a sign to update Form W-4.",
    readingTime: "5 min read",
    publishedAt: "May 18, 2026",
    updatedAt: "May 19, 2026",
    category: "Taxes",
    audience: "Workers who owed unexpectedly, got an oversized refund, or had a major income change",
    takeaway: "If this year's tax result felt off, the best time to correct withholding is while there are still pay periods left in the year.",
    relatedCalculators: ["budget-calculator", "debt-payoff-calculator", "savings-goal-calculator"],
    Content: PaycheckCheckupBlog
  },
  {
    slug: "claim-2025-home-energy-credit-on-2026-return",
    title: "How To Claim A 2025 Home Energy Credit On A 2026 Tax Return",
    description: "The timing, eligibility, and filing steps that matter if you installed qualifying home energy property in 2025 and are claiming the credit during 2026 filing season.",
    readingTime: "6 min read",
    publishedAt: "May 18, 2026",
    updatedAt: "May 19, 2026",
    category: "Housing",
    audience: "Homeowners who completed qualifying clean-energy improvements in 2025",
    takeaway: "For these credits, installation timing matters as much as purchase timing, and Form 5695 is the filing checkpoint that ties it together.",
    relatedCalculators: ["budget-calculator", "mortgage-calculator", "savings-goal-calculator"],
    Content: EnergyCreditBlog
  }
];

export const resources = [
  {
    title: "Search the site",
    href: "/resources/search",
    description: "Find calculators, guides, blog posts, and comparison pages by topic once search is fully enabled."
  },
  {
    title: "Guide library",
    href: "/guides",
    description: "Browse explainers on budgeting, debt payoff, emergency savings, and mortgage basics."
  },
  {
    title: "Comparison hub",
    href: "/compare",
    description: "Review side-by-side breakdowns for financial choices that require more than a quick estimate."
  }
];

export const guideIndex = Object.fromEntries(guides.map((guide) => [guide.slug, guide]));
export const compareIndex = Object.fromEntries(compareArticles.map((article) => [article.slug, article]));
export const blogIndex = Object.fromEntries(blogArticles.map((article) => [article.slug, article]));
