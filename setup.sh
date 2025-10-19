#!/bin/bash

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

MODE="${1:-docker}"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║          🌱 Ecomama Development Setup                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

check_command() {
    if ! command -v "$1" >/dev/null 2>&1; then
        echo -e "${RED}✗ $1 is required but not installed${NC}"
        return 1
    fi
    echo -e "${GREEN}✓ $1 found${NC}"
    return 0
}

echo -e "${BLUE}Checking prerequisites...${NC}"

check_command docker || exit 1

if ! docker compose version >/dev/null 2>&1; then
    echo -e "${RED}✗ Docker Compose V2 is required${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker Compose V2 found${NC}"

if [ "$MODE" = "local" ]; then
    check_command java || exit 1
    check_command node || exit 1
    check_command pnpm || exit 1
fi

echo ""
echo -e "${BLUE}Validating environment files...${NC}"

if [ ! -f .env.dev ]; then
    echo -e "${YELLOW}Creating .env.dev from .env.example...${NC}"
    cp .env.example .env.dev
    echo -e "${GREEN}✓ Created .env.dev${NC}"
fi

chmod +x backend/gradlew 2>/dev/null || true

echo ""

if [ "$MODE" = "docker" ]; then
    echo -e "${BLUE}Starting full Docker environment...${NC}"
    echo ""
    docker compose --env-file .env.dev -f docker-compose.dev.yml up -d --build
    
    echo ""
    echo -e "${GREEN}✅ All services started successfully!${NC}"
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║                    Access Points                           ║"
    echo "╠════════════════════════════════════════════════════════════╣"
    echo "║  Frontend:      http://localhost:3000                      ║"
    echo "║  Backend API:   http://localhost:8080/api/v1               ║"
    echo "║  Swagger UI:    http://localhost:8080/swagger-ui.html      ║"
    echo "║  PostgreSQL:    localhost:5432                             ║"
    echo "║  Redis:         localhost:6379                             ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    echo -e "${BLUE}Useful commands:${NC}"
    echo "  View logs:    make dev-logs"
    echo "  Stop:         make dev-down"
    echo "  Restart:      make dev-restart"
    echo "  DB connect:   make db-connect"
    echo ""
else
    echo -e "${BLUE}Setting up local development with Docker DB...${NC}"
    echo ""
    
    if [ ! -d "frontend/node_modules" ]; then
        echo -e "${BLUE}Installing frontend dependencies...${NC}"
        cd frontend && pnpm install && cd ..
        echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
    else
        echo -e "${GREEN}✓ Frontend dependencies already installed${NC}"
    fi
    
    echo -e "${BLUE}Starting database services...${NC}"
    docker compose --env-file .env.dev -f docker-compose.base.yml up -d
    echo -e "${GREEN}✓ Database services started${NC}"
    
    echo ""
    echo -e "${GREEN}✅ Local development setup complete!${NC}"
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║              Start Development Services                    ║"
    echo "╠════════════════════════════════════════════════════════════╣"
    echo "║  Terminal 1:  cd frontend && pnpm dev                      ║"
    echo "║  Terminal 2:  cd backend && ./gradlew bootRun              ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║                    Access Points                           ║"
    echo "╠════════════════════════════════════════════════════════════╣"
    echo "║  Frontend:      http://localhost:3000                      ║"
    echo "║  Backend API:   http://localhost:8080/api/v1               ║"
    echo "║  Swagger UI:    http://localhost:8080/swagger-ui.html      ║"
    echo "║  PostgreSQL:    localhost:5432                             ║"
    echo "║  Redis:         localhost:6379                             ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    echo -e "${BLUE}Useful commands:${NC}"
    echo "  DB logs:      make db-logs"
    echo "  DB connect:   make db-connect"
    echo "  Stop DB:      make db-down"
    echo ""
fi

echo -e "${YELLOW}Tip: Use 'make help' to see all available commands${NC}"
echo ""
