#!/bin/bash
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/core.sh"

readonly ENV="${1:-}"
readonly IMAGE_TAG="${2:-}"

main() {
  [[ -n "$ENV" && -n "$IMAGE_TAG" ]] || error "Usage: $0 <staging|production> <image-tag>"
  validate_env "$ENV"
  
  log "⚠️  Rolling back $ENV to $IMAGE_TAG"
  read -p "Type 'yes' to confirm: " -r
  [[ "$REPLY" == "yes" ]] || error "Cancelled"
  
  cd "${APP_DIR}/${ENV}"
  export $(cat .env.${ENV} | xargs)
  export VERSION="$IMAGE_TAG"
  
  log "Pulling images..."
  docker compose -f docker-compose.production.yml pull -q
  
  log "Restarting services..."
  docker compose -f docker-compose.production.yml up -d --remove-orphans --wait --wait-timeout 90
  
  check_health "$ENV" 60 && log "✅ Rollback complete" || log "❌ Rollback failed"
}

trap 'error "Interrupted"' INT TERM
main "$@"
