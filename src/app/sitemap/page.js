import Link from "next/link";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { guides, compareArticles, blogArticles } from "@/lib/articles";
import { calculatorRegistry } from "@/lib/calculator-registry";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Sitemap",
  description: "A full index of every calculator, guide, comparison, and article on Everyday Money Tools.",
  path: "/sitemap"
});

function Section({ title, items }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight text-content-strong">{title}</h2>
      <ul className="mt-5 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-lg text-content underline-offset-4 transition hover:text-content-strong hover:underline"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SitemapPage() {
  const calculatorItems = calculatorRegistry.map((c) => ({
    href: `/calculators/${c.slug}`,
    label: c.name
  }));
  const guideItems = guides.map((g) => ({
    href: `/guides/${g.slug}`,
    label: g.title
  }));
  const compareItems = compareArticles.map((c) => ({
    href: `/compare/${c.slug}`,
    label: c.title
  }));
  const blogItems = blogArticles.map((b) => ({
    href: `/blog/${b.slug}`,
    label: b.title
  }));

  return (
    <div className="pb-20">
      <section className="border-b border-[#d7dfde] bg-[radial-gradient(circle_at_top_left,_rgba(220,227,224,0.82),_rgba(248,250,249,0.94)_44%,_rgba(229,234,238,0.64)_100%)] py-18">
        <Container>
          <SectionHeading
            eyebrow="Sitemap"
            title="Every page on this site, in one place"
            description="Use this index to browse all calculators, guides, comparisons, and articles. It also helps search engines discover every page."
          />
        </Container>
      </section>

      <Container className="mt-16 space-y-14">
        <Section title={`Calculators (${calculatorItems.length})`} items={calculatorItems} />
        <Section title={`Guides (${guideItems.length})`} items={guideItems} />
        <Section title={`Comparisons (${compareItems.length})`} items={compareItems} />
        <Section title={`Articles (${blogItems.length})`} items={blogItems} />
        <p className="text-base text-content-muted">
          Looking for the machine-readable version? See{" "}
          <Link href="/sitemap.xml" className="underline underline-offset-4 hover:text-content-strong">
            sitemap.xml
          </Link>
          .
        </p>
      </Container>
    </div>
  );
}
