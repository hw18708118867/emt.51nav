"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FeatureCard } from "@/components/cards";

const AUTOPLAY_MS = 6000;

/**
 * Lightweight, dependency-free carousel for feature cards.
 * Shows a responsive number of cards per page and auto-advances, with
 * pause on hover/focus, tab hidden, manual interaction, and reduced-motion.
 */
export function FeatureCarousel({ items, ariaLabel = "Featured guides" }) {
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(3);
  const [paused, setPaused] = useState(false);
  const regionRef = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const compute = () => {
      const width = window.innerWidth;
      if (width < 640) setPerPage(1);
      else if (width < 1024) setPerPage(2);
      else setPerPage(3);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const pageCount = Math.max(1, Math.ceil(items.length / perPage));

  useEffect(() => {
    if (page > pageCount - 1) setPage(0);
  }, [page, pageCount]);

  const go = useCallback(
    (next) => {
      setPage((current) => {
        if (next < 0) return pageCount - 1;
        if (next > pageCount - 1) return 0;
        return next;
      });
    },
    [pageCount]
  );

  // Auto-advance
  useEffect(() => {
    if (pageCount <= 1) return;
    if (pausedRef.current) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const id = setInterval(() => {
      if (!pausedRef.current) setPage((current) => (current + 1) % pageCount);
    }, AUTOPLAY_MS);

    return () => clearInterval(id);
  }, [pageCount]);

  // Pause when tab is hidden
  useEffect(() => {
    const onVisibility = () => {
      pausedRef.current = document.hidden ? true : paused;
      setPaused((p) => (document.hidden ? true : p));
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [paused]);

  const start = page * perPage;
  const visible = items.slice(start, start + perPage);

  const togglePause = () => {
    const next = !paused;
    pausedRef.current = next;
    setPaused(next);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        pausedRef.current = true;
        setPaused(true);
      }}
      onMouseLeave={() => {
        if (!paused) {
          pausedRef.current = false;
        }
      }}
      onFocusCapture={() => {
        pausedRef.current = true;
        setPaused(true);
      }}
      onBlurCapture={() => {
        if (!paused) {
          pausedRef.current = false;
        }
      }}
    >
      <div
        ref={regionRef}
        role="region"
        aria-label={ariaLabel}
        aria-roledescription="carousel"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visible.map((item) => (
          <FeatureCard
            key={item.slug}
            href={`/guides/${item.slug}`}
            title={item.title}
            description={item.description}
            meta={`${item.category} · ${item.readingTime}`}
          />
        ))}
      </div>

      {pageCount > 1 ? (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(page - 1)}
            aria-label="Previous featured guides"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line-strong bg-surface text-content-strong transition hover:border-accent hover:text-accent-strong"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M10 3.5 6.5 8 10 12.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: pageCount }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => go(index)}
                aria-label={`Go to featured page ${index + 1}`}
                aria-current={index === page ? "true" : undefined}
                className={
                  index === page
                    ? "h-2.5 w-2.5 rounded-full bg-accent-strong"
                    : "h-2.5 w-2.5 rounded-full bg-line-strong transition hover:bg-ink-400"
                }
              />
            ))}
          </div>

          <button
            type="button"
            onClick={togglePause}
            aria-label={paused ? "Resume autoplay" : "Pause autoplay"}
            aria-pressed={paused}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line-strong bg-surface text-content-strong transition hover:border-accent hover:text-accent-strong"
          >
            {paused ? (
              <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4" fill="currentColor">
                <path d="M4 3.5v9l8-4.5z" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4" fill="currentColor">
                <path d="M5 3.5h2v9H5zM9 3.5h2v9H9z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={() => go(page + 1)}
            aria-label="Next featured guides"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line-strong bg-surface text-content-strong transition hover:border-accent hover:text-accent-strong"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 3.5 9.5 8 6 12.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}
