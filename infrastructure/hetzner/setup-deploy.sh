#!/bin/bash
set -euo pipefail

readonly SERVER="${1:-}"

[[ -n "$SERVER" ]] || {
  echo "Usage: $0 <server-ip>"
  echo ""
  echo "Example: $0 1.2.3.4"
  exit 1
}

log() { echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"; }

main() {
  log "🚀 Setting up deployment to $SERVER..."
  
  log "Creating directories..."
  ssh "deploy@$SERVER" "mkdir -p /opt/ecomama/{stg,prod,scripts,backups}"
  
  log "Copying scripts..."
  scp infrastructure/hetzner/{core.sh,deploy.sh,rollback.sh,health-check.sh,monitor.sh} \
      "deploy@$SERVER:/opt/ecomama/scripts/"
  
  log "Setting permissions..."
  ssh "deploy@$SERVER" "chmod +x /opt/ecomama/scripts/*.sh"
  
  log "✅ Setup complete!"
  log ""
  log "Next steps:"
  log "  1. Configure GitHub secrets:"
  log "     - SERVER_IP: $SERVER"
  log "     - SSH_PRIVATE_KEY: Your deploy SSH key"
  log "     - STAGING_ENV: Content of .env.staging.template"
  log "     - PRODUCTION_ENV: Content of .env.production.template"
  log "     - DOMAIN: Your domain (e.g., ecomama.com)"
  log ""
  log "  2. Deploy:"
  log "     git push origin develop  # Deploys to staging"
  log "     git push origin main     # Deploys to production"
}

main "$@"
