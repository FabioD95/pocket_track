# Usa l'immagine ufficiale Node.js
FROM node:22.11.0

# Imposta la directory di lavoro nel container
WORKDIR /usr/src/app

# Copia i file package.json e package-lock.json per installare le dipendenze
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto dei file nel container
COPY . .

# Compila TypeScript
RUN npm run build

# Espone la porta utilizzata dall'app
EXPOSE 3000

# Comando per avviare il server
CMD ["npm", "start"]
