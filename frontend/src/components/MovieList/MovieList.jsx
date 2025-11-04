// src/components/MovieList/MovieList.jsx
import React from 'react';
import MovieCard from '../MovieCard/MovieCard';
import './MovieList.css';

// 1. Receba as novas props: { movies, onToggleFavorite, favoriteIds }
function MovieList({ movies, onToggleFavorite, favoriteIds, onMovieSelect }) {
  
  return (
    <div className="movie-list-container">
      {movies.map(movie => (
        // 2. Passe as props para CADA MovieCard
        <MovieCard 
          key={movie.id} 
          movie={movie}
          onToggleFavorite={onToggleFavorite}
          // 3. Verifique se este filme é um favorito e passe um boolean
          isFavorite={favoriteIds.has(movie.id)}
          onMovieSelect={onMovieSelect}
        />
      ))}
    </div>
  );
}

export default MovieList;