import "./globals.css";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { siteConfig } from "@/lib/site-config";
import { buildPageMetadata } from "@/lib/metadata";

const headingFont = localFont({
  src: "./fonts/InterVariable.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-heading"
});

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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
    other: [
      { rel: "icon", url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { rel: "icon", url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      { rel: "manifest", url: "/site.webmanifest" }
    ]
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
    <html lang="en" data-scroll-behavior="smooth" className={headingFont.variable}>
      <body>
        <SiteHeader />
        <main data-pagefind-body>{children}</main>
        <SiteFooter />
      </body>
      {googleAnalyticsId ? <GoogleAnalytics gaId={googleAnalyticsId} /> : null}
    </html>
  );
}
