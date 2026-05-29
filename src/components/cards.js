import Link from "next/link";
import clsx from "clsx";

export function FeatureCard({ href, title, description, meta, accent = "red" }) {
  return (
    <Link
      href={href}
      className={clsx(
        "group rounded-[2rem] border bg-[#fcfcfb] p-6 shadow-[0_12px_32px_-30px_rgba(33,53,48,0.12)] transition hover:-translate-y-0.5 hover:border-[#bcc7cd] hover:shadow-[0_16px_38px_-28px_rgba(33,53,48,0.14)]",
        accent === "red" ? "border-[#dde4e8]" : "border-[#d7dfde]"
      )}
    >
      {meta ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4b665d]">{meta}</p> : null}
      <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#1d3128]">{title}</h3>
      <p className="mt-3 text-base leading-7 text-[#556a61]">{description}</p>
      <div className="mt-6 text-sm font-semibold text-[#556874]">Explore</div>
    </Link>
  );
}

export function StatCard({ label, value }) {
  return (
    <div className="rounded-[1.75rem] border border-[#d7dfde] bg-[#fcfcfb] p-5 shadow-[0_10px_24px_-28px_rgba(33,53,48,0.14)]">
      <p className="text-sm text-[#708178]">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-[#1d3128]">{value}</p>
    </div>
  );
}
