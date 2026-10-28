#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
chinabuddy_node="$(command -v node || true)"
chinabuddy_bundled="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
if [[ -x "$chinabuddy_bundled" ]]; then chinabuddy_node="$chinabuddy_bundled"; fi
if [[ -z "$chinabuddy_node" ]]; then
  echo "Install Node.js 22.13 or newer from https://nodejs.org/, then run this script again."
  exit 1
fi
exec "$chinabuddy_node" scripts/start-mobile.mjs --preview "$@"
