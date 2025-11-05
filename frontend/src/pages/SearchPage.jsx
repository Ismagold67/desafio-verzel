// src/pages/SearchPage.jsx
import React, { useState, useEffect, useRef } from 'react';

import Header from '../components/Header/Header';
import SearchBar from '../components/SearchBar/SearchBar';
import MovieList from '../components/MovieList/MovieList';
import MovieModal from '../components/MovieModal/MovieModal';
import './SearchPage.css';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function SearchPage() {
  
  // --- NOSSOS ESTADOS (STATES) ---
  const [movies, setMovies] = useState([]);
  const [favoriteListId, setFavoriteListId] = useState(null);
  const [favoriteMovies, setFavoriteMovies] = useState(new Map());
  const [viewMode, setViewMode] = useState('search');
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const effectRan = useRef(false);

  // --- NOSSAS FUNÇÕES ---

  /**
   * ESTA É A GRANDE MUDANÇA:
   * Agora, o useEffect busca o ID salvo ou cria um novo.
   */
  useEffect(() => {
    if (effectRan.current === true) {
      return; 
    }

    /**
     * Função 1: Tenta buscar os favoritos de uma lista que JÁ EXISTE.
     * (É a mesma lógica da FavoritesPage)
     */
    const fetchSavedFavorites = (listId) => {
      console.log(`Carregando lista salva do localStorage. ID: ${listId}`);
      setIsLoading(true); // Liga o loading da página
      
      // 1. Busca os IDs dos filmes
      fetch(`${API_BASE_URL}/favorites/${listId}`)
        .then(response => {
          if (!response.ok) throw new Error('Lista de favoritos salva não encontrada.');
          return response.json();
        })
        .then(data => {
          const favoriteMoviesInfo = data.movies;
          if (favoriteMoviesInfo.length === 0) {
            setIsLoading(false);
            return; // Lista existe, mas está vazia
          }
          
          // 2. Busca os DETALHES de cada filme salvo
          const detailPromises = favoriteMoviesInfo.map(movieInfo =>
            fetch(`${API_BASE_URL}/movie/${movieInfo.tmdb_movie_id}`)
              .then(res => res.json())
          );
          return Promise.all(detailPromises);
        })
        .then(movieDetailsArray => {
          if (movieDetailsArray) {
            // 3. Popula o nosso estado 'favoriteMovies' com os filmes salvos
            const newMap = new Map();
            movieDetailsArray.forEach(movie => {
              if (movie.id) { // Garante que o filme é válido
                newMap.set(movie.id, movie);
              }
            });
            setFavoriteMovies(newMap);
            console.log(`Sucesso! ${newMap.size} favoritos carregados.`);
          }
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Erro ao buscar lista salva:", err);
          // Se a lista não foi encontrada (404), limpa o localStorage e cria uma nova
          localStorage.removeItem('favoriteListId');
          createNewFavoriteList();
        });
    };

    /**
     * Função 2: Cria uma lista NOVA (para usuários de primeira viagem)
     */
    const createNewFavoriteList = () => {
      console.log("Nenhum ID salvo. Criando nova lista de favoritos...");
      fetch(`${API_BASE_URL}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      .then(response => response.json())
      .then(data => {
        console.log('Lista de favoritos criada com sucesso! ID:', data.share_id);
        setFavoriteListId(data.share_id);
        // A MÁGICA: Salva o novo ID no localStorage
        localStorage.setItem('favoriteListId', data.share_id);
      })
      .catch(err => {
        console.error("Erro ao criar lista:", err);
        setError("Erro de conexão ao criar lista. Tente recarregar a página.");
      });
    };

    // --- A LÓGICA PRINCIPAL DO useEffect ---
    const savedListId = localStorage.getItem('favoriteListId');
    
    if (savedListId) {
      // Se achamos um ID, carregue os favoritos salvos
      setFavoriteListId(savedListId);
      fetchSavedFavorites(savedListId);
    } else {
      // Se não, crie uma lista nova
      createNewFavoriteList();
    }

    // Marca o effect como "rodado" para o StrictMode
    return () => {
      effectRan.current = true;
    };
  }, []); // O array vazio [] garante que isso só rode UMA VEZ.

  
  // NENHUMA MUDANÇA DAQUI PARA BAIXO
  // Todas as outras funções (handleSearch, handleToggleFavorite, etc.)
  // já funcionam perfeitamente com a nova lógica.

  const handleSearch = (query) => {
    setViewMode('search');
    if (query === "") { setMovies([]); setError(null); return; }
    setIsLoading(true);
    setError(null);
    setMovies([]);
    fetch(`${API_BASE_URL}/search?q=${query}`)
      .then(response => {
        if (!response.ok) throw new Error('Falha ao buscar dados.');
        return response.json();
      })
      .then(data => {
        const filteredResults = data.results.filter(movie => movie.poster_path);
        setMovies(filteredResults); 
        setIsLoading(false);
        if (filteredResults.length === 0) setError("Nenhum filme encontrado com esse termo.");
      })
      .catch(err => {
        console.error("Erro na chamada de API:", err);
        setError(err.message);
        setIsLoading(false);
      });
  };

  const handleToggleFavorite = (movie) => {
    if (!favoriteListId) { setError("Não foi possível favoritar: ID da lista não encontrado."); return; }
    const movieId = movie.id;
    const isFavorite = favoriteMovies.has(movieId);
    const method = isFavorite ? 'DELETE' : 'POST';
    fetch(`${API_BASE_URL}/favorites/${favoriteListId}/movie/${movieId}`, { method: method })
      .then(response => {
        if (!response.ok && response.status !== 204) throw new Error(`Falha ao ${method} o favorito.`);
        setFavoriteMovies(prevMap => {
          const newMap = new Map(prevMap);
          if (isFavorite) {
            newMap.delete(movieId);
          } else {
            newMap.set(movieId, movie);
          }
          return newMap;
        });
      })
      .catch(err => {
        console.error("Erro ao favoritar:", err);
        setError(err.message);
      });
  };

  const handleCopyLink = () => {
    if (!favoriteListId) return;
    const baseUrl = window.location.origin; 
    const shareUrl = `${baseUrl}/favorites/${favoriteListId}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(err => console.error('Falha ao copiar o link: ', err));
  };

  const handleMovieSelect = (movieId) => {
    console.log("Selecionado filme com ID:", movieId);
    setIsModalLoading(true);
    setError(null);
    fetch(`${API_BASE_URL}/movie/${movieId}`)
      .then(response => {
        if (!response.ok) throw new Error('Falha ao buscar detalhes do filme.');
        return response.json();
      })
      .then(data => {
        setSelectedMovie(data);
        setIsModalLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar detalhes:", err);
        setError("Não foi possível carregar os detalhes do filme.");
        setIsModalLoading(false);
      });
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };
  
  const renderContent = () => {
    if (isLoading) { return <p style={{ textAlign: 'center' }}>Carregando...</p>; }
    if (error && !isModalLoading) { return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>; }
    let moviesToShow = (viewMode === 'search') ? movies : Array.from(favoriteMovies.values());
    if (viewMode === 'favorites' && moviesToShow.length === 0) {
      return <p style={{ textAlign: 'center' }}>Você ainda não favoritou nenhum filme.</p>;
    }
    const currentFavoriteIds = new Set(favoriteMovies.keys());
    return (
      <MovieList 
        movies={moviesToShow} 
        onToggleFavorite={handleToggleFavorite} 
        favoriteIds={currentFavoriteIds}
        onMovieSelect={handleMovieSelect}
      />
    );
  }

  // --- O JSX (HTML) DA PÁGINA (Sem mudanças) ---
  return (
    <div className="search-page-container">
      
      <Header>
        <button
          onClick={() => setViewMode(viewMode === 'search' ? 'favorites' : 'search')}
          className="action-button btn-primary"
        >
          {viewMode === 'search' ? 'Ver Meus Favoritos' : 'Voltar para Busca'}
        </button>
      </Header>

      <div className="search-controls">
        <SearchBar onSearch={handleSearch} />
      </div>

      {viewMode === 'favorites' && (
        <div className="action-buttons" style={{ marginBottom: '1rem' }}>
          <button 
            onClick={handleCopyLink}
            disabled={!favoriteListId || isCopied} 
            className={`action-button ${isCopied ? 'btn-success' : 'btn-secondary'}`}
          >
            {isCopied ? 'Link Copiado!' : 'Copiar Link de Compartilhamento'}
          </button>
        </div>
      )}
      
      <main className="search-page-main">
        {renderContent()}
      </main>

      {/* --- LÓGICA DO MODAL (Sem mudanças) --- */}
      {isModalLoading && (
        <div className="modal-backdrop">
          <p style={{ color: 'white', fontSize: '1.5rem' }}>Carregando detalhes...</p>
        </div>
      )}
      {selectedMovie && !isModalLoading && (
        <MovieModal 
          movie={selectedMovie} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
}

export default SearchPage;