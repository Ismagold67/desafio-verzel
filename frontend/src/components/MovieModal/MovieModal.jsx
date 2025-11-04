// src/components/MovieModal/MovieModal.jsx
import React from 'react';
import './MovieModal.css';

// Recebe o objeto 'movie' (com todos os detalhes) e a função 'onClose'
function MovieModal({ movie, onClose }) {

  // A API manda a URL do poster, só precisamos montar
  const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  
  // A API manda a nota, só precisamos formatar
  const rating = movie.vote_average.toFixed(1);

  // A API manda a data (ex: "1999-03-31"), vamos formatar para "31/03/1999"
  const releaseDate = movie.release_date.split('-').reverse().join('/');

  // A API manda os gêneros como um array de objetos (ex: [{name: 'Ação'}, {name: 'Ficção'}])
  // Vamos transformar isso em um texto: "Ação, Ficção"
  const genres = movie.genres.map(genre => genre.name).join(', ');

  // Esta função garante que, ao clicar no "fundo" escuro, o modal feche,
  // mas se clicar DENTRO do card branco, ele não feche.
  const handleBackdropClick = (e) => {
    if (e.target.className === 'modal-backdrop') {
      onClose();
    }
  };

  return (
    // O "fundo" escuro
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      
      {/* O "card" branco do modal */}
      <div className="modal-content">
        
        {/* Botão de Fechar "X" */}
        <button className="modal-close-button" onClick={onClose}>
          &times; {/* Este é um "X" de HTML */}
        </button>

        <img className="modal-poster" src={imageUrl} alt={`Poster de ${movie.title}`} />
        
        <div className="modal-info">
          <h2 className="modal-title">{movie.title}</h2>

          {/* A Nota Destacada (Requisito!) */}
          <div className="modal-rating" title={`Nota TMDB: ${rating}`}>
            <span>⭐</span> {rating}
          </div>

          <p className="modal-overview">{movie.overview}</p>

          <div className="modal-extra-details">
            <p><strong>Data de Lançamento:</strong> {releaseDate}</p>
            <p><strong>Gêneros:</strong> {genres}</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default MovieModal;