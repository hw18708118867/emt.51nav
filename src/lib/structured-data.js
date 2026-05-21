import { absoluteAssetUrl, absoluteUrl } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

function normalizeList(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

export function buildWebsiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: absoluteUrl("/"),
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/resources/search")}?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function buildBreadcrumbStructuredData(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: normalizeList(items).map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}

export function buildFaqStructuredData(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: normalizeList(faqs).map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
}

export function buildArticleStructuredData({
  title,
  description,
  path,
  datePublished,
  dateModified,
  section,
  keywords = [],
  type = "Article",
  author = siteConfig.defaultAuthor
}) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    headline: title,
    description,
    url: absoluteUrl(path),
    mainEntityOfPage: absoluteUrl(path),
    inLanguage: "en-US",
    datePublished: datePublished || dateModified,
    dateModified,
    articleSection: section,
    keywords: normalizeList(keywords),
    image: absoluteAssetUrl(siteConfig.ogImagePath),
    author: {
      "@type": "Organization",
      name: author
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: absoluteUrl("/"),
      logo: {
        "@type": "ImageObject",
        url: absoluteAssetUrl(siteConfig.ogImagePath)
      }
    }
  };
}
