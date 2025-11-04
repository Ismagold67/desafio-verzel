import React from 'react';
import ReactDOM from 'react-dom/client';

// 1. Importe o CSS global
import './index.css'; 

// 2. Importe o Roteador e nossas páginas
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';

// 3. Defina as rotas
const router = createBrowserRouter([
  {
    path: "/", // A página inicial (raiz)
    element: <SearchPage />, // Carrega nosso componente de busca
  },
  {
    path: "/favorites/:share_id", // A página de compartilhamento
    element: <FavoritesPage />,   // Carrega a página de favoritos
  },
]);

// 4. Renderize o "Provedor" do Roteador
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);