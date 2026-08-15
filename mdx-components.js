import Link from "next/link";
import { CategoryArt, CategoryIcon, HeroGrowthChart } from "@/components/illustrations";

function SmartLink({ href = "#", ...props }) {
  if (href.startsWith("/")) {
    return <Link href={href} {...props} />;
  }

  return <a href={href} rel="noreferrer" target="_blank" {...props} />;
}

function slugify(node) {
  const text = getNodeText(node);
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function getNodeText(node) {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).join("");
  if (node && node.props && node.props.children) return getNodeText(node.props.children);
  return "";
}

export function useMDXComponents(components) {
  return {
    CategoryArt,
    CategoryIcon,
    HeroGrowthChart,
    // Inline illustration block: <Figure category="Retirement" caption="..." />
    Figure: ({ category, caption }) => (
      <figure className="my-10 flex flex-col items-center">
        <div className="w-full max-w-xs rounded-[2rem] border border-line bg-surface p-6 shadow-[0_18px_40px_-34px_rgba(33,53,48,0.2)]">
          <CategoryArt category={category} />
        </div>
        {caption ? (
          <figcaption className="mt-3 text-center text-sm text-slate-500">{caption}</figcaption>
        ) : null}
      </figure>
    ),
    h2: ({ children, ...props }) => (
      <h2
        id={slugify(children)}
        className="mt-10 scroll-mt-28 text-3xl font-semibold tracking-tight text-slate-950"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        id={slugify(children)}
        className="mt-8 scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950"
        {...props}
      >
        {children}
      </h3>
    ),
    p: (props) => <p className="mt-4 text-lg leading-8 text-slate-700" {...props} />,
    ul: (props) => <ul className="mt-4 list-disc space-y-2 pl-6 text-lg leading-8 text-slate-700" {...props} />,
    ol: (props) => <ol className="mt-4 list-decimal space-y-2 pl-6 text-lg leading-8 text-slate-700" {...props} />,
    li: (props) => <li className="pl-1" {...props} />,
    a: (props) => <SmartLink className="font-medium text-red-700 underline decoration-red-300 underline-offset-4" {...props} />,
    strong: (props) => <strong className="font-semibold text-slate-950" {...props} />,
    blockquote: (props) => (
      <blockquote
        className="mt-6 rounded-3xl border border-red-200 bg-red-50 px-6 py-5 text-lg italic text-slate-700"
        {...props}
      />
    ),
    ...components
  };
}
