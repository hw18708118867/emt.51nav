import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "About",
  description: "Learn what Everyday Money Tools covers, how the site is organized, and what readers can expect from the calculators and articles.",
  path: "/about"
});

const sections = [
  {
    title: "What Everyday Money Tools is",
    body:
      "Everyday Money Tools is a static personal finance site built around calculators, longer guides, and side-by-side comparison pages. It is meant for people who want to check the numbers, read a clear explanation, and move on without creating an account."
  },
  {
    title: "Who the site is for",
    body:
      "The site is for readers working through ordinary questions like how much house they can carry, how long debt payoff may take, how quickly savings might grow, or whether a monthly budget still has enough margin."
  },
  {
    title: "How to use the calculators well",
    body:
      "These tools work better when you test a few scenarios instead of trusting one neat-looking result. A change in rate, timeline, contribution, or payment can shift the outcome more than people expect."
  },
  {
    title: "What the site does not do",
    body:
      "Everyday Money Tools publishes educational material only. It does not provide personal financial, legal, tax, or investment advice, and it does not replace actual loan terms, account paperwork, or professional help."
  }
];

const quickFacts = [
  { label: "Site focus", value: "Budgeting, debt, savings, housing, and long-term planning" },
  { label: "Main formats", value: "Calculators, guides, and side-by-side comparisons" },
  { label: "Access model", value: "No account required" },
  { label: "Update style", value: "Pages are reviewed and refined as tools and content evolve" }
];

export default function AboutPage() {
  return (
    <div className="pb-20">
      <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(254,226,226,0.95),_rgba(255,255,255,0.8)_45%,_rgba(255,247,237,0.9)_100%)] py-18">
        <Container>
          <SectionHeading
            eyebrow="About"
            title="A money site built for the questions people usually have before they take action"
            description="The site combines calculators, guides, and comparison pages so readers can move from a quick estimate to a clearer decision."
          />
        </Container>
      </section>

      <Container className="grid gap-10 pt-16 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          {sections.map((section) => (
            <section key={section.title} className="max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{section.title}</h2>
              <p className="mt-4 text-lg leading-8 text-slate-700">{section.body}</p>
            </section>
          ))}
        </div>

        <aside className="space-y-5">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-700">Quick facts</p>
            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
              {quickFacts.map((item) => (
                <div key={item.label}>
                  <p className="font-semibold text-slate-950">{item.label}</p>
                  <p>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </Container>
    </div>
  );
}
