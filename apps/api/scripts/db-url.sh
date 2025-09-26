#!/usr/bin/env bash
set -euo pipefail
ENV="${1:-development}"
CFG_FILE="config/${ENV}/${ENV}.json"
if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required. Install it (e.g., sudo apt-get install jq)"; exit 1
fi
export DATABASE_URL="$(jq -r '.database.url' "${CFG_FILE}")"
echo "DATABASE_URL exported for ${ENV}"
