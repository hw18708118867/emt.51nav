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
      <section className="border-b border-[#d7dfde] bg-[radial-gradient(circle_at_top_left,_rgba(220,227,224,0.82),_rgba(248,250,249,0.94)_44%,_rgba(229,234,238,0.64)_100%)] py-18">
        <Container>
          <div className="max-w-4xl space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4b665d]">Search</p>
            <h1 className="text-4xl font-semibold tracking-tight text-[#1d3128] sm:text-6xl">
              Search calculators, guides, blog posts, and comparison pages
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-[#556a61]">
              Search the full site by topic, question, or keyword to jump directly into the tools and explanations that
              match what you are trying to figure out.
            </p>
          </div>
        </Container>
      </section>

      <Container className="space-y-10 pt-16">
        <SearchExperience />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-[#d7dfde] bg-[#fcfcfb] p-6 shadow-[0_12px_30px_-30px_rgba(33,53,48,0.12)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4b665d]">Try searches like</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["mortgage affordability", "debt payoff timeline", "how to save money", "renting vs buying"].map(
                (term) => (
                  <a
                    key={term}
                    href={`/resources/search/?q=${encodeURIComponent(term)}`}
                    className="rounded-full border border-[#d0d9d8] bg-[#f8faf9] px-3 py-2 text-sm font-medium text-[#3f5950] transition hover:border-[#bec8ce] hover:text-[#556874]"
                  >
                    {term}
                  </a>
                )
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#d7dfde] bg-[#fcfcfb] p-6 shadow-[0_12px_30px_-30px_rgba(33,53,48,0.12)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4b665d]">What is indexed</p>
            <p className="mt-4 text-sm leading-7 text-[#556a61]">
              Search covers calculator pages, educational guides, blog posts, comparison pages, and supporting content
              across the site.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#d7dfde] bg-[#fcfcfb] p-6 shadow-[0_12px_30px_-30px_rgba(33,53,48,0.12)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4b665d]">Result labels</p>
            <p className="mt-4 text-sm leading-7 text-[#556a61]">
              Results are labeled by page type so you can quickly tell whether a match is a calculator, a guide, a
              blog post, a compare page, or another resource.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
