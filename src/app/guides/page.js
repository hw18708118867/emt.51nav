import { Container } from "@/components/container";
import { FeatureCard } from "@/components/cards";
import { SectionHeading } from "@/components/section-heading";
import { guides } from "@/lib/articles";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Personal Finance Guides for Saving, Budgeting, Debt, and Housing",
  description:
    "Read personal finance guides on saving money, paying off debt, budgeting, building an emergency fund, and thinking through mortgage decisions.",
  path: "/guides",
  keywords: [
    "personal finance guides",
    "how to save money",
    "how to pay off debt",
    "budgeting for beginners",
    "emergency fund guide",
    "mortgage guide"
  ]
});

export default function GuidesPage() {
  return (
    <div className="pb-20">
      <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(254,226,226,0.95),_rgba(255,255,255,0.8)_45%,_rgba(255,247,237,0.9)_100%)] py-18">
        <Container>
          <SectionHeading
            eyebrow="Guides"
            title="Longer guides on saving, borrowing, and handling money day to day"
            description="These articles focus on the habits, tradeoffs, and decision points behind common money questions."
          />
        </Container>
      </section>

      <Container className="grid gap-6 pt-16 md:grid-cols-2 xl:grid-cols-3">
        {guides.map((guide) => (
          <FeatureCard
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            title={guide.title}
            description={guide.description}
            meta={guide.readingTime}
          />
        ))}
      </Container>
    </div>
  );
}
