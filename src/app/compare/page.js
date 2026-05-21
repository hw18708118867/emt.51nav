import { Container } from "@/components/container";
import { FeatureCard } from "@/components/cards";
import { SectionHeading } from "@/components/section-heading";
import { compareArticles } from "@/lib/articles";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Financial Comparison Guides for Debt, Retirement, and Housing Choices",
  description:
    "Compare common financial decisions like Roth vs Traditional IRA, debt snowball vs avalanche, and renting vs buying with side-by-side guidance.",
  path: "/compare",
  keywords: [
    "financial comparison guides",
    "Roth vs Traditional IRA",
    "debt snowball vs avalanche",
    "renting vs buying",
    "compare financial choices"
  ]
});

export default function ComparePage() {
  return (
    <div className="pb-20">
      <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(254,226,226,0.95),_rgba(255,255,255,0.8)_45%,_rgba(255,247,237,0.9)_100%)] py-18">
        <Container>
          <SectionHeading
            eyebrow="Compare"
            title="Side-by-side guides for choices that make more sense when the tradeoffs sit next to each other"
            description="Review the upside, downside, and planning impact of common money decisions before you commit."
          />
        </Container>
      </section>

      <Container className="grid gap-6 pt-16 md:grid-cols-2 xl:grid-cols-3">
        {compareArticles.map((article) => (
          <FeatureCard
            key={article.slug}
            href={`/compare/${article.slug}`}
            title={article.title}
            description={article.description}
            meta={article.category}
          />
        ))}
      </Container>
    </div>
  );
}
