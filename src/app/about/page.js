import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { AboutArt } from "@/components/page-art";
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
      <PageHero
        eyebrow="About"
        title="A money site built for the questions people usually have before they take action"
        description="The site combines calculators, guides, and comparison pages so readers can move from a quick estimate to a clearer decision."
        art={<AboutArt />}
        band="bg-band-sage"
      />

      <Container className="grid gap-10 pt-16 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          {sections.map((section) => (
            <section key={section.title} className="max-w-4xl rounded-[2rem] border border-[#d7dfde] bg-[#fcfcfb] p-8 shadow-[0_12px_30px_-30px_rgba(33,53,48,0.12)]">
              <h2 className="text-2xl font-semibold tracking-tight text-[#1d3128]">{section.title}</h2>
              <p className="mt-4 text-lg leading-8 text-[#556a61]">{section.body}</p>
            </section>
          ))}
        </div>

        <aside className="space-y-5">
          <div className="rounded-[2rem] border border-[#dce2e4] bg-[#f1f4f5] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4b665d]">Quick facts</p>
            <div className="mt-4 space-y-4 text-sm leading-7 text-[#556a61]">
              {quickFacts.map((item) => (
                <div key={item.label}>
                  <p className="font-semibold text-[#1d3128]">{item.label}</p>
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
