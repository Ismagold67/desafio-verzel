# api/views.py
from rest_framework import views, response, status
from .models import FavoriteList, FavoriteMovie
from .serializers import FavoriteListSerializer, FavoriteMovieSerializer

# Libs para o proxy do TMDB
import os
import requests
from dotenv import load_dotenv

# Carrega as variáveis do .env (onde está nossa chave)
load_dotenv()

# --- Views do TMDB (Proxy) ---

class SearchMovieView(views.APIView):
    """
    View para buscar filmes na API do TMDB.
    Ela atua como um proxy para não expor nossa API Key.
    """
    def get(self, request):
        # 1. Pegar o termo de busca da URL (ex: /api/search?q=avatar)
        query = request.query_params.get('q', None)
        
        if not query:
            return response.Response(
                {"error": "O parâmetro 'q' (query) é obrigatório."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2. Pegar a API Key do .env
        tmdb_api_key = os.getenv('TMDB_API_KEY')
        if not tmdb_api_key:
            return response.Response(
                {"error": "Chave da API do TMDB não configurada no servidor."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # 3. Montar a URL da API externa
        tmdb_url = f"https://api.themoviedb.org/3/search/movie"
        params = {
            'api_key': tmdb_api_key,
            'query': query,
            'language': 'pt-BR', # Já trazemos em português
            'include_adult': 'false'
        }

        # 4. Fazer a chamada para o TMDB
        try:
            api_response = requests.get(tmdb_url, params=params)
            api_response.raise_for_status() # Lança erro se a resposta for 4xx ou 5xx
            
            # 5. Devolver a resposta do TMDB para o nosso front-end
            return response.Response(api_response.json(), status=api_response.status_code)

        except requests.exceptions.RequestException as e:
            # Captura erros de conexão, timeout, HTTP 500 do TMDB, etc.
            return response.Response(
                {"error": f"Erro ao contatar a API do TMDB: {e}"}, 
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

class CreateFavoriteListView(views.APIView):
    """
    View para criar uma nova lista de favoritos (vazia).
    O front-end vai chamar essa view assim que o usuário
    decidir começar a favoritar.
    """
    def post(self, request):
        # 1. Cria uma nova instância do modelo FavoriteList
        new_list = FavoriteList.objects.create()
        
        # 2. Serializa (converte para JSON) a lista criada
        # Passamos 'request=request' para o contexto, 
        # para que nosso 'share_url' no serializer consiga montar a URL completa
        serializer = FavoriteListSerializer(new_list, context={'request': request})
        
        # 3. Retorna os dados da nova lista (incluindo o share_id e a URL)
        # status=201 significa "Created" (Criado com sucesso)
        return response.Response(serializer.data, status=status.HTTP_201_CREATED)

class ManageFavoriteMovieView(views.APIView):
    """
    View para Adicionar (POST) ou Remover (DELETE) um filme
    de uma lista de favoritos específica.
    """
    
    def post(self, request, share_id, tmdb_movie_id):
        """
        Adiciona um filme (tmdb_movie_id) a uma lista (share_id).
        """
        # 1. Encontra a lista de favoritos pelo 'share_id'
        try:
            fav_list = FavoriteList.objects.get(share_id=share_id)
        except FavoriteList.DoesNotExist:
            return response.Response(
                {"error": "Lista de favoritos não encontrada."}, 
                status=status.HTTP_404_NOT_FOUND
            )

        # 2. Tenta criar o novo filme favorito nessa lista
        # O 'unique_together' no nosso modelo (models.py) impede duplicatas
        movie, created = FavoriteMovie.objects.get_or_create(
            list=fav_list, 
            tmdb_movie_id=tmdb_movie_id
        )

        if not created:
            # Se 'created' for False, o filme já estava na lista
            return response.Response(
                {"message": "Filme já está na lista de favoritos."}, 
                status=status.HTTP_200_OK
            )

        # 3. Serializa o filme que foi adicionado e retorna
        serializer = FavoriteMovieSerializer(movie)
        return response.Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, share_id, tmdb_movie_id):
        """
        Remove um filme (tmdb_movie_id) de uma lista (share_id).
        """
        # 1. Encontra a lista de favoritos
        try:
            fav_list = FavoriteList.objects.get(share_id=share_id)
        except FavoriteList.DoesNotExist:
            return response.Response(
                {"error": "Lista de favoritos não encontrada."}, 
                status=status.HTTP_404_NOT_FOUND
            )

        # 2. Encontra o filme específico naquela lista
        try:
            movie = FavoriteMovie.objects.get(
                list=fav_list, 
                tmdb_movie_id=tmdb_movie_id
            )
        except FavoriteMovie.DoesNotExist:
            return response.Response(
                {"error": "Filme não encontrado nesta lista de favoritos."}, 
                status=status.HTTP_404_NOT_FOUND
            )

        # 3. Deleta o filme do banco
        movie.delete()
        # status=204 significa "No Content" (Sucesso, mas sem conteúdo para retornar)
        return response.Response(status=status.HTTP_204_NO_CONTENT)


class RetrieveFavoriteListView(views.APIView):
    """
    View para buscar e exibir uma lista de favoritos específica.
    É isso que será usado pela página de compartilhamento (o link).
    """
    def get(self, request, share_id):
        # 1. Encontra a lista de favoritos pelo 'share_id'
        try:
            # 'prefetch_related' é uma otimização de performance
            # Ele busca a lista E os filmes em uma consulta mais eficiente
            fav_list = FavoriteList.objects.prefetch_related('movies').get(share_id=share_id)
        except FavoriteList.DoesNotExist:
            return response.Response(
                {"error": "Lista de favoritos não encontrada."}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # 2. Serializa a lista completa (com os filmes aninhados)
        serializer = FavoriteListSerializer(fav_list, context={'request': request})
        
        # 3. Retorna a lista
        return response.Response(serializer.data, status=status.HTTP_200_OK)
    
class GetMovieDetailView(views.APIView):
    """
    View para buscar os DETALHES de UM filme específico no TMDB.
    Usaremos isso na nossa página de compartilhamento.
    """
    def get(self, request, tmdb_movie_id):

        # 1. Pegar a API Key
        tmdb_api_key = os.getenv('TMDB_API_KEY')
        if not tmdb_api_key:
            return response.Response(
                {"error": "Chave da API do TMDB não configurada."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # 2. Montar a URL da API externa (note a URL /movie/ID)
        tmdb_url = f"https://api.themoviedb.org/3/movie/{tmdb_movie_id}"
        params = {
            'api_key': tmdb_api_key,
            'language': 'pt-BR',
        }

        # 3. Fazer a chamada
        try:
            api_response = requests.get(tmdb_url, params=params)
            api_response.raise_for_status()

            # 4. Devolver a resposta (os detalhes do filme)
            return response.Response(api_response.json(), status=api_response.status_code)

        except requests.exceptions.RequestException as e:
            # Se o filme não for encontrado (404) ou outro erro
            return response.Response(
                {"error": f"Erro ao contatar a API do TMDB: {e}"}, 
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )