---
name: write-blog-post
description: This skill should be used when adding a new blog post, guide, or comparison article to the emt.51nav site. It encodes the project file layout, slug and URL rules, the article registry in src/lib/articles.js, the sitemap fallback, the 800-word minimum, the required MDX section structure, and the safe internal-link slugs so a new article is fully wired, indexed, and on-brand.
---

# Write a blog / guide / compare article (emt.51nav)

Use this skill whenever the user asks to **add a new article**, **write a new
post**, **create a guide/comparison page**, or otherwise publish new MDX content
under `src/content/{blog,guides,compare}`.

## Mental model
The site is a Next.js static export. Article *content* lives as MDX in
`src/content/<type>/<slug>.mdx`. Article *metadata* (title, summary, dates,
tags, audience, related slugs) lives separately in `src/lib/articles.js` — there
is **no YAML frontmatter** in the MDX files. Rendering, the right-hand sticky
cards, related-article logic, and the left floating table of contents are all
driven by that registry. A new article is "live" only after it is registered
there AND its word count meets the minimum.

## Step-by-step procedure

### 1. Choose the type and slug
- `blog`   -> `src/content/blog/<slug>.mdx`   (URL `/blog/<slug>`)
- `guides` -> `src/content/guides/<slug>.mdx` (URL `/guides/<slug>`)
- `compare`-> `src/content/compare/<slug>.mdx`(URL `/compare/<slug>`)

Slug rules (see `references/slugs-and-links.md`):
- lowercase, hyphen-separated kebab-case; no spaces/underscores/trailing hyphen
- descriptive and **stable** — do not rename later (it changes the URL)

### 2. Write the MDX body
The MDX file must NOT contain frontmatter. Start directly with the H2 sections.
Required structure (keep this order; the left TOC auto-generates from H2 `id`s):

- `## Key takeaway` — one short paragraph: the single most useful thing to do.
- `## <Section 2: plain-language explainer>` — define the concept in direct,
  second-person, practical language. Use concrete numbers and short examples.
- `## <Section 3: worked example / numbers>` — show a small numeric example
  (e.g. a per-paycheck calculation) so the reader can copy the method.
- `## <Section 4: common mistake or edge case>` — what people get wrong.
- `## <Section 5: how to act / checklist>` — steps the reader can take today.
- `## Official references` (blog) — link only real official domains
  (irs.gov, ssa.gov, consumerfinance.gov, ftc.gov, fdic.gov, energystar.gov).
  Never fabricate a deep link; link the section root when unsure.
  (For `compare`/`guides`, end with `## Related next steps` instead.)

Style rules:
- Plain, direct, second-person English. No fluff, no AI filler.
- Wrap H2 section headings so the auto-TOC has clean anchor labels.
- Minimum **800 words**. Validate with the script in Step 4.
- Link internally ONLY to slugs listed in `references/slugs-and-links.md`
  (articles or calculators). Never invent a URL.

Optionally embed a calculator using the existing MDX component, e.g.
`<CalculatorCard slug="mortgage-calculator" />`, choosing a slug from the
verified calculator list. This also lets you surface it in the right rail via
`calculatorSlugs` in the registry entry (Step 3).

### 3. Register the article in `src/lib/articles.js`
Import the MDX and add an object to the correct array (`blogPosts`,
`guides`, or `comparePosts`). Copy the shape of an existing entry exactly:

```js
{
  slug: "<slug>",                       // must match the .mdx filename
  title: "<Human Title>",
  description: "<1-sentence SEO summary>",
  publishedAt: "Month DD, YYYY",        // real publish date
  updatedAt: "Month DD, YYYY",          // set = publishedAt for new posts
  tags: ["<topic>"],
  audience: "Who this helps",           // optional
  takeaway: "One actionable sentence shown in the Key takeaway card.",
  relatedSlugs: ["<other-article-slug>"], // 2-3 from the verified list
  calculatorSlugs: ["<calculator-slug>"], // optional; verified slugs only
  readingTime: "X min read",            // estimate ~200 wpm
  Content: lazy(() => import("@/content/<type>/<slug>.mdx")),
}
```

Keep `src/lib/articles.js` the single source of truth — listing pages, related
articles, the right-rail cards, and SEO all read from it.

### 4. Validate word count
Run the bundled checker (exit code 1 if below minimum):

```bash
node <skill>/scripts/wordcount.mjs src/content/<type>/<slug>.mdx 800
```

If it fails, expand the explainer/example/mistake sections until ≥ 800 words,
then re-run. Do not pad with filler.

### 5. Build and verify
```bash
npm run build
```
Confirm the build succeeds and the new URL appears under `out/<type>/<slug>/`.
Spot-check the HTML contains `<h2 id="...">` anchors (the left TOC depends on
them) and that `updatedAt` renders.

### 6. Sitemap / calculator fallback (only if adding a calculator)
Article pages are auto-discovered by next-sitemap. Calculator pages are added
via `next-sitemap.config.js` -> `additionalPaths` reading
`src/lib/calculator-slugs.json`. If a NEW calculator is introduced, add its slug
to BOTH `calculator-slugs.json` and `src/lib/calculator-registry.js`
(`calculatorCategories`). Article slugs need no sitemap change.

## Checklist before declaring done
- [ ] MDX file created at the correct `src/content/<type>/<slug>.mdx` path
- [ ] No YAML frontmatter in the MDX
- [ ] `## Key takeaway` present; H2 structure matches the required order
- [ ] Word count ≥ 800 (script passes)
- [ ] Internal links only use verified slugs; official refs are real domains
- [ ] Entry added to the correct array in `src/lib/articles.js` with `Content:
      lazy(() => import(...))` and `updatedAt` set
- [ ] `npm run build` succeeds; new URL present in `out/`
- [ ] (If new calculator) slug added to `calculator-slugs.json` +
      `calculator-registry.js`
