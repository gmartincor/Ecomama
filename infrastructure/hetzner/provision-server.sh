#!/bin/bash
set -euo pipefail

readonly DEPLOY_USER=deploy

log() { echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"; }
error() { log "ERROR: $*" >&2; exit 1; }

[[ $EUID -eq 0 ]] || error "Run as root"

update_system() {
  log "Updating..."
  export DEBIAN_FRONTEND=noninteractive
  apt-get update -qq
  apt-get upgrade -y -qq
  apt-get install -y -qq curl git ufw fail2ban unattended-upgrades jq
}

install_docker() {
  command -v docker &>/dev/null && return
  
  log "Installing Docker..."
  curl -fsSL https://get.docker.com | sh
  
  cat > /etc/docker/daemon.json <<'EOF'
{
  "log-driver": "json-file",
  "log-opts": {"max-size": "10m", "max-file": "3"}
}
EOF
  
  systemctl enable --now docker
}

setup_firewall() {
  log "Configuring firewall..."
  ufw --force reset
  ufw default deny incoming
  ufw default allow outgoing
  ufw allow 22/tcp
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw allow 8080/tcp
  ufw allow 8443/tcp
  ufw --force enable
}

setup_swap() {
  swapon --show | grep -q '/swapfile' && return
  
  log "Creating 8GB swap..."
  fallocate -l 8G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  
  sysctl -w vm.swappiness=10 vm.vfs_cache_pressure=50
  echo -e "vm.swappiness=10\nvm.vfs_cache_pressure=50" >> /etc/sysctl.conf
}

optimize() {
  log "Optimizing..."
  
  cat >> /etc/sysctl.conf <<'EOF'
fs.file-max=2097152
net.core.somaxconn=65535
net.ipv4.tcp_max_syn_backlog=8192
net.ipv4.tcp_tw_reuse=1
net.ipv4.tcp_fin_timeout=30
EOF
  sysctl -p &>/dev/null
}

setup_user() {
  id "$DEPLOY_USER" &>/dev/null && return
  
  log "Creating user..."
  useradd -m -s /bin/bash -G docker "$DEPLOY_USER"
  mkdir -p /home/$DEPLOY_USER/.ssh
  chmod 700 /home/$DEPLOY_USER/.ssh
  [[ -f ~/.ssh/authorized_keys ]] && cp ~/.ssh/authorized_keys /home/$DEPLOY_USER/.ssh/
  chown -R $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER/.ssh
}

setup_dirs() {
  mkdir -p /opt/ecomama/{staging,production,scripts}
  mkdir -p /var/log/ecomama
  chown -R $DEPLOY_USER:$DEPLOY_USER /opt/ecomama /var/log/ecomama
}

setup_cron() {
  cat > /tmp/cron <<'EOF'
0 * * * * /opt/ecomama/scripts/monitor.sh
0 3 * * 0 docker system prune -af --filter "until=168h"
EOF
  crontab -u $DEPLOY_USER /tmp/cron
  rm /tmp/cron
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
  
  log "✅ Complete!"
  log ""
  log "Next: setup-ssl.sh <domain> <email>"
}

trap 'error "Interrupted"' INT TERM
main "$@"
