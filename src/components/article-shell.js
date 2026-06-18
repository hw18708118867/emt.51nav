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
      <section className="border-b border-line bg-[radial-gradient(circle_at_top_left,_rgba(220,227,224,0.82),_rgba(248,250,249,0.94)_44%,_rgba(229,234,238,0.64)_100%)] py-18">
        <Container>
          <div className="max-w-4xl space-y-5">
            <p className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent-strong">{sectionLabel}</p>
            <h1 className="text-4xl font-semibold tracking-tight text-ink-900 sm:text-6xl">{article.title}</h1>
            <p className="max-w-3xl text-lg leading-8 text-content">{article.description}</p>
            <div className="flex flex-wrap gap-3 text-sm text-content-muted">
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
            <div className="mb-8 rounded-[2rem] border border-accent-line bg-accent-soft/60 p-6">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent-strong">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Key takeaway
              </p>
              <p className="mt-3 text-lg leading-8 text-content">{article.takeaway}</p>
            </div>
          ) : null}
          <Content />
        </article>

        <aside className="space-y-5">
          {(article.audience || article.publishedAt || article.updatedAt) ? (
            <div className="rounded-[2rem] border border-line bg-surface p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-strong">At a glance</p>
              <div className="mt-4 space-y-4 text-sm leading-7 text-content">
                {article.audience ? (
                  <div>
                    <p className="font-semibold text-content-strong">Who this is for</p>
                    <p>{article.audience}</p>
                  </div>
                ) : null}
                {article.publishedAt ? (
                  <div>
                    <p className="font-semibold text-content-strong">Published</p>
                    <p>{article.publishedAt}</p>
                  </div>
                ) : null}
                <div>
                  <p className="font-semibold text-content-strong">Updated</p>
                  <p>{article.updatedAt}</p>
                </div>
                <div>
                  <p className="font-semibold text-content-strong">Format</p>
                  <p>{article.readingTime}</p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="rounded-[2rem] border border-line bg-surface-muted p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-strong">Related calculators</p>
            <div className="mt-4 space-y-3">
              {relatedCalculators.map((calculator) => (
                <Link
                  key={calculator.slug}
                  href={`/calculators/${calculator.slug}/`}
                  className="block rounded-2xl border border-line-strong bg-surface px-4 py-4 text-sm font-medium text-ink-400 transition hover:border-accent hover:text-ink-600"
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
