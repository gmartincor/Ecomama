#!/bin/bash
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/core.sh"

readonly ENV="${1:-}"

deploy_zero_downtime() {
  log "Pulling new images..."
  docker compose pull -q
  
  log "Starting new containers..."
  docker compose up -d --no-deps --scale ${ENV}-web=2 --scale ${ENV}-api=2 --no-recreate
  
  sleep 10
  
  log "Removing old containers..."
  docker compose up -d --remove-orphans
  
  log "Waiting for health checks..."
  check_health "$ENV" 90 || return 1
  
  return 0
}

main() {
  [[ -n "$ENV" ]] || error "Usage: $0 <stg|prod>"
  validate_env "$ENV"
  
  log "🚀 Deploying $ENV (zero-downtime)..."
  
  cd "${APP_DIR}/${ENV}"
  
  set -a
  source .env.${ENV}
  set +a
  
  if deploy_zero_downtime; then
    cleanup_docker
    log "✅ Deployment successful"
    docker compose ps
    exit 0
  fi
  
  log "❌ Deployment failed"
  docker compose logs --tail=100
  exit 1
}

trap 'error "Deployment interrupted"' INT TERM
main "$@"
