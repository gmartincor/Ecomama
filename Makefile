.PHONY: help setup verify dev prod build test clean deploy

.DEFAULT_GOAL := help

ENV ?= dev
COMPOSE_DEV := docker compose -f docker-compose.dev.yml --env-file .env.dev
COMPOSE_PROD := docker compose -f docker-compose.prod.yml --env-file .env.prod
COMPOSE_BACKEND := docker compose -f docker-compose.backend.yml --env-file .env.backend
COMPOSE_FRONTEND := docker compose -f docker-compose.frontend.yml --env-file .env.frontend
DB_COMPOSE := docker compose -f docker-compose.base.yml --env-file .env.$(ENV)

help:
	@echo "╔════════════════════════════════════════════════════════════╗"
	@echo "║                     ECOMAMA COMMANDS                       ║"
	@echo "╚════════════════════════════════════════════════════════════╝"
	@echo ""
	@echo "🔧 Setup"
	@echo "  make setup           Initial project setup"
	@echo "  make verify          Verify configuration"
	@echo ""
	@echo "🚀 Development"
	@echo "  make dev             Start dev services"
	@echo "  make dev-build       Rebuild dev and start"
	@echo "  make dev-down        Stop dev services"
	@echo "  make dev-logs        View dev logs"
	@echo ""
	@echo "🏭 Production"
	@echo "  make prod            Start prod services"
	@echo "  make prod-build      Build prod images"
	@echo "  make prod-down       Stop prod services"
	@echo "  make prod-logs       View prod logs"
	@echo ""
	@echo "🚢 Deployment (Separate)"
	@echo "  make deploy-backend  Deploy backend only"
	@echo "  make deploy-frontend Deploy frontend only"
	@echo "  make stop-backend    Stop backend"
	@echo "  make stop-frontend   Stop frontend"
	@echo ""
	@echo "🗄️  Database"
	@echo "  make db              Start database"
	@echo "  make db-down         Stop database"
	@echo "  make db-logs         Database logs"
	@echo "  make db-connect      Connect to DB"
	@echo "  make db-reset        Reset database ⚠️"
	@echo ""
	@echo "🏗️  Build"
	@echo "  make build-frontend  Build frontend"
	@echo "  make build-backend   Build backend"
	@echo "  make build-all       Build all"
	@echo ""
	@echo "🧪 Test"
	@echo "  make test            All tests"
	@echo "  make test-backend    Backend tests"
	@echo "  make test-frontend   Frontend tests"
	@echo ""
	@echo "🧹 Clean"
	@echo "  make clean           Remove containers"
	@echo "  make clean-all       Deep clean ⚠️"
	@echo "  make clean-images    Remove old images"
	@echo ""

setup:
	@echo "🔧 Setting up Ecomama..."
	@if [ ! -f .env.dev ]; then cp .env.example .env.dev && echo "✓ Created .env.dev"; fi
	@chmod +x backend/gradlew 2>/dev/null || true && echo "✓ Made gradlew executable"
	@echo "✅ Setup complete"

verify:
	@echo "🔍 Verifying Docker configurations..."
	@docker compose -f docker-compose.base.yml config > /dev/null && echo "✓ base.yml valid"
	@docker compose -f docker-compose.dev.yml config > /dev/null && echo "✓ dev.yml valid"
	@docker compose -f docker-compose.prod.yml config > /dev/null && echo "✓ prod.yml valid"
	@docker compose -f docker-compose.backend.yml config > /dev/null && echo "✓ backend.yml valid"
	@docker compose -f docker-compose.frontend.yml config > /dev/null && echo "✓ frontend.yml valid"
	@echo "✅ All configurations valid"

dev:
	@echo "🚀 Starting development environment..."
	$(COMPOSE_DEV) up

dev-build:
	@echo "🏗️  Building and starting development environment..."
	$(COMPOSE_DEV) up --build

dev-down:
	@echo "🛑 Stopping development environment..."
	$(COMPOSE_DEV) down

dev-logs:
	@echo "📋 Showing development logs..."
	$(COMPOSE_DEV) logs -f

prod:
	$(COMPOSE_PROD) up -d

prod-build:
	$(COMPOSE_PROD) build --no-cache

prod-down:
	$(COMPOSE_PROD) down

prod-logs:
	$(COMPOSE_PROD) logs -f

db:
	$(DB_COMPOSE) up -d

db-down:
	$(DB_COMPOSE) down

db-logs:
	$(DB_COMPOSE) logs -f

db-connect:
	@docker exec -it ecomama-postgres psql -U ecomama_user -d ecomama_dev

db-reset:
	@read -p "⚠️  Reset database? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		$(DB_COMPOSE) down -v; \
		$(DB_COMPOSE) up -d; \
	fi

build-frontend:
	@cd frontend && DOCKER_BUILDKIT=1 docker build -t ecomama-frontend:latest -f Dockerfile .

build-backend:
	@cd backend && DOCKER_BUILDKIT=1 docker build -t ecomama-backend:latest -f Dockerfile .

build-all:
	@$(MAKE) build-backend
	@$(MAKE) build-frontend

test:
	@$(MAKE) test-backend
	@$(MAKE) test-frontend

test-backend:
	@cd backend && ./gradlew test --quiet

test-frontend:
	@cd frontend && pnpm test --silent

clean:
	@$(COMPOSE_DEV) down -v
	@$(COMPOSE_PROD) down -v
	@docker system prune -f

clean-all:
	@read -p "⚠️  Deep clean? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		$(COMPOSE_DEV) down -v; \
		$(COMPOSE_PROD) down -v; \
		$(DB_COMPOSE) down -v; \
		docker system prune -a -f --volumes; \
	fi

clean-images:
	@docker images | grep '<none>' | awk '{print $$3}' | xargs docker rmi -f 2>/dev/null || true
	@docker images | grep 'ecomama' | awk '{print $$3}' | sort -u | tail -n +3 | xargs docker rmi -f 2>/dev/null || true

deploy-backend:
	@echo "🚢 Deploying backend..."
	@if [ ! -f .env.backend ]; then echo "❌ .env.backend not found"; exit 1; fi
	$(COMPOSE_BACKEND) up -d
	@echo "✅ Backend deployed"

deploy-frontend:
	@echo "🚢 Deploying frontend..."
	@if [ ! -f .env.frontend ]; then echo "❌ .env.frontend not found"; exit 1; fi
	$(COMPOSE_FRONTEND) up -d
	@echo "✅ Frontend deployed"

stop-backend:
	@echo "🛑 Stopping backend..."
	$(COMPOSE_BACKEND) down

stop-frontend:
	@echo "🛑 Stopping frontend..."
	$(COMPOSE_FRONTEND) down
