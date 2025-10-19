#!/bin/bash
set -euo pipefail

readonly LOG_DIR="/var/log/ecomama"
readonly LOG_FILE="$LOG_DIR/monitor.log"

log() { echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

main() {
  mkdir -p "$LOG_DIR"
  
  log "=== Check ==="
  log "CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}')%"
  log "Mem: $(free | awk '/Mem:/ {printf "%.0f%%", $3/$2*100}')"
  log "Disk: $(df / | awk 'NR==2 {print $5}')"
  
  local unhealthy=$(docker ps --filter "health=unhealthy" -q | wc -l)
  [[ $unhealthy -gt 0 ]] && log "⚠️  $unhealthy unhealthy"
  
  find "$LOG_DIR" -name "*.log" -mtime +7 -delete 2>/dev/null || true
}

main "$@"
