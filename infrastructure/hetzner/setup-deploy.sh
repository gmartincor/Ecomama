#!/bin/bash
set -euo pipefail

readonly SERVER="${1:-}"
readonly ENV="${2:-}"

[[ -n "$SERVER" && -n "$ENV" ]] || {
  echo "Usage: $0 <server-ip> <staging|production>"
  exit 1
}

[[ "$ENV" =~ ^(staging|production)$ ]] || {
  echo "Environment must be staging or production"
  exit 1
}

echo "🚀 Deploying scripts to $SERVER ($ENV)..."

ssh "deploy@$SERVER" "mkdir -p /opt/ecomama/{$ENV,scripts}"

scp infrastructure/hetzner/{core.sh,deploy.sh,rollback.sh,health-check.sh,monitor.sh} \
    "deploy@$SERVER:/opt/ecomama/scripts/"

ssh "deploy@$SERVER" "chmod +x /opt/ecomama/scripts/*.sh"

echo "✅ Scripts deployed"
echo ""
echo "Next steps:"
echo "  1. Configure GitHub secrets:"
echo "     - SERVER_IP: $SERVER"
echo "     - SSH_PRIVATE_KEY: Your deploy key"
echo "     - ${ENV^^}_ENV: Your .env.$ENV content"
echo "  2. Push to ${ENV == 'staging' && 'develop' || 'main'} branch"
