import Link from "next/link";
import { Container } from "@/components/container";
import { FeatureCard, StatCard } from "@/components/cards";
import { CalculatorQuickStart } from "@/components/calculator-navigation";
import { SectionHeading } from "@/components/section-heading";
import { StructuredData } from "@/components/structured-data";
import { calculatorCategories, getCalculatorsBySlugs, getFeaturedCalculators } from "@/lib/calculator-registry";
import { blogArticles, compareArticles, guides } from "@/lib/articles";
import { siteConfig } from "@/lib/site-config";
import { buildWebsiteStructuredData } from "@/lib/structured-data";

export default function HomePage() {
  const featuredCalculators = getFeaturedCalculators();
  const websiteStructuredData = buildWebsiteStructuredData();

  return (
    <div className="pb-20">
      <StructuredData data={websiteStructuredData} />
      <section className="relative overflow-hidden border-b border-[#d7dfde] bg-[radial-gradient(circle_at_top_left,_rgba(220,227,224,0.82),_rgba(248,250,249,0.94)_44%,_rgba(229,234,238,0.64)_100%)]">
        <Container className="grid gap-14 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4b665d]">{siteConfig.hero.eyebrow}</p>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-[#1d3128] sm:text-7xl">
              {siteConfig.hero.title}
            </h1>
            <p className="max-w-2xl text-xl leading-9 text-[#556a61]">
              Check a payment, compare a few scenarios, or read the next step before you make a call on your budget,
              debt, savings, or housing plan.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/calculators/"
                className="rounded-full bg-[#314841] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#283c36]"
              >
                Explore calculators
              </Link>
              <Link
                href="/guides/"
                className="rounded-full border border-[#d0d9d8] bg-[#fcfcfb]/86 px-6 py-3 text-sm font-semibold text-[#3f5950] transition hover:border-[#8d9ca5] hover:text-[#556874]"
              >
                Read latest guides
              </Link>
            </div>
            <CalculatorQuickStart />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard label="Calculator topics" value="10 essential tools" />
            <StatCard label="Money guides" value="5 in-depth guides" />
            <StatCard label="Compare pages" value="3 side-by-side choices" />
            <StatCard label="Everyday focus" value="Budget, debt, saving" />
          </div>
        </Container>
      </section>

      <Container className="space-y-20 pt-18">
        <section className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow="Core categories"
            title="Three areas people come back to when the numbers need a second look"
            description="Start with the decision in front of you, whether that means building savings, paying down debt, or figuring out whether the monthly plan still works."
          />
          <div className="grid gap-4">
            {calculatorCategories.map((category) => (
              <div key={category.title} className="rounded-[2rem] border border-[#d7dfde] bg-[#fcfcfb] p-6 shadow-[0_12px_30px_-30px_rgba(33,53,48,0.12)]">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4b665d]">{category.title}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {getCalculatorsBySlugs(category.slugs).map((calculator) => (
                    <Link
                      key={calculator.slug}
                      href={`/calculators/${calculator.slug}/`}
                      className="rounded-full border border-[#d0d9d8] bg-[#f8faf9] px-3 py-2 text-sm font-medium text-[#3f5950] transition hover:border-[#bec8ce] hover:bg-white hover:text-[#556874]"
                    >
                      {calculator.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <SectionHeading
            eyebrow="Popular calculators"
            title="Popular tools for the questions that usually come first"
            description="Run the numbers from here, then use the page notes and related tools to see what the result actually means."
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredCalculators.map((calculator) => (
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

        <section className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-8">
            <SectionHeading
              eyebrow="Latest guides"
              title="Guides for the part that starts after the calculator"
              description="These longer reads cover saving, budgeting, debt payoff, and housing decisions in plain language."
            />
            <div className="grid gap-5">
              {guides.slice(0, 3).map((guide) => (
                <FeatureCard
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  title={guide.title}
                  description={guide.description}
                  meta={guide.readingTime}
                />
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <SectionHeading
              eyebrow="Compare"
              title="Side-by-side pages for choices that are easier to judge in one view"
              description="Compare tradeoffs before you commit to a payoff method, retirement account, or housing path."
            />
            <div className="grid gap-5">
              {compareArticles.map((article) => (
                <FeatureCard
                  key={article.slug}
                  href={`/compare/${article.slug}`}
                  title={article.title}
                  description={article.description}
                  meta={article.category}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <SectionHeading
            eyebrow="From the blog"
            title="Recent posts tied to current rules, limits, and planning questions"
            description="These shorter articles cover things like contribution limits, filing details, credit checks, and other smaller decisions that still affect the bigger plan."
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {blogArticles.slice(0, 4).map((article) => (
              <FeatureCard
                key={article.slug}
                href={`/blog/${article.slug}/`}
                title={article.title}
                description={article.description}
                meta={article.category}
              />
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
