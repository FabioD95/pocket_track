# Usa un'immagine Node per costruire il progetto
FROM node:22.11.0 AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Usa un'immagine Nginx per servire i file statici
FROM nginx:1.24

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Configura Nginx per gestire il routing di React
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
