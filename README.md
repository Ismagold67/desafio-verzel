# Desafio Elite Dev - Lista de Filmes (Verzel)

Este é um projeto Full-Stack desenvolvido como parte do desafio técnico Elite Dev da Verzel. A aplicação permite aos usuários buscar filmes, gerenciar uma lista de favoritos e compartilhar essa lista com um link único.

O projeto está estruturado como um **monorepo**, contendo o `backend` e o `frontend` no mesmo repositório, conforme solicitado.

---

## 🚀 Links do Deploy

* **Front-End (React):** `[LINK DO FRONT-END NA VERCEL - PREENCHER DEPOIS]`
* **Back-End (Django):** `[LINK DO BACK-END NO RENDER - PREENCHER DEPOIS]`

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias:

### **Back-End (Pasta: `/backend`)**
* **Python 3**
* **Django** (para a estrutura do servidor)
* **Django Rest Framework (DRF)** (para a criação da API RESTful)
* **PostgreSQL** (Banco de dados em produção)
* **SQLite3** (Banco de dados em desenvolvimento)
* **Gunicorn** (Servidor de aplicação WSGI para produção)
* **Whitenoise** (Para servir arquivos estáticos do Admin)
* **dj-database-url** (Para configuração flexível do banco de dados)
* **django-cors-headers** (Para permitir a comunicação entre o front-end e o back-end)

### **Front-End (Pasta: `/frontend`)**
* **React 18** (com Hooks: `useState`, `useEffect`, `useRef`)
* **Vite** (Como ferramenta de build e servidor de desenvolvimento)
* **React Router DOM** (Para o sistema de rotas e páginas)
* **CSS Puro** (Para estilização, sem frameworks)

---

## ✅ Requisitos Cumpridos

Todos os requisitos funcionais solicitados no desafio foram implementados:

### Front-End:
* [✔] Interface de pesquisa de filmes (consumindo o TMDB via proxy do back-end).
* [✔] Exibição de detalhes dos filmes selecionados (clique no card para abrir um modal com sinopse, nota, gêneros e data de lançamento).
* [✔] Nota do TMDB (rating) apresentada de forma destacada (no card e no modal).
* [✔] Gerenciamento da lista de filmes favoritos (adicionar/remover).
* [✔] O usuário pode ver sua própria lista de favoritos dentro do app (clicando em "Ver Meus Favoritos").
* [✔] Os favoritos persistem (não somem) ao recarregar a página, usando `localStorage`.

### Back-End:
* [✔] Gestão das chamadas para a API do TMDB (atuando como um proxy para proteger a Chave de API).
* [✔] Armazenamento da lista de filmes favoritos (em banco de dados).
* [✔] Implementação de lógica para permitir o compartilhamento da lista via link (com botão "Copiar Link").

---

## 🏁 Como Executar Localmente

Para rodar este projeto em sua máquina local, siga os passos abaixo.

### Pré-requisitos
* [Python 3.10+](https://www.python.org/downloads/)
* [Node.js 18+](https://nodejs.org/en)
* Uma Chave de API do [The Movie Database (TMDB)](https://www.themoviedb.org/signup)

### 1. Clonar o Repositório
```bash
git clone [https://github.com/](https://github.com/)[SEU-NOME-NO-GITHUB]/[NOME-DO-SEU-REPOSITORIO].git
cd [NOME-DO-SEU-REPOSITORIO]
```

*(Não se esqueça de editar a URL acima com seu usuário e nome de repositório!)*

### 2. Configurar o Back-End (Django)
1. Navegue até a pasta do back-end

```
cd backend
```

2. Crie e ative um ambiente virtual:
```bash
python -m venv venv
source venv/bin/activate  # (ou venv\Scripts\activate no Windows)
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

4. Crie um arquivo `.env` na pasta `backend` e adicione suas chaves:
```.env
TMDB_API_KEY=sua_chave_secreta_do_tmdb_aqui
SECRET_KEY=sua_secret_key_django_aqui_(pode_copiar_do_settings.py_localmente)
```

5. Rode as migrações para criar o banco de dados `db.sqlite3`:
```bash
python manage.py migrate
```

6. Inicie o servidor do Django (ele rodará na porta 8000):
```bash
python manage.py runserver
```

### 3. Configurar o Front-End (React)
1. Em um **novo terminal**, navegue até a pasta do front-end (a partir da raiz do projeto):
```bash
cd frontend
```

2. Instale as dependências do Node:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento do Vite (ele rodará na porta 5173):
```bash
npm run dev
```

### 4. Acessar a Aplicação
Abra seu navegador e acesse `http://localhost:5173`.