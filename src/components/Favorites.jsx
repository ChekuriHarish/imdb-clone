import React from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "./MovieCard";

export default function Favorites({ favorites, onToggleFavorite, isFavorite }) {
  const navigate = useNavigate();

  const hasFavorites = favorites && favorites.length > 0;

  return (
    <div className="w-full mt-2 pb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl sm:text-2xl font-semibold">⭐ Favorites</h2>
        <button
          onClick={() => navigate("/")}
          className="text-xs sm:text-sm px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          Back to Home
        </button>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/70 rounded-2xl p-4 sm:p-5 shadow-md">
        {!hasFavorites ? (
          <div className="text-center py-6 space-y-2">
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
              No favorite movies yet.
            </p>
            <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500">
              Go to Home and tap the heart icon on any movie to add it here.
            </p>
          </div>
        ) : (
          <div className="movies-grid grid gap-4 sm:gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 mt-2">
            {favorites.map((movie) => (
              <MovieCard
                key={movie.id || movie.imdbID || movie.title}
                movie={movie}
                isFavorite={isFavorite ? isFavorite(movie) : true}
                onToggleFavorite={() => onToggleFavorite(movie)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
