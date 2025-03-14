FROM node:20

#Genericco que dio chatgpt
RUN apt-get update && apt-get install -y netcat-openbsd

#Direcctorio donde del contenedor
WORKDIR /app

#Comando para esperar que mySql este activo
COPY wait-for-mysql.sh /wait-for-mysql.sh
RUN chmod +x /wait-for-mysql.sh

#Copiando dependencias e instalando en el 
#directorio del contenedor
COPY package*.json ./
RUN npm install

#Copiando codigo al directorio del contenedor
COPY . .

#Corre el comando y cuando este activo mySql corre el npm start
CMD ["/wait-for-mysql.sh", "mysqldb", "3306", "npm", "start"]