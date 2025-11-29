import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMovieDetails } from "../api";
import Loader from "./Loader";
import useLocalStorage from "../hooks/useLocalStorage";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userName, setUserName] = useLocalStorage("reviewUserName", "");
  const [nameDraft, setNameDraft] = useState(userName || "");

  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(10);
  const [userComment, setUserComment] = useState("");

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

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`reviews_${id}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setReviews(parsed);
        } else {
          setReviews([]);
        }
      } else {
        setReviews([]);
      }
    } catch (e) {
      console.error("Failed to read reviews", e);
      setReviews([]);
    }
  }, [id]);

  useEffect(() => {
    try {
      localStorage.setItem(`reviews_${id}`, JSON.stringify(reviews));
    } catch (e) {
      console.error("Failed to save reviews", e);
    }
  }, [id, reviews]);

  const handleRetry = async () => {
    setLoading(true);
    try {
      const data = await fetchMovieDetails(id);
      setMovie(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch movie details");
      setMovie(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveName = (e) => {
    e.preventDefault();
    if (!nameDraft.trim()) return;
    setUserName(nameDraft.trim());
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!userName.trim()) {
      alert("Please set your name before adding a review.");
      return;
    }
    if (!userComment.trim()) return;

    const newReview = {
      id: Date.now(),
      userName: userName.trim(),
      rating: Number(userRating),
      comment: userComment.trim(),
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);
    setUserRating(10);
    setUserComment("");
  };

  if (loading) {
    return <Loader label="Loading movie details..." />;
  }

  if (error) {
    return (
      <div className="w-full flex flex-col items-center py-10 gap-4">
        <p className="text-red-500 text-sm sm:text-base text-center px-4">
          {error}
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleRetry}
            className="px-4 py-2 rounded-full bg-indigo-600 text-white text-sm hover:bg-indigo-500 transition-colors"
          >
            Retry
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-full bg-slate-200 text-slate-800 text-sm hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  const poster =
    movie.poster && movie.poster !== "N/A"
      ? movie.poster
      : "https://via.placeholder.com/400x600?text=No+Image";

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) /
          reviews.length
        ).toFixed(1)
      : null;

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

              {averageRating && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs sm:text-sm font-semibold">
                  ⭐ User Avg: {averageRating}/10 ({reviews.length}{" "}
                  review{reviews.length > 1 ? "s" : ""})
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

      <div className="mt-6 bg-white/80 dark:bg-slate-900/80 rounded-2xl p-4 sm:p-6 shadow-md space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold">
          User Reviews & Ratings
        </h2>

        <form
          onSubmit={handleSaveName}
          className="flex flex-col sm:flex-row gap-2 items-start sm:items-center"
        >
          <label className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Display Name:
          </label>
          <input
            type="text"
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            placeholder="Enter your name"
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-full text-xs sm:text-sm bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
          >
            {userName ? "Update Name" : "Save Name"}
          </button>
          {userName && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Currently signed in as <strong>{userName}</strong>
            </span>
          )}
        </form>

        <form
          onSubmit={handleReviewSubmit}
          className="mt-3 space-y-3 border-t border-slate-100 dark:border-slate-800 pt-3"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <label className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Your Rating (1–10):
            </label>
            <select
              value={userRating}
              onChange={(e) => setUserRating(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            >
              {Array.from({ length: 10 }, (_, i) => 10 - i).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <textarea
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
            placeholder="Write your review..."
            className="w-full min-h-[80px] rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
          />

          <button
            type="submit"
            className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-sm hover:shadow-md"
          >
            Submit Review
          </button>
        </form>

        <div className="mt-4 space-y-3">
          {reviews.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No reviews yet. Be the first to review this movie!
            </p>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-3 py-2.5"
              >
                <div className="flex items-center justify-between gap-3 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                      {rev.userName}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {new Date(rev.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-amber-600">
                    ⭐ {rev.rating}/10
                  </span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                  {rev.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
