#!/bin/bash
set -euo pipefail

readonly DOMAIN="${1:-}"
readonly EMAIL="${2:-}"

log() { echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"; }
error() { log "ERROR: $*" >&2; exit 1; }

check_root() {
  [[ $EUID -eq 0 ]] || error "Must run as root"
}

validate_args() {
  [[ -n "$DOMAIN" && -n "$EMAIL" ]] || {
    echo "Usage: $0 <domain> <email>"
    echo ""
    echo "Example: $0 ecomama.com admin@ecomama.com"
    echo ""
    echo "This will setup SSL for:"
    echo "  - $DOMAIN"
    echo "  - www.$DOMAIN"
    echo "  - staging.$DOMAIN"
    exit 1
  }
}

install_certbot() {
  if command -v certbot &>/dev/null; then
    log "Certbot installed"
    return
  fi

  log "Installing Certbot..."
  apt-get update -qq
  apt-get install -y -qq certbot
}

create_dhparam() {
  if [[ -f /etc/ssl/certs/dhparam.pem ]]; then
    log "DH params exist"
    return
  fi

  log "Generating DH params (2-5 minutes)..."
  openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
}

obtain_cert() {
  log "Obtaining certificate for $DOMAIN..."
  
  certbot certonly \
    --standalone \
    --non-interactive \
    --agree-tos \
    --no-eff-email \
    --email "$EMAIL" \
    -d "$DOMAIN" \
    -d "www.$DOMAIN" \
    -d "staging.$DOMAIN" \
    --pre-hook "docker stop prod-proxy stg-proxy 2>/dev/null || true" \
    --post-hook "docker start prod-proxy stg-proxy 2>/dev/null || true"
}

setup_renewal() {
  log "Setting up auto-renewal..."
  
  cat > /etc/cron.d/certbot-renew <<'EOF'
0 3 * * * root certbot renew --quiet --deploy-hook "docker exec prod-proxy nginx -s reload 2>/dev/null; docker exec stg-proxy nginx -s reload 2>/dev/null"
EOF
  
  chmod 644 /etc/cron.d/certbot-renew
}

main() {
  check_root
  validate_args
  
  log "🔒 Setting up SSL for $DOMAIN..."
  
  install_certbot
  create_dhparam
  obtain_cert
  setup_renewal
  
  log "✅ SSL configured!"
  log ""
  log "Certificate: /etc/letsencrypt/live/$DOMAIN/fullchain.pem"
  log "Private key: /etc/letsencrypt/live/$DOMAIN/privkey.pem"
  log "Auto-renewal: configured (daily at 3 AM)"
}

trap 'error "Interrupted"' INT TERM
main "$@"
