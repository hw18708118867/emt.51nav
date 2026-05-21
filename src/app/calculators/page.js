import { Container } from "@/components/container";
import { FeatureCard } from "@/components/cards";
import { SectionHeading } from "@/components/section-heading";
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
      <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(254,226,226,0.95),_rgba(255,255,255,0.8)_45%,_rgba(255,247,237,0.9)_100%)] py-18">
        <Container>
          <SectionHeading
            eyebrow="Calculator library"
            title="Money calculators organized around the decisions that tend to come up first"
            description="Find tools for questions about mortgage affordability, debt payoff timelines, savings goals, retirement growth, and emergency fund targets."
          />
        </Container>
      </section>

      <Container className="space-y-16 pt-16">
        {calculatorCategories.map((category) => (
          <section key={category.title} className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">{category.title}</h2>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {getCalculatorsBySlugs(category.slugs).map((calculator) => (
                <FeatureCard
                  key={calculator.slug}
                  href={`/calculators/${calculator.slug}`}
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
