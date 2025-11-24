import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMovieDetails } from "../api";

export default function MovieDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadDetails() {
      setLoading(true);
      try {
        const data = await fetchMovieDetails(id);
        if (!active) return;
        setMovie(data);
        setError(null);
      } catch (err) {
        if (!active) return;
        setError(err.message || "Failed to fetch movie details");
        setMovie(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDetails();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-10">
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
          Loading movie details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col items-center py-10 gap-4">
        <p className="text-red-500 text-sm sm:text-base">
          {error}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-full bg-indigo-600 text-white text-sm hover:bg-indigo-500 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!movie) {
    return null;
  }

  const poster =
    movie.poster && movie.poster !== "N/A"
      ? movie.poster
      : "https://via.placeholder.com/400x600?text=No+Image";

  return (
    <div className="w-full py-6 sm:py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      >
        ⬅ Back
      </button>

      <div className="flex flex-col md:flex-row gap-6 bg-white/80 dark:bg-slate-900/80 rounded-2xl p-4 sm:p-6 shadow-md">
        <div className="flex-shrink-0 mx-auto md:mx-0">
          <img
            src={poster}
            alt={movie.title}
            className="w-52 sm:w-64 md:w-72 rounded-xl shadow-md object-cover"
          />
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">
              {movie.title}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {movie.year} • {movie.rated} • {movie.runtime}
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200">
            <span className="font-semibold">Genre:</span>{" "}
            {movie.genre || "N/A"}
          </p>

          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200">
            <span className="font-semibold">Cast:</span>{" "}
            {movie.actors || "N/A"}
          </p>

          <div>
            <h2 className="text-base font-semibold mb-1">Plot</h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-200">
              {movie.plot || "No plot available."}
            </p>
          </div>

          <div className="mt-3">
            <h2 className="text-base font-semibold mb-2">Ratings</h2>
            <div className="flex flex-wrap items-center gap-3">
              {movie.imdbRating && movie.imdbRating !== "N/A" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs sm:text-sm font-semibold">
                  ⭐ IMDb: {movie.imdbRating}
                </span>
              )}

              {movie.ratings &&
                movie.ratings.map((r, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-200"
                  >
                    {r.Source}: {r.Value}
                  </span>
                ))}
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Language: {movie.language || "N/A"} • Country:{" "}
            {movie.country || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
