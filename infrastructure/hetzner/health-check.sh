#!/bin/bash
set -euo pipefail

readonly ENV="${1:-all}"

check_container() {
  local name="$1"
  
  if ! docker ps --format '{{.Names}}' | grep -q "^${name}$"; then
    echo "❌ $name (not running)"
    return 1
  fi
  
  local status=$(docker inspect --format='{{.State.Health.Status}}' "$name" 2>/dev/null || echo "none")
  
  case "$status" in
    healthy) echo "✅ $name" ;;
    unhealthy) echo "❌ $name (unhealthy)"; return 1 ;;
    starting) echo "🔄 $name (starting)" ;;
    *) echo "⚠️  $name (no healthcheck)" ;;
  esac
  
  return 0
}

check_env() {
  local env="$1"
  local failed=0
  
  echo ""
  echo "=== ${env^^} ==="
  
  for svc in db cache api web proxy; do
    check_container "${env}-${svc}" || ((failed++))
  done
  
  return $failed
}

main() {
  local failed=0
  
  case "$ENV" in
    all)
      check_env "stg" || ((failed+=$?))
      check_env "prod" || ((failed+=$?))
      ;;
    stg|staging)
      check_env "stg" || ((failed+=$?))
      ;;
    prod|production)
      check_env "prod" || ((failed+=$?))
      ;;
    *)
      echo "Usage: $0 <stg|prod|all>"
      exit 1
      ;;
  esac
  
  echo ""
  echo "=== SYSTEM (CX32) ==="
  echo "CPU:     $(top -bn1 | grep "Cpu(s)" | awk '{print $2}')%"
  echo "Memory:  $(free -h | awk '/Mem:/ {printf "%s / %s (%.0f%%)", $3, $2, $3/$2*100}')"
  echo "Disk:    $(df -h / | awk 'NR==2 {printf "%s / %s (%s)", $3, $2, $5}')"
  echo "Swap:    $(free -h | awk '/Swap:/ {printf "%s / %s", $3, $2}')"
  
  echo ""
  echo "=== DOCKER ==="
  echo "Containers: $(docker ps -q | wc -l) running"
  echo "Images:     $(docker images -q | wc -l)"
  
  echo ""
  [[ $failed -eq 0 ]] && echo "✅ All services healthy" || echo "❌ $failed service(s) with issues"
  exit $failed
}

main "$@"
