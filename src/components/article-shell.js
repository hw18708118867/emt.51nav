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
      <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(254,226,226,0.95),_rgba(255,255,255,0.8)_45%,_rgba(255,247,237,0.9)_100%)] py-18">
        <Container>
          <div className="max-w-4xl space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-700">{sectionLabel}</p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">{article.title}</h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-700">{article.description}</p>
            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
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
            <div className="mb-8 rounded-[2rem] border border-red-100 bg-red-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-700">Key takeaway</p>
              <p className="mt-3 text-lg leading-8 text-slate-700">{article.takeaway}</p>
            </div>
          ) : null}
          <Content />
        </article>

        <aside className="space-y-5">
          {(article.audience || article.publishedAt || article.updatedAt) ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-700">At a glance</p>
              <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
                {article.audience ? (
                  <div>
                    <p className="font-semibold text-slate-950">Who this is for</p>
                    <p>{article.audience}</p>
                  </div>
                ) : null}
                {article.publishedAt ? (
                  <div>
                    <p className="font-semibold text-slate-950">Published</p>
                    <p>{article.publishedAt}</p>
                  </div>
                ) : null}
                <div>
                  <p className="font-semibold text-slate-950">Updated</p>
                  <p>{article.updatedAt}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-950">Format</p>
                  <p>{article.readingTime}</p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-700">Related calculators</p>
            <div className="mt-4 space-y-3">
              {relatedCalculators.map((calculator) => (
                <Link
                  key={calculator.slug}
                  href={`/calculators/${calculator.slug}/`}
                  className="block rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-medium text-slate-800 transition hover:border-red-300 hover:text-red-700"
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
