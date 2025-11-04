// src/components/Header/Header.jsx
import React from 'react';
import './Header.css';

// Vamos aceitar 'children' (que será o nosso botão)
function Header({ children }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1>Desafio Elite Dev - Lista de Filmes</h1>
        
        {/* 'children' será renderizado aqui (no nosso caso, o botão) */}
        <div className="header-actions">
          {children}
        </div>
      </div>
    </header>
  );
}

export default Header;