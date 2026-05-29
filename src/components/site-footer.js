import Link from "next/link";
import { Container } from "@/components/container";
import { blogArticles } from "@/lib/articles";
import { getCalculatorsBySlugs } from "@/lib/calculator-registry";
import { siteConfig } from "@/lib/site-config";

const exploreLinks = [
  { href: "/calculators", label: "Calculators" },
  { href: "/guides", label: "Guides" },
  { href: "/compare", label: "Compare" },
  { href: "/resources", label: "Resources" },
  { href: "/blog", label: "Blog" }
];

const companyLinks = [
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
  { href: "/editorial-policy/", label: "Editorial Policy" },
  { href: "/privacy/", label: "Privacy" }
];

export function SiteFooter() {
  const popularCalculators = getCalculatorsBySlugs([
    "compound-interest-calculator",
    "mortgage-calculator",
    "budget-calculator",
    "debt-payoff-calculator"
  ]);

  return (
    <footer className="border-t border-[#d7dfde] bg-[#223832] text-[#d6dcd9]">
      <Container className="grid gap-10 py-14 xl:grid-cols-[1.2fr_0.75fr_0.85fr_0.8fr_1fr]">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b8cbc3]">{siteConfig.name}</p>
          <h2 className="max-w-xl text-2xl font-semibold text-white">
            Money tools and readable guidance for the decisions people run into all the time.
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-[#a7b7af]">
            Use these calculators and guides to estimate payments, model savings growth, compare options, and read a
            little context before making the next call.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Explore</p>
          <div className="mt-4 grid gap-3">
            {exploreLinks.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Popular calculators</p>
          <div className="mt-4 grid gap-3">
            {popularCalculators.map((item) => (
              <Link
                key={item.slug}
                href={`/calculators/${item.slug}/`}
                className="text-sm transition hover:text-white"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Site information</p>
          <div className="mt-4 grid gap-3">
            {companyLinks.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Latest blog posts</p>
          <div className="mt-4 grid gap-3">
            {blogArticles.slice(0, 3).map((item) => (
              <Link key={item.slug} href={`/blog/${item.slug}/`} className="text-sm transition hover:text-white">
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </Container>

      <Container className="border-t border-white/10 py-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <p className="text-xs leading-6 text-[#8fa099]">
            {siteConfig.name} publishes educational calculators and money content for informational purposes only. It is
            not financial, tax, investment, or legal advice.
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-[#8fa099]">
            <Link href="/calculators/" className="transition hover:text-white">
              All calculators
            </Link>
            <Link href="/about/" className="transition hover:text-white">
              About
            </Link>
            <Link href="/privacy/" className="transition hover:text-white">
              Privacy
            </Link>
            <Link href="/resources/search/" className="transition hover:text-white">
              Search
            </Link>
            <span>Updated May 2026</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
