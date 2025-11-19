import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import { fetchPopularMovies } from './api';
import MovieCard from './components/MovieCard';
import './App.css';
import './movies.css';
function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const results = await fetchPopularMovies();
        setMovies(results);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Popular Movies App using OMDB API</p>
      </header>
      <div className="container">
        <h1>Popular Movies (OMDB)</h1>
        {loading && <div className="center">Loading...</div>}
        {error && <div className="center error">{error}</div>}
        <div className="movies-grid">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}
export default App;