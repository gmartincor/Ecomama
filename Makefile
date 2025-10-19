.PHONY: help dev dev-build dev-down dev-logs db db-down db-logs db-connect db-reset prod prod-build prod-down prod-logs test test-backend test-frontend clean clean-all

.DEFAULT_GOAL := help

COMPOSE := docker compose
ENV_DEV := --env-file .env.dev
ENV_PROD := --env-file .env.prod
COMPOSE_DEV := $(COMPOSE) $(ENV_DEV) -f docker-compose.dev.yml
COMPOSE_PROD := $(COMPOSE) $(ENV_PROD) -f docker-compose.prod.yml
COMPOSE_BASE := $(COMPOSE) $(ENV_DEV) -f docker-compose.base.yml

help:
	@echo "╔════════════════════════════════════════════════════════════╗"
	@echo "║              ECOMAMA - Development Commands                ║"
	@echo "╚════════════════════════════════════════════════════════════╝"
	@echo ""
	@echo "🚀 Development (Full Stack)"
	@echo "  make dev             Start all services with Docker"
	@echo "  make dev-build       Rebuild and start services"
	@echo "  make dev-down        Stop all services"
	@echo "  make dev-logs        View live logs"
	@echo ""
	@echo "🗄️  Database Only"
	@echo "  make db              Start PostgreSQL + Redis only"
	@echo "  make db-down         Stop database services"
	@echo "  make db-logs         View database logs"
	@echo "  make db-connect      Connect to PostgreSQL CLI"
	@echo "  make db-reset        Reset database (⚠️  destructive)"
	@echo ""
	@echo "🚢 Production"
	@echo "  make prod            Start production stack"
	@echo "  make prod-build      Rebuild and start production"
	@echo "  make prod-down       Stop production"
	@echo "  make prod-logs       View production logs"
	@echo ""
	@echo "🧪 Testing"
	@echo "  make test            Run all tests"
	@echo "  make test-backend    Backend tests only"
	@echo "  make test-frontend   Frontend tests only"
	@echo ""
	@echo "🧹 Cleanup"
	@echo "  make clean           Remove containers & volumes"
	@echo "  make clean-all       Deep clean (⚠️  removes images)"
	@echo ""

dev:
	@echo "🚀 Starting development environment..."
	$(COMPOSE_DEV) up

dev-build:
	@echo "🔨 Building and starting development environment..."
	$(COMPOSE_DEV) up --build

dev-down:
	@echo "⏹️  Stopping development environment..."
	$(COMPOSE_DEV) down

dev-logs:
	$(COMPOSE_DEV) logs -f

db:
	@echo "🗄️  Starting database services..."
	$(COMPOSE_BASE) up -d

db-down:
	@echo "⏹️  Stopping database services..."
	$(COMPOSE_BASE) down

db-logs:
	$(COMPOSE_BASE) logs -f

db-connect:
	@echo "🔌 Connecting to PostgreSQL..."
	docker exec -it ecomama-postgres psql -U ecomama_user -d ecomama_dev

db-reset:
	@echo "⚠️  Resetting database (all data will be lost)..."
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		$(COMPOSE_DEV) down -v; \
		$(COMPOSE_BASE) up -d; \
		echo "✅ Database reset complete"; \
	else \
		echo "❌ Cancelled"; \
	fi

prod:
	@echo "🚢 Starting production environment..."
	$(COMPOSE_PROD) up -d

prod-build:
	@echo "🔨 Building and starting production..."
	$(COMPOSE_PROD) up -d --build

prod-down:
	@echo "⏹️  Stopping production..."
	$(COMPOSE_PROD) down

prod-logs:
	$(COMPOSE_PROD) logs -f

test:
	@echo "🧪 Running all tests..."
	@$(MAKE) test-backend
	@$(MAKE) test-frontend

test-backend:
	@echo "🔬 Running backend tests..."
	cd backend && ./gradlew test --quiet

test-frontend:
	@echo "🔬 Running frontend tests..."
	cd frontend && pnpm test --silent

clean:
	@echo "🧹 Cleaning up containers and volumes..."
	$(COMPOSE_DEV) down -v
	$(COMPOSE_PROD) down -v
	$(COMPOSE_BASE) down -v
	docker system prune -f
	@echo "✅ Cleanup complete"

clean-all:
	@echo "⚠️  Deep cleaning (removes images)..."
	@read -p "This will remove all Docker images. Continue? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		$(COMPOSE_DEV) down -v; \
		$(COMPOSE_PROD) down -v; \
		$(COMPOSE_BASE) down -v; \
		docker system prune -a -f --volumes; \
		echo "✅ Deep clean complete"; \
	else \
		echo "❌ Cancelled"; \
	fi
