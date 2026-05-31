#!/usr/bin/env bash
# mobile-agency install script
# Installs agents and skills into ~/.claude/agents/ and ~/.claude/skills/

set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_DIR="${HOME}/.claude"
AGENTS_DIR="${CLAUDE_DIR}/agents"
SKILLS_DIR="${CLAUDE_DIR}/skills"

PLATFORM="${1:-all}"
TOOL="${2:-claude}"

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()  { echo -e "${BLUE}[mobile-agency]${NC} $*"; }
ok()   { echo -e "${GREEN}[✓]${NC} $*"; }
warn() { echo -e "${YELLOW}[!]${NC} $*"; }
err()  { echo -e "${RED}[✗]${NC} $*"; exit 1; }

usage() {
  cat <<EOF
mobile-agency install script

Usage:
  ./install.sh [platform] [tool]

Platform:
  all           Install everything (default)
  android       Android agents and skills only
  ios           iOS agents and skills only
  flutter       Flutter agents and skills only
  react-native  React Native agents and skills only
  gaming        Unity and Unreal agents and skills only
  cross         Cross-platform agents and skills only

Tool:
  claude        Install for Claude Code (default) → ~/.claude/
  cursor        Install for Cursor → .cursorrules
  windsurf      Install for Windsurf → .windsurfrules

Examples:
  ./install.sh
  ./install.sh android
  ./install.sh ios claude
  ./install.sh all cursor
EOF
}

install_claude() {
  log "Installing for Claude Code..."
  mkdir -p "${AGENTS_DIR}" "${SKILLS_DIR}"

  install_agents
  install_skills

  ok "Claude Code installation complete."
  ok "Agents: ${AGENTS_DIR}"
  ok "Skills: ${SKILLS_DIR}"
  echo ""
  log "Restart Claude Code to pick up new agents and skills."
}

install_agents() {
  local platform="${PLATFORM}"

  case "${platform}" in
    all)
      copy_agent "android/axiom" "android-axiom"
      copy_agent "ios/swift" "ios-swift"
      copy_agent "flutter/dart" "flutter-dart"
      copy_agent "react-native/bridge" "rn-bridge"
      copy_agent "gaming/forge" "gaming-forge"
      copy_agent "gaming/unreal" "gaming-unreal"
      copy_agent "cross-platform/crasher" "crasher"
      copy_agent "cross-platform/sentinel" "sentinel"
      copy_agent "cross-platform/launchpad" "launchpad"
      copy_agent "cross-platform/pipeline" "pipeline"
      copy_agent "cross-platform/perf" "perf"
      copy_agent "cross-platform/scribe" "scribe"
      copy_agent "cross-platform/figma" "figma"
      ;;
    android)
      copy_agent "android/axiom" "android-axiom"
      copy_agent "cross-platform/crasher" "crasher"
      ;;
    ios)
      copy_agent "ios/swift" "ios-swift"
      copy_agent "cross-platform/crasher" "crasher"
      ;;
    flutter)
      copy_agent "flutter/dart" "flutter-dart"
      copy_agent "cross-platform/crasher" "crasher"
      ;;
    react-native)
      copy_agent "react-native/bridge" "rn-bridge"
      copy_agent "cross-platform/crasher" "crasher"
      ;;
    gaming)
      copy_agent "gaming/forge" "gaming-forge"
      copy_agent "gaming/unreal" "gaming-unreal"
      ;;
    cross)
      copy_agent "cross-platform/crasher" "crasher"
      copy_agent "cross-platform/sentinel" "sentinel"
      copy_agent "cross-platform/launchpad" "launchpad"
      copy_agent "cross-platform/pipeline" "pipeline"
      copy_agent "cross-platform/perf" "perf"
      copy_agent "cross-platform/scribe" "scribe"
      copy_agent "cross-platform/figma" "figma"
      ;;
    *)
      err "Unknown platform: ${platform}. Run ./install.sh --help"
      ;;
  esac
}

copy_agent() {
  local src="${REPO_DIR}/agents/${1}/agent.md"
  local dest="${AGENTS_DIR}/${2}.md"
  if [[ -f "${src}" ]]; then
    cp "${src}" "${dest}"
    ok "Agent: ${2}"
  else
    warn "Agent not found: ${src}"
  fi
}

install_skills() {
  local platform="${PLATFORM}"

  case "${platform}" in
    all)
      copy_skills_dir "android"
      copy_skills_dir "ios"
      copy_skills_dir "flutter"
      copy_skills_dir "react-native"
      copy_skills_dir "gaming"
      copy_skills_dir "cross-platform"
      ;;
    android)
      copy_skills_dir "android"
      copy_skills_dir "cross-platform"
      ;;
    ios)
      copy_skills_dir "ios"
      copy_skills_dir "cross-platform"
      ;;
    flutter)
      copy_skills_dir "flutter"
      copy_skills_dir "cross-platform"
      ;;
    react-native)
      copy_skills_dir "react-native"
      copy_skills_dir "cross-platform"
      ;;
    gaming)
      copy_skills_dir "gaming"
      copy_skills_dir "cross-platform"
      ;;
    cross)
      copy_skills_dir "cross-platform"
      ;;
  esac
}

copy_skills_dir() {
  local dir="${REPO_DIR}/skills/${1}"
  local dest="${SKILLS_DIR}/${1}"
  if [[ -d "${dir}" ]]; then
    mkdir -p "${dest}"
    cp "${dir}"/*.md "${dest}/" 2>/dev/null || true
    ok "Skills: ${1}/"
  fi
}

if [[ "${PLATFORM}" == "--help" || "${PLATFORM}" == "-h" ]]; then
  usage
  exit 0
fi

case "${TOOL}" in
  claude)
    install_claude
    ;;
  cursor)
    log "Cursor install: run ./scripts/install-cursor.sh"
    ;;
  windsurf)
    log "Windsurf install: run ./scripts/install-windsurf.sh"
    ;;
  *)
    err "Unknown tool: ${TOOL}"
    ;;
esac
