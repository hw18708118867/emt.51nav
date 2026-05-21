import Link from "next/link";
import clsx from "clsx";

export function FeatureCard({ href, title, description, meta, accent = "red" }) {
  return (
    <Link
      href={href}
      className={clsx(
        "group rounded-[2rem] border bg-white p-6 shadow-[0_18px_60px_-30px_rgba(15,23,42,0.35)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_-28px_rgba(15,23,42,0.38)]",
        accent === "red" ? "border-red-100" : "border-slate-200"
      )}
    >
      {meta ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-700">{meta}</p> : null}
      <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{title}</h3>
      <p className="mt-3 text-base leading-7 text-slate-700">{description}</p>
      <div className="mt-6 text-sm font-semibold text-slate-950">Explore</div>
    </Link>
  );
}

export function StatCard({ label, value }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
    </div>
  );
}
