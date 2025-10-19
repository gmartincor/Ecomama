#!/bin/bash

# =========================================
# Ecomama Development Environment Setup
# =========================================

set -e

echo "🌱 Setting up Ecomama development environment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

command -v java >/dev/null 2>&1 || { echo -e "${RED}Java 21 is required but not installed. Aborting.${NC}" >&2; exit 1; }
command -v node >/dev/null 2>&1 || { echo -e "${RED}Node.js is required but not installed. Aborting.${NC}" >&2; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo -e "${RED}pnpm is required but not installed. Aborting.${NC}" >&2; exit 1; }
command -v docker >/dev/null 2>&1 || { echo -e "${RED}Docker is required but not installed. Aborting.${NC}" >&2; exit 1; }

echo -e "${GREEN}✓ All prerequisites met${NC}"

# Create environment files
echo -e "${BLUE}Creating environment files...${NC}"

if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo -e "${GREEN}✓ Created .env.local${NC}"
else
    echo -e "${GREEN}✓ .env.local already exists${NC}"
fi

if [ ! -f frontend/.env.local ]; then
    cp frontend/.env.local.example frontend/.env.local
    echo -e "${GREEN}✓ Created frontend/.env.local${NC}"
else
    echo -e "${GREEN}✓ frontend/.env.local already exists${NC}"
fi

# Install frontend dependencies
echo -e "${BLUE}Installing frontend dependencies...${NC}"
cd frontend
pnpm install
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
cd ..

# Make gradlew executable
echo -e "${BLUE}Setting up backend...${NC}"
chmod +x backend/gradlew
echo -e "${GREEN}✓ Backend setup complete${NC}"

# Start Docker services
echo -e "${BLUE}Starting Docker services (PostgreSQL, Redis)...${NC}"
docker-compose -f infrastructure/docker-compose.yml up -d postgres redis
echo -e "${GREEN}✓ Docker services started${NC}"

# Wait for services to be ready
echo -e "${BLUE}Waiting for services to be ready...${NC}"
sleep 10

# Run database migrations (when implemented)
# echo -e "${BLUE}Running database migrations...${NC}"
# cd backend
# ./gradlew flywayMigrate
# cd ..
# echo -e "${GREEN}✓ Database migrations complete${NC}"

echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}✓ Setup complete!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""
echo -e "${BLUE}To start development:${NC}"
echo "  Frontend: cd frontend && pnpm dev"
echo "  Backend:  cd backend && ./gradlew bootRun"
echo ""
echo -e "${BLUE}To stop services:${NC}"
echo "  docker-compose -f infrastructure/docker-compose.yml down"
echo ""
echo -e "${BLUE}Access points:${NC}"
echo "  Frontend:     http://localhost:3000"
echo "  Backend API:  http://localhost:8080"
echo "  Swagger UI:   http://localhost:8080/swagger-ui.html"
echo "  PostgreSQL:   localhost:5432"
echo "  Redis:        localhost:6379"
echo ""
