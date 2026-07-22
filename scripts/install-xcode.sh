#!/usr/bin/env bash
# Install mobile-ai-agents SWIFT agent for Xcode Claude integration (2026)
# Copies the SWIFT agent system prompt to ~/Library/Application Support/Xcode/Claude/
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
XCODE_CLAUDE_DIR="${HOME}/Library/Application Support/Xcode/Claude"

mkdir -p "${XCODE_CLAUDE_DIR}"

cp "${REPO_DIR}/agents/ios/swift/agent.md" "${XCODE_CLAUDE_DIR}/swift-agent.md"
echo "[✓] SWIFT agent installed for Xcode Claude integration."
echo "Restart Xcode to activate."
