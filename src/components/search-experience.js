"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const bundlePath = `${basePath}/pagefind/`;
const stylesheetHref = `${bundlePath}pagefind-ui.css`;
const scriptSrc = `${bundlePath}pagefind-ui.js`;

function ensureStylesheet(href) {
  if (typeof document === "undefined") {
    return;
  }

  const existing = document.querySelector(`link[data-pagefind-ui="${href}"]`);
  if (existing) {
    return;
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.dataset.pagefindUi = href;
  document.head.appendChild(link);
}

function loadScript(src) {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Window is not available."));
  }

  if (window.PagefindUI) {
    return Promise.resolve(window.PagefindUI);
  }

  const existing = document.querySelector(`script[data-pagefind-ui-script="${src}"]`);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(window.PagefindUI), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Pagefind UI.")), { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.pagefindUiScript = src;
    script.onload = () => resolve(window.PagefindUI);
    script.onerror = () => reject(new Error("Failed to load Pagefind UI."));
    document.body.appendChild(script);
  });
}

function getInitialQuery() {
  if (typeof window === "undefined") {
    return "";
  }

  return new URLSearchParams(window.location.search).get("q")?.trim() || "";
}

function getResultTypeLabel(url = "") {
  if (url.includes("/calculators/")) {
    return "Calculator";
  }

  if (url.includes("/guides/")) {
    return "Guide";
  }

  if (url.includes("/compare/")) {
    return "Compare";
  }

  if (url.includes("/resources/")) {
    return "Resource";
  }

  if (url.includes("/blog/")) {
    return "Blog";
  }

  return "Page";
}

function updateQueryString(term) {
  if (typeof window === "undefined") {
    return;
  }

  const url = new URL(window.location.href);

  if (term) {
    url.searchParams.set("q", term);
  } else {
    url.searchParams.delete("q");
  }

  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

function triggerInitialSearch(rootElement, initialQuery) {
  if (!rootElement || !initialQuery) {
    return;
  }

  const searchInput = rootElement.querySelector(".pagefind-ui__search-input");
  if (!searchInput || searchInput.value === initialQuery) {
    return;
  }

  searchInput.value = initialQuery;
  searchInput.dispatchEvent(new Event("input", { bubbles: true }));
}

export function SearchExperience() {
  const rawId = useId();
  const elementId = useMemo(() => `pagefind-search-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`, [rawId]);
  const [status, setStatus] = useState("loading");
  const initializedRef = useRef(false);
  const searchRootRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function initializePagefind() {
      ensureStylesheet(stylesheetHref);

      try {
        const response = await fetch(`${bundlePath}pagefind-entry.json`, { method: "HEAD" });
        if (!response.ok) {
          throw new Error("Search index is not available yet.");
        }

        await loadScript(scriptSrc);

        if (cancelled || initializedRef.current || !window.PagefindUI) {
          return;
        }

        const initialQuery = getInitialQuery();
        initializedRef.current = true;

        new window.PagefindUI({
          element: `#${elementId}`,
          bundlePath,
          resetStyles: false,
          showImages: false,
          showSubResults: true,
          excerptLength: 22,
          pageSize: 6,
          focusOnSlash: true,
          processResult(result) {
            const typeLabel = getResultTypeLabel(result.url);
            result.meta = result.meta || {};
            result.meta.emtType = typeLabel;

            if (!result.meta.title && result.url) {
              result.meta.title = result.url;
            }

            if (result.meta.title && !result.meta.title.startsWith(`${typeLabel}: `)) {
              result.meta.title = `${typeLabel}: ${result.meta.title}`;
            }

            return result;
          },
          translations: {
            placeholder: "Search topics, questions, or tool names",
            clear_search: "Clear search",
            load_more: "Load more results",
            zero_results: "No matching pages found for [SEARCH_TERM]",
            searching: "Searching...",
            results_label: "Search results"
          }
        });

        window.setTimeout(() => {
          triggerInitialSearch(searchRootRef.current, initialQuery);
        }, 80);

        setStatus("ready");
      } catch (error) {
        if (!cancelled) {
          setStatus("unavailable");
        }
      }
    }

    initializePagefind();

    return () => {
      cancelled = true;
    };
  }, [elementId]);

  useEffect(() => {
    const rootElement = searchRootRef.current;
    if (!rootElement) {
      return undefined;
    }

    function handleInput(event) {
      const target = event.target;
      if (!target || !target.classList?.contains("pagefind-ui__search-input")) {
        return;
      }

      updateQueryString(target.value.trim());
    }

    rootElement.addEventListener("input", handleInput);

    return () => {
      rootElement.removeEventListener("input", handleInput);
    };
  }, []);

  return (
    <section className="space-y-5">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-5 sm:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-700">Site search</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Search across calculators, long-form guides, blog posts, and comparison pages from one place.
            </p>
          </div>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-600">
            {status === "loading" ? "Loading search" : status === "ready" ? "Search ready" : "Search index unavailable"}
          </div>
        </div>

        <div className="emt-search" id={elementId} ref={searchRootRef} />

        {status === "unavailable" ? (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-7 text-slate-700">
            Search is available after the Pagefind index has been generated. Run a fresh production build if you need
            to refresh search data locally.
          </div>
        ) : null}
      </div>
    </section>
  );
}
