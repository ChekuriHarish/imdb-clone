import React from "react";

export default function MovieCard({ movie }) {
  const poster =
    movie.poster !== "N/A" && movie.poster
      ? movie.poster
      : "https://via.placeholder.com/300x450?text=No+Image";

  return (
    <div
      className="
        movie-card
        rounded-xl overflow-hidden
        bg-white/90 dark:bg-slate-900/80
        shadow-sm hover:shadow-xl
        transition-transform transition-shadow duration-200
        hover:-translate-y-1 cursor-pointer
        flex flex-col
      "
    >
      <img
        src={poster}
        alt={movie.title}
        className="movie-poster w-full h-56 sm:h-64 object-cover"
      />
      <div className="movie-info p-3 flex-1 flex flex-col justify-between">
        <h3 className="movie-title font-semibold text-sm sm:text-base mb-1 line-clamp-2">
          {movie.title}
        </h3>
        <p className="movie-meta text-xs text-slate-500 dark:text-slate-400">
          Year: {movie.year}
        </p>
      </div>
    </div>
  );
}
