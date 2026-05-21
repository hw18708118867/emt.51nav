import { Container } from "@/components/container";
import { FeatureCard } from "@/components/cards";
import { SectionHeading } from "@/components/section-heading";
import { blogArticles } from "@/lib/articles";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Money Blog With Practical Planning Updates and Financial Tips",
  description:
    "Read timely money articles on contribution limits, credit reports, FDIC insurance, inflation planning, tax withholding, and other everyday financial decisions.",
  path: "/blog",
  keywords: [
    "money blog",
    "personal finance articles",
    "retirement contribution limits",
    "credit report tips",
    "FDIC insurance",
    "inflation planning"
  ]
});

export default function BlogPage() {
  return (
    <div className="pb-20">
      <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(254,226,226,0.95),_rgba(255,255,255,0.8)_45%,_rgba(255,247,237,0.9)_100%)] py-18">
        <Container>
          <SectionHeading
            eyebrow="Blog"
            title="Shorter posts on current rules, timelines, and planning details"
            description="This section covers narrower money questions that sit between the calculators and the longer guides."
          />
        </Container>
      </section>

      <Container className="space-y-10 pt-16">
        <div className="max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-700">Now live</p>
          <p className="mt-4 text-lg leading-8 text-slate-700">
            These posts cover decisions people may need to act on soon, including contribution limits, credit-report
            checks, FDIC coverage basics, inflation adjustments, and withholding reviews.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {blogArticles.map((article) => (
            <FeatureCard
              key={article.slug}
              href={`/blog/${article.slug}/`}
              title={article.title}
              description={article.description}
              meta={article.category}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}
