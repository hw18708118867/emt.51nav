import Link from "next/link";

export function Breadcrumb({ items = [], className = "" }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.path}-${item.name}`} className="flex items-center gap-x-2">
              {isLast ? (
                <span aria-current="page" className="font-medium text-ink-700">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link
                    href={item.path}
                    className="text-ink-400 transition-colors hover:text-accent-strong"
                  >
                    {item.name}
                  </Link>
                  <span aria-hidden="true" className="text-ink-400">
                    ›
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
