import { siteConfig } from "@/lib/site-config";

const monthIndex = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11
};

function normalizePath(path = "/") {
  if (!path || path === "/") {
    return "/";
  }

  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

function toIsoDate(value) {
  if (!value) {
    return undefined;
  }

  const plainDateMatch = String(value).match(/^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})$/);
  if (plainDateMatch) {
    const [, monthName, day, year] = plainDateMatch;
    const month = monthIndex[monthName];

    if (month !== undefined) {
      return new Date(Date.UTC(Number(year), month, Number(day))).toISOString();
    }
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

export function absoluteUrl(path = "/") {
  return new URL(normalizePath(path), `${siteConfig.domain}/`).toString();
}

export function absoluteAssetUrl(path = "/") {
  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  return new URL(withLeadingSlash, `${siteConfig.domain}/`).toString();
}

export function buildPageMetadata({
  title,
  description,
  path = "/",
  type = "website",
  robots,
  updatedTime,
  publishedTime,
  keywords,
  imagePath = siteConfig.ogImagePath,
  imageAlt
}) {
  const canonicalPath = normalizePath(path);
  const url = absoluteUrl(canonicalPath);
  const modifiedTime = toIsoDate(updatedTime);
  const publishedDate = toIsoDate(publishedTime);
  const socialImage = absoluteAssetUrl(imagePath);

  return {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: {
      canonical: canonicalPath
    },
    ...(robots ? { robots } : {}),
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: "en_US",
      type,
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: imageAlt || `${title} preview image`
        }
      ],
      ...(publishedDate ? { publishedTime: publishedDate } : {}),
      ...(modifiedTime ? { modifiedTime } : {})
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage]
    }
  };
}
