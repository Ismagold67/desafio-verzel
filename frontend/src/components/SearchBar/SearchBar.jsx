// src/components/SearchBar/SearchBar.jsx
import React, { useState } from 'react'; // Só precisa de React e useState
import './SearchBar.css'; // Importa o seu próprio CSS

// Recebe a prop 'onSearch'
function SearchBar({ onSearch }) {
  
  // Cria um "estado" para guardar o que o usuário digita
  const [query, setQuery] = useState(""); 

  const handleSubmit = (evento) => {
    evento.preventDefault(); 
    onSearch(query);
  };

  return (
    <div className="searchbar-container">
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Digite o nome de um filme..."
          className="search-input"
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
        />
        <button type="submit" className="search-button">
          Buscar
        </button>
      </form>
    </div>
  );
}

export default SearchBar;