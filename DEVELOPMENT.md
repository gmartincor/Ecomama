# Development Guide

## Prerequisites

**Required:**
- Docker Desktop 4.25+ (with Compose V2)
- Git 2.40+

**Local mode only:**
- Java 21+
- Node.js 20+
- pnpm 8+

## Quick Start

**Full Docker (Recommended):**
```bash
./setup.sh docker
make dev-logs
```

**Local with Docker DB:**
```bash
./setup.sh local
cd frontend && pnpm dev
cd backend && ./gradlew bootRun
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8080/api/v1
- Swagger: http://localhost:8080/swagger-ui.html
- Database: localhost:5432

## Commands

**Development:**
```bash
make dev                # Start
make dev-build          # Rebuild
make dev-logs           # View logs
make dev-down           # Stop
```

**Database:**
```bash
make db                 # Start DB only
make db-connect         # PostgreSQL CLI
make db-reset           # Reset (destructive)
```

**Testing:**
```bash
make test               # All tests
make test-backend       # Backend only
make test-frontend      # Frontend only
```

**Production:**
```bash
make prod-build         # Build & start
make prod-logs          # View logs
make prod-down          # Stop
```

**Cleanup:**
```bash
make clean              # Remove containers
make clean-all          # Remove images too
```

## Workflow

**Docker Mode:**
1. `./setup.sh docker`
2. Edit code in `frontend/src` or `backend/src`
3. Changes hot-reload automatically
4. Debug backend: `localhost:5005`
5. `make dev-down` to stop

**Local Mode:**
1. `./setup.sh local`
2. `make db`
3. Start services in separate terminals
4. Ctrl+C to stop each service

## Database

**Connect:**
```bash
make db-connect
```

**Common SQL:**
```sql
\dt                     -- Tables
\d+ table_name          -- Schema
\q                      -- Exit
```

**Migrations:**
- Location: `backend/src/main/resources/db/migration/`
- Format: `V1__description.sql`
- Applied on startup (Flyway)

## Testing

```bash
make test                        # All
cd frontend && pnpm test         # Frontend unit
cd frontend && pnpm test:e2e     # E2E
cd backend && ./gradlew test     # Backend
```

## Environment

| File | Committed | Purpose |
|------|-----------|---------|
| `.env.example` | ✅ | Template |
| `.env.dev` | ✅ | Development |
| `.env.local` | ❌ | Local overrides |
| `.env.prod.example` | ✅ | Prod template |
| `.env.prod` | ❌ | Production |

**Development:** Uses `.env.dev` automatically

**Production:**
```bash
cp .env.prod.example .env.prod
vim .env.prod  # Update secrets
make prod-build
```

## Docker Architecture

**Compose Files:**
- `base.yml` - PostgreSQL + Redis
- `dev.yml` - Development with hot-reload
- `prod.yml` - Production with Nginx

**Key Features:**
- Compose V2 with `include:`
- Shared config via anchors (`&`)
- Named volumes for dependencies
- Bind mounts for hot-reload

**Network:**
```
┌──────────────────────────────┐
│   ecomama-network            │
│  Postgres → Backend ← Redis  │
│              ↓               │
│          Frontend            │
└──────────────────────────────┘
         ↓
    localhost
```

## Troubleshooting

**Port in use:**
```bash
lsof -ti:3000 | xargs kill -9
make dev-down
```

**Permission denied:**
```bash
chmod +x backend/gradlew setup.sh
```

**Database connection failed:**
```bash
make db-down && make db
docker logs -f ecomama-postgres
```

**Build fails:**
```bash
make clean-all
./setup.sh docker
```

**Hot-reload not working:**
```bash
docker restart ecomama-frontend-dev
docker restart ecomama-backend-dev
```

**Health check:**
```bash
docker ps
make dev-logs
curl http://localhost:8080/actuator/health
```

**Nuclear option:**
```bash
make clean-all
docker system prune -a --volumes
./setup.sh docker
```

## Production

**Checklist:**
- [ ] Copy `.env.prod.example` to `.env.prod`
- [ ] Set strong passwords
- [ ] Configure Stripe, email, JWT secret
- [ ] Add SSL certs to `infrastructure/nginx/ssl/`
- [ ] Disable Swagger (`SWAGGER_ENABLED=false`)

**Deploy:**
```bash
cp .env.prod.example .env.prod
vim .env.prod
make prod-build
```

**Access:** http://localhost (via Nginx)

**SSL Setup:**
```bash
infrastructure/nginx/ssl/cert.pem
infrastructure/nginx/ssl/key.pem
```

Uncomment HTTPS in `nginx/conf.d/default.conf`, then:
```bash
docker restart ecomama-nginx-prod
```

## Resources

- [Architecture](./docs/ARCHITECTURE.md)
- [Implementation Plan](./IMPLEMENTATION_PLAN.md)
- Run `make help` for all commands


````
