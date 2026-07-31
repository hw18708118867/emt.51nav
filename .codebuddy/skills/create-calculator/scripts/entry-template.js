// TEMPLATE: copy this into src/lib/calculator-registry.js (inside calculatorRegistry = [...]),
// then edit the marked <EDIT> fields. Keep compute() pure and never throw.
{
  slug: "<topic>-calculator", // <EDIT> e.g. "savings-goal-calculator"
  title: "<Human Title>",     // <EDIT>
  description: "<One-sentence SEO summary>", // <EDIT>
  category: "Savings",        // <EDIT> one of: Mortgage, Debt, Income & Tax, Investing, Retirement, Savings, Budgeting
  intro: "<One or two sentences shown under the title.>", // <EDIT>
  ogImagePath: "/og/calculators/<topic>-calculator.svg",
  updatedAt: new Date().toISOString(),
  inputs: [
    { name: "amount", label: "Amount", prefix: "$", min: 0, step: 100 }, // <EDIT>
    // { name: "rate", label: "Annual rate", suffix: "%", min: 0, step: 0.1, max: 100 },
  ],
  advancedInputs: [
    // { name: "extra", label: "Extra monthly", prefix: "$", min: 0, step: 10 },
  ],
  compute: (inputs, advanced) => {
    const amount = Number(inputs.amount) || 0;
    // <EDIT> do the math with raw numbers; guard zero / empty.
    const result = amount; // placeholder
    const fmt = (n) => "$" + Math.round(n).toLocaleString("en-US");
    return {
      summary: [{ label: "Result", value: fmt(result), emphasis: true }],
      details: [{ label: "Amount entered", value: fmt(amount) }],
      // timeline / comparison / breakdown / amortizationTable / milestones / note optional
    };
  },
  relatedSlugs: [
    // ["<other-slug>", "<Label>"],  // <EDIT> verified slugs only
  ],
  faqs: [
    // { question: "<Q>", answer: "<A>" },
  ],
  extraSections: [
    // { heading: "How to use this", body: "..." },
  ],
  // disclaimer omits -> standard default is used
}
