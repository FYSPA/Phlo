FROM node:20-slim

# Directorio de trabajo en el contenedor
WORKDIR /app

# Herramientas necesarias
RUN apt-get update && apt-get install -y bash git

# Instalar expo-cli globalmente
RUN npm install -g expo-cli @expo/ngrok

# Variables de entorno para que el servidor de desarrollo sea accesible externamente
ENV HOST=0.0.0.0
ENV PORT=8081

# Copiamos archivos de dependencias
COPY package.json package-lock.json* yarn.lock* ./

# Instalamos dependencias
RUN npm install

# No copiamos el resto del código aquí porque lo montaremos como un volumen
# en docker-compose para tener Hot-Reloading.

EXPOSE 8081

# Comando de inicio
CMD ["npx", "expo", "start", "--tunnel"]
