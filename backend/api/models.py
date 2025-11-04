import uuid
from django.db import models

class FavoriteList(models.Model):
    """
    Representa uma lista de favoritos.
    O 'share_id' é o UUID que vai ser usado no link compartilhável
    """
    share_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Lista {self.share_id}"
    
class FavoriteMovie(models.Model):
    """
    Representa um filme favoritado dentro de uma lista
    """
    # 'related_name' nos permite acessar os filmes a partir da lista
    list = models.ForeignKey(FavoriteList, related_name='movies', on_delete=models.CASCADE)
    tmdb_movie_id = models.IntegerField(help_text="O ID do filme no TMDB")
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        # Garante que um filme não seja adicionado duas vezes na MESMA lista
        unique_together = ('list','tmdb_movie_id')
        
    def __str__(self):
        return f'Filme ID {self.tmdb_movie_id} na Lista {self.list.share_id}'
    