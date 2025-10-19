#!/bin/bash

readonly APP_DIR="/opt/ecomama"
readonly LOG_DIR="/var/log/ecomama"

log() { echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"; }
error() { log "ERROR: $*" >&2; exit 1; }

validate_env() {
  [[ "$1" =~ ^(stg|prod)$ ]] || error "Invalid environment: $1 (use stg or prod)"
}

check_health() {
  local env="$1"
  local timeout="${2:-60}"
  local compose_file="${APP_DIR}/${env}/docker-compose.production.yml"
  
  log "Checking health (timeout: ${timeout}s)..."
  
  local attempt=0
  while [[ $attempt -lt $timeout ]]; do
    local unhealthy=$(docker compose -f "$compose_file" ps --format json 2>/dev/null | \
                      jq -r 'select(.Health == "unhealthy") | .Name' | wc -l)
    
    if [[ $unhealthy -eq 0 ]]; then
      log "✅ All services healthy"
      return 0
    fi
    
    ((attempt++))
    sleep 1
  done
  
  log "❌ Health check timeout"
  docker compose -f "$compose_file" ps
  return 1
}

cleanup_docker() {
  log "Cleaning up Docker resources..."
  docker image prune -af --filter "until=72h" 2>/dev/null || true
  docker system prune -f --volumes --filter "until=168h" 2>/dev/null || true
  log "✅ Cleanup complete"
}

backup_env() {
  local env="$1"
  local backup_dir="${APP_DIR}/backups/${env}"
  mkdir -p "$backup_dir"
  
  local timestamp=$(date +%Y%m%d_%H%M%S)
  docker compose -f "${APP_DIR}/${env}/docker-compose.production.yml" exec ${env}-db \
    pg_dump -U postgres -Fc > "${backup_dir}/db_${timestamp}.dump"
  
  find "$backup_dir" -name "*.dump" -mtime +7 -delete
  log "✅ Backup created: ${backup_dir}/db_${timestamp}.dump"
}
