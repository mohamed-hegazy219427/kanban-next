"use client";

import { useSearchQuery } from "@/hooks/useSearchQuery";

export default function SearchBar() {
  const { search, setSearch } = useSearchQuery();

  return (
    <div className="form-control w-full group">
      <label className="input input-bordered w-full pr-12 bg-base-100 focus-within:input-primary focus-within:outline-offset-0 transition-all rounded-2xl font-black h-14 border-2 shadow-sm flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={24}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className=" text-primary group-focus-within:text-primary transition-colors shrink-0"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Quick search across tasks..."
          className="grow bg-transparent border-none outline-none placeholder:text-base-content/30"
        />
      </label>
    </div>
  );
}
