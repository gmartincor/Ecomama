#!/bin/bash
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/core.sh"

readonly ENV="${1:-}"
readonly IMAGE_TAG="${2:-}"

main() {
  [[ -n "$ENV" && -n "$IMAGE_TAG" ]] || error "Usage: $0 <stg|prod> <image-tag>"
  validate_env "$ENV"
  
  log "⚠️  Rolling back $ENV to $IMAGE_TAG"
  read -p "Type 'yes' to confirm: " -r
  [[ "$REPLY" == "yes" ]] || error "Cancelled"
  
  cd "${APP_DIR}/${ENV}"
  
  log "Creating backup before rollback..."
  backup_env "$ENV" || log "Warning: Backup failed"
  
  set -a
  source .env.${ENV}
  set +a
  export VERSION="$IMAGE_TAG"
  
  log "Pulling images (tag: $IMAGE_TAG)..."
  docker compose pull -q
  
  log "Restarting services..."
  docker compose up -d --remove-orphans
  
  if check_health "$ENV" 90; then
    log "✅ Rollback successful"
    docker compose ps
  else
    log "❌ Rollback failed"
    docker compose logs --tail=100
    exit 1
  fi
}

trap 'error "Interrupted"' INT TERM
main "$@"
