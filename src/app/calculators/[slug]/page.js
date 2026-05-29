import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { CalculatorSwitcher } from "@/components/calculator-navigation";
import { SectionHeading } from "@/components/section-heading";
import { CalculatorForm } from "@/components/calculator-form";
import { FeatureCard } from "@/components/cards";
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

  return (
    <div className="pb-20">
      <StructuredData data={breadcrumbStructuredData} />
      <StructuredData data={faqStructuredData} />
      <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(254,226,226,0.95),_rgba(255,255,255,0.8)_45%,_rgba(255,247,237,0.9)_100%)] py-18">
        <Container>
          <div className="max-w-4xl space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-700">{calculator.category}</p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">{calculator.name}</h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-700">{calculator.description}</p>
            <p className="max-w-3xl text-base leading-7 text-slate-600">{calculator.intro}</p>
          </div>
        </Container>
      </section>

      <Container className="space-y-18 pt-16">
        <CalculatorSwitcher currentSlug={calculator.slug} />

        <CalculatorForm calculatorSlug={calculator.slug} />

        <section className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <SectionHeading
            eyebrow="How it works"
            title="What the result is showing you"
            description="These sections explain what the calculator measures, which assumptions matter most, and where the number can be misleading."
          />
          <div className="space-y-6">
            {calculator.sections.map((section) => (
              <div key={section.title} className="rounded-[2rem] border border-slate-200 bg-white p-6">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{section.title}</h2>
                <p className="mt-3 text-lg leading-8 text-slate-700">{section.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-red-100 bg-red-50 p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-700">Common questions</p>
            <ul className="mt-4 space-y-3 text-lg leading-8 text-slate-700">
              {calculator.keywords.map((keyword) => (
                <li key={keyword}>{keyword}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-700">Frequently asked questions</p>
            <div className="mt-4 space-y-5">
              {calculator.faqs.map((faq) => (
                <div key={faq.question} className="border-b border-slate-200 pb-5 last:border-b-0 last:pb-0">
                  <h2 className="text-xl font-semibold tracking-tight text-slate-950">{faq.question}</h2>
                  <p className="mt-2 text-lg leading-8 text-slate-700">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
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
