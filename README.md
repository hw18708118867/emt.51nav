# Finance Tools

Static, SEO-oriented finance site built with Next.js App Router, static export, Tailwind CSS, MDX, next-sitemap, and Pagefind.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The build outputs a pure static site in `out/`.

## GitHub Pages

For a project site, set:

```bash
NEXT_PUBLIC_SITE_URL=https://<user>.github.io/<repo>
NEXT_PUBLIC_BASE_PATH=/<repo>
```

If you publish as a user site (`<user>.github.io`) or use a custom domain, leave `NEXT_PUBLIC_BASE_PATH` empty.

## Content model

- `src/app`: route structure
- `src/content`: MDX editorial content
- `src/lib/calculator-registry.js`: tool definitions and formulas
- `src/lib/articles.js`: guide and comparison metadata

Add new tools by extending the calculator registry. Add new editorial pages by creating MDX files and registering them in `src/lib/articles.js`.
