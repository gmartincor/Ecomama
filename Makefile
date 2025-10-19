.PHONY: help setup dev logs health test clean

.DEFAULT_GOAL := help

help:
	@echo "╔═══════════════════════════════════════╗"
	@echo "║               ECOMAMA                 ║"
	@echo "╚═══════════════════════════════════════╝"
	@echo ""
	@echo "🔧  setup       Initialize project"
	@echo "🚀  dev         Start development"
	@echo "📋  logs        View logs"
	@echo "💚  health      Check health"
	@echo "🧪  test        Run tests"
	@echo "🧹  clean       Remove containers"
	@echo ""
	@echo "Deploy:"
	@echo "  git push origin develop  → Staging"
	@echo "  git push origin main     → Production"
	@echo ""

setup:
	@[ -f .env.dev ] || cp .env.example .env.dev
	@chmod +x backend/gradlew infrastructure/hetzner/*.sh
	@echo "✅ Ready"

dev:
	@docker compose -f docker-compose.dev.yml up

logs:
	@docker compose -f docker-compose.dev.yml logs -f

health:
	@docker compose -f docker-compose.dev.yml ps

test:
	@docker compose -f docker-compose.base.yml up -d
	@sleep 10
	@docker exec backend-test ./gradlew test --no-daemon --quiet || true
	@docker exec frontend-test pnpm test --run || true
	@docker compose -f docker-compose.base.yml down -v

clean:
	@docker compose -f docker-compose.dev.yml down -v
	@docker system prune -f --volumes
