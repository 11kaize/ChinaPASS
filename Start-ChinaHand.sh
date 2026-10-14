#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
chinahand_node="$(command -v node || true)"
chinahand_bundled="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
if [[ -x "$chinahand_bundled" ]]; then chinahand_node="$chinahand_bundled"; fi
if [[ -z "$chinahand_node" ]]; then
  echo "Install Node.js 22.13 or newer from https://nodejs.org/, then run this script again."
  exit 1
fi
exec "$chinahand_node" scripts/start-mobile.mjs --preview "$@"
