#!/bin/bash
set -euo pipefail

readonly ENV="${1:-all}"

check_container() {
  local name="$1"
  
  docker ps --format '{{.Names}}' | grep -q "^${name}$" || { echo "❌ $name"; return 1; }
  
  local status=$(docker inspect --format='{{.State.Health.Status}}' "$name" 2>/dev/null || echo "none")
  
  case "$status" in
    healthy) echo "✅ $name"; return 0 ;;
    unhealthy|starting) echo "❌ $name"; return 1 ;;
    *) echo "⚠️  $name"; return 0 ;;
  esac
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
    staging)
      check_env "stg" || ((failed+=$?))
      ;;
    production)
      check_env "prod" || ((failed+=$?))
      ;;
    *)
      echo "Usage: $0 <staging|production|all>"
      exit 1
      ;;
  esac
  
  echo ""
  echo "=== SYSTEM ==="
  echo "CPU:  $(top -bn1 | grep "Cpu(s)" | awk '{print $2}')%"
  echo "Mem:  $(free | awk '/Mem:/ {printf "%.0f%%", $3/$2*100}')"
  echo "Disk: $(df / | awk 'NR==2 {print $5}')"
  
  echo ""
  [[ $failed -eq 0 ]] && echo "✅ All healthy" || echo "❌ $failed issues"
  exit $failed
}

main "$@"
