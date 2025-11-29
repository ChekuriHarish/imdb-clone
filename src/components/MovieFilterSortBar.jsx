import React from "react";

export default function MovieFilterSortBar({
  yearFilter,
  setYearFilter,
  minRating,
  setMinRating,
  sortBy,
  setSortBy,
}) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
      <div className="flex items-center gap-1.5">
        <span className="text-slate-600 dark:text-slate-300">Year:</span>
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
        >
          <option value="all">All</option>
          <option value="2020s">2020–2024</option>
          <option value="2010s">2010–2019</option>
          <option value="older">&lt; 2010</option>
        </select>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-slate-600 dark:text-slate-300">Min Rating:</span>
        <select
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
        >
          <option value="all">All</option>
          <option value="6">6+ </option>
          <option value="7">7+ </option>
          <option value="8">8+ </option>
          <option value="9">9+ </option>
        </select>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-slate-600 dark:text-slate-300">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
        >
          <option value="default">Default</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="highestUserRated">Highest User Rated</option>
        </select>
      </div>
    </div>
  );
}
