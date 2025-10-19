#!/bin/bash

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║          🔍 Ecomama Docker Configuration Verification      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

check_command() {
    if ! command -v "$1" >/dev/null 2>&1; then
        echo -e "${RED}✗ $1 not found${NC}"
        return 1
    fi
    echo -e "${GREEN}✓ $1 installed${NC}"
    return 0
}

check_file() {
    if [ ! -f "$1" ]; then
        echo -e "${RED}✗ Missing: $1${NC}"
        return 1
    fi
    echo -e "${GREEN}✓ Found: $1${NC}"
    return 0
}

check_docker_compose_syntax() {
    if docker compose -f "$1" config > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Valid: $1${NC}"
        return 0
    else
        echo -e "${RED}✗ Invalid syntax: $1${NC}"
        return 1
    fi
}

ERRORS=0

echo -e "${BLUE}1. Checking prerequisites...${NC}"
check_command docker || ERRORS=$((ERRORS+1))
if ! docker compose version >/dev/null 2>&1; then
    echo -e "${RED}✗ Docker Compose V2 required${NC}"
    ERRORS=$((ERRORS+1))
else
    echo -e "${GREEN}✓ Docker Compose V2 installed${NC}"
fi
echo ""

echo -e "${BLUE}2. Checking Docker Compose files...${NC}"
check_file "docker-compose.base.yml" || ERRORS=$((ERRORS+1))
check_file "docker-compose.dev.yml" || ERRORS=$((ERRORS+1))
check_file "docker-compose.prod.yml" || ERRORS=$((ERRORS+1))
echo ""

echo -e "${BLUE}3. Validating Docker Compose syntax...${NC}"
check_docker_compose_syntax "docker-compose.base.yml" || ERRORS=$((ERRORS+1))
check_docker_compose_syntax "docker-compose.dev.yml" || ERRORS=$((ERRORS+1))
check_docker_compose_syntax "docker-compose.prod.yml" || ERRORS=$((ERRORS+1))
echo ""

echo -e "${BLUE}4. Checking Dockerfiles...${NC}"
check_file "backend/Dockerfile" || ERRORS=$((ERRORS+1))
check_file "backend/Dockerfile.dev" || ERRORS=$((ERRORS+1))
check_file "frontend/Dockerfile" || ERRORS=$((ERRORS+1))
check_file "frontend/Dockerfile.dev" || ERRORS=$((ERRORS+1))
echo ""

echo -e "${BLUE}5. Checking .dockerignore files...${NC}"
check_file "backend/.dockerignore" || ERRORS=$((ERRORS+1))
check_file "frontend/.dockerignore" || ERRORS=$((ERRORS+1))
echo ""

echo -e "${BLUE}6. Checking environment files...${NC}"
check_file ".env.dev" || ERRORS=$((ERRORS+1))
check_file ".env.example" || ERRORS=$((ERRORS+1))
echo ""

echo -e "${BLUE}7. Checking Makefile...${NC}"
check_file "Makefile" || ERRORS=$((ERRORS+1))
echo ""

echo -e "${BLUE}8. Verifying environment variables in .env.dev...${NC}"
ENV_VARS=(
    "SPRING_DATASOURCE_URL"
    "SPRING_DATASOURCE_USERNAME"
    "SPRING_DATASOURCE_PASSWORD"
    "SPRING_DATA_REDIS_HOST"
    "SPRING_DATA_REDIS_PORT"
)

for var in "${ENV_VARS[@]}"; do
    if grep -q "^${var}=" .env.dev; then
        echo -e "${GREEN}✓ ${var} defined${NC}"
    else
        echo -e "${RED}✗ ${var} missing${NC}"
        ERRORS=$((ERRORS+1))
    fi
done
echo ""

echo -e "${BLUE}9. Checking for localhost references (should use service names)...${NC}"
if grep -q "localhost" .env.dev | grep -v "NEXT_PUBLIC\|NODE_ENV\|#"; then
    echo -e "${YELLOW}⚠ Found localhost references in .env.dev (should use service names in Docker)${NC}"
else
    echo -e "${GREEN}✓ No problematic localhost references${NC}"
fi
echo ""

echo -e "${BLUE}10. Checking volume naming convention...${NC}"
VOLUMES=$(docker compose -f docker-compose.dev.yml config --volumes 2>/dev/null || echo "")
if echo "$VOLUMES" | grep -q "ecomama_"; then
    echo -e "${GREEN}✓ Volume names use ecomama_ prefix${NC}"
else
    echo -e "${YELLOW}⚠ Some volumes may not follow naming convention${NC}"
fi
echo ""

echo -e "${BLUE}11. Checking network configuration...${NC}"
if docker compose -f docker-compose.base.yml config | grep -q "ecomama-network"; then
    echo -e "${GREEN}✓ Network ecomama-network configured${NC}"
else
    echo -e "${RED}✗ Network ecomama-network not found${NC}"
    ERRORS=$((ERRORS+1))
fi
echo ""

echo -e "${BLUE}12. Checking health checks...${NC}"
SERVICES=("postgres" "redis" "backend" "frontend")
for service in "${SERVICES[@]}"; do
    if docker compose -f docker-compose.dev.yml config | grep -A5 "container_name: ecomama-${service}" | grep -q "healthcheck:"; then
        echo -e "${GREEN}✓ ${service} has health check${NC}"
    else
        echo -e "${YELLOW}⚠ ${service} may be missing health check${NC}"
    fi
done
echo ""

echo -e "${BLUE}13. Checking restart policies...${NC}"
if docker compose -f docker-compose.dev.yml config | grep -q "restart: unless-stopped"; then
    echo -e "${GREEN}✓ Using unless-stopped restart policy${NC}"
else
    echo -e "${YELLOW}⚠ Check restart policies${NC}"
fi
echo ""

echo ""
echo "════════════════════════════════════════════════════════════"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Docker configuration is correct.${NC}"
    echo ""
    echo "You can now run:"
    echo "  make dev        - Start full development stack"
    echo "  make db         - Start database only"
else
    echo -e "${RED}❌ Found $ERRORS error(s). Please fix them before proceeding.${NC}"
    exit 1
fi
echo "════════════════════════════════════════════════════════════"
echo ""
