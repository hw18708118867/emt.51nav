import { Container } from "@/components/container";
import { FeatureCard } from "@/components/cards";
import { SectionHeading } from "@/components/section-heading";
import { resources } from "@/lib/articles";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Resources",
  description: "Use search, guide hubs, and comparison pages to move through the site more quickly.",
  path: "/resources"
});

export default function ResourcesPage() {
  return (
    <div className="pb-20">
      <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(254,226,226,0.95),_rgba(255,255,255,0.8)_45%,_rgba(255,247,237,0.9)_100%)] py-18">
        <Container>
          <SectionHeading
            eyebrow="Resources"
            title="Shortcuts for finding calculators, guides, and related topics"
            description="Use these pages to search the site, jump into key sections, and move between connected articles."
          />
        </Container>
      </section>

      <Container className="grid gap-6 pt-16 md:grid-cols-2 xl:grid-cols-3">
        {resources.map((resource) => (
          <FeatureCard
            key={resource.href}
            href={resource.href}
            title={resource.title}
            description={resource.description}
            meta="Resource"
          />
        ))}
      </Container>
    </div>
  );
}
