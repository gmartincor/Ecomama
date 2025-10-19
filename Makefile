.PHONY: help setup verify dev prod build test clean

.DEFAULT_GOAL := help

ENV ?= dev
COMPOSE_DEV := docker compose -f docker-compose.dev.yml --env-file .env.dev
COMPOSE_PROD := docker compose -f docker-compose.prod.yml --env-file .env.prod
DB_COMPOSE := docker compose -f docker-compose.base.yml --env-file .env.$(ENV)

help:
	@echo "╔════════════════════════════════════════════════════════════╗"
	@echo "║                     ECOMAMA COMMANDS                       ║"
	@echo "╚════════════════════════════════════════════════════════════╝"
	@echo ""
	@echo "� Setup"
	@echo "  make setup           Initial project setup"
	@echo "  make verify          Verify configuration"
	@echo ""
	@echo "�🚀 Development"
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
	@if [ ! -f .env.dev ]; then cp .env.example .env.dev; fi
	@chmod +x backend/gradlew 2>/dev/null || true
	@echo "✅ Setup complete"

verify:
	@docker compose -f docker-compose.base.yml config > /dev/null
	@docker compose -f docker-compose.dev.yml config > /dev/null
	@docker compose -f docker-compose.prod.yml config > /dev/null
	@echo "✅ Configuration valid"

dev:
	$(COMPOSE_DEV) up

dev-build:
	$(COMPOSE_DEV) up --build

dev-down:
	$(COMPOSE_DEV) down

dev-logs:
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
	@docker images | grep '<none>' | awk '{print $$3}' | xargs -r docker rmi -f || true
	@docker images | grep 'ecomama' | awk '{print $$3}' | sort -u | tail -n +3 | xargs -r docker rmi -f || true
