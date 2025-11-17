// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;




import React, { useEffect, useState } from 'react';
import { fetchPopularMovies } from './api';
import MovieCard from './components/MovieCard';
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
  );
}
export default App;