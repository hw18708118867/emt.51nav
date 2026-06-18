import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { ContactArt } from "@/components/page-art";
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
      <PageHero
        eyebrow="Contact"
        title="Feedback, corrections, and business questions"
        description="This page explains the kinds of messages the site can handle and the details that make a request easier to review."
        art={<ContactArt />}
        band="bg-band-mint"
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
          <div className="rounded-[2rem] border border-[#d7dfde] bg-[#223832] p-6 text-white shadow-[0_18px_42px_-30px_rgba(34,56,50,0.34)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b8cbc3]">Email us</p>
            <a
              href="mailto:miraclehuang611@gmail.com"
              className="mt-3 inline-flex items-center gap-2 text-lg font-semibold tracking-tight text-white underline decoration-[#e0992c] decoration-2 underline-offset-4 transition hover:text-[#f4d9a8]"
            >
              miraclehuang611@gmail.com
            </a>
            <p className="mt-3 text-sm leading-7 text-[#c4d2db]">
              The fastest way to send feedback, a correction, or a business inquiry. We read every message, though we cannot reply to all of them.
            </p>
          </div>
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
