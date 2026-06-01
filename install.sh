#!/bin/bash

# Mobile Agency — One-command installer
# Usage: ./install.sh [--platform android|ios|flutter|rn|gaming|all] [--tool claude|cursor|windsurf|all]

set -e

PLATFORM="all"
TOOL="claude"
CLAUDE_AGENTS_DIR="$HOME/.claude/agents"
CLAUDE_SKILLS_DIR="$HOME/.claude/commands"

# Parse args
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --platform) PLATFORM="$2"; shift ;;
        --tool) TOOL="$2"; shift ;;
        *) echo "Unknown parameter: $1"; exit 1 ;;
    esac
    shift
done

echo ""
echo "📱 Mobile Agency Installer"
echo "Platform: $PLATFORM | Tool: $TOOL"
echo ""

install_claude() {
    mkdir -p "$CLAUDE_AGENTS_DIR"
    mkdir -p "$CLAUDE_SKILLS_DIR"

    # Cross-platform agents (always installed)
    # Copied to both ~/.claude/agents/ (sub-agent use) and ~/.claude/commands/ (slash command autocomplete)
    echo "→ Installing cross-platform agents..."
    for agent in crasher launchpad sentinel pipeline scribe perf figma; do
        src="agents/cross-platform/$agent/agent.md"
        cp "$src" "$CLAUDE_AGENTS_DIR/$agent.md"
        cp "$src" "$CLAUDE_SKILLS_DIR/$agent.md"
    done

    # Cross-platform skills
    echo "→ Installing cross-platform skills..."
    cp skills/cross-platform/grill-mobile.md "$CLAUDE_SKILLS_DIR/grill-mobile.md"
    cp skills/cross-platform/crash-triage.md "$CLAUDE_SKILLS_DIR/crash-triage.md"
    cp skills/cross-platform/perf-audit.md "$CLAUDE_SKILLS_DIR/perf-audit.md"
    cp skills/cross-platform/store-listing.md "$CLAUDE_SKILLS_DIR/store-listing.md"
    cp skills/cross-platform/release-prep.md "$CLAUDE_SKILLS_DIR/release-prep.md"
    cp skills/cross-platform/feature-slice.md "$CLAUDE_SKILLS_DIR/feature-slice.md"

    # Platform-specific
    if [[ "$PLATFORM" == "android" || "$PLATFORM" == "all" ]]; then
        echo "→ Installing Android agents and skills..."
        cp agents/android/axiom/agent.md "$CLAUDE_AGENTS_DIR/axiom.md"
        cp agents/android/axiom/agent.md "$CLAUDE_SKILLS_DIR/axiom.md"
        cp skills/android/compose-review.md "$CLAUDE_SKILLS_DIR/compose-review.md"
        cp skills/android/android-tdd.md "$CLAUDE_SKILLS_DIR/android-tdd.md"
        cp skills/android/kotlin-modernize.md "$CLAUDE_SKILLS_DIR/kotlin-modernize.md"
    fi

    if [[ "$PLATFORM" == "ios" || "$PLATFORM" == "all" ]]; then
        echo "→ Installing iOS agents and skills..."
        cp agents/ios/swift/agent.md "$CLAUDE_AGENTS_DIR/swift.md"
        cp agents/ios/swift/agent.md "$CLAUDE_SKILLS_DIR/swift.md"
        cp skills/ios/swiftui-review.md "$CLAUDE_SKILLS_DIR/swiftui-review.md"
        cp skills/ios/ios-tdd.md "$CLAUDE_SKILLS_DIR/ios-tdd.md"
    fi

    if [[ "$PLATFORM" == "flutter" || "$PLATFORM" == "all" ]]; then
        echo "→ Installing Flutter agents and skills..."
        cp agents/flutter/dart/agent.md "$CLAUDE_AGENTS_DIR/dart.md"
        cp agents/flutter/dart/agent.md "$CLAUDE_SKILLS_DIR/dart.md"
        cp skills/flutter/flutter-review.md "$CLAUDE_SKILLS_DIR/flutter-review.md"
        cp skills/flutter/flutter-tdd.md "$CLAUDE_SKILLS_DIR/flutter-tdd.md"
    fi

    if [[ "$PLATFORM" == "rn" || "$PLATFORM" == "all" ]]; then
        echo "→ Installing React Native agents and skills..."
        cp agents/react-native/bridge/agent.md "$CLAUDE_AGENTS_DIR/bridge.md"
        cp agents/react-native/bridge/agent.md "$CLAUDE_SKILLS_DIR/bridge.md"
        cp skills/react-native/rn-review.md "$CLAUDE_SKILLS_DIR/rn-review.md"
        cp skills/react-native/rn-tdd.md "$CLAUDE_SKILLS_DIR/rn-tdd.md"
    fi

    if [[ "$PLATFORM" == "gaming" || "$PLATFORM" == "all" ]]; then
        echo "→ Installing Gaming agents and skills..."
        cp agents/gaming/forge/agent.md "$CLAUDE_AGENTS_DIR/forge.md"
        cp agents/gaming/forge/agent.md "$CLAUDE_SKILLS_DIR/forge.md"
        cp agents/gaming/unreal/agent.md "$CLAUDE_AGENTS_DIR/unreal.md"
        cp agents/gaming/unreal/agent.md "$CLAUDE_SKILLS_DIR/unreal.md"
        cp skills/gaming/shader-gen.md "$CLAUDE_SKILLS_DIR/shader-gen.md"
        cp skills/gaming/game-perf.md "$CLAUDE_SKILLS_DIR/game-perf.md"
    fi

    echo ""
    echo "✅ Installed to:"
    echo "   Agents → $CLAUDE_AGENTS_DIR"
    echo "   Skills → $CLAUDE_SKILLS_DIR"
    echo ""
    echo "   Slash commands available:"
    echo "   /axiom  /swift  /dart  /bridge  /forge  /unreal"
    echo "   /crasher  /sentinel  /scribe  /pipeline  /perf  /launchpad  /figma"
    echo "   /flutter-review  /flutter-tdd  /android-tdd  /crash-triage  /perf-audit ..."
}

install_cursor() {
    echo "→ Installing for Cursor (.cursorrules)..."
    cat agents/cross-platform/crasher/agent.md \
        agents/cross-platform/launchpad/agent.md \
        skills/cross-platform/grill-mobile.md > .cursorrules
    echo "✅ .cursorrules created in current directory"
}

install_windsurf() {
    echo "→ Installing for Windsurf (.windsurfrules)..."
    cat agents/cross-platform/crasher/agent.md \
        skills/cross-platform/grill-mobile.md > .windsurfrules
    echo "✅ .windsurfrules created in current directory"
}

# Run installs
if [[ "$TOOL" == "claude" || "$TOOL" == "all" ]]; then
    install_claude
fi

if [[ "$TOOL" == "cursor" || "$TOOL" == "all" ]]; then
    install_cursor
fi

if [[ "$TOOL" == "windsurf" || "$TOOL" == "all" ]]; then
    install_windsurf
fi

echo ""
echo "🚀 Mobile Agency installed. Happy shipping."
echo "   → github.com/salmanashraf/mobile-agency"
echo ""
