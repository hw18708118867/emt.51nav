import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/container";
import { HeaderSearchForm } from "@/components/header-search-form";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <Container className="flex h-18 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
            {siteConfig.abbreviation}
          </span>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-red-700">{siteConfig.brandLines[0]}</div>
            <div className="text-base font-semibold text-slate-950">{siteConfig.brandLines[1]}</div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/resources/search/"
            className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950 md:hidden"
          >
            Search
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-700 transition hover:text-slate-950"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/resources/search/"
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
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
