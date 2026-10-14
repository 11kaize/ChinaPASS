#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../mobile"
bundled_node="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin"
if [[ -x "$bundled_node/node" ]]; then export PATH="$bundled_node:$PATH"; fi
node -e 'const [major,minor]=process.versions.node.split(".").map(Number);if(major<22||(major===22&&minor<13)){console.error("ChinaHand mobile needs Node.js 22.13 or newer.");process.exit(1);}'
if [[ ! -d node_modules ]]; then npm ci; fi
exec npm start -- "$@"
