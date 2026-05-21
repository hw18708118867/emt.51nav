import { notFound } from "next/navigation";
import { ArticleShell } from "@/components/article-shell";
import { StructuredData } from "@/components/structured-data";
import { blogArticles, blogIndex } from "@/lib/articles";
import { getCalculatorsBySlugs } from "@/lib/calculator-registry";
import { buildPageMetadata } from "@/lib/metadata";
import { buildArticleStructuredData, buildBreadcrumbStructuredData } from "@/lib/structured-data";

export function generateStaticParams() {
  return blogArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = blogIndex[slug];

  if (!article) {
    return {};
  }

  const relatedCalculatorNames = getCalculatorsBySlugs(article.relatedCalculators || []).map((calculator) => calculator.name);

  return {
    ...buildPageMetadata({
      title: article.title,
      description: article.description,
      path: `/blog/${article.slug}`,
      type: "article",
      publishedTime: article.publishedAt,
      updatedTime: article.updatedAt,
      keywords: [article.category, article.title, ...relatedCalculatorNames]
    })
  };
}

export default async function BlogArticlePage({ params }) {
  const { slug } = await params;
  const article = blogIndex[slug];

  if (!article) {
    notFound();
  }

  const relatedCalculatorNames = getCalculatorsBySlugs(article.relatedCalculators || []).map((calculator) => calculator.name);
  const relatedArticles = blogArticles
    .filter((item) => item.slug !== article.slug)
    .sort((left, right) => {
      if (left.category === article.category && right.category !== article.category) {
        return -1;
      }

      if (left.category !== article.category && right.category === article.category) {
        return 1;
      }

      return 0;
    })
    .slice(0, 3)
    .map((item) => ({
      href: `/blog/${item.slug}/`,
      title: item.title,
      description: item.description,
      meta: item.category
    }));

  const breadcrumbStructuredData = buildBreadcrumbStructuredData([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: article.title, path: `/blog/${article.slug}` }
  ]);
  const articleStructuredData = buildArticleStructuredData({
    title: article.title,
    description: article.description,
    path: `/blog/${article.slug}`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    section: article.category,
    keywords: [article.category, article.title, ...relatedCalculatorNames],
    type: "BlogPosting"
  });

  return (
    <>
      <StructuredData data={breadcrumbStructuredData} />
      <StructuredData data={articleStructuredData} />
      <ArticleShell article={article} sectionLabel="Blog" relatedArticles={relatedArticles} relatedArticlesTitle="More from the blog" />
    </>
  );
}
