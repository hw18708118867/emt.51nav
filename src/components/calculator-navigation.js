import Link from "next/link";
import { calculatorCategories, calculatorRegistry, getCalculatorsBySlugs, getFeaturedCalculators } from "@/lib/calculator-registry";

function categoryLinks() {
  return calculatorCategories.map((category) => ({
    ...category,
    calculators: getCalculatorsBySlugs(category.slugs)
  }));
}

export function HeaderCalculatorMenu() {
  const categories = categoryLinks();

  return (
    <details className="group relative">
      <summary className="flex list-none cursor-pointer items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-slate-950 [&::-webkit-details-marker]:hidden">
        <span>Calculators</span>
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className="h-3.5 w-3.5 transition group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M4 6.5 8 10l4-3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>

      <div className="invisible absolute left-1/2 top-full z-40 mt-4 w-[44rem] max-w-[calc(100vw-3rem)] -translate-x-1/2 rounded-[2rem] border border-slate-200 bg-white p-6 opacity-0 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.35)] transition duration-150 group-open:visible group-open:opacity-100">
        <div className="flex items-start justify-between gap-6 border-b border-slate-200 pb-5">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-700">Calculator menu</p>
            <p className="max-w-xl text-sm leading-6 text-slate-600">
              Jump straight into the tool you want instead of stopping at the category page first.
            </p>
          </div>
          <Link
            href="/calculators/"
            className="shrink-0 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 transition hover:border-slate-950 hover:text-slate-950"
          >
            View all
          </Link>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {categories.map((category) => (
            <div key={category.title} className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-700">{category.title}</p>
              <div className="space-y-2">
                {category.calculators.map((calculator) => (
                  <Link
                    key={calculator.slug}
                    href={`/calculators/${calculator.slug}/`}
                    className="block rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-800 transition hover:border-red-300 hover:text-red-700"
                  >
                    {calculator.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </details>
  );
}

export function CalculatorQuickStart() {
  const featuredCalculators = getFeaturedCalculators();

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.5)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-700">Jump in faster</p>
          <p className="text-sm leading-6 text-slate-600">Open one of the most-used tools directly from the homepage.</p>
        </div>
        <Link
          href="/calculators/"
          className="text-sm font-semibold text-slate-900 transition hover:text-red-700"
        >
          All calculators
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {featuredCalculators.map((calculator) => (
          <Link
            key={calculator.slug}
            href={`/calculators/${calculator.slug}/`}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 transition hover:border-red-400 hover:text-red-700"
          >
            {calculator.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function CalculatorSwitcher({ currentSlug }) {
  const categories = categoryLinks().map((category) => ({
    ...category,
    calculators: category.calculators.filter((calculator) => calculator.slug !== currentSlug)
  }));
  const currentCalculator = calculatorRegistry.find((calculator) => calculator.slug === currentSlug);

  return (
    <section className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-700">Switch calculator</p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Move to the next tool without backing out</h2>
          <p className="max-w-3xl text-base leading-7 text-slate-700">
            {currentCalculator
              ? `You are in ${currentCalculator.name}. Pick another calculator below if you want to compare a nearby number or run the next step.`
              : "Pick another calculator below if you want to compare a nearby number or run the next step."}
          </p>
        </div>
        <Link
          href="/calculators/"
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 transition hover:border-slate-950 hover:text-slate-950"
        >
          Browse all
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {categories.map((category) => (
          <div key={category.title} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-700">{category.title}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {category.calculators.map((calculator) => (
                <Link
                  key={calculator.slug}
                  href={`/calculators/${calculator.slug}/`}
                  className="rounded-full border border-white bg-white px-3 py-2 text-sm font-medium text-slate-800 transition hover:border-red-300 hover:text-red-700"
                >
                  {calculator.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
