import EmergencyFundGuide from "@/content/guides/how-to-build-an-emergency-fund.mdx";
import SaveMoneyGuide from "@/content/guides/how-to-save-money.mdx";
import DebtGuide from "@/content/guides/how-to-pay-off-debt-fast.mdx";
import BudgetGuide from "@/content/guides/budgeting-for-beginners.mdx";
import MortgageGuide from "@/content/guides/mortgage-guide.mdx";
import SinkingFundGuide from "@/content/guides/how-to-start-a-sinking-fund.mdx";
import InvestmentReturnsGuide from "@/content/guides/investment-returns-explained.mdx";
import DividendInvestingGuide from "@/content/guides/dividend-investing-basics.mdx";
import How401kGuide from "@/content/guides/how-401k-works.mdx";
import RothIraGuide from "@/content/guides/roth-ira-explained.mdx";
import AmortizationGuide from "@/content/guides/how-mortgage-amortization-works.mdx";
import RefinanceGuide from "@/content/guides/when-refinancing-is-worth-it.mdx";
import AffordabilityGuide from "@/content/guides/how-much-house-can-you-afford.mdx";
import PaycheckGuide from "@/content/guides/understanding-your-paycheck.mdx";
import FederalTaxGuide from "@/content/guides/federal-income-tax-explained.mdx";
import SalesTaxGuide from "@/content/guides/how-sales-tax-works.mdx";
import DtiGuide from "@/content/guides/debt-to-income-ratio-explained.mdx";
import CreditCardDebtGuide from "@/content/guides/paying-off-credit-card-debt.mdx";
import CarPaymentGuide from "@/content/guides/what-drives-your-car-payment.mdx";
import CdGuide from "@/content/guides/how-cds-work.mdx";
import BudgetRuleGuide from "@/content/guides/the-50-30-20-budget-rule.mdx";
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
import VestingBeforeExitBlog from "@/content/blog/401k-vesting-before-you-leave-job.mdx";
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
    relatedCalculators: ["mortgage-calculator", "home-affordability-calculator", "loan-calculator"],
    Content: MortgageGuide
  },
  {
    slug: "how-to-start-a-sinking-fund",
    title: "How To Start A Sinking Fund Without Turning It Into A Second Job",
    description: "A practical guide to setting aside money for known future expenses before they become credit card problems.",
    readingTime: "6 min read",
    publishedAt: "May 24, 2026",
    updatedAt: "May 24, 2026",
    category: "Savings",
    audience: "Readers whose budget gets knocked sideways by predictable but irregular expenses",
    takeaway: "A sinking fund works best when it covers a few real upcoming costs and moves money automatically before those bills arrive.",
    relatedCalculators: ["budget-calculator", "savings-goal-calculator", "emergency-fund-calculator"],
    Content: SinkingFundGuide
  },
  {
    slug: "investment-returns-explained",
    title: "Investment Returns Explained: ROI, CAGR, and Annualized Growth",
    description: "Understand the difference between ROI, annualized return, and CAGR, and learn which return measure to use when comparing investments.",
    readingTime: "6 min read",
    publishedAt: "June 15, 2026",
    updatedAt: "June 15, 2026",
    category: "Investing",
    audience: "Investors trying to compare returns across investments and time periods fairly",
    takeaway: "ROI shows the total gain, but annualized return and CAGR are what let you compare investments with different time spans on equal footing.",
    relatedCalculators: ["roi-calculator", "cagr-calculator", "compound-interest-calculator"],
    Content: InvestmentReturnsGuide
  },
  {
    slug: "dividend-investing-basics",
    title: "How Dividend Investing and Reinvestment Work",
    description: "A plain-language guide to dividends, yield, total return, and how reinvesting dividends through a DRIP compounds over time.",
    readingTime: "6 min read",
    publishedAt: "June 16, 2026",
    updatedAt: "June 16, 2026",
    category: "Investing",
    audience: "Readers deciding whether dividend stocks and reinvestment fit their strategy",
    takeaway: "Yield is only half of total return, and reinvesting dividends is where the long-term compounding really comes from.",
    relatedCalculators: ["dividend-calculator", "compound-interest-calculator", "retirement-calculator"],
    Content: DividendInvestingGuide
  },
  {
    slug: "how-401k-works",
    title: "How a 401(k) Works: Contributions, Employer Match, and Growth",
    description: "Learn how 401(k) contributions, the employer match, vesting, and decades of compounding combine to build a retirement balance.",
    readingTime: "7 min read",
    publishedAt: "June 17, 2026",
    updatedAt: "June 17, 2026",
    category: "Retirement",
    audience: "Workers setting up or revisiting a workplace 401(k) plan",
    takeaway: "Contribute at least enough to capture the full employer match, then let early, consistent contributions do the heavy lifting over time.",
    relatedCalculators: ["401k-calculator", "roth-ira-calculator", "retirement-calculator"],
    Content: How401kGuide
  },
  {
    slug: "roth-ira-explained",
    title: "Roth IRA Explained: Tax-Free Growth and the Rules That Matter",
    description: "How a Roth IRA works, when it beats a traditional account, the contribution and income rules, and the five-year withdrawal rule.",
    readingTime: "6 min read",
    publishedAt: "June 17, 2026",
    updatedAt: "June 17, 2026",
    category: "Retirement",
    audience: "Savers deciding whether tax-free retirement income is worth giving up a deduction today",
    takeaway: "A Roth trades today's deduction for decades of tax-free growth, which usually favors younger savers and anyone expecting similar or higher future taxes.",
    relatedCalculators: ["roth-ira-calculator", "401k-calculator", "retirement-calculator"],
    Content: RothIraGuide
  },
  {
    slug: "how-mortgage-amortization-works",
    title: "How Mortgage Amortization Works",
    description: "Understand how a mortgage payment splits between principal and interest, why early payments feel slow, and how extra payments save interest.",
    readingTime: "6 min read",
    publishedAt: "June 17, 2026",
    updatedAt: "June 17, 2026",
    category: "Housing",
    audience: "Homeowners who want to understand where their mortgage payment actually goes",
    takeaway: "Early payments are mostly interest because interest is charged on the balance, so anything that lowers the balance faster pays off twice.",
    relatedCalculators: ["mortgage-amortization-calculator", "extra-payment-mortgage-calculator", "mortgage-calculator"],
    Content: AmortizationGuide
  },
  {
    slug: "when-refinancing-is-worth-it",
    title: "When Refinancing Your Mortgage Is Worth It",
    description: "How to decide if refinancing pays off, using the break-even point on closing costs and watching out for a reset loan term.",
    readingTime: "6 min read",
    publishedAt: "June 18, 2026",
    updatedAt: "June 18, 2026",
    category: "Housing",
    audience: "Homeowners weighing a refinance and trying to tell real savings from a lower headline rate",
    takeaway: "A lower rate only helps if you keep the loan past the break-even point and avoid quietly adding interest by restarting the term.",
    relatedCalculators: ["refinance-calculator", "mortgage-calculator", "mortgage-amortization-calculator"],
    Content: RefinanceGuide
  },
  {
    slug: "how-much-house-can-you-afford",
    title: "How Much House Can You Afford?",
    description: "How affordability is really estimated from income, debts, and down payment, the costs people forget, and how renting versus buying fits in.",
    readingTime: "7 min read",
    publishedAt: "June 18, 2026",
    updatedAt: "June 18, 2026",
    category: "Housing",
    audience: "Buyers setting a realistic price range before house hunting",
    takeaway: "The most a lender approves is not the same as a payment you can live with once taxes, insurance, and maintenance are included.",
    relatedCalculators: ["home-affordability-calculator", "rent-vs-buy-calculator", "mortgage-calculator"],
    Content: AffordabilityGuide
  },
  {
    slug: "understanding-your-paycheck",
    title: "Understanding Your Paycheck: Where the Money Goes",
    description: "What separates gross pay from take-home pay, the taxes and deductions that come out, and why pre-tax contributions stretch further.",
    readingTime: "6 min read",
    publishedAt: "June 19, 2026",
    updatedAt: "June 19, 2026",
    category: "Taxes",
    audience: "Workers trying to understand the gap between their salary and their take-home pay",
    takeaway: "Build your budget around net pay, and use pre-tax contributions to lower the income your tax is based on.",
    relatedCalculators: ["paycheck-calculator", "salary-calculator", "income-tax-calculator"],
    Content: PaycheckGuide
  },
  {
    slug: "federal-income-tax-explained",
    title: "Federal Income Tax and Self-Employment Tax, Explained",
    description: "How marginal tax brackets really work, the difference between marginal and effective rates, the standard deduction, and self-employment tax.",
    readingTime: "7 min read",
    publishedAt: "June 19, 2026",
    updatedAt: "June 19, 2026",
    category: "Taxes",
    audience: "Filers who want to understand how their federal tax is actually calculated",
    takeaway: "Brackets are marginal, so a raise never lowers your take-home pay, and the self-employed owe an extra 15.3% tax on top of income tax.",
    relatedCalculators: ["income-tax-calculator", "self-employment-tax-calculator", "paycheck-calculator"],
    Content: FederalTaxGuide
  },
  {
    slug: "how-sales-tax-works",
    title: "How Sales Tax Works, Including How to Back It Out of a Total",
    description: "How sales tax is added at the register, why rates vary by location, and how to recover the pre-tax price from a tax-included total.",
    readingTime: "5 min read",
    publishedAt: "June 20, 2026",
    updatedAt: "June 20, 2026",
    category: "Taxes",
    audience: "Shoppers and small sellers who need to add or remove sales tax accurately",
    takeaway: "To find a pre-tax price from a total, divide by one plus the rate rather than subtracting the percentage.",
    relatedCalculators: ["sales-tax-calculator", "income-tax-calculator", "budget-calculator"],
    Content: SalesTaxGuide
  },
  {
    slug: "debt-to-income-ratio-explained",
    title: "What Your Debt-to-Income Ratio Says to Lenders",
    description: "How front-end and back-end DTI are calculated, the thresholds lenders use, and the fastest ways to lower the ratio before you apply.",
    readingTime: "6 min read",
    publishedAt: "June 20, 2026",
    updatedAt: "June 20, 2026",
    category: "Debt",
    audience: "Borrowers preparing for a mortgage, car loan, or other financing",
    takeaway: "Lenders weigh your back-end DTI most, and clearing a monthly payment can lower it more than the balance alone suggests.",
    relatedCalculators: ["debt-to-income-ratio-calculator", "credit-card-payoff-calculator", "auto-loan-calculator"],
    Content: DtiGuide
  },
  {
    slug: "paying-off-credit-card-debt",
    title: "How to Pay Off Credit Card Debt Faster",
    description: "Why credit card balances stall, what the minimum payment really costs, the payment threshold that matters, and how to order multiple cards.",
    readingTime: "6 min read",
    publishedAt: "June 21, 2026",
    updatedAt: "June 21, 2026",
    category: "Debt",
    audience: "Readers carrying high-interest credit card balances",
    takeaway: "Paying above the monthly interest is what creates real progress, and a small cash buffer keeps the payoff from relapsing.",
    relatedCalculators: ["credit-card-payoff-calculator", "debt-payoff-calculator", "debt-to-income-ratio-calculator"],
    Content: CreditCardDebtGuide
  },
  {
    slug: "what-drives-your-car-payment",
    title: "What Really Drives Your Car Payment",
    description: "The four inputs behind a car payment, why negotiating the monthly number backfires, and how the loan term quietly raises total cost.",
    readingTime: "6 min read",
    publishedAt: "June 21, 2026",
    updatedAt: "June 21, 2026",
    category: "Debt",
    audience: "Car buyers comparing financing offers",
    takeaway: "Control the price, down payment, and rate, and treat the monthly payment as a result to check rather than a target to negotiate.",
    relatedCalculators: ["auto-loan-calculator", "loan-calculator", "debt-to-income-ratio-calculator"],
    Content: CarPaymentGuide
  },
  {
    slug: "how-cds-work",
    title: "How Certificates of Deposit Work",
    description: "How a CD trades access for a fixed rate, why APY beats the stated rate for comparison, early-withdrawal penalties, and where a CD fits.",
    readingTime: "6 min read",
    publishedAt: "June 22, 2026",
    updatedAt: "June 22, 2026",
    category: "Savings",
    audience: "Savers deciding whether a CD fits money with a known deadline",
    takeaway: "A CD suits cash you can leave untouched until a set date, but not an emergency fund or long-term growth money.",
    relatedCalculators: ["cd-calculator", "savings-goal-calculator", "emergency-fund-calculator"],
    Content: CdGuide
  },
  {
    slug: "the-50-30-20-budget-rule",
    title: "The 50/30/20 Budget Rule, and When to Bend It",
    description: "How the 50/30/20 split works, what belongs in needs, wants, and savings, and how to adjust the percentages for your situation.",
    readingTime: "6 min read",
    publishedAt: "June 22, 2026",
    updatedAt: "June 22, 2026",
    category: "Budgeting",
    audience: "Readers who want a simple budget framework they can actually maintain",
    takeaway: "The split is a benchmark for spotting where your money is tight, not a rule to obey exactly.",
    relatedCalculators: ["50-30-20-budget-calculator", "budget-calculator", "savings-goal-calculator"],
    Content: BudgetRuleGuide
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
    relatedCalculators: ["roth-ira-calculator", "401k-calculator", "retirement-calculator"],
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
    relatedCalculators: ["rent-vs-buy-calculator", "home-affordability-calculator", "mortgage-calculator"],
    Content: RentingVsBuying
  }
];

export const blogArticles = [
  {
    slug: "401k-vesting-before-you-leave-job",
    title: "401(k) Vesting When You Leave a Job: What Happens to Your Employer Match?",
    description:
      "Learn how 401(k) vesting works, whether you keep your employer match when you leave a job, and which plan details to check before you resign.",
    readingTime: "5 min read",
    publishedAt: "May 29, 2026",
    updatedAt: "May 29, 2026",
    category: "Retirement",
    audience: "Workers changing jobs who want to understand how much of the employer-funded 401(k) balance is truly theirs",
    takeaway: "Your own 401(k) contributions are always yours, but employer contributions may follow a vesting schedule that is worth checking before you leave.",
    relatedCalculators: ["401k-calculator", "retirement-calculator", "net-worth-calculator"],
    Content: VestingBeforeExitBlog
  },
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
    relatedCalculators: ["401k-calculator", "roth-ira-calculator", "retirement-calculator"],
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
