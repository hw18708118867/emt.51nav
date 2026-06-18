export function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl space-y-3">
      {eyebrow ? (
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent-strong">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-semibold tracking-tight text-content-strong sm:text-4xl">{title}</h2>
      {description ? <p className="text-lg leading-8 text-content">{description}</p> : null}
    </div>
  );
}
