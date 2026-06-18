import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";

/* Shared hero band: heading on the left, a page-specific illustration on the right.
   Each page passes its own `art` and `band` so the section keeps a distinct feel. */
export function PageHero({ eyebrow, title, description, art, band = "bg-band-mint" }) {
  return (
    <section className={`border-b border-line ${band}`}>
      <Container className="grid items-center gap-10 py-16 lg:grid-cols-[1.08fr_0.92fr] lg:py-20">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        </Reveal>
        {art ? (
          <Reveal delay={120} className="hidden sm:block">
            <div className="mx-auto w-full max-w-md lg:ml-auto lg:mr-0">{art}</div>
          </Reveal>
        ) : null}
      </Container>
    </section>
  );
}
