import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Privacy",
  description: "Read the privacy overview for the site, including how calculator inputs, site usage, and future integrations should be handled.",
  path: "/privacy"
});

const sections = [
  {
    title: "Calculator inputs",
    body:
      "The calculators on this site run in the browser. Values you enter are used to generate results on the page and should not be treated as account data, application data, or advice history."
  },
  {
    title: "Site usage data",
    body:
      "Like most websites, hosting providers may log standard technical information such as requests, browser details, or basic performance data. The site may also use analytics tools to measure visits, page views, referral sources, and general site usage patterns. That information is typically used to understand performance, content reach, and reliability rather than to build personal financial profiles."
  },
  {
    title: "Accounts and sensitive data",
    body:
      "The site does not require account creation to use its calculators and guides. Readers should avoid submitting sensitive personal, financial, tax, or identity information anywhere on the site unless a clearly labeled secure workflow is added in the future."
  },
  {
    title: "Analytics and future updates",
    body:
      "If analytics settings change, or if advertising, embedded forms, or other third-party services are added later, this privacy page should be updated so readers understand what changed, what data is involved, and what choices they have."
  }
];

const privacyNotes = [
  { label: "Accounts required", value: "No" },
  { label: "Calculator use", value: "Runs locally in the browser" },
  { label: "Analytics", value: "Basic traffic measurement may be used to understand visits and page performance" },
  { label: "Sensitive data", value: "Readers should avoid sending personal financial details through general forms or messages" }
];

export default function PrivacyPage() {
  return (
    <div className="pb-20">
      <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(254,226,226,0.95),_rgba(255,255,255,0.8)_45%,_rgba(255,247,237,0.9)_100%)] py-18">
        <Container>
          <SectionHeading
            eyebrow="Privacy"
            title="A simple privacy baseline for a static money tools site"
            description="This page explains how calculator use and basic site interactions should be understood from a privacy perspective."
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
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-700">Privacy at a glance</p>
            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
              {privacyNotes.map((item) => (
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
