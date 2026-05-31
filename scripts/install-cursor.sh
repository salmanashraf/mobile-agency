#!/usr/bin/env bash
# Install mobile-agency agents and skills for Cursor
# Writes agent system prompts to .cursorrules in the current project directory
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PLATFORM="${1:-all}"
OUTPUT=".cursorrules"

echo "# mobile-agency — AI agents for mobile development" > "${OUTPUT}"
echo "# https://github.com/salmanashraf/mobile-dev-skills" >> "${OUTPUT}"
echo "" >> "${OUTPUT}"

append_agent() {
  local agent_file="${REPO_DIR}/agents/${1}/agent.md"
  if [[ -f "${agent_file}" ]]; then
    echo "---" >> "${OUTPUT}"
    cat "${agent_file}" >> "${OUTPUT}"
    echo "" >> "${OUTPUT}"
    echo "[✓] Added: ${1}"
  fi
}

case "${PLATFORM}" in
  all)
    append_agent "android/axiom"
    append_agent "ios/swift"
    append_agent "flutter/dart"
    append_agent "react-native/bridge"
    append_agent "cross-platform/crasher"
    append_agent "cross-platform/sentinel"
    ;;
  android) append_agent "android/axiom" ;;
  ios)     append_agent "ios/swift" ;;
  flutter) append_agent "flutter/dart" ;;
  react-native) append_agent "react-native/bridge" ;;
esac

echo ""
echo "[mobile-agency] Written to .cursorrules"
echo "Restart Cursor to activate."
