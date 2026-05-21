import { notFound } from "next/navigation";
import { ArticleShell } from "@/components/article-shell";
import { StructuredData } from "@/components/structured-data";
import { compareArticles, compareIndex } from "@/lib/articles";
import { getCalculatorsBySlugs } from "@/lib/calculator-registry";
import { buildPageMetadata } from "@/lib/metadata";
import { buildArticleStructuredData, buildBreadcrumbStructuredData } from "@/lib/structured-data";

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

  return (
    <>
      <StructuredData data={breadcrumbStructuredData} />
      <StructuredData data={articleStructuredData} />
      <ArticleShell article={article} sectionLabel="Comparison" />
    </>
  );
}
