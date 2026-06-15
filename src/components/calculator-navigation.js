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

export function CalculatorSwitchButton({ currentSlug }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-[#223832] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2c473f]"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M2.5 5h9L9 2.5M13.5 11h-9L7 13.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Switch calculator</span>
      </button>
      <CalculatorSwitchModal currentSlug={currentSlug} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function CalculatorSwitchModal({ currentSlug, open, onClose }) {
  const categories = categoryLinks();
  const currentCalculator = calculatorRegistry.find((calculator) => calculator.slug === currentSlug);
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(frame);
    }

    setShown(false);
    const timer = window.setTimeout(() => setMounted(false), 200);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-6">
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-[#10201b]/45 backdrop-blur-sm transition-opacity duration-200 ${shown ? "opacity-100" : "opacity-0"}`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Switch calculator"
        className={`relative z-10 my-auto w-full max-w-3xl rounded-[2rem] border border-[#d7dfde] bg-[#fcfcfb] p-6 shadow-[0_30px_80px_-32px_rgba(33,53,48,0.5)] transition duration-200 sm:p-8 ${
          shown ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
        style={{ transitionTimingFunction: shown ? "cubic-bezier(0.34, 1.56, 0.64, 1)" : "ease-in" }}
      >
        <div className="flex items-start justify-between gap-6 border-b border-[#dee4e2] pb-5">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4b665d]">Switch calculator</p>
            <p className="max-w-xl text-sm leading-6 text-[#5c6f66]">
              {currentCalculator
                ? `You are in ${currentCalculator.name}. Jump straight to another tool to compare a nearby number or run the next step.`
                : "Jump straight to another tool to compare a nearby number or run the next step."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-full border border-[#d0d9d8] p-2 text-[#3f5950] transition hover:border-[#8d9ca5] hover:text-[#556874]"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div key={category.title} className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4b665d]">{category.title}</p>
              <div className="flex flex-col gap-2">
                {category.calculators.map((calculator) => {
                  const isCurrent = calculator.slug === currentSlug;

                  if (isCurrent) {
                    return (
                      <span
                        key={calculator.slug}
                        aria-current="page"
                        className="rounded-2xl border border-[#c4d2cb] bg-[#e7efeb] px-4 py-3 text-sm font-semibold text-[#27413a]"
                      >
                        {calculator.name}
                        <span className="ml-2 text-xs font-medium uppercase tracking-[0.16em] text-[#5c7a6f]">Now</span>
                      </span>
                    );
                  }

                  return (
                    <Link
                      key={calculator.slug}
                      href={`/calculators/${calculator.slug}/`}
                      onClick={onClose}
                      className="rounded-2xl border border-[#dbe2e5] bg-[#f8faf9] px-4 py-3 text-sm font-medium text-[#3a5048] transition hover:border-[#bec8ce] hover:bg-white hover:text-[#556874]"
                    >
                      {calculator.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-[#dee4e2] pt-5 text-right">
          <Link
            href="/calculators/"
            onClick={onClose}
            className="text-sm font-semibold text-[#556874] transition hover:text-[#4b665d]"
          >
            Browse all calculators
          </Link>
        </div>
      </div>
    </div>
  );
}
