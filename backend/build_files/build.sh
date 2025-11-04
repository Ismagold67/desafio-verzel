#!/bin/bash

# Saia imediatamente se um comando falhar
set -e

echo "Iniciando build..."

# Instale o poetry (ou qualquer outro gerenciador, se usar)
# pip install poetry

# Instale as dependências
pip install -r requirements.txt

# Coleta os arquivos estáticos (do Admin)
python manage.py collectstatic --no-input

# Aplica as migrações do banco de dados
python manage.py migrate

echo "Build finalizado."