import Link from "next/link";
import clsx from "clsx";
import { CalculatorArt } from "@/components/calculator-art";

export function CalculatorCard({ slug, title, description, meta, className }) {
  return (
    <Link
      href={`/calculators/${slug}`}
      className={clsx(
        "group flex h-full flex-col rounded-[2rem] border border-line-strong bg-surface p-6 shadow-[0_14px_34px_-28px_rgba(33,53,48,0.28)] transition hover:-translate-y-1 hover:border-accent hover:shadow-[0_22px_46px_-26px_rgba(33,53,48,0.42)]",
        className
      )}
    >
      <div className="emt-float-soft mb-4 h-28 w-28">
        <CalculatorArt slug={slug} category={meta} />
      </div>
      {meta ? (
        <p className="inline-flex w-fit rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">
          {meta}
        </p>
      ) : null}
      <h3 className="mt-4 text-xl font-semibold leading-snug tracking-tight text-content-strong">{title}</h3>
      <p className="mt-3 text-base leading-7 text-content">{description}</p>
      <div className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-accent-strong transition group-hover:gap-2.5">
        <span className="border-b border-transparent group-hover:border-accent">Open calculator</span>
        <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 8h9M9 4.5 12.5 8 9 11.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  );
}

export function FeatureCard({ href, title, description, meta, className }) {
  return (
    <Link
      href={href}
      className={clsx(
        "group flex h-full flex-col rounded-[2rem] border border-line-strong bg-surface p-6 shadow-[0_14px_34px_-28px_rgba(33,53,48,0.28)] transition hover:-translate-y-1 hover:border-accent hover:shadow-[0_22px_46px_-26px_rgba(33,53,48,0.42)]",
        className
      )}
    >
      {meta ? (
        <p className="inline-flex w-fit rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">
          {meta}
        </p>
      ) : null}
      <h3 className="mt-4 text-xl font-semibold leading-snug tracking-tight text-content-strong">{title}</h3>
      <p className="mt-3 text-base leading-7 text-content">{description}</p>
      <div className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-accent-strong transition group-hover:gap-2.5">
        <span className="border-b border-transparent group-hover:border-accent">Explore</span>
        <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 8h9M9 4.5 12.5 8 9 11.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  );
}
