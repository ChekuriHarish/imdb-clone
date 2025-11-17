const API_KEY = process.env.REACT_APP_OMDB_API_KEY;
export async function fetchPopularMovies() {
  if (!API_KEY) {
    throw new Error("OMDB API key missing. Add REACT_APP_OMDB_API_KEY in .env.local");
  }
  const searchTerm = "avengers";
  const resp = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}&type=movie`
  );
  const data = await resp.json();
  if (data.Response === "False") {
    throw new Error(data.Error || "Failed to fetch movies");
  }
  return data.Search.map(movie => ({
    id: movie.imdbID,
    title: movie.Title,
    year: movie.Year,
    poster: movie.Poster
  }));
}
