#!/usr/bin/env bash
# Install mobile-ai-agents agents and skills for Claude Code
# Usage: ./scripts/install-claude.sh --platform android
set -euo pipefail
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
"${REPO_DIR}/install.sh" "${1:-all}" claude
