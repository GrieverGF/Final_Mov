# ============================================================
# Dockerfile - Backend API (Node.js + Express)
# MVP Controles Médicos Rurales
# ============================================================

FROM node:18-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos de dependencias primero (para cachear la capa de npm install)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente del backend
COPY . .

# Exponer el puerto del servidor Express
EXPOSE 3000

# Comando por defecto: iniciar con nodemon para desarrollo (hot-reload)
CMD ["npm", "run", "dev"]
