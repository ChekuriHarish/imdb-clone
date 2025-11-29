import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MovieCard({
  movie,
  isFavorite = false,
  onToggleFavorite,
}) {
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);

  const poster =
    movie.poster !== "N/A" && movie.poster
      ? movie.poster
      : "https://via.placeholder.com/300x450?text=No+Image";

  const handleClick = () => {
    const id = movie.id || movie.imdbID;
    if (id) {
      navigate(`/movie/${id}`);
    }
  };

  const handleHeartClick = (e) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite();
    }
  };

  let userAvg = movie.userAvg ?? null;
  let userCount = movie.userCount ?? 0;

  if (userAvg == null && typeof window !== "undefined") {
    try {
      const movieId = movie.id || movie.imdbID;
      if (movieId) {
        const raw = window.localStorage.getItem(`reviews_${movieId}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            userCount = parsed.length;
            const sum = parsed.reduce(
              (acc, r) => acc + (Number(r.rating) || 0),
              0
            );
            userAvg = sum / userCount;
          }
        }
      }
    } catch (e) {
    }
  }

  return (
    <div
      className="
        movie-card
        relative
        rounded-xl overflow-hidden
        bg-white/90 dark:bg-slate-900/80
        shadow-sm hover:shadow-xl
        transition-transform transition-shadow duration-200
        hover:-translate-y-1 cursor-pointer
        flex flex-col
      "
      onClick={handleClick}
    >
      <button
        onClick={handleHeartClick}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        className="
          absolute top-2 right-2
          rounded-full px-2 py-1
          bg-white/80 dark:bg-slate-800/80
          text-sm shadow
          hover:scale-105 transition-transform
        "
      >
        <span className="text-base">{isFavorite ? "❤️" : "🤍"}</span>
      </button>

      <img
        src={poster}
        alt={movie.title}
        loading="lazy"         
        decoding="async"
        onLoad={() => setImgLoaded(true)}
        className={`movie-poster w-full h-56 sm:h-64 object-cover ${
          imgLoaded ? "poster-loaded" : "poster-loading"
        }`}
      />

      <div className="movie-info p-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="movie-title font-semibold text-sm sm:text-base mb-1 line-clamp-2">
            {movie.title}
          </h3>
          <p className="movie-meta text-xs text-slate-500 dark:text-slate-400">
            Year: {movie.year}
          </p>

          {userAvg != null && (
            <p className="mt-1 text-[11px] text-amber-600">
              ⭐ {userAvg.toFixed(1)}/10 · {userCount} review
              {userCount > 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
