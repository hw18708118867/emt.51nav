# Slug conventions and safe internal links

## Slug rules (CRITICAL — post URLs are derived from these)
- Blog:     `src/content/blog/<slug>.mdx`    -> `/blog/<slug>`
- Guides:   `src/content/guides/<slug>.mdx`  -> `/guides/<slug>`
- Compare:  `src/content/compare/<slug>.mdx` -> `/compare/<slug>`

Slug format:
- lowercase, hyphen-separated, kebab-case
- no spaces, no underscores, no trailing hyphen
- descriptive and stable (do NOT rename later — it changes the URL)

## Internal-link slugs you may use (verified to exist)
Only link to these real slugs. Never invent a URL.

### Other articles (use as `/blog/...`, `/guides/...`, `/compare/...`)
Blog:
2026-hsa-contribution-limits, 2026-retirement-contribution-limits,
401k-vesting-before-you-leave-job, bnpl-fees-and-pay-in-four-risks,
cash-buffer-before-extra-debt-payment, check-credit-reports-for-free,
claim-2025-home-energy-credit-on-2026-return, fdic-insurance-high-yield-savings,
ira-limit-shared-across-accounts, midyear-paycheck-checkup,
review-social-security-earnings-record, use-cpi-before-setting-savings-goal

Guides:
the-50-30-20-budget-rule, how-cds-work, what-drives-your-car-payment,
paying-off-credit-card-debt, debt-to-income-ratio-explained, how-sales-tax-works,
understanding-your-paycheck, when-refinancing-is-worth-it,
federal-income-tax-explained, what-is-pmi-and-how-to-avoid-it,
mortgage-guide, how-to-build-an-emergency-fund

Compare:
roth-vs-traditional-ira, renting-vs-buying, avalanche-vs-snowball

### Calculators (use as `/calculators/<slug>`)
mortgage-calculator, mortgage-amortization-calculator, refinance-calculator,
home-affordability-calculator, rent-vs-buy-calculator,
extra-payment-mortgage-calculator, pmi-calculator, loan-calculator,
debt-payoff-calculator, credit-card-payoff-calculator, auto-loan-calculator,
debt-to-income-ratio-calculator, student-loan-calculator, car-affordability-calculator,
debt-snowball-calculator, debt-avalanche-calculator, debt-consolidation-calculator,
paycheck-calculator, salary-calculator, income-tax-calculator, sales-tax-calculator,
self-employment-tax-calculator, capital-gains-tax-calculator,
compound-interest-calculator, roi-calculator, cagr-calculator, dividend-calculator,
inflation-calculator, rule-of-72-calculator, rental-property-calculator,
retirement-calculator, 401k-calculator, roth-ira-calculator,
social-security-estimator, savings-goal-calculator, emergency-fund-calculator,
cd-calculator, apy-calculator, budget-calculator, net-worth-calculator,
50-30-20-budget-calculator, life-insurance-calculator

## Registry files that must stay in sync
- `src/lib/articles.js` — manual article registry (metadata + content import).
  Each new article MUST be added here so listing/related/SEO pages work.
- `src/lib/calculator-slugs.json` + `src/lib/calculator-registry.js` — calculator
  registry. Only relevant when a blog/guide links a calculator card.
- `next-sitemap.config.js` — reads `calculator-slugs.json` via `additionalPaths`
  as a fallback so calculator pages are never missing from the sitemap.

## Official-source links allowed in "Official references"
Use only real government / official domains, e.g.:
- https://www.irs.gov/
- https://www.ssa.gov/
- https://www.consumerfinance.gov/
- https://www.ftc.gov/
- https://www.fdic.gov/
- https://www.energystar.gov/  / https://www.irs.gov/clean-vehicle-credit
Never fabricate a deep-link path; link to the official section root when unsure.
