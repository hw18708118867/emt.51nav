import Link from "next/link";
import { Container } from "@/components/container";
import { getCalculatorsBySlugs } from "@/lib/calculator-registry";
import { FeatureCard } from "@/components/cards";
import { SectionHeading } from "@/components/section-heading";

export function ArticleShell({ article, sectionLabel, relatedArticles = [], relatedArticlesTitle = "More to read" }) {
  const relatedCalculators = getCalculatorsBySlugs(article.relatedCalculators || []);
  const Content = article.Content;

  return (
    <div className="pb-20">
      <section className="border-b border-[#d7dfde] bg-[radial-gradient(circle_at_top_left,_rgba(220,227,224,0.82),_rgba(248,250,249,0.94)_44%,_rgba(229,234,238,0.64)_100%)] py-18">
        <Container>
          <div className="max-w-4xl space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4b665d]">{sectionLabel}</p>
            <h1 className="text-4xl font-semibold tracking-tight text-[#1d3128] sm:text-6xl">{article.title}</h1>
            <p className="max-w-3xl text-lg leading-8 text-[#556a61]">{article.description}</p>
            <div className="flex flex-wrap gap-3 text-sm text-[#6f8178]">
              <span>{article.category}</span>
              <span>|</span>
              <span>{article.readingTime}</span>
              {article.publishedAt ? (
                <>
                  <span>|</span>
                  <span>Published {article.publishedAt}</span>
                </>
              ) : null}
              <span>|</span>
              <span>Updated {article.updatedAt}</span>
            </div>
          </div>
        </Container>
      </section>

      <Container className="grid gap-16 pt-16 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="max-w-3xl">
          {article.takeaway ? (
            <div className="mb-8 rounded-[2rem] border border-[#d8e1dd] bg-[#edf2f0] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4b665d]">Key takeaway</p>
              <p className="mt-3 text-lg leading-8 text-[#556a61]">{article.takeaway}</p>
            </div>
          ) : null}
          <Content />
        </article>

        <aside className="space-y-5">
          {(article.audience || article.publishedAt || article.updatedAt) ? (
            <div className="rounded-[2rem] border border-[#d7dfde] bg-[#fcfcfb] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4b665d]">At a glance</p>
              <div className="mt-4 space-y-4 text-sm leading-7 text-[#556a61]">
                {article.audience ? (
                  <div>
                    <p className="font-semibold text-[#1d3128]">Who this is for</p>
                    <p>{article.audience}</p>
                  </div>
                ) : null}
                {article.publishedAt ? (
                  <div>
                    <p className="font-semibold text-[#1d3128]">Published</p>
                    <p>{article.publishedAt}</p>
                  </div>
                ) : null}
                <div>
                  <p className="font-semibold text-[#1d3128]">Updated</p>
                  <p>{article.updatedAt}</p>
                </div>
                <div>
                  <p className="font-semibold text-[#1d3128]">Format</p>
                  <p>{article.readingTime}</p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="rounded-[2rem] border border-[#dce2e4] bg-[#f1f4f5] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4b665d]">Related calculators</p>
            <div className="mt-4 space-y-3">
              {relatedCalculators.map((calculator) => (
                <Link
                  key={calculator.slug}
                  href={`/calculators/${calculator.slug}/`}
                  className="block rounded-2xl border border-[#dde3e5] bg-[#fcfcfb] px-4 py-4 text-sm font-medium text-[#3f5950] transition hover:border-[#bec8ce] hover:text-[#556874]"
                >
                  {calculator.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </Container>

      <Container className="pt-18">
        <div className="grid gap-6 md:grid-cols-3">
          {relatedCalculators.slice(0, 3).map((calculator) => (
            <FeatureCard
              key={calculator.slug}
              href={`/calculators/${calculator.slug}/`}
              title={calculator.name}
              description={calculator.description}
              meta={calculator.category}
            />
          ))}
        </div>
      </Container>

      {relatedArticles.length ? (
        <Container className="space-y-8 pt-18">
          <SectionHeading
            eyebrow="Related reading"
            title={relatedArticlesTitle}
            description="If you want a little more context before deciding, these pages cover the next nearby question."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {relatedArticles.map((articleLink) => (
              <FeatureCard
                key={articleLink.href}
                href={articleLink.href}
                title={articleLink.title}
                description={articleLink.description}
                meta={articleLink.meta}
              />
            ))}
          </div>
        </Container>
      ) : null}
    </div>
  );
}
