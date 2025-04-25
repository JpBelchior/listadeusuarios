# Etapa base com Node.js
FROM node:18-alpine

# Diretório principal do container
WORKDIR /projetopraentender

# Copia os arquivos do backend
COPY backend/package*.json ./backend/
COPY backend/tsconfig.json ./backend/
COPY backend/src ./backend/src
COPY backend/nodemon.json ./backend/

# Copia os arquivos do frontend
COPY frontend/package*.json ./frontend/
COPY frontend/tsconfig.json ./frontend/
COPY frontend/src ./frontend/src


# Instala dependências do backend
WORKDIR /projetopraentender/backend
RUN npm install

# Instala dependências do frontend (mas não roda nada ainda)
WORKDIR /projetopraentender/frontend
RUN npm install

# Retorna ao backend para rodar o app
WORKDIR /projetopraentender/backend

# Expõe a porta padrão da API
EXPOSE 3000

# Roda o backend em modo dev
CMD ["npm", "run", "dev"]
