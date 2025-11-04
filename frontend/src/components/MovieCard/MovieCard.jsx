// src/components/MovieCard/MovieCard.jsx
import React from 'react';
import './MovieCard.css';

// 1. Receba as novas props: { movie, onToggleFavorite, isFavorite }
function MovieCard({ movie, onToggleFavorite, isFavorite, onMovieSelect }) {

  const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  const rating = movie.vote_average.toFixed(1);

  // 2. Crie uma função local para "chamar o pai"
  //    Isso impede que o clique no botão se propague para o card inteiro
  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Impede que o clique afete outros elementos
    onToggleFavorite(movie); // Chama a função que veio lá do App.jsx
  };

  return (
    <div 
        className="movie-card"
        onClick={()=> onMovieSelect ? onMovieSelect(movie.id) : null}
    >
      <img src={imageUrl} alt={`Poster do filme ${movie.title}`} />
      
      {/* 3. O botão de Favorito! */}
      {/* Usamos 'isFavorite' para mudar a classe CSS dinamicamente */}
      {onToggleFavorite && (
        <button 
          className="favorite-button" 
          onClick={handleFavoriteClick}
          title={isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
        >
          {isFavorite ? '❤️' : '♡'}
        </button>
      )}

      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-rating" title={`Nota TMDB: ${rating}`}>
          <span>⭐</span> {rating}
        </div>
      </div>
    </div>
  );
}

export default MovieCard;