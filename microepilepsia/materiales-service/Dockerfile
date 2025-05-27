FROM node:20

# Crear directorio de trabajo
WORKDIR /app

# Copiar e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY ./src ./src

# Establecer puerto
EXPOSE 5003

# Comando de inicio
CMD ["node", "src/index.js"]
