import { notFound } from "next/navigation";
import { ArticleShell } from "@/components/article-shell";
import { StructuredData } from "@/components/structured-data";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { compareArticles, compareIndex } from "@/lib/articles";
import { getCalculatorsBySlugs } from "@/lib/calculator-registry";
import { buildPageMetadata } from "@/lib/metadata";
import { buildArticleStructuredData, buildBreadcrumbStructuredData, buildFaqStructuredData } from "@/lib/structured-data";

export function generateStaticParams() {
  return compareArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = compareIndex[slug];

  if (!article) {
    return {};
  }

  const relatedCalculatorNames = getCalculatorsBySlugs(article.relatedCalculators || []).map((calculator) => calculator.name);

  return {
    ...buildPageMetadata({
      title: article.title,
      description: article.description,
      path: `/compare/${article.slug}`,
      type: "article",
      publishedTime: article.publishedAt,
      updatedTime: article.updatedAt,
      keywords: [article.category, article.title, "financial comparison", ...relatedCalculatorNames]
    })
  };
}

export default async function CompareArticlePage({ params }) {
  const { slug } = await params;
  const article = compareIndex[slug];

  if (!article) {
    notFound();
  }

  const relatedCalculatorNames = getCalculatorsBySlugs(article.relatedCalculators || []).map((calculator) => calculator.name);
  const breadcrumbStructuredData = buildBreadcrumbStructuredData([
    { name: "Home", path: "/" },
    { name: "Compare", path: "/compare" },
    { name: article.title, path: `/compare/${article.slug}` }
  ]);
  const articleStructuredData = buildArticleStructuredData({
    title: article.title,
    description: article.description,
    path: `/compare/${article.slug}`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    section: article.category,
    keywords: [article.category, article.title, "financial comparison", ...relatedCalculatorNames],
    type: "Article"
  });
  const faqStructuredData = buildFaqStructuredData(article.faqs);

  return (
    <>
      <StructuredData data={breadcrumbStructuredData} />
      <StructuredData data={articleStructuredData} />
      <StructuredData data={faqStructuredData} />
      <ArticleShell article={article} sectionLabel="Comparison" />
      {article.faqs?.length ? (
        <Container className="space-y-8 pt-4 pb-20">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently asked questions"
            description="Quick answers to the questions people ask most about this topic."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {article.faqs.map((faq) => (
              <div key={faq.question} className="rounded-[2rem] border border-line bg-surface p-7 shadow-[0_12px_30px_-30px_rgba(33,53,48,0.12)]">
                <h2 className="text-xl font-semibold tracking-tight text-content-strong">{faq.question}</h2>
                <p className="mt-3 text-lg leading-8 text-content">{faq.answer}</p>
              </div>
            ))}
          </div>
        </Container>
      ) : null}
    </>
  );
}
