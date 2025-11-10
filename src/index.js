
import React from 'react';
import { useState, useMemo } from 'react';

// Sample static data for the movies
const SAMPLE_MOVIES = [
  {
    id: 1,
    title: "The Stellar Odyssey",
    year: 2023,
    rating: 4.8,
    posterUrl: "https://placehold.co/400x600/111827/ffffff?text=Odyssey",
  },
  {
    id: 2,
    title: "Whispers in the Canyon",
    year: 2021,
    rating: 4.1,
    posterUrl: "https://placehold.co/400x600/374151/ffffff?text=Whispers",
  },
  {
    id: 3,
    title: "Cybernetic Dream",
    year: 2024,
    rating: 4.9,
    posterUrl: "https://placehold.co/400x600/4b5563/ffffff?text=Cybernetic",
  },
  {
    id: 4,
    title: "Ancient City Secrets",
    year: 2019,
    rating: 3.5,
    posterUrl: "https://placehold.co/400x600/6b7280/ffffff?text=Secrets",
  },
];

/**
 * Reusable component to display a single movie's details.
 * @param {object} props - The props for the component.
 * @param {string} props.title - The title of the movie.
 * @param {number} props.year - The release year of the movie.
 * @param {number} props.rating - The movie's rating (out of 5).
 * @param {string} props.posterUrl - The URL for the movie poster image.
 */
const MovieCard = ({ title, year, rating, posterUrl }) => {
  // Determine color based on rating for visual feedback
  const ratingColor = useMemo(() => {
    if (rating >= 4.5) return 'text-green-400';
    if (rating >= 3.0) return 'text-yellow-400';
    return 'text-red-400';
  }, [rating]);

  return (
    <div className="bg-gray-800 shadow-xl rounded-xl overflow-hidden transform transition duration-300 hover:shadow-2xl hover:-translate-y-1 w-full max-w-xs mx-auto">
      {/* Movie Poster */}
      <div className="relative h-64 sm:h-80">
        <img
          src={posterUrl}
          alt={`Poster for ${title}`}
          className="w-full h-full object-cover"
          // Fallback image source in case the placeholder URL fails
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x600/1f2937/ffffff?text=Image+Missing"; }}
        />
        {/* Rating Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 text-sm font-bold rounded-full bg-gray-900 bg-opacity-80 border ${ratingColor.includes('green') ? 'border-green-400' : ratingColor.includes('yellow') ? 'border-yellow-400' : 'border-red-400'} flex items-center`}>
          <svg className={`w-4 h-4 mr-1 fill-current ${ratingColor}`} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.487 7.71h6.575L10 1l2.938 6.71h6.575l-4.758 4.835 1.123 6.545z"/>
          </svg>
          <span className={ratingColor}>{rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Movie Details */}
      <div className="p-4 text-white">
        {/* Title */}
        <h3 className="text-xl font-bold mb-1 truncate" title={title}>
          {title}
        </h3>
        {/* Year */}
        <p className="text-sm text-gray-400 font-medium">
          Release Year: <span className="text-gray-300">{year}</span>
        </p>
      </div>
    </div>
  );
};

// Main application component
const App = () => {
  const [movies] = useState(SAMPLE_MOVIES);

  return (
    <div className="min-h-screen bg-gray-900 p-8 font-sans">
      <header className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-400 mb-2">
          Movie Collection
        </h1>
        <p className="text-gray-400 text-lg">
          A demonstration of the reusable MovieCard component.
        </p>
      </header>
      
      {/* Grid container for responsive layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {movies.map(movie => (
          <MovieCard
            key={movie.id}
            title={movie.title}
            year={movie.year}
            rating={movie.rating}
            posterUrl={movie.posterUrl}
          />
        ))}
      </div>

      <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>Data provided by static sample for demonstration purposes.</p>
      </footer>
    </div>
  );
};

export default App;