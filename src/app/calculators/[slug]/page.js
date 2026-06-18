import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { CalculatorForm } from "@/components/calculator-form";
import { FeatureCard } from "@/components/cards";
import { Reveal } from "@/components/reveal";
import { CalculatorArt } from "@/components/calculator-art";
import { StructuredData } from "@/components/structured-data";
import { getCalculatorBySlug, getCalculatorsBySlugs, calculatorRegistry } from "@/lib/calculator-registry";
import { buildPageMetadata } from "@/lib/metadata";
import { buildBreadcrumbStructuredData, buildFaqStructuredData } from "@/lib/structured-data";

export function generateStaticParams() {
  return calculatorRegistry.map((calculator) => ({ slug: calculator.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const calculator = getCalculatorBySlug(slug);

  if (!calculator) {
    return {};
  }

  return {
    ...buildPageMetadata({
      title: calculator.name,
      description: calculator.description,
      path: `/calculators/${calculator.slug}`,
      keywords: calculator.keywords,
      imagePath: calculator.ogImagePath,
      imageAlt: `${calculator.name} preview image`
    })
  };
}

export default async function CalculatorPage({ params }) {
  const { slug } = await params;
  const calculator = getCalculatorBySlug(slug);

  if (!calculator) {
    notFound();
  }

  const relatedCalculators = getCalculatorsBySlugs(calculator.related || []);
  const breadcrumbStructuredData = buildBreadcrumbStructuredData([
    { name: "Home", path: "/" },
    { name: "Calculators", path: "/calculators" },
    { name: calculator.name, path: `/calculators/${calculator.slug}` }
  ]);
  const faqStructuredData = buildFaqStructuredData(calculator.faqs);
  const categoryBands = {
    Mortgage: "bg-band-mint",
    Investing: "bg-band-sky",
    Debt: "bg-band-cream",
    "Income & Tax": "bg-band-sage",
    Retirement: "bg-band-sky",
    Savings: "bg-band-cream",
    Budgeting: "bg-band-sage"
  };
  const heroBand = categoryBands[calculator.category] || "bg-band-mint";

  return (
    <div className="pb-20">
      <StructuredData data={breadcrumbStructuredData} />
      <StructuredData data={faqStructuredData} />
      <section className={`border-b border-line ${heroBand}`}>
        <Container className="grid items-center gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <Reveal>
            <div className="max-w-2xl space-y-5">
              <p className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent-strong">
                {calculator.category}
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl xl:text-6xl">{calculator.name}</h1>
              <p className="text-lg leading-8 text-content">{calculator.description}</p>
              <p className="text-base leading-7 text-content-muted">{calculator.intro}</p>
            </div>
          </Reveal>
          <Reveal delay={120} className="hidden sm:block">
            <div className="mx-auto w-full max-w-xs lg:ml-auto lg:mr-0">
              <CalculatorArt slug={calculator.slug} category={calculator.category} />
            </div>
          </Reveal>
        </Container>
      </section>

      <Container className="space-y-18 pt-16">
        <CalculatorForm calculatorSlug={calculator.slug} />

        <section className="space-y-8">
          <SectionHeading
            eyebrow="How it works"
            title="What the result is showing you"
            description="These sections explain what the calculator measures, which assumptions matter most, and where the number can be misleading."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {calculator.sections.map((section) => (
              <div key={section.title} className="rounded-[2rem] border border-line bg-surface p-6 shadow-[0_12px_30px_-30px_rgba(33,53,48,0.12)]">
                <h2 className="text-2xl font-semibold tracking-tight text-content-strong">{section.title}</h2>
                <p className="mt-3 text-lg leading-8 text-content">{section.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently asked questions"
            description="Quick answers to the questions people ask most about this calculator."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {calculator.faqs.map((faq) => (
              <div key={faq.question} className="rounded-[2rem] border border-line bg-surface p-7 shadow-[0_12px_30px_-30px_rgba(33,53,48,0.12)]">
                <h2 className="text-xl font-semibold tracking-tight text-content-strong">{faq.question}</h2>
                <p className="mt-3 text-lg leading-8 text-content">{faq.answer}</p>
              </div>
            ))}
          </div>
          {calculator.keywords?.length ? (
            <div className="rounded-[2rem] border border-line bg-surface-muted p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-strong">People also search for</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {calculator.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-line-strong bg-surface px-3 py-1.5 text-sm text-content"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        <section className="space-y-8">
          <SectionHeading
            eyebrow="Related tools"
            title="Other tools that usually come next"
            description="Use these if you want to compare a connected cost, adjust the budget around it, or check the next step in the same decision."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {relatedCalculators.map((related) => (
              <FeatureCard
                key={related.slug}
                href={`/calculators/${related.slug}`}
                title={related.name}
                description={related.description}
                meta={related.category}
              />
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
