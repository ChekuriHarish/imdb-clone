const API_KEY = process.env.REACT_APP_OMDB_API_KEY;
const OMDB_BASE = "https://www.omdbapi.com/";

function ensureKey() {
  if (!API_KEY) {
    throw new Error(
      "OMDB API key missing. Add REACT_APP_OMDB_API_KEY in .env.local"
    );
  }
}

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

export async function fetchMovieDetails(id) {
  if (!id) {
    throw new Error("Movie id (imdbID) is required");
  }

  ensureKey();

  const url = `${OMDB_BASE}?apikey=${API_KEY}&i=${id}&plot=full`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Network error while fetching movie details");
  }

  const data = await res.json();

  if (data.Response === "False") {
    throw new Error(data.Error || "Failed to fetch movie details");
  }

  return {
    id: data.imdbID,
    title: data.Title,
    year: data.Year,
    poster: data.Poster,
    genre: data.Genre,
    actors: data.Actors,
    plot: data.Plot,
    rated: data.Rated,
    runtime: data.Runtime,
    language: data.Language,
    country: data.Country,
    ratings: data.Ratings || [],
    imdbRating: data.imdbRating,
    type: data.Type,
  };
}