import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Editorial Policy",
  description: "Read how the site handles calculator assumptions, educational content, updates, and correction standards.",
  path: "/editorial-policy"
});

const sections = [
  {
    title: "Editorial approach",
    body:
      "The goal is to publish clear money content that helps readers understand common decisions. The writing favors direct explanations, realistic tradeoffs, and examples that can be tested with the calculators rather than broad financial slogans."
  },
  {
    title: "Calculator assumptions",
    body:
      "Many calculators rely on simplified assumptions such as fixed interest rates, steady monthly contributions, or stable inflation. Those assumptions are useful for comparison and planning, but they are not predictions."
  },
  {
    title: "Content updates and corrections",
    body:
      "Pages should be reviewed when assumptions change, when a better explanation is available, or when readers identify factual issues. When a correction is made, accuracy matters more than preserving earlier wording."
  },
  {
    title: "Independence and reader trust",
    body:
      "Educational usefulness comes before monetization. If sponsorships, affiliate relationships, or promotional placements are added later, they should be clearly labeled so readers can distinguish editorial information from commercial content."
  }
];

const policyPoints = [
  { label: "Primary goal", value: "Clarity, usefulness, and realistic planning support" },
  { label: "Calculator role", value: "Decision-support estimates rather than predictions or guarantees" },
  { label: "Update trigger", value: "Better assumptions, clearer framing, or credible correction requests" }
];

export default function EditorialPolicyPage() {
  return (
    <div className="pb-20">
      <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(254,226,226,0.95),_rgba(255,255,255,0.8)_45%,_rgba(255,247,237,0.9)_100%)] py-18">
        <Container>
          <SectionHeading
            eyebrow="Editorial Policy"
            title="How the site handles assumptions, explanations, and updates"
            description="This policy explains how calculator outputs and educational content are framed, reviewed, and updated."
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
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-700">Policy summary</p>
            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
              {policyPoints.map((item) => (
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
