# Calculator conventions (emt.51nav)

All calculators live in ONE registry file: `src/lib/calculator-registry.js`.
The page `src/app/calculators/[slug]/page.js` renders any slug found in that array.
There is NO per-calculator page file to create — you only add a registry entry,
sync the sitemap slug list, and optionally add art + an OG image.

## 1. Slug rules
- Format: `<topic>-calculator` (e.g. `mortgage-calculator`, `roth-ira-calculator`).
- lowercase, hyphen-separated, stable (renaming changes the URL).
- URL becomes `/calculators/<slug>`.

## 2. Categories (one of these — used by calculators/index and category art)
"Mortgage", "Debt", "Income & Tax", "Investing", "Retirement", "Savings", "Budgeting"
They are defined in `calculatorCategories` at the bottom of `calculator-registry.js`.
Add the new slug to the matching category's `calculators: [...]` array.

## 3. Entry shape (copy from the template in scripts/ below)
Required fields:
- `slug` (matches URL), `title`, `description` (SEO, 1 sentence), `category`
- `intro` (1–2 sentences shown under the title)
- `inputs`: `[{ name, label, prefix?, suffix?, min, step, max? }]`
- `advancedInputs`: same shape, shown under "Advanced options" toggle
- `compute(inputs, advanced)`: pure function returning a result object (see §4)
- `updatedAt`: `new Date().toISOString()` (used by sitemap)
- `ogImagePath`: `/og/calculators/<slug>.svg` (file optional; see §5)

Optional fields:
- `relatedSlugs`: `[[<slug>, "<label>"], ...]` shown as "Explore" links
- `faqs`: `[{ question, answer }]` rendered as accordion + FAQ schema
- `extraSections`: `[{ heading, body }]` markdown-ish extra copy
- `disclaimer`: string, or defaults to the standard one
- `resultHint`: string shown near the result

## 4. compute() return contract (consumed by CalculatorForm)
Return an object with these keys (omit what you don't need):
- `summary: [{ label, value, emphasis?: true }]`  // headline result rows
- `details: [{ label, value }]`                     // secondary breakdown
- `timeline: [{ label, value, sublabel? }]`         // e.g. year-by-year
- `comparison: [{ label, value, highlight?: true }]`// side-by-side scenarios
- `breakdown: [{ label, value, portion? }]`         // for a donut/bar
- `amortizationTable: [{ period, payment, principal, interest, balance }]`
- `milestones: [{ label, value, at: <period> }]`
- `note: string`                                    // caveat under the result
All `value`s are already-formatted strings (e.g. "$1,234"). Do the math with raw
numbers, format at the end. Never throw — guard divide-by-zero / empty inputs.

## 5. Art and OG image (both OPTIONAL)
- Art: `CalculatorArt` (in `src/components/calculator-art.js`) maps slug -> SVG
  component via `artBySlug`. If your slug is not in that map it AUTO-FALLBACKS to
  the category art, so the calculator works without custom art. To add custom art,
  append a function + an `artBySlug` entry (copy an existing one as a starting
  point; uses the shared `P` palette and `Frame`/`Backdrop`/`House`/`Coin` helpers).
- OG image: drop an SVG at `public/og/calculators/<slug>.svg` (1200x630). If absent,
  the page still builds; only the social share image is missing. Reuse an existing
  SVG's structure when creating one.

## 6. Sitemap fallback (MUST do)
`next-sitemap.config.js` reads `src/lib/calculator-slugs.json` via `additionalPaths`
and merges by `loc` (no duplicates). Add the new slug to that JSON array so the
calculator page is present in `sitemap.xml` / `robots.txt` after `next-sitemap`.
(Article pages are auto-discovered; only calculator slugs need this manual entry.)

## 7. Verify
- `npm run build` then `ls out/calculators/<slug>` to confirm the page was generated.
- Search `out/sitemap.xml` (or run `next-sitemap`) for `/calculators/<slug>`.
