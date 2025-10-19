#!/bin/bash
set -euo pipefail

readonly DEPLOY_USER=deploy

log() { echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"; }
error() { log "ERROR: $*" >&2; exit 1; }

[[ $EUID -eq 0 ]] || error "Run as root"

update_system() {
  log "Updating system..."
  export DEBIAN_FRONTEND=noninteractive
  apt-get update -qq
  apt-get upgrade -y -qq
  apt-get install -y -qq curl git ufw fail2ban unattended-upgrades jq htop
}

install_docker() {
  command -v docker &>/dev/null && { log "Docker already installed"; return; }
  
  log "Installing Docker..."
  curl -fsSL https://get.docker.com | sh
  
  cat > /etc/docker/daemon.json <<'EOF'
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "5m",
    "max-file": "2"
  },
  "live-restore": true,
  "userland-proxy": false
}
EOF
  
  systemctl enable docker
  systemctl restart docker
}

setup_firewall() {
  log "Configuring firewall..."
  ufw --force reset
  ufw default deny incoming
  ufw default allow outgoing
  ufw allow 22/tcp comment "SSH"
  ufw allow 80/tcp comment "HTTP"
  ufw allow 443/tcp comment "HTTPS"
  ufw allow 8080/tcp comment "Staging HTTP"
  ufw allow 8443/tcp comment "Staging HTTPS"
  ufw logging on
  ufw --force enable
}

setup_swap() {
  swapon --show | grep -q '/swapfile' && { log "Swap exists"; return; }
  
  log "Creating 4GB swap..."
  fallocate -l 4G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  
  sysctl -w vm.swappiness=10
  sysctl -w vm.vfs_cache_pressure=50
  cat >> /etc/sysctl.conf <<'EOF'
vm.swappiness=10
vm.vfs_cache_pressure=50
EOF
}

optimize() {
  log "Optimizing kernel..."
  
  cat >> /etc/sysctl.conf <<'EOF'
fs.file-max=1048576
net.core.somaxconn=32768
net.ipv4.tcp_max_syn_backlog=4096
net.ipv4.tcp_tw_reuse=1
net.ipv4.tcp_fin_timeout=15
net.ipv4.tcp_keepalive_time=300
net.ipv4.tcp_keepalive_probes=5
net.ipv4.tcp_keepalive_intvl=15
EOF
  sysctl -p >/dev/null
}

setup_user() {
  id "$DEPLOY_USER" &>/dev/null && { log "User $DEPLOY_USER exists"; return; }
  
  log "Creating deploy user..."
  useradd -m -s /bin/bash -G docker "$DEPLOY_USER"
  mkdir -p /home/$DEPLOY_USER/.ssh
  chmod 700 /home/$DEPLOY_USER/.ssh
  [[ -f ~/.ssh/authorized_keys ]] && cp ~/.ssh/authorized_keys /home/$DEPLOY_USER/.ssh/
  chown -R $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER/.ssh
}

setup_dirs() {
  log "Creating directories..."
  mkdir -p /opt/ecomama/{stg,prod,scripts}
  mkdir -p /var/log/ecomama
  chown -R $DEPLOY_USER:$DEPLOY_USER /opt/ecomama /var/log/ecomama
}

setup_cron() {
  log "Setting up cron jobs..."
  cat > /etc/cron.d/ecomama <<'EOF'
0 * * * * deploy /opt/ecomama/scripts/monitor.sh >> /var/log/ecomama/monitor.log 2>&1
0 3 * * 0 root docker system prune -af --filter "until=168h" >> /var/log/ecomama/cleanup.log 2>&1
EOF
  chmod 644 /etc/cron.d/ecomama
}

main() {
  log "🚀 Provisioning Hetzner CX32..."
  
  update_system
  install_docker
  setup_swap
  optimize
  setup_firewall
  setup_user
  setup_dirs
  setup_cron
  
  log "✅ Provisioning complete!"
  log ""
  log "Next steps:"
  log "  1. Copy scripts: scp infrastructure/hetzner/*.sh deploy@SERVER:/opt/ecomama/scripts/"
  log "  2. Setup SSL: ssh root@SERVER '/opt/ecomama/scripts/setup-ssl.sh DOMAIN EMAIL'"
  log "  3. Deploy: git push origin develop  # for staging"
  log "  4. Deploy: git push origin main     # for production"
}

trap 'error "Interrupted"' INT TERM
main "$@"
