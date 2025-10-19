#!/bin/bash

readonly APP_DIR="/opt/ecomama"
readonly LOG_DIR="/var/log/ecomama"

log() { echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"; }
error() { log "ERROR: $*" >&2; exit 1; }

validate_env() {
  [[ "$1" =~ ^(staging|production)$ ]] || error "Invalid environment: $1"
}

check_health() {
  local env="$1"
  local timeout="${2:-60}"
  
  log "Checking health..."
  
  local attempt=0
  while [[ $attempt -lt $timeout ]]; do
    if docker compose -f "${APP_DIR}/${env}/docker-compose.production.yml" ps --format json 2>/dev/null | \
       jq -e 'all(.Health == "healthy" or .Health == null)' &>/dev/null; then
      log "✅ All services healthy"
      return 0
    fi
    ((attempt++))
    sleep 1
  done
  
  log "❌ Health check failed"
  docker compose -f "${APP_DIR}/${env}/docker-compose.production.yml" ps
  return 1
}

cleanup_docker() {
  log "Cleaning up..."
  docker image prune -af --filter "until=72h" 2>/dev/null || true
  docker system prune -f --filter "until=168h" 2>/dev/null || true
  log "✅ Cleanup complete"
}
