import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Contact",
  description: "Learn how to send feedback, correction requests, accessibility notes, or business inquiries related to the site.",
  path: "/contact"
});

const sections = [
  {
    title: "Reader feedback",
    body:
      "Questions, usability feedback, and suggestions for new tools or guides are useful. If you send a note, include the page you were using, what you expected, and what felt unclear or incomplete."
  },
  {
    title: "Corrections and factual updates",
    body:
      "If you spot an error in a calculator explanation, guide, or comparison page, include the page URL, the statement you think is wrong, and the source or reasoning behind the correction request."
  },
  {
    title: "Accessibility and technical issues",
    body:
      "If a page is hard to use with a screen reader, keyboard navigation, mobile browser, or a specific device, describe the issue and the environment where it happened. Accessibility and reliability problems should be treated as real product issues."
  },
  {
    title: "Business inquiries",
    body:
      "Partnership, licensing, or editorial collaboration requests should explain who is reaching out, what the request is, and what timeline matters. The site does not provide personal financial advice through contact requests."
  }
];

const contactNotes = [
  "Include the page URL when reporting a content or calculator issue.",
  "Describe the expected result and the result you actually saw.",
  "Avoid sending sensitive personal or financial information through general contact channels."
];

export default function ContactPage() {
  return (
    <div className="pb-20">
      <section className="border-b border-[#d7dfde] bg-[radial-gradient(circle_at_top_left,_rgba(220,227,224,0.82),_rgba(248,250,249,0.94)_44%,_rgba(229,234,238,0.64)_100%)] py-18">
        <Container>
          <SectionHeading
            eyebrow="Contact"
            title="Feedback, corrections, and business questions"
            description="This page explains the kinds of messages the site can handle and the details that make a request easier to review."
          />
        </Container>
      </section>

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
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4b665d]">Before you send a note</p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[#556a61]">
              {contactNotes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </aside>
      </Container>
    </div>
  );
}
