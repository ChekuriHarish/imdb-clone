import React from 'react';
export default function MovieCard({ movie }) {
  return (
    <div className="movie-card">
      <img 
        src={movie.poster !== "N/A" ? movie.poster : "https://via.placeholder.com/300x450?text=No+Image"} 
        alt={movie.title} 
        className="movie-poster"
      />
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-meta">Year: {movie.year}</p>
      </div>
    </div>
  );
}
