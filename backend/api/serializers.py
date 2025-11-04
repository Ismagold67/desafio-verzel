from rest_framework import serializers
from .models import FavoriteList, FavoriteMovie

class FavoriteMovieSerializer(serializers.ModelSerializer):
    """
    Serializa os filmes favoritos (apenas o ID do TMDB)
    """
    class Meta:
        model = FavoriteMovie
        fields = ['id', 'tmdb_movie_id'] # 'id' é o ID do nosso banco

class FavoriteListSerializer(serializers.ModelSerializer):
    """
    Serializa a lista de favoritos completa, incluindo os filmes dentro dela.
    """
    movies = FavoriteMovieSerializer(many=True, read_only=True)
    
    share_url = serializers.SerializerMethodField()
    
    class Meta:
        model = FavoriteList
        # O 'share_id' é o UUID que será usado na URL
        fields = ['share_id', 'created_at', 'movies', 'share_url']
        
    def get_share_url(self, obj):
        return f"http://localhost:3000/favorites/{obj.share_id}"