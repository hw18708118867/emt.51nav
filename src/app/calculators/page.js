import { Container } from "@/components/container";
import { CalculatorCard } from "@/components/cards";
import { PageHero } from "@/components/page-hero";
import { CalculatorsArt } from "@/components/page-art";
import { CategoryIcon } from "@/components/illustrations";
import { calculatorCategories, getCalculatorsBySlugs } from "@/lib/calculator-registry";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Financial Calculators for Budgeting, Debt, Savings, and Investing",
  description:
    "Browse financial calculators for compound interest, mortgages, loans, debt payoff, retirement planning, budgeting, savings goals, inflation, and net worth.",
  path: "/calculators",
  keywords: [
    "financial calculators",
    "budget calculator",
    "mortgage calculator",
    "loan calculator",
    "debt payoff calculator",
    "retirement calculator",
    "savings goal calculator"
  ]
});

export default function CalculatorsPage() {
  return (
    <div className="pb-20">
      <PageHero
        eyebrow="Calculator library"
        title="Every calculator, grouped by decision"
        description="Find tools for mortgage affordability, debt payoff timelines, savings goals, retirement growth, and emergency fund targets."
        art={<CalculatorsArt />}
        band="bg-band-sky"
      />

      <Container className="space-y-16 pt-16">
        {calculatorCategories.map((category) => (
          <section key={category.title} className="space-y-6">
            <h2 className="flex items-center gap-3 text-3xl font-semibold tracking-tight text-content-strong">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink-500 text-[#eef3f0]">
                <CategoryIcon category={category.title} />
              </span>
              {category.title}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {getCalculatorsBySlugs(category.slugs).map((calculator) => (
                <CalculatorCard
                  key={calculator.slug}
                  slug={calculator.slug}
                  title={calculator.name}
                  description={calculator.description}
                  meta={calculator.category}
                />
              ))}
            </div>
          </section>
        ))}
      </Container>
    </div>
  );
}
