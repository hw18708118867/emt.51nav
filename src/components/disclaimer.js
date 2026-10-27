const COPY = {
  general:
    "This page is for general education only. It is not personalized financial, tax, or legal advice. The figures are estimates based on the assumptions you enter, and rules can change—confirm the details with a qualified professional before making a decision.",
  tax:
    "Tax figures, brackets, and thresholds shown here are summaries for education. They are not tax advice. Rules change and your situation is unique—verify against current IRS guidance or a tax professional before filing.",
  investment:
    "Investing involves risk, including the possible loss of principal. This content is educational and is not investment advice or a recommendation for any specific product. Assumed or past returns do not guarantee future results.",
  insurance:
    "Insurance needs are personal. This tool and its explanations are educational only and are not a recommendation to buy or skip any policy. Coverage, pricing, and rules vary—review the actual policy terms and talk with a licensed agent before deciding."
};

export function disclaimerVariantForCategory(category) {
  if (!category) {
    return "general";
  }

  if (/tax/i.test(category)) {
    return "tax";
  }

  if (/invest|retire/i.test(category)) {
    return "investment";
  }

  if (/insur/i.test(category)) {
    return "insurance";
  }

  return "general";
}

export function Disclaimer({ variant = "general", className = "" }) {
  const copy = COPY[variant] || COPY.general;

  return (
    <aside
      className={`rounded-[2rem] border border-line bg-surface-muted p-5 text-sm leading-7 text-content-muted ${className}`}
    >
      <p className="flex items-start gap-2">
        <span aria-hidden="true" className="mt-0.5 shrink-0 font-semibold uppercase tracking-[0.18em] text-accent-strong">
          Note
        </span>
        <span>{copy}</span>
      </p>
    </aside>
  );
}
