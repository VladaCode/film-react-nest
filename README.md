# FILM React + Nest

## Production Links
- Frontend: `https://<your-domain>.nomoreparties.site`
- Backend API: `https://api.<your-domain>.nomoreparties.site/api/afisha`

Update links after deployment.

## Backend Logging
Implemented 3 loggers:
- `DevLogger` (`ConsoleLogger` based)
- `JsonLogger` (JSON output)
- `TskvLogger` (TSKV `key=value` with tab separator)

Logger selection is done with env variable:
- `LOG_FORMAT=dev`
- `LOG_FORMAT=json`
- `LOG_FORMAT=tskv`

Configured in `backend/src/main.ts` with `bufferLogs: true` and `app.useLogger(...)`.

## Tests
Backend has unit tests for:
- `JsonLogger`
- `TskvLogger`
- `FilmsController`
- `OrderController`

Run tests:

```bash
cd backend
npm ci
npm test
```

Run lint:

```bash
cd backend
npm run lint
```

## Docker
Added:
- `frontend/Dockerfile` (multi-stage build, outputs frontend `dist`)
- `backend/Dockerfile` (multi-stage production build, runs `dist/main`)
- `nginx/Dockerfile` + `nginx/nginx.conf` (serves frontend and proxies `/api/` + `/content/`)
- `docker-compose.yml` with services:
  - `frontend`
  - `backend`
  - `nginx`
  - `database` (PostgreSQL)
  - `pgadmin`

Data is persisted in separate volumes:
- `postgres_data`
- `pgadmin_data`
- `frontend_dist`

## Environment Variables
Copy example and fill values:

```bash
cp .env.example .env
```

Main vars:
- `DATABASE_DRIVER`
- `DATABASE_HOST`
- `DATABASE_PORT`
- `DATABASE_NAME`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`
- `LOG_FORMAT`
- `CORS_ORIGINS`
- `PGADMIN_DEFAULT_EMAIL`
- `PGADMIN_DEFAULT_PASSWORD`
- `GHCR_OWNER`
- `IMAGE_TAG`

## Local Start in Docker

```bash
docker compose up -d --build
```

After startup:
- App: `http://localhost`
- pgAdmin: `http://localhost:8080`

## GitHub Actions (CI/CD)
Workflow: `.github/workflows/docker-publish.yml`

On push to `main` it:
1. Builds `backend`, `frontend`, `nginx` images with Buildx.
2. Publishes images to GHCR:
   - `ghcr.io/<owner>/film-react-nest-backend`
   - `ghcr.io/<owner>/film-react-nest-frontend`
   - `ghcr.io/<owner>/film-react-nest-nginx`

`GITHUB_TOKEN` is used for publishing.

## Server Deployment (Yandex Cloud)
1. Create VM and bind domain from `domain.nomoreparties.site`.
2. Install Docker + Docker Compose plugin.
3. Create deployment directory and upload:
   - `docker-compose.yml`
   - `.env`
4. Start containers:

```bash
docker compose up -d
```

5. Check status:

```bash
docker compose ps
```

6. Fill PostgreSQL with starter SQL files from `backend/test`:
   - `prac.init.sql`
   - `prac.films.sql`
   - `prac.shedules.sql`

7. Close public pgAdmin port in firewall after initial setup.
