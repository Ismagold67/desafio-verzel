// src/pages/FavoritesPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MovieList from '../components/MovieList/MovieList';
import Header from '../components/Header/Header'; // 1. Importe o Header
import './SearchPage.css'; // 2. Importe o CSS para usar os estilos dos botões

function FavoritesPage() {
  const { share_id } = useParams();
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 3. Estado e função de COPIAR (movidos para cá)
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = () => {
    // Pega a URL *atual* da página, que é o link de compartilhamento
    const shareUrl = window.location.href; 
    
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch(err => {
        console.error('Falha ao copiar o link: ', err);
      });
  };

  // (useEffect para buscar os filmes continua o MESMO)
  useEffect(() => {
    if (!share_id) return;
    const fetchFavoriteList = () => {
      setIsLoading(true);
      setError(null);
      // ... (resto da lógica de fetch que já tínhamos) ...
      fetch(`http://localhost:8000/api/favorites/${share_id}`)
        .then(response => {
          if (!response.ok) throw new Error('Lista de favoritos não encontrada.');
          return response.json();
        })
        .then(data => {
          const favoriteMoviesInfo = data.movies;
          if (favoriteMoviesInfo.length === 0) {
            setError("Esta lista de favoritos está vazia.");
            setIsLoading(false);
            return;
          }
          const detailPromises = favoriteMoviesInfo.map(movieInfo =>
            fetch(`http://localhost:8000/api/movie/${movieInfo.tmdb_movie_id}`)
              .then(res => res.json())
          );
          return Promise.all(detailPromises);
        })
        .then(movieDetailsArray => {
          if (movieDetailsArray) {
            setMovies(movieDetailsArray.filter(movie => movie.poster_path));
            setIsLoading(false);
          }
        })
        .catch(err => {
          console.error("Erro ao buscar lista de favoritos:", err);
          setError(err.message);
          setIsLoading(false);
        });
    };
    fetchFavoriteList();
  }, [share_id]);

  // (renderContent continua o MESMO, mas agora passa 'onMovieSelect'!)
  // Nós também queremos o Modal de Detalhes nesta página, certo?
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  
  // (Lógica do Modal copiada da SearchPage)
  const handleMovieSelect = (movieId) => {
    setIsModalLoading(true);
    setError(null);
    fetch(`http://localhost:8000/api/movie/${movieId}`)
      .then(response => response.json())
      .then(data => {
        setSelectedMovie(data);
        setIsModalLoading(false);
      })
      .catch(err => {
        setError("Não foi possível carregar os detalhes do filme.");
        setIsModalLoading(false);
      });
  };
  const handleCloseModal = () => setSelectedMovie(null);

  const renderContent = () => {
    if (isLoading) {
      return <p style={{ textAlign: 'center' }}>Carregando lista de favoritos...</p>;
    }
    if (error) {
      return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;
    }
    return (
      <MovieList 
        movies={movies}
        favoriteIds={new Set()}
        onToggleFavorite={null} // Sem botão de favoritar na pág. pública
        onMovieSelect={handleMovieSelect} // MAS com o clique para detalhes!
      />
    );
  };
  
  return (
    // 4. Nova estrutura com Header e botão de Copiar
    <div className="search-page-container">
      <Header /> {/* Header simples, sem botões */}
      
      <main className="search-page-main">
        <div style={{ textAlign: 'center', margin: '2rem' }}>
          <h2>Lista de Favoritos Compartilhada</h2>
          <button 
            onClick={handleCopyLink}
            disabled={isCopied} 
            className={`action-button ${isCopied ? 'btn-success' : 'btn-secondary'}`}
            style={{marginTop: '1rem'}}
          >
            {isCopied ? 'Link Copiado!' : 'Copiar Link desta Lista'}
          </button>
        </div>
        
        {renderContent()}
      </main>
      
      {/* Lógica do Modal (também nesta página) */}
      {isModalLoading && ( <div className="modal-backdrop">...</div> )}
      {selectedMovie && !isModalLoading && (
        <MovieModal 
          movie={selectedMovie} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
}

export default FavoritesPage;