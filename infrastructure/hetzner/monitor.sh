#!/bin/bash
set -euo pipefail

readonly LOG_DIR="/var/log/ecomama"
readonly LOG_FILE="$LOG_DIR/monitor.log"
readonly ALERT_THRESHOLD_CPU=80
readonly ALERT_THRESHOLD_MEM=85
readonly ALERT_THRESHOLD_DISK=80

log() { echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

check_resources() {
  local cpu=$(top -bn1 | grep "Cpu(s)" | awk '{print int($2)}')
  local mem=$(free | awk '/Mem:/ {printf "%.0f", $3/$2*100}')
  local disk=$(df / | awk 'NR==2 {print int($5)}')
  
  log "Resources: CPU=${cpu}% MEM=${mem}% DISK=${disk}%"
  
  [[ $cpu -gt $ALERT_THRESHOLD_CPU ]] && log "⚠️  HIGH CPU: ${cpu}%"
  [[ $mem -gt $ALERT_THRESHOLD_MEM ]] && log "⚠️  HIGH MEMORY: ${mem}%"
  [[ $disk -gt $ALERT_THRESHOLD_DISK ]] && log "⚠️  HIGH DISK: ${disk}%"
}

check_containers() {
  local unhealthy=$(docker ps --filter "health=unhealthy" --format "{{.Names}}" 2>/dev/null)
  
  if [[ -n "$unhealthy" ]]; then
    log "⚠️  Unhealthy containers: $unhealthy"
  fi
  
  local stopped=$(docker ps -a --filter "status=exited" --format "{{.Names}}" 2>/dev/null | wc -l)
  [[ $stopped -gt 0 ]] && log "Info: $stopped stopped containers"
}

cleanup_logs() {
  find "$LOG_DIR" -name "*.log" -mtime +7 -delete 2>/dev/null || true
  find /var/log/nginx -name "*.log" -mtime +7 -delete 2>/dev/null || true
  
  if [[ $(du -sm "$LOG_DIR" | cut -f1) -gt 100 ]]; then
    log "⚠️  Log directory size exceeds 100MB"
  fi
}

main() {
  mkdir -p "$LOG_DIR"
  
  check_resources
  check_containers
  cleanup_logs
}

main "$@"
