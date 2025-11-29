import React from "react";
export default function SkeletonMovieCard() {
  return (
    <div
      className="
        movie-card
        rounded-xl overflow-hidden
        bg-white/90 dark:bg-slate-900/80
        shadow-sm
        flex flex-col
      "
    >
      <div className="skeleton skeleton-poster" />

      <div className="p-3 space-y-2">
        <div className="skeleton skeleton-text w-3/4" />
        <div className="skeleton skeleton-text w-1/2" />
      </div>
    </div>
  );
}
