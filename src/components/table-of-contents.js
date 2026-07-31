"use client";

import { useEffect, useRef, useState } from "react";

const HEADER_OFFSET = 96; // matches top-24, keeps TOC below the fixed site header

export function TableOfContents({ targetId = "article-content" }) {
  const ref = useRef(null);
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [top, setTop] = useState(HEADER_OFFSET);

  useEffect(() => {
    const root = document.getElementById(targetId);
    if (!root) return;

    const headings = Array.from(root.querySelectorAll("h2[id]"));
    setItems(headings.map((heading) => ({ id: heading.id, text: heading.textContent })));

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 }
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [targetId]);

  // Keep the floating TOC within the article column vertically: it stays next to
  // the Key takeaway (article top) and never floats up over the hero title area,
  // nor past the bottom of the article.
  useEffect(() => {
    const update = () => {
      const root = document.getElementById(targetId);
      const el = ref.current;
      if (!root || !el) return;

      const tocHeight = el.offsetHeight;
      const rect = root.getBoundingClientRect();

      let next = rect.top < HEADER_OFFSET ? HEADER_OFFSET : rect.top;

      // Bottom boundary: keep the TOC inside the article. Once the article ends,
      // the menu follows the article bottom upward so it never floats over the
      // related reading / footer area.
      const maxTop = rect.bottom - tocHeight - 16;
      if (next > maxTop) next = maxTop;

      setTop(next);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [targetId, items.length]);

  if (items.length === 0) return null;

  return (
    <div
      ref={ref}
      style={{ top }}
      className="fixed left-[max(1rem,calc((100vw-80rem)/2-15rem))] z-20 hidden w-56 xl:block"
    >
      <div className="rounded-[2rem] border border-line bg-surface/95 p-6 shadow-sm backdrop-blur">
        <nav aria-label="Table of contents" className="text-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-accent-strong">On this page</p>
          <ul className="space-y-1 border-l border-line">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`-ml-px block border-l-2 py-1 pl-4 transition ${
                    activeId === item.id
                      ? "border-accent font-semibold text-ink-900"
                      : "border-transparent text-content-muted hover:border-accent-line hover:text-content"
                  }`}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
