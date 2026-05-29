import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/container";
import { HeaderSearchForm } from "@/components/header-search-form";
import { HeaderCalculatorMenu } from "@/components/calculator-navigation";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#d7dfde]/90 bg-[#f6f8f7]/92 backdrop-blur">
      <Container className="flex h-18 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#314841] text-sm font-semibold text-white shadow-[0_10px_20px_-18px_rgba(49,72,65,0.42)]">
            {siteConfig.abbreviation}
          </span>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4b665d]">{siteConfig.brandLines[0]}</div>
            <div className="text-base font-semibold text-[#1d3128]">{siteConfig.brandLines[1]}</div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/resources/search/"
            className="inline-flex rounded-full border border-[#d0d9d8] px-4 py-2 text-sm font-medium text-[#3f5950] transition hover:border-[#8d9ca5] hover:text-[#556874] md:hidden"
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
                  className="text-sm font-medium text-[#51675f] transition hover:text-[#556874]"
                >
                  {item.label}
                </Link>
              ))}
            <Link
              href="/resources/search/"
              className="rounded-full border border-[#d0d9d8] px-4 py-2 text-sm font-medium text-[#3f5950] transition hover:border-[#8d9ca5] hover:text-[#556874]"
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
