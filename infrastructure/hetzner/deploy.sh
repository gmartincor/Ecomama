#!/bin/bash
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/core.sh"

readonly ENV="${1:-}"

main() {
  [[ -n "$ENV" ]] || error "Usage: $0 <staging|production>"
  validate_env "$ENV"
  
  log "🚀 Deploying $ENV..."
  
  cd "${APP_DIR}/${ENV}"
  
  export $(cat .env.${ENV} | xargs)
  
  log "Pulling images..."
  docker compose -f docker-compose.production.yml pull -q
  
  log "Starting services..."
  docker compose -f docker-compose.production.yml up -d --remove-orphans --wait --wait-timeout 90
  
  if check_health "$ENV" 60; then
    cleanup_docker
    log "✅ Deployment successful"
    exit 0
  fi
  
  log "❌ Health check failed"
  docker compose -f docker-compose.production.yml logs --tail=50
  exit 1
}

trap 'error "Deployment interrupted"' INT TERM
main "$@"
