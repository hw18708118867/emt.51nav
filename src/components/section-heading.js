export function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl space-y-3">
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4b665d]">{eyebrow}</p> : null}
      <h2 className="text-3xl font-semibold tracking-tight text-[#1d3128] sm:text-4xl">{title}</h2>
      {description ? <p className="text-lg leading-8 text-[#51675d]">{description}</p> : null}
    </div>
  );
}
