export function HeaderSearchForm() {
  return (
    <form action="/resources/search/" method="get" className="hidden items-center gap-2 lg:flex">
      <label className="sr-only" htmlFor="site-search">
        Search the site
      </label>
      <input
        id="site-search"
        name="q"
        type="search"
        placeholder="Search the site"
        className="w-56 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-950"
      />
      <button
        type="submit"
        className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        Go
      </button>
    </form>
  );
}
