# Pocket Track Backend

## Setup

Questo progetto utilizza Docker per la containerizzazione. MongoDB Atlas è usato come database.

### Prerequisiti

- Docker
- Docker Compose

### Configurazione

1. Clona il repository.
2. Configura il file `.env` (vedi `.env.example` per riferimento).
3. Costruisci l'immagine Docker:
   ```bash
   docker-compose up --build -d
   ```

# Avviare i container:

- docker-compose up -d

# Fermare i container:

- docker-compose down

# Controllare i log:

- docker ps
- docker logs <CONTAINER_ID>

# creare una imagine

- docker buildx build --platform linux/amd64 -t fabiod95/pocket_track_be-backend .
