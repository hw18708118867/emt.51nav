export function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl space-y-3">
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-700">{eyebrow}</p> : null}
      <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h2>
      {description ? <p className="text-lg leading-8 text-slate-700">{description}</p> : null}
    </div>
  );
}
