import { Container } from "@/components/container";
import { FeatureCard } from "@/components/cards";
import { Reveal } from "@/components/reveal";
import { PageHero } from "@/components/page-hero";
import { GuidesArt } from "@/components/page-art";
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
    "mortgage guide",
    "sinking fund guide"
  ]
});

export default function GuidesPage() {
  return (
    <div className="pb-20">
      <PageHero
        eyebrow="Guides"
        title="Longer guides on saving, borrowing, and handling money day to day"
        description="These articles focus on the habits, tradeoffs, and decision points behind common money questions."
        art={<GuidesArt />}
        band="bg-band-mint"
      />

      <Container className="grid gap-6 pt-16 md:grid-cols-2 xl:grid-cols-3">
        {guides.map((guide, index) => (
          <Reveal key={guide.slug} delay={index * 70} className="h-full">
            <FeatureCard
              href={`/guides/${guide.slug}`}
              title={guide.title}
              description={guide.description}
              meta={guide.readingTime}
            />
          </Reveal>
        ))}
      </Container>
    </div>
  );
}
