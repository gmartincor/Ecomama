# Ecomama Docker Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     DEVELOPMENT ENVIRONMENT                      │
└─────────────────────────────────────────────────────────────────┘

    Developer Machine (localhost)
    ─────────────────────────────
    
    Port: 3000                Port: 8080
    ┌──────────┐             ┌──────────┐
    │ Browser  │────────────▶│   IDE    │
    │          │◀────────────│          │
    └──────────┘             └──────────┘
         │                        │
         │                        │ Debug: 5005
         ▼                        ▼
    ╔════════════════════════════════════════════════════════╗
    ║            Docker Network: ecomama-network             ║
    ╠════════════════════════════════════════════════════════╣
    ║                                                        ║
    ║  ┌────────────────┐         ┌────────────────┐       ║
    ║  │   Frontend     │────────▶│    Backend     │       ║
    ║  │   Next.js      │         │  Spring Boot   │       ║
    ║  │   Port: 3000   │         │   Port: 8080   │       ║
    ║  │                │         │   Debug: 5005  │       ║
    ║  └────────────────┘         └────────────────┘       ║
    ║         │                           │                 ║
    ║         │                           │                 ║
    ║         │                           ▼                 ║
    ║         │                   ┌────────────────┐       ║
    ║         │                   │   PostgreSQL   │       ║
    ║         │                   │   PostGIS      │       ║
    ║         │                   │   Port: 5432   │       ║
    ║         │                   └────────────────┘       ║
    ║         │                           │                 ║
    ║         │                           │                 ║
    ║         └──────────────┐   ┌────────┘                ║
    ║                        │   │                         ║
    ║                        ▼   ▼                         ║
    ║                   ┌────────────────┐                 ║
    ║                   │     Redis      │                 ║
    ║                   │   Port: 6379   │                 ║
    ║                   └────────────────┘                 ║
    ║                                                        ║
    ╚════════════════════════════════════════════════════════╝
                            │
                            │
                            ▼
              ┌─────────────────────────┐
              │    Docker Volumes       │
              ├─────────────────────────┤
              │ • postgres_data         │
              │ • redis_data            │
              │ • gradle_cache          │
              │ • backend_build         │
              │ • backend_uploads       │
              │ • frontend_node_modules │
              │ • frontend_next         │
              └─────────────────────────┘
```

## Production Environment

```
┌─────────────────────────────────────────────────────────────────┐
│                     PRODUCTION ENVIRONMENT                       │
└─────────────────────────────────────────────────────────────────┘

    Internet
    ────────
         │
         │ Port: 80/443
         ▼
    ╔════════════════════════════════════════════════════════╗
    ║            Docker Network: ecomama-network             ║
    ╠════════════════════════════════════════════════════════╣
    ║                                                        ║
    ║  ┌────────────────────────────────────────────┐       ║
    ║  │              Nginx                         │       ║
    ║  │         Reverse Proxy                      │       ║
    ║  │       Port: 80, 443                        │       ║
    ║  └────────────────────────────────────────────┘       ║
    ║         │                    │                         ║
    ║         │ /api               │ /                       ║
    ║         ▼                    ▼                         ║
    ║  ┌────────────────┐   ┌────────────────┐             ║
    ║  │    Backend     │   │   Frontend     │             ║
    ║  │  Spring Boot   │   │   Next.js      │             ║
    ║  │  (Optimized)   │   │  (Standalone)  │             ║
    ║  │  Port: 8080    │   │   Port: 3000   │             ║
    ║  └────────────────┘   └────────────────┘             ║
    ║         │                                              ║
    ║         │                                              ║
    ║         ▼                                              ║
    ║  ┌────────────────┐         ┌────────────────┐       ║
    ║  │   PostgreSQL   │         │     Redis      │       ║
    ║  │   PostGIS      │         │   Port: 6379   │       ║
    ║  │   Port: 5432   │         │                │       ║
    ║  └────────────────┘         └────────────────┘       ║
    ║         │                           │                 ║
    ║         │                           │                 ║
    ║         └───────────────┬───────────┘                 ║
    ║                         │                             ║
    ║                         ▼                             ║
    ║              ┌─────────────────────┐                 ║
    ║              │   Persistent Data   │                 ║
    ║              │   - postgres_data   │                 ║
    ║              │   - redis_data      │                 ║
    ║              │   - uploads         │                 ║
    ║              └─────────────────────┘                 ║
    ║                                                        ║
    ╚════════════════════════════════════════════════════════╝
```

## Docker Compose Structure

```
Project Root
├── docker-compose.base.yml     ← Base services (DB, Cache)
├── docker-compose.dev.yml      ← Development (includes base)
└── docker-compose.prod.yml     ← Production (includes base)

docker-compose.base.yml
┌────────────────────┐
│ postgres           │  PostGIS 16 with spatial extensions
│ - port: 5432       │  Health: pg_isready
│ - volume: data     │  Restart: unless-stopped
└────────────────────┘
┌────────────────────┐
│ redis              │  Redis 7 for caching
│ - port: 6379       │  Health: redis-cli ping
│ - volume: data     │  Restart: unless-stopped
└────────────────────┘

docker-compose.dev.yml (extends base)
┌────────────────────┐
│ backend            │  Spring Boot with hot reload
│ - port: 8080       │  Volumes: src/ mounted
│ - debug: 5005      │  Health: /actuator/health
│ - depends: postgres│  Restart: unless-stopped
│           redis    │
└────────────────────┘
┌────────────────────┐
│ frontend           │  Next.js with Fast Refresh
│ - port: 3000       │  Volumes: src/ mounted
│ - depends: backend │  Health: /api/health
│                    │  Restart: unless-stopped
└────────────────────┘

docker-compose.prod.yml (extends base)
┌────────────────────┐
│ backend            │  Optimized JAR (multi-stage)
│ - port: 8080       │  No volumes mounted
│ - depends: postgres│  Health: /actuator/health
│           redis    │  Restart: unless-stopped
└────────────────────┘
┌────────────────────┐
│ frontend           │  Standalone build (optimized)
│ - port: 3000       │  No volumes mounted
│ - depends: backend │  Health: /api/health
│                    │  Restart: unless-stopped
└────────────────────┘
┌────────────────────┐
│ nginx              │  Reverse proxy & load balancer
│ - port: 80, 443    │  Routes to frontend/backend
│ - depends: frontend│  Health: /health
│           backend  │  Restart: unless-stopped
└────────────────────┘
```

## Volume Architecture

```
Development Volumes
─────────────────────────────────────────────────

Persistent Data (survives restarts)
┌──────────────────────────────────┐
│ ecomama_postgres_data            │ ← Database data
│ ecomama_redis_data               │ ← Cache data
└──────────────────────────────────┘

Build Caches (improves rebuild speed)
┌──────────────────────────────────┐
│ ecomama_gradle_cache             │ ← Gradle dependencies
│ ecomama_backend_build            │ ← Compiled classes
│ ecomama_frontend_node_modules    │ ← NPM packages
│ ecomama_frontend_next            │ ← Next.js cache
└──────────────────────────────────┘

Application Data
┌──────────────────────────────────┐
│ ecomama_backend_uploads          │ ← User uploads
└──────────────────────────────────┘

Source Code Mounts (hot reload)
┌──────────────────────────────────┐
│ ./backend/src → /app/src         │ ← Java sources
│ ./frontend/src → /app/src        │ ← TypeScript sources
└──────────────────────────────────┘
```

## Network Communication Flow

```
Development Request Flow
────────────────────────────────────────────────

1. User Request
   Browser :3000
      │
      ▼
   Frontend Container (next.js)
      │
      │ Internal DNS: backend:8080
      ▼
   Backend Container (spring-boot)
      │
      ├─▶ PostgreSQL (postgres:5432)
      │   └─▶ Executes SQL
      │       └─▶ Returns data
      │
      └─▶ Redis (redis:6379)
          └─▶ Cache lookup/store
              └─▶ Returns cached data
      
   ◀── Response flow (reverse)


Production Request Flow
────────────────────────────────────────────────

1. User Request
   Browser :80/:443
      │
      ▼
   Nginx (reverse proxy)
      │
      ├─▶ /api/* → backend:8080
      │   └─▶ Spring Boot API
      │
      └─▶ /* → frontend:3000
          └─▶ Next.js SSR/Static

2. Backend Operations
   Backend Container
      │
      ├─▶ postgres:5432
      └─▶ redis:6379
```

## Health Check Flow

```
Health Check Chain
──────────────────────────────────────────────

Startup Order (with health checks):
1. postgres     ─────▶ pg_isready
                       └─▶ HEALTHY
2. redis        ─────▶ redis-cli ping
                       └─▶ HEALTHY
3. backend      ─────▶ wait for postgres & redis
                ─────▶ /actuator/health
                       └─▶ HEALTHY
4. frontend     ─────▶ wait for backend
                ─────▶ /api/health
                       └─▶ HEALTHY
5. nginx (prod) ─────▶ wait for frontend & backend
                ─────▶ /health
                       └─▶ HEALTHY

If any health check fails:
- Container marked unhealthy
- Dependent services won't start
- Automatic restart after max retries
```

## File Organization

```
Project Structure
────────────────────────────────────────────────

Ecomama/
│
├── docker-compose.base.yml      ← Shared services
├── docker-compose.dev.yml       ← Development config
├── docker-compose.prod.yml      ← Production config
│
├── .env.dev                     ← Dev environment vars
├── .env.example                 ← Template
├── .env.prod                    ← Prod environment vars
│
├── Makefile                     ← Simplified commands
├── setup.sh                     ← Initial setup script
├── verify-docker.sh             ← Configuration validator
│
├── backend/
│   ├── Dockerfile               ← Production build
│   ├── Dockerfile.dev           ← Development build
│   ├── .dockerignore            ← Exclude files
│   └── src/
│       └── main/resources/
│           ├── application.properties
│           └── application-dev.properties
│
├── frontend/
│   ├── Dockerfile               ← Production build
│   ├── Dockerfile.dev           ← Development build
│   ├── .dockerignore            ← Exclude files
│   └── src/                     ← Source code
│
├── infrastructure/
│   ├── init-db.sql              ← Database initialization
│   └── nginx/
│       ├── nginx.conf           ← Main nginx config
│       └── conf.d/              ← Virtual hosts
│
└── docs/
    ├── DOCKER.md                ← Full Docker guide
    ├── DOCKER_OPTIMIZATION.md   ← Optimization details
    ├── DOCKER_QUICK_REF.md      ← Quick reference
    └── DOCKER_CHECKLIST.md      ← Validation checklist
```

## Configuration Matrix

```
┌──────────────┬────────────────┬────────────────┬──────────────┐
│   Service    │  Development   │   Production   │    Shared    │
├──────────────┼────────────────┼────────────────┼──────────────┤
│ PostgreSQL   │ docker-compose.base.yml         │ Port: 5432   │
│              │ Volume: ecomama_postgres_data   │ PostGIS 16   │
├──────────────┼────────────────┼────────────────┼──────────────┤
│ Redis        │ docker-compose.base.yml         │ Port: 6379   │
│              │ Volume: ecomama_redis_data      │ Redis 7      │
├──────────────┼────────────────┼────────────────┼──────────────┤
│ Backend      │ Hot reload     │ Optimized JAR  │ Port: 8080   │
│              │ Debug: 5005    │ Multi-stage    │ Health check │
│              │ Volume mounts  │ No volumes     │ Spring Boot  │
├──────────────┼────────────────┼────────────────┼──────────────┤
│ Frontend     │ Fast Refresh   │ Standalone     │ Port: 3000   │
│              │ Volume mounts  │ No volumes     │ Health check │
│              │ Dev server     │ Production srv │ Next.js      │
├──────────────┼────────────────┼────────────────┼──────────────┤
│ Nginx        │ Not used       │ Reverse proxy  │ Port: 80,443 │
│              │                │ SSL/TLS        │ Load balance │
└──────────────┴────────────────┴────────────────┴──────────────┘
```

## Key Design Decisions

### 1. Modular Compose Files
**Decision**: Separate base, dev, and prod configurations
**Rationale**: DRY principle, easier maintenance, clear separation
**Implementation**: `include` directive in dev/prod files

### 2. Service Names Instead of Localhost
**Decision**: Use DNS service names (postgres, redis, backend)
**Rationale**: True containerization, production parity
**Implementation**: Removed localhost fallbacks from configs

### 3. Named Volumes with Prefix
**Decision**: All volumes prefixed with `ecomama_`
**Rationale**: Clear ownership, avoid conflicts, easy cleanup
**Implementation**: Consistent naming across all compose files

### 4. Unified Restart Policy
**Decision**: `restart: unless-stopped` for all services
**Rationale**: Simpler than deploy.restart_policy, more reliable
**Implementation**: Removed complex restart configurations

### 5. Hot Reload for Development
**Decision**: Mount source directories as volumes
**Rationale**: Fast development feedback, no rebuild needed
**Implementation**: Delegated volumes with proper flags

### 6. Multi-stage Production Builds
**Decision**: Separate builder and runtime stages
**Rationale**: Minimal image size, security, performance
**Implementation**: Optimized Dockerfiles for both services

### 7. Health Check Dependencies
**Decision**: Services wait for dependencies to be healthy
**Rationale**: Proper startup order, avoid connection errors
**Implementation**: `depends_on` with `condition: service_healthy`

### 8. Environment-based Configuration
**Decision**: All config via environment variables
**Rationale**: 12-factor app, no hardcoded values, flexibility
**Implementation**: Comprehensive .env files

## Performance Characteristics

```
Development Mode
────────────────────────────────────────────────
• First build:  ~5-10 minutes (downloads deps)
• Rebuild:      ~30-60 seconds (uses caches)
• Hot reload:   ~2-5 seconds (no rebuild)
• Startup:      ~30-60 seconds (with health checks)

Production Mode
────────────────────────────────────────────────
• Build:        ~10-15 minutes (full optimization)
• Image size:   
  - Backend:    ~250MB (JRE + JAR)
  - Frontend:   ~150MB (Node + standalone)
• Startup:      ~20-40 seconds (optimized)
```

## Security Model

```
Security Layers
────────────────────────────────────────────────

1. Network Isolation
   └─▶ Internal bridge network
       └─▶ Services can't reach host
           └─▶ Only exposed ports accessible

2. Non-root Users (Production)
   └─▶ Backend runs as 'spring:spring'
       └─▶ Frontend runs as 'nextjs:nodejs'

3. Environment Variables
   └─▶ No hardcoded secrets
       └─▶ Secrets via .env files
           └─▶ .env.prod not committed

4. Read-only Volumes
   └─▶ Config files mounted :ro
       └─▶ Prevents accidental modification

5. Health Endpoints
   └─▶ Public health checks
       └─▶ No sensitive data exposed
```

## Troubleshooting Decision Tree

```
Service Won't Start?
├─▶ Check logs: make dev-logs
├─▶ Port conflict? lsof -i :PORT
├─▶ Dependencies healthy? docker ps
└─▶ Environment vars? docker exec SERVICE env

Can't Connect to Database?
├─▶ Service name correct? (postgres, not localhost)
├─▶ Network configured? docker network inspect
├─▶ Container running? docker ps | grep postgres
└─▶ Credentials correct? check .env.dev

Hot Reload Not Working?
├─▶ Volumes mounted? docker inspect SERVICE
├─▶ File watching enabled? Check WATCHPACK_POLLING
├─▶ Restart container: docker compose restart SERVICE
└─▶ Rebuild: make dev-build

Performance Issues?
├─▶ Check resources: docker stats
├─▶ Clean volumes: make clean
├─▶ Prune system: docker system prune
└─▶ Check disk space: docker system df
```

---

**Architecture Status**: ✅ Production Ready

**Last Updated**: 2025-10-19

**Validated**: Automated verification + Manual testing
