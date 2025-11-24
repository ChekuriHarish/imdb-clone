// const API_KEY = process.env.REACT_APP_OMDB_API_KEY;
// const OMDB_BASE = "https://www.omdbapi.com/";
// function ensureKey() {
//   if (!API_KEY) {
//     throw new Error(
//       "OMDB API key missing. Add REACT_APP_OMDB_API_KEY in .env.local"
//     );
//   } 
// }
// export async function fetchPopularMovies() {
//   ensureKey();
//   const searchTerm = "avengers";
//   const resp = await fetch(
//     `${OMDB_BASE}?apikey=${API_KEY}&s=${encodeURIComponent(
//       searchTerm
//     )}&type=movie`
//   );
//   if (!resp.ok) throw new Error("Network error while fetching popular movies");
//   const data = await resp.json();
//   if (data.Response === "False") {
//     throw new Error(data.Error || "Failed to fetch movies");
//   }
//   return (data.Search || []).map((movie) => ({
//     id: movie.imdbID,
//     title: movie.Title,
//     year: movie.Year,
//     poster: movie.Poster,
//   }));
// }
// export async function fetchMoviesByTitle(query) {
//   if (!query || !query.trim()) return [];
//   ensureKey();
//   const q = encodeURIComponent(query.trim());
//   const url = `${OMDB_BASE}?s=${q}&type=movie&apikey=${API_KEY}`;
//   const res = await fetch(url);
//   if (!res.ok) throw new Error("Network error while searching movies");
//   const data = await res.json();
//   if (data.Response === "False") return [];
//   return (data.Search || []).map((m) => ({
//     id: m.imdbID,
//     title: m.Title,
//     poster: m.Poster,
//     year: m.Year,
//   }));
// }




// src/api.js
// Uses OMDB. Make sure REACT_APP_OMDB_API_KEY is set in .env.local

const API_KEY = process.env.REACT_APP_OMDB_API_KEY;
const OMDB_BASE = "https://www.omdbapi.com/";

function ensureKey() {
  if (!API_KEY) {
    throw new Error(
      "OMDB API key missing. Add REACT_APP_OMDB_API_KEY in .env.local"
    );
  }
}

/**
 * Fetch a "popular" list (fixed search term 'avengers') with pagination.
 * Returns: { movies, totalResults, page }
 */
export async function fetchPopularMovies(page = 1) {
  ensureKey();
  const searchTerm = "avengers";

  const resp = await fetch(
    `${OMDB_BASE}?apikey=${API_KEY}&s=${encodeURIComponent(
      searchTerm
    )}&type=movie&page=${page}`
  );

  if (!resp.ok) {
    throw new Error("Network error while fetching popular movies");
  }

  const data = await resp.json();

  if (data.Response === "False") {
    throw new Error(data.Error || "Failed to fetch movies");
  }

  const movies = (data.Search || []).map((movie) => ({
    id: movie.imdbID,
    title: movie.Title,
    year: movie.Year,
    poster: movie.Poster,
  }));

  const totalResults = Number(data.totalResults || movies.length);

  return { movies, totalResults, page };
}

/**
 * Search movies by title with pagination.
 * Returns: { movies, totalResults, page }
 */
export async function fetchMoviesByTitle(query, page = 1) {
  if (!query || !query.trim()) {
    return { movies: [], totalResults: 0, page: 1 };
  }

  ensureKey();
  const q = encodeURIComponent(query.trim());
  const url = `${OMDB_BASE}?s=${q}&type=movie&apikey=${API_KEY}&page=${page}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Network error while searching movies");
  }

  const data = await res.json();

  if (data.Response === "False") {
    // No results case
    return { movies: [], totalResults: 0, page };
  }

  const movies = (data.Search || []).map((m) => ({
    id: m.imdbID,
    title: m.Title,
    poster: m.Poster,
    year: m.Year,
  }));

  const totalResults = Number(data.totalResults || movies.length);

  return { movies, totalResults, page };
}
