import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { siteConfig } from "@/lib/site-config";
import { buildPageMetadata } from "@/lib/metadata";

const siteTitle = `${siteConfig.name} | Calculators, Guides, and Money Planning Tools`;
const googleSearchConsoleId = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const homeMetadata = buildPageMetadata({
  title: siteTitle,
  description: siteConfig.description,
  path: "/"
});

export const metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default: siteTitle,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: [
    "money tools",
    "financial calculators",
    "budget calculator",
    "mortgage calculator",
    "debt payoff calculator",
    "savings calculator",
    "personal finance guides"
  ],
  verification: googleSearchConsoleId
    ? {
        google: googleSearchConsoleId
      }
    : undefined,
  alternates: homeMetadata.alternates,
  openGraph: homeMetadata.openGraph,
  twitter: homeMetadata.twitter
};

export default function RootLayout({ children }) {
  const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <SiteHeader />
        <main data-pagefind-body>{children}</main>
        <SiteFooter />
      </body>
      {googleAnalyticsId ? <GoogleAnalytics gaId={googleAnalyticsId} /> : null}
    </html>
  );
}
