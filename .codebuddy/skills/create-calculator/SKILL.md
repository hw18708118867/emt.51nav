---
name: create-calculator
description: This skill should be used when adding a new financial calculator to the emt.51nav site. It encodes the project's single-registry architecture, the required entry fields, the compute function return contract consumed by CalculatorForm, the category list, the sitemap fallback sync, and the optional art / OG image conventions so a new calculator is fully wired and indexed without re-discovering project structure.
---

# Create a financial calculator (emt.51nav)

Use this skill whenever the user asks to **add a calculator**, **create a new
<topic> calculator**, **build a <thing> estimator**, or otherwise introduce a new
interactive tool under `/calculators/<slug>`.

Read `references/calculator-conventions.md` for the full field/contract reference
and `scripts/entry-template.js` for a copy-paste starter.

## Mental model
There is exactly ONE registry: `src/lib/calculator-registry.js`. The dynamic route
`src/app/calculators/[slug]/page.js` renders any slug found there — you do NOT
create a per-calculator page file. `CalculatorForm` consumes the entry's
`inputs`/`advancedInputs` to render fields and calls `compute()` to render the
result blocks. The left floating TOC, right rail cards, related/FAQ, and SEO all
come from the entry. The only other mandatory edit for a NEW calculator is the
sitemap slug list.

## Step-by-step procedure

### 1. Pick slug + category
- slug: `<topic>-calculator` (kebab-case, stable). URL -> `/calculators/<slug>`.
- category: one of Mortgage, Debt, Income & Tax, Investing, Retirement, Savings,
  Budgeting (used by the index page and the fallback art).

### 2. Add the registry entry
Open `src/lib/calculator-registry.js`, copy `scripts/entry-template.js` into the
`calculatorRegistry = [...]` array and fill the `<EDIT>` fields:
- `slug`, `title`, `description`, `category`, `intro`
- `inputs` / `advancedInputs`: each `{ name, label, prefix?, suffix?, min, step, max? }`
- `compute(inputs, advanced)`: pure function. Do math with raw numbers, format
  strings at the end. Return the result object per the contract below. Guard
  divide-by-zero and empty inputs (never throw).
- `relatedSlugs`: verified slugs only (see the blog skill's slug list).
- `faqs`, `extraSections`: optional.
- `ogImagePath`: `/og/calculators/<slug>.svg` (file optional — see step 5).

`compute()` return contract (omit keys you don't need):
- `summary: [{ label, value, emphasis? }]`  headline rows
- `details: [{ label, value }]`              secondary breakdown
- `timeline: [{ label, value, sublabel? }]`  period series
- `comparison: [{ label, value, highlight? }]` scenarios side-by-side
- `breakdown: [{ label, value, portion? }]`  for donut/bar
- `amortizationTable: [{ period, payment, principal, interest, balance }]`
- `milestones: [{ label, value, at }]`
- `note: string`                              caveat under result

### 3. Register slug in its category
In the same file, at `calculatorCategories`, add `<slug>` to the matching
category's `calculators: [...]` array.

### 4. Sync the sitemap fallback (REQUIRED for new calculators)
Open `src/lib/calculator-slugs.json` and add `"<slug>"` to the array.
`next-sitemap.config.js` reads this via `additionalPaths` and merges by `loc`,
so the new page appears in `sitemap.xml` / `robots.txt`. (Article pages are
auto-discovered; only calculator slugs need this manual entry.)

### 5. Art + OG image (both OPTIONAL — calculator works without them)
- Art: `CalculatorArt` in `src/components/calculator-art.js` maps slug -> SVG via
  `artBySlug`. If the slug is absent it AUTO-FALLBACKS to the category art, so the
  page renders fine. To add custom art, append a function + an `artBySlug` entry
  (copy an existing one; reuse the shared `P` palette and `Frame`/`Backdrop`/
  `House`/`Coin` helpers).
- OG image: drop `public/og/calculators/<slug>.svg` (1200x630). If missing, the
  build still succeeds; only the social share image is absent. Reuse an existing
  SVG's structure.

### 6. Build and verify
```bash
npm run build
ls out/calculators/<slug>            # page generated?
# then confirm the slug is in the sitemap after next-sitemap runs
grep -r "/calculators/<slug>" out/sitemap.xml
```
Spot-check that `compute()` output shapes match the contract (no runtime errors
in the result blocks) and that `updatedAt` is present.

## Checklist before declaring done
- [ ] Entry added to `calculatorRegistry` in `src/lib/calculator-registry.js`
- [ ] slug is kebab-case ending in `-calculator`; category is one of the 7
- [ ] `inputs`/`advancedInputs` use the correct field shape
- [ ] `compute()` is pure, guards bad input, returns the documented shape
- [ ] slug added to the correct category in `calculatorCategories`
- [ ] slug added to `src/lib/calculator-slugs.json` (sitemap fallback)
- [ ] (optional) custom art added to `calculator-art.js` + OG SVG created
- [ ] `npm run build` succeeds; `/calculators/<slug>` page generated and in sitemap
