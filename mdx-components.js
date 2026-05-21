import Link from "next/link";

function SmartLink({ href = "#", ...props }) {
  if (href.startsWith("/")) {
    return <Link href={href} {...props} />;
  }

  return <a href={href} rel="noreferrer" target="_blank" {...props} />;
}

export function useMDXComponents(components) {
  return {
    h2: (props) => <h2 className="mt-10 text-3xl font-semibold tracking-tight text-slate-950" {...props} />,
    h3: (props) => <h3 className="mt-8 text-2xl font-semibold tracking-tight text-slate-950" {...props} />,
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
