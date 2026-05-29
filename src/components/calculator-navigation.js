"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { calculatorCategories, calculatorRegistry, getCalculatorsBySlugs, getFeaturedCalculators } from "@/lib/calculator-registry";

function categoryLinks() {
  return calculatorCategories.map((category) => ({
    ...category,
    calculators: getCalculatorsBySlugs(category.slugs)
  }));
}

export function HeaderCalculatorMenu() {
  const categories = categoryLinks();
  const pathname = usePathname();
  const detailsRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!detailsRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <details ref={detailsRef} open={isOpen} className="group relative" onToggle={(event) => setIsOpen(event.currentTarget.open)}>
      <summary className="flex list-none cursor-pointer items-center gap-2 text-sm font-medium text-[#51675f] transition hover:text-[#556874] [&::-webkit-details-marker]:hidden">
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

      <div className="invisible absolute left-1/2 top-full z-40 mt-4 w-[44rem] max-w-[calc(100vw-3rem)] -translate-x-1/2 rounded-[2rem] border border-[#d7dfde] bg-[#fcfcfb] p-6 opacity-0 shadow-[0_18px_42px_-34px_rgba(33,53,48,0.14)] transition duration-150 group-open:visible group-open:opacity-100">
        <div className="flex items-start justify-between gap-6 border-b border-[#dee4e2] pb-5">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4b665d]">Calculator menu</p>
            <p className="max-w-xl text-sm leading-6 text-[#5c6f66]">
              Jump straight into the tool you want instead of stopping at the category page first.
            </p>
          </div>
          <Link
            href="/calculators/"
            className="shrink-0 rounded-full border border-[#d0d9d8] px-4 py-2 text-sm font-medium text-[#3f5950] transition hover:border-[#8d9ca5] hover:text-[#556874]"
          >
            View all
          </Link>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {categories.map((category) => (
            <div key={category.title} className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4b665d]">{category.title}</p>
              <div className="space-y-2">
                {category.calculators.map((calculator) => (
                  <Link
                    key={calculator.slug}
                    href={`/calculators/${calculator.slug}/`}
                    className="block rounded-2xl border border-[#dbe2e5] bg-[#f8faf9] px-4 py-3 text-sm font-medium text-[#3a5048] transition hover:border-[#bec8ce] hover:bg-white hover:text-[#556874]"
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
    <div className="rounded-[2rem] border border-[#d7dfde] bg-[#fcfcfb]/96 p-5 shadow-[0_12px_28px_-26px_rgba(33,53,48,0.12)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4b665d]">Jump in faster</p>
          <p className="text-sm leading-6 text-[#5c6f66]">Open one of the most-used tools directly from the homepage.</p>
        </div>
        <Link
          href="/calculators/"
          className="text-sm font-semibold text-[#556874] transition hover:text-[#4b665d]"
        >
          All calculators
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {featuredCalculators.map((calculator) => (
          <Link
            key={calculator.slug}
            href={`/calculators/${calculator.slug}/`}
            className="rounded-full border border-[#d0d9d8] bg-[#f8faf9] px-4 py-2 text-sm font-medium text-[#3f5950] transition hover:border-[#bec8ce] hover:bg-white hover:text-[#556874]"
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
    <section className="space-y-6 rounded-[2rem] border border-[#d7dfde] bg-[#fcfcfb] p-6 shadow-[0_12px_30px_-30px_rgba(33,53,48,0.12)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4b665d]">Switch calculator</p>
          <h2 className="text-2xl font-semibold tracking-tight text-[#1d3128]">Move to the next tool without backing out</h2>
          <p className="max-w-3xl text-base leading-7 text-[#556a61]">
            {currentCalculator
              ? `You are in ${currentCalculator.name}. Pick another calculator below if you want to compare a nearby number or run the next step.`
              : "Pick another calculator below if you want to compare a nearby number or run the next step."}
          </p>
        </div>
        <Link
          href="/calculators/"
          className="rounded-full border border-[#d0d9d8] px-4 py-2 text-sm font-medium text-[#3f5950] transition hover:border-[#8d9ca5] hover:text-[#556874]"
        >
          Browse all
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {categories.map((category) => (
          <div key={category.title} className="rounded-[1.75rem] border border-[#dce2e4] bg-[#f1f4f5] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4b665d]">{category.title}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {category.calculators.map((calculator) => (
                <Link
                  key={calculator.slug}
                  href={`/calculators/${calculator.slug}/`}
                  className="rounded-full border border-[#e2e7e8] bg-[#fcfcfb] px-3 py-2 text-sm font-medium text-[#3f5950] transition hover:border-[#bec8ce] hover:text-[#556874]"
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
