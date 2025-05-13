# Etapa 1: Build
FROM node:20 AS builder

WORKDIR /app

# Copiamos dependencias y las instalamos
COPY package*.json ./
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Etapa 2: Producción
FROM node:20-slim AS production

# Instalamos solo lo necesario para producción
RUN apt-get update && apt-get install -y netcat-openbsd && apt-get clean

WORKDIR /app

# Copiamos solo lo necesario desde la etapa anterior
COPY --from=builder /app /app

# Aseguramos permisos de ejecución para el script
RUN chmod +x /app/wait-for-mysql.sh

# Comando de arranque
CMD ["/app/wait-for-mysql.sh", "mysqldb", "3306", "npm", "start"]
