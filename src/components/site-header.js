import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/container";
import { HeaderSearchForm } from "@/components/header-search-form";
import { HeaderCalculatorMenu } from "@/components/calculator-navigation";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/90 bg-[#f6f8f7]/92 backdrop-blur">
      <Container className="flex h-18 items-center justify-between gap-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-ink-500 text-sm font-semibold text-white shadow-[0_10px_20px_-18px_rgba(49,72,65,0.42)]">
            <span className="absolute inset-x-0 bottom-0 h-1 bg-accent" />
            {siteConfig.abbreviation}
          </span>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-300">{siteConfig.brandLines[0]}</div>
            <div className="text-base font-semibold text-ink-700">{siteConfig.brandLines[1]}</div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/resources/search/"
            className="inline-flex rounded-full border border-line-strong px-4 py-2 text-sm font-medium text-ink-400 transition hover:border-ink-500 hover:text-ink-600 md:hidden"
          >
            Search
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <HeaderCalculatorMenu />
            {siteConfig.navigation
              .filter((item) => item.href !== "/calculators")
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-ink-300 transition hover:text-ink-600"
                >
                  {item.label}
                </Link>
              ))}
            <Link
              href="/resources/search/"
              className="rounded-full border border-line-strong px-4 py-2 text-sm font-medium text-ink-400 transition hover:border-ink-500 hover:text-ink-600"
            >
              Search
            </Link>
          </nav>

          <HeaderSearchForm />
        </div>
      </Container>
    </header>
  );
}
