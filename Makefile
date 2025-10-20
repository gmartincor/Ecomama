.PHONY: help setup dev stop restart logs health test clean provision deploy-scripts check-staging check-production rollback

.DEFAULT_GOAL := help

help:
	@echo "╔═══════════════════════════════════════╗"
	@echo "║               ECOMAMA                 ║"
	@echo "╚═══════════════════════════════════════╝"
	@echo ""
	@echo "Development:"
	@echo "  setup              Initialize project"
	@echo "  dev                Start development"
	@echo "  stop               Stop containers"
	@echo "  restart            Restart containers"
	@echo "  logs               View logs"
	@echo "  health             Check health"
	@echo "  test               Run tests"
	@echo "  clean              Remove containers"
	@echo ""
	@echo "Deployment:"
	@echo "  provision          Provision Hetzner server"
	@echo "  deploy-scripts     Deploy scripts to server"
	@echo "  check-staging      Check staging health"
	@echo "  check-production   Check production health"
	@echo ""
	@echo "CI/CD:"
	@echo "  git push origin develop  → Staging"
	@echo "  git push origin main     → Production"
	@echo ""

setup:
	@[ -f .env.dev ] || cp .env.example .env.dev
	@chmod +x backend/gradlew infrastructure/hetzner/*.sh
	@echo "✅ Project ready"

dev:
	@docker compose -f docker-compose.dev.yml up -d
	@echo "✅ Development started"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:8080"

stop:
	@docker compose -f docker-compose.dev.yml down
	@echo "✅ Containers stopped"

restart: stop dev

logs:
	@docker compose -f docker-compose.dev.yml logs -f

health:
	@docker compose -f docker-compose.dev.yml ps

test:
	@docker compose -f docker-compose.base.yml up -d
	@sleep 10
	@docker exec backend-test ./gradlew test -q || true
	@docker exec frontend-test pnpm test --run || true
	@docker compose -f docker-compose.base.yml down -v

clean:
	@docker compose -f docker-compose.dev.yml down -v
	@docker system prune -f --volumes

provision:
	@[ -n "$(SERVER)" ] || (echo "Usage: make provision SERVER=<ip>" && exit 1)
	@ssh root@$(SERVER) 'bash -s' < infrastructure/hetzner/provision-server.sh

deploy-scripts:
	@[ -n "$(SERVER)" ] || (echo "Usage: make deploy-scripts SERVER=<ip>" && exit 1)
	@infrastructure/hetzner/setup-deploy.sh $(SERVER)

check-staging:
	@[ -n "$(SERVER)" ] || (echo "Usage: make check-staging SERVER=<ip>" && exit 1)
	@ssh deploy@$(SERVER) '/opt/ecomama/scripts/health-check.sh stg'

check-production:
	@[ -n "$(SERVER)" ] || (echo "Usage: make check-production SERVER=<ip>" && exit 1)
	@ssh deploy@$(SERVER) '/opt/ecomama/scripts/health-check.sh prod'

rollback:
	@[ -n "$(SERVER)" ] && [ -n "$(ENV)" ] && [ -n "$(TAG)" ] || \
		(echo "Usage: make rollback SERVER=<ip> ENV=<stg|prod> TAG=<version>" && exit 1)
	@ssh deploy@$(SERVER) '/opt/ecomama/scripts/rollback.sh $(ENV) $(TAG)'
