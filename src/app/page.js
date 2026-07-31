import Link from "next/link";
import { Container } from "@/components/container";
import { FeatureCard } from "@/components/cards";
import { SectionHeading } from "@/components/section-heading";
import { StructuredData } from "@/components/structured-data";
import { Reveal } from "@/components/reveal";
import { CategoryArt, HeroArt } from "@/components/spot-art";
import { calculatorCategories, calculatorRegistry, getCalculatorsBySlugs, getFeaturedCalculators } from "@/lib/calculator-registry";
import { blogArticles, compareArticles, guides } from "@/lib/articles";
import { siteConfig } from "@/lib/site-config";
import { buildWebsiteStructuredData } from "@/lib/structured-data";

const heroStats = [
  { label: "Calculators", value: calculatorRegistry.length },
  { label: "Categories", value: calculatorCategories.length },
  { label: "Guides", value: guides.length },
  { label: "Articles & guides", value: guides.length + blogArticles.length + compareArticles.length }
];

export default function HomePage() {
  const featuredCalculators = getFeaturedCalculators();
  const websiteStructuredData = buildWebsiteStructuredData();

  return (
    <div>
      <StructuredData data={websiteStructuredData} />

      {/* HERO */}
      <section className="bg-band-mint">
        <Container className="grid items-center gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="space-y-7">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent-strong">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {siteConfig.hero.eyebrow}
            </p>
            <h1 className="text-5xl font-extrabold leading-[1.04] tracking-tight text-ink-900 sm:text-6xl xl:text-7xl">
              Make every money decision with confidence.
            </h1>
            <p className="max-w-xl text-xl leading-9 text-content">
              Free calculators and clear, no-jargon guides for mortgages, debt, investing, retirement, and savings.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/calculators/"
                className="rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-white shadow-[0_14px_30px_-14px_rgba(168,106,18,0.7)] transition hover:bg-accent-strong"
              >
                Explore calculators
              </Link>
              <Link
                href="/guides/"
                className="rounded-full border-2 border-ink-700 bg-transparent px-7 py-3.5 text-sm font-bold text-ink-700 transition hover:bg-ink-700 hover:text-white"
              >
                Read the guides
              </Link>
            </div>
            <dl className="flex flex-wrap gap-x-10 gap-y-4 pt-3">
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-content-muted">{stat.label}</dt>
                  <dd className="mt-1 text-3xl font-extrabold tracking-tight text-ink-900">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <HeroArt />
          </div>
        </Container>
      </section>

      {/* CATEGORIES */}
      <section className="bg-surface">
        <Container className="space-y-12 py-20">
          <Reveal>
            <SectionHeading eyebrow="Browse by topic" title="Pick the decision in front of you" />
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {calculatorCategories.map((category, index) => {
              const tools = getCalculatorsBySlugs(category.slugs);
              return (
                <Reveal key={category.title} delay={index * 70} className="h-full">
                  <div className="group flex h-full flex-col rounded-[2rem] border border-line-strong bg-surface p-7 shadow-[0_14px_34px_-28px_rgba(33,53,48,0.26)] transition hover:-translate-y-1 hover:border-accent hover:shadow-[0_24px_50px_-26px_rgba(33,53,48,0.4)]">
                    <div className="emt-float-soft h-24 w-24">
                      <CategoryArt category={category.title} />
                    </div>
                    <h3 className="mt-5 text-2xl font-bold tracking-tight text-content-strong">{category.title}</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {tools.map((calculator) => (
                        <Link
                          key={calculator.slug}
                          href={`/calculators/${calculator.slug}/`}
                          className="rounded-full border border-line-strong bg-surface-muted px-3 py-1.5 text-sm font-medium text-ink-400 transition hover:border-ink-500 hover:bg-ink-500 hover:text-white"
                        >
                          {calculator.name.replace(/ Calculator$/, "")}
                        </Link>
                      ))}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* POPULAR */}
      <section className="bg-band-cream">
        <Container className="space-y-12 py-20">
          <Reveal>
            <SectionHeading eyebrow="Most used" title="Popular calculators" />
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredCalculators.map((calculator, index) => (
              <Reveal key={calculator.slug} delay={index * 70} className="h-full">
                <FeatureCard
                  href={`/calculators/${calculator.slug}`}
                  title={calculator.name}
                  description={calculator.description}
                  meta={calculator.category}
                />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* GUIDES + COMPARE */}
      <section className="bg-surface">
        <Container className="grid gap-12 py-20 lg:grid-cols-2">
          <div className="space-y-8">
            <Reveal>
              <SectionHeading eyebrow="Guides" title="Go deeper after the math" />
            </Reveal>
            <div className="grid gap-5">
              {guides.slice(0, 3).map((guide, index) => (
                <Reveal key={guide.slug} delay={index * 70} className="h-full">
                  <FeatureCard
                    href={`/guides/${guide.slug}`}
                    title={guide.title}
                    description={guide.description}
                    meta={guide.readingTime}
                  />
                </Reveal>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <Reveal>
              <SectionHeading eyebrow="Compare" title="Two options, side by side" />
            </Reveal>
            <div className="grid gap-5">
              {compareArticles.map((article, index) => (
                <Reveal key={article.slug} delay={index * 70} className="h-full">
                  <FeatureCard
                    href={`/compare/${article.slug}`}
                    title={article.title}
                    description={article.description}
                    meta={article.category}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* BLOG */}
      <section className="bg-band-sage">
        <Container className="space-y-12 py-20">
          <Reveal>
            <SectionHeading eyebrow="From the blog" title="Latest posts" />
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {blogArticles.slice(0, 4).map((article, index) => (
              <Reveal key={article.slug} delay={index * 70} className="h-full">
                <FeatureCard
                  href={`/blog/${article.slug}/`}
                  title={article.title}
                  description={article.description}
                  meta={article.category}
                />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA BAND */}
      <section className="bg-surface-panel">
        <Container className="py-20">
          <Reveal>
            <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl space-y-3">
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Start with the number, then make the call.
                </h2>
                <p className="text-lg leading-8 text-[#bcd0c7]">
                  Run a quick calculation, compare a few scenarios, and read the context before you decide.
                </p>
              </div>
              <Link
                href="/calculators/"
                className="shrink-0 rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-white shadow-[0_14px_30px_-14px_rgba(168,106,18,0.7)] transition hover:bg-accent-bright"
              >
                Browse all calculators
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
