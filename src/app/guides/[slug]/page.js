import { notFound } from "next/navigation";
import { ArticleShell } from "@/components/article-shell";
import { StructuredData } from "@/components/structured-data";
import { guideIndex, guides } from "@/lib/articles";
import { getCalculatorsBySlugs } from "@/lib/calculator-registry";
import { buildPageMetadata } from "@/lib/metadata";
import { buildArticleStructuredData, buildBreadcrumbStructuredData } from "@/lib/structured-data";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = guideIndex[slug];

  if (!article) {
    return {};
  }

  const relatedCalculatorNames = getCalculatorsBySlugs(article.relatedCalculators || []).map((calculator) => calculator.name);

  return {
    ...buildPageMetadata({
      title: article.title,
      description: article.description,
      path: `/guides/${article.slug}`,
      type: "article",
      publishedTime: article.publishedAt,
      updatedTime: article.updatedAt,
      keywords: [article.category, article.title, ...relatedCalculatorNames]
    })
  };
}

export default async function GuideArticlePage({ params }) {
  const { slug } = await params;
  const article = guideIndex[slug];

  if (!article) {
    notFound();
  }

  const relatedCalculatorNames = getCalculatorsBySlugs(article.relatedCalculators || []).map((calculator) => calculator.name);
  const breadcrumbStructuredData = buildBreadcrumbStructuredData([
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
    { name: article.title, path: `/guides/${article.slug}` }
  ]);
  const articleStructuredData = buildArticleStructuredData({
    title: article.title,
    description: article.description,
    path: `/guides/${article.slug}`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    section: article.category,
    keywords: [article.category, article.title, ...relatedCalculatorNames],
    type: "Article"
  });

  return (
    <>
      <StructuredData data={breadcrumbStructuredData} />
      <StructuredData data={articleStructuredData} />
      <ArticleShell article={article} sectionLabel="Guide" />
    </>
  );
}
