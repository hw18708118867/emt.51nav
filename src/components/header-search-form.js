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
        className="w-56 rounded-full border border-[#d0d9d8] bg-[#fcfcfb] px-4 py-2 text-sm text-[#31433d] outline-none transition placeholder:text-[#7b887f] focus:border-[#8d9ca5]"
      />
      <button
        type="submit"
        className="rounded-full bg-[#314841] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#283c36]"
      >
        Go
      </button>
    </form>
  );
}
