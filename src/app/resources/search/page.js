import { Container } from "@/components/container";
import { SearchExperience } from "@/components/search-experience";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Search",
  description:
    "Search Everyday Money Tools to quickly find calculators, guides, blog posts, and comparison pages for specific questions.",
  path: "/resources/search",
  robots: {
    index: false,
    follow: true
  }
});

export default function SearchPage() {
  return (
    <div className="pb-20">
      <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(254,226,226,0.95),_rgba(255,255,255,0.8)_45%,_rgba(255,247,237,0.9)_100%)] py-18">
        <Container>
          <div className="max-w-4xl space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-700">Search</p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              Search calculators, guides, blog posts, and comparison pages
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-700">
              Search the full site by topic, question, or keyword to jump directly into the tools and explanations that
              match what you are trying to figure out.
            </p>
          </div>
        </Container>
      </section>

      <Container className="space-y-10 pt-16">
        <SearchExperience />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-700">Try searches like</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["mortgage affordability", "debt payoff timeline", "how to save money", "renting vs buying"].map(
                (term) => (
                  <a
                    key={term}
                    href={`/resources/search/?q=${encodeURIComponent(term)}`}
                    className="rounded-full border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-red-300 hover:text-red-700"
                  >
                    {term}
                  </a>
                )
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-700">What is indexed</p>
            <p className="mt-4 text-sm leading-7 text-slate-700">
              Search covers calculator pages, educational guides, blog posts, comparison pages, and supporting content
              across the site.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-700">Result labels</p>
            <p className="mt-4 text-sm leading-7 text-slate-700">
              Results are labeled by page type so you can quickly tell whether a match is a calculator, a guide, a
              blog post, a compare page, or another resource.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
