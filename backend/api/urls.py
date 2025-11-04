# api/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # URL do Proxy do TMDB
    # Ex: GET /api/search?q=matrix
    path('search', views.SearchMovieView.as_view(), name='search-movies'),
    
    # URL para criar uma nova lista de favoritos
    # Ex: POST /api/favorites
    path('favorites', views.CreateFavoriteListView.as_view(), name='create-list'),
    
    # URL para ver uma lista de favoritos (pelo link de compartilhar)
    # Ex: GET /api/favorites/a1b2c3d4-..../
    path('favorites/<uuid:share_id>', views.RetrieveFavoriteListView.as_view(), name='get-list'),
    
    # URL para adicionar/remover um filme da lista
    # Ex: POST /api/favorites/a1b2c3d4-..../movie/550
    # Ex: DELETE /api/favorites/a1b2c3d4-..../movie/550
    path('favorites/<uuid:share_id>/movie/<int:tmdb_movie_id>', 
         views.ManageFavoriteMovieView.as_view(), 
         name='manage-movie'),
         
    # URL para buscar os detalhes de um filme
    # Ex: GET /api/movie/603
    path('movie/<int:tmdb_movie_id>', 
         views.GetMovieDetailView.as_view(), 
         name='get-movie-detail'),
]