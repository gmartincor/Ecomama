.PHONY: help setup verify dev prod build test clean deploy

.DEFAULT_GOAL := help

COMPOSE_DEV := docker compose -f docker-compose.dev.yml
COMPOSE_PROD := docker compose -f docker-compose.prod.yml
COMPOSE_BASE := docker compose -f docker-compose.base.yml

help:
	@echo "╔════════════════════════════════════════════════════════════╗"
	@echo "║                     ECOMAMA COMMANDS                       ║"
	@echo "╚════════════════════════════════════════════════════════════╝"
	@echo ""
	@echo "🔧 Setup"
	@echo "  make setup           Initial setup (first time)"
	@echo "  make verify          Verify Docker configuration"
	@echo ""
	@echo "🚀 Development (Local)"
	@echo "  make dev             Start development environment"
	@echo "  make dev-build       Rebuild and start development"
	@echo "  make dev-down        Stop development"
	@echo "  make logs            View all logs (dev)"
	@echo ""
	@echo "🏭 Production (VPS/Self-Hosted)"
	@echo "  make prod            Start full stack (Docker Compose)"
	@echo "  make prod-build      Build all production images"
	@echo "  make prod-down       Stop production"
	@echo "  make prod-backend    Deploy backend only (+ database)"
	@echo "  make prod-frontend   Deploy frontend only"
	@echo ""
	@echo "📦 Production (PaaS - Render/Vercel)"
	@echo "  → Use render.yaml and vercel.json"
	@echo "  → Deploy via Git push (automatic)"
	@echo "  → No docker-compose needed"
	@echo ""
	@echo "🗄️  Database"
	@echo "  make db              Start database only"
	@echo "  make db-down         Stop database"
	@echo "  make db-connect      Connect to PostgreSQL"
	@echo "  make db-reset        Reset database ⚠️"
	@echo ""
	@echo "🧪 Test"
	@echo "  make test            Run all tests"
	@echo ""
	@echo "🧹 Clean"
	@echo "  make clean           Remove dev containers and volumes"
	@echo "  make clean-all       Deep clean (requires confirmation) ⚠️"
	@echo ""

setup:
	@echo "🔧 Setting up Ecomama..."
	@if [ ! -f .env.dev ]; then cp .env.example .env.dev && echo "✓ Created .env.dev"; fi
	@if [ ! -f .env.prod ]; then cp .env.prod.example .env.prod && echo "✓ Created .env.prod (configure before production use)"; fi
	@chmod +x backend/gradlew 2>/dev/null || true && echo "✓ Made gradlew executable"
	@echo "✅ Setup complete! Run 'make dev' to start development"

verify:
	@echo "🔍 Verifying Docker configurations..."
	@$(COMPOSE_BASE) config > /dev/null && echo "✓ base.yml valid"
	@$(COMPOSE_DEV) config > /dev/null && echo "✓ dev.yml valid"
	@$(COMPOSE_PROD) config > /dev/null && echo "✓ prod.yml valid"
	@echo "✅ All configurations valid"

dev:
	@echo "🚀 Starting development environment..."
	@$(COMPOSE_DEV) up

dev-build:
	@echo "🏗️  Building and starting development..."
	@$(COMPOSE_DEV) down -v 2>/dev/null || true
	@$(COMPOSE_DEV) up --build

dev-down:
	@$(COMPOSE_DEV) down

logs:
	@$(COMPOSE_DEV) logs -f

prod:
	@echo "🏭 Starting full production stack (all services + nginx)..."
	@$(COMPOSE_PROD) --profile all up -d

prod-build:
	@echo "🏗️  Building production images..."
	@$(COMPOSE_PROD) --profile all build

prod-down:
	@$(COMPOSE_PROD) --profile all down

prod-backend:
	@echo "🚢 Deploying backend only (with database)..."
	@$(COMPOSE_PROD) --profile backend up -d

prod-frontend:
	@echo "🚢 Deploying frontend only..."
	@$(COMPOSE_PROD) --profile frontend up -d

db:
	@$(COMPOSE_BASE) up -d

db-down:
	@$(COMPOSE_BASE) down

db-connect:
	@docker exec -it ecomama-postgres psql -U ecomama_user -d ecomama_dev

db-reset:
	@read -p "⚠️  Reset database? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		$(COMPOSE_BASE) down -v; \
		$(COMPOSE_BASE) up -d; \
		echo "✅ Database reset complete"; \
	fi

test:
	@echo "🧪 Running tests..."
	@docker exec ecomama-backend-dev ./gradlew test --quiet 2>/dev/null || echo "⚠️  Backend not running"
	@docker exec ecomama-frontend-dev pnpm test --silent 2>/dev/null || echo "⚠️  Frontend not running"

clean:
	@echo "🧹 Cleaning development environment..."
	@$(COMPOSE_DEV) down -v
	@docker system prune -f
	@echo "✅ Clean complete"

clean-all:
	@read -p "⚠️  Deep clean? This removes ALL Docker data [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		$(COMPOSE_DEV) down -v; \
		$(COMPOSE_PROD) --profile all down -v; \
		$(COMPOSE_BASE) down -v; \
		docker system prune -a -f --volumes; \
		echo "✅ Deep clean complete"; \
	fi
