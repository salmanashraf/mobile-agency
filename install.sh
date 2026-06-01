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
    for agent in crasher launchpad sentinel pipeline scribe perf figma accessibility-auditor ci-cd-generator release-notes-generator security-scanner store-listing-writer; do
        src="agents/cross-platform/$agent/agent.md"
        cp "$src" "$CLAUDE_AGENTS_DIR/$agent.md"
        cp "$src" "$CLAUDE_SKILLS_DIR/$agent.md"
    done

    # Cross-platform skills (always installed)
    echo "→ Installing cross-platform skills..."
    cp skills/cross-platform/grill-mobile.md      "$CLAUDE_SKILLS_DIR/grill-mobile.md"
    cp skills/cross-platform/crash-triage.md      "$CLAUDE_SKILLS_DIR/crash-triage.md"
    cp skills/cross-platform/perf-audit.md        "$CLAUDE_SKILLS_DIR/perf-audit.md"
    cp skills/cross-platform/store-listing.md     "$CLAUDE_SKILLS_DIR/store-listing.md"
    cp skills/cross-platform/release-prep.md      "$CLAUDE_SKILLS_DIR/release-prep.md"
    cp skills/cross-platform/feature-slice.md     "$CLAUDE_SKILLS_DIR/feature-slice.md"
    cp skills/cross-platform/accessibility-audit.md "$CLAUDE_SKILLS_DIR/accessibility-audit.md"
    cp skills/cross-platform/api-versioning.md    "$CLAUDE_SKILLS_DIR/api-versioning.md"
    cp skills/cross-platform/deeplink-debug.md    "$CLAUDE_SKILLS_DIR/deeplink-debug.md"
    cp skills/shared/accessibility-audit.md       "$CLAUDE_SKILLS_DIR/shared-accessibility-audit.md"
    cp skills/shared/crash-analysis.md            "$CLAUDE_SKILLS_DIR/crash-analysis.md"
    cp skills/shared/security-scan.md             "$CLAUDE_SKILLS_DIR/security-scan.md"

    # Workflows (always installed — cross-platform process guides)
    echo "→ Installing workflows..."
    cp workflows/feature-ship.md      "$CLAUDE_SKILLS_DIR/feature-ship.md"
    cp workflows/release-cycle.md     "$CLAUDE_SKILLS_DIR/release-cycle.md"
    cp workflows/game-level.md        "$CLAUDE_SKILLS_DIR/game-level.md"
    cp workflows/crash-to-fix.md      "$CLAUDE_SKILLS_DIR/crash-to-fix.md"
    cp workflows/ci-setup.md          "$CLAUDE_SKILLS_DIR/ci-setup.md"
    cp workflows/new-screen.md        "$CLAUDE_SKILLS_DIR/new-screen.md"
    cp workflows/new-project-setup.md "$CLAUDE_SKILLS_DIR/new-project-setup.md"
    cp workflows/app-launch.md        "$CLAUDE_SKILLS_DIR/app-launch.md"
    cp workflows/perf-sprint.md       "$CLAUDE_SKILLS_DIR/perf-sprint.md"

    # Platform-specific
    if [[ "$PLATFORM" == "android" || "$PLATFORM" == "all" ]]; then
        echo "→ Installing Android agents and skills..."
        cp agents/android/axiom/agent.md                  "$CLAUDE_AGENTS_DIR/axiom.md"
        cp agents/android/axiom/agent.md                  "$CLAUDE_SKILLS_DIR/axiom.md"
        cp agents/android/android-crash-analyzer/agent.md "$CLAUDE_AGENTS_DIR/android-crash-analyzer.md"
        cp agents/android/android-crash-analyzer/agent.md "$CLAUDE_SKILLS_DIR/android-crash-analyzer.md"
        cp agents/android/code-reviewer/agent.md          "$CLAUDE_AGENTS_DIR/android-code-reviewer.md"
        cp agents/android/code-reviewer/agent.md          "$CLAUDE_SKILLS_DIR/android-code-reviewer.md"
        cp agents/android/compose-screen-builder/agent.md "$CLAUDE_AGENTS_DIR/compose-screen-builder.md"
        cp agents/android/compose-screen-builder/agent.md "$CLAUDE_SKILLS_DIR/compose-screen-builder.md"
        cp agents/android/compose-ui-reviewer/agent.md    "$CLAUDE_AGENTS_DIR/compose-ui-reviewer.md"
        cp agents/android/compose-ui-reviewer/agent.md    "$CLAUDE_SKILLS_DIR/compose-ui-reviewer.md"
        cp agents/android/crash-analyzer/agent.md         "$CLAUDE_AGENTS_DIR/android-crash-analyzer-v2.md"
        cp agents/android/crash-analyzer/agent.md         "$CLAUDE_SKILLS_DIR/android-crash-analyzer-v2.md"
        cp skills/android/compose-review.md    "$CLAUDE_SKILLS_DIR/compose-review.md"
        cp skills/android/android-tdd.md       "$CLAUDE_SKILLS_DIR/android-tdd.md"
        cp skills/android/kotlin-modernize.md  "$CLAUDE_SKILLS_DIR/kotlin-modernize.md"
        cp skills/android/code-review.md       "$CLAUDE_SKILLS_DIR/android-code-review.md"
        cp skills/android/compose-migration.md "$CLAUDE_SKILLS_DIR/compose-migration.md"
        cp skills/android/proguard-rules.md    "$CLAUDE_SKILLS_DIR/proguard-rules.md"
    fi

    if [[ "$PLATFORM" == "ios" || "$PLATFORM" == "all" ]]; then
        echo "→ Installing iOS agents and skills..."
        cp agents/ios/swift/agent.md               "$CLAUDE_AGENTS_DIR/swift.md"
        cp agents/ios/swift/agent.md               "$CLAUDE_SKILLS_DIR/swift.md"
        cp agents/ios/crash-analyzer/agent.md      "$CLAUDE_AGENTS_DIR/ios-crash-analyzer.md"
        cp agents/ios/crash-analyzer/agent.md      "$CLAUDE_SKILLS_DIR/ios-crash-analyzer.md"
        cp agents/ios/swift-reviewer/agent.md      "$CLAUDE_AGENTS_DIR/swift-reviewer.md"
        cp agents/ios/swift-reviewer/agent.md      "$CLAUDE_SKILLS_DIR/swift-reviewer.md"
        cp skills/ios/swiftui-review.md      "$CLAUDE_SKILLS_DIR/swiftui-review.md"
        cp skills/ios/ios-tdd.md             "$CLAUDE_SKILLS_DIR/ios-tdd.md"
        cp skills/ios/data-persistence.md    "$CLAUDE_SKILLS_DIR/data-persistence.md"
        cp skills/ios/networking.md          "$CLAUDE_SKILLS_DIR/ios-networking.md"
        cp skills/ios/performance.md         "$CLAUDE_SKILLS_DIR/ios-performance.md"
        cp skills/ios/swift-concurrency.md   "$CLAUDE_SKILLS_DIR/swift-concurrency.md"
        cp skills/ios/swift-review.md        "$CLAUDE_SKILLS_DIR/swift-review.md"
        cp skills/ios/swiftui-state.md       "$CLAUDE_SKILLS_DIR/swiftui-state.md"
        cp skills/ios/unit-testing.md        "$CLAUDE_SKILLS_DIR/ios-unit-testing.md"
        cp skills/ios/xcode-warnings.md      "$CLAUDE_SKILLS_DIR/xcode-warnings.md"
    fi

    if [[ "$PLATFORM" == "flutter" || "$PLATFORM" == "all" ]]; then
        echo "→ Installing Flutter agents and skills..."
        cp agents/flutter/dart/agent.md                  "$CLAUDE_AGENTS_DIR/dart.md"
        cp agents/flutter/dart/agent.md                  "$CLAUDE_SKILLS_DIR/dart.md"
        cp agents/flutter/bloc-feature-builder/agent.md  "$CLAUDE_AGENTS_DIR/bloc-feature-builder.md"
        cp agents/flutter/bloc-feature-builder/agent.md  "$CLAUDE_SKILLS_DIR/bloc-feature-builder.md"
        cp agents/flutter/widget-generator/agent.md      "$CLAUDE_AGENTS_DIR/widget-generator.md"
        cp agents/flutter/widget-generator/agent.md      "$CLAUDE_SKILLS_DIR/widget-generator.md"
        cp skills/flutter/flutter-review.md  "$CLAUDE_SKILLS_DIR/flutter-review.md"
        cp skills/flutter/flutter-tdd.md     "$CLAUDE_SKILLS_DIR/flutter-tdd.md"
        cp skills/flutter/dart-modernize.md  "$CLAUDE_SKILLS_DIR/dart-modernize.md"
        cp skills/flutter/widget-extract.md  "$CLAUDE_SKILLS_DIR/widget-extract.md"
        cp skills/flutter/widget-gen.md      "$CLAUDE_SKILLS_DIR/widget-gen.md"
    fi

    if [[ "$PLATFORM" == "rn" || "$PLATFORM" == "all" ]]; then
        echo "→ Installing React Native agents and skills..."
        cp agents/react-native/bridge/agent.md                "$CLAUDE_AGENTS_DIR/bridge.md"
        cp agents/react-native/bridge/agent.md                "$CLAUDE_SKILLS_DIR/bridge.md"
        cp agents/react-native/performance-optimizer/agent.md "$CLAUDE_AGENTS_DIR/rn-performance-optimizer.md"
        cp agents/react-native/performance-optimizer/agent.md "$CLAUDE_SKILLS_DIR/rn-performance-optimizer.md"
        cp skills/react-native/rn-review.md         "$CLAUDE_SKILLS_DIR/rn-review.md"
        cp skills/react-native/rn-tdd.md            "$CLAUDE_SKILLS_DIR/rn-tdd.md"
        cp skills/react-native/bridge-audit.md      "$CLAUDE_SKILLS_DIR/bridge-audit.md"
        cp skills/react-native/expo-optimize.md     "$CLAUDE_SKILLS_DIR/expo-optimize.md"
        cp skills/react-native/new-arch-migrate.md  "$CLAUDE_SKILLS_DIR/new-arch-migrate.md"
        cp skills/react-native/performance.md       "$CLAUDE_SKILLS_DIR/rn-performance.md"
    fi

    if [[ "$PLATFORM" == "gaming" || "$PLATFORM" == "all" ]]; then
        echo "→ Installing Gaming agents and skills..."
        cp agents/gaming/forge/agent.md                    "$CLAUDE_AGENTS_DIR/forge.md"
        cp agents/gaming/forge/agent.md                    "$CLAUDE_SKILLS_DIR/forge.md"
        cp agents/gaming/unreal/agent.md                   "$CLAUDE_AGENTS_DIR/unreal.md"
        cp agents/gaming/unreal/agent.md                   "$CLAUDE_SKILLS_DIR/unreal.md"
        cp agents/unity/shader-generator/agent.md          "$CLAUDE_AGENTS_DIR/shader-generator.md"
        cp agents/unity/shader-generator/agent.md          "$CLAUDE_SKILLS_DIR/shader-generator.md"
        cp agents/unreal/blueprint-advisor/agent.md        "$CLAUDE_AGENTS_DIR/blueprint-advisor.md"
        cp agents/unreal/blueprint-advisor/agent.md        "$CLAUDE_SKILLS_DIR/blueprint-advisor.md"
        cp skills/gaming/shader-gen.md        "$CLAUDE_SKILLS_DIR/shader-gen.md"
        cp skills/gaming/game-perf.md         "$CLAUDE_SKILLS_DIR/game-perf.md"
        cp skills/gaming/blueprint-to-cpp.md  "$CLAUDE_SKILLS_DIR/blueprint-to-cpp.md"
        cp skills/gaming/unity-tdd.md         "$CLAUDE_SKILLS_DIR/unity-tdd.md"
        cp skills/unity/shader-review.md      "$CLAUDE_SKILLS_DIR/shader-review.md"
    fi

    echo ""
    echo "✅ Installed to:"
    echo "   Agents → $CLAUDE_AGENTS_DIR"
    echo "   Commands → $CLAUDE_SKILLS_DIR"
    echo ""
    echo "   Slash commands available:"
    echo ""
    echo "   Cross-platform agents:"
    echo "   /crasher  /sentinel  /scribe  /pipeline  /perf  /launchpad  /figma"
    echo "   /accessibility-auditor  /ci-cd-generator  /release-notes-generator"
    echo "   /security-scanner  /store-listing-writer"
    echo ""
    echo "   Cross-platform skills:"
    echo "   /grill-mobile  /crash-triage  /perf-audit  /store-listing  /release-prep"
    echo "   /feature-slice  /accessibility-audit  /api-versioning  /deeplink-debug"
    echo "   /crash-analysis  /security-scan"
    echo ""
    echo "   Workflows:"
    echo "   /feature-ship  /release-cycle  /crash-to-fix  /ci-setup  /new-screen"
    echo "   /new-project-setup  /app-launch  /perf-sprint  /game-level"
    if [[ "$PLATFORM" == "android" || "$PLATFORM" == "all" ]]; then
    echo ""
    echo "   Android agents:"
    echo "   /axiom  /android-crash-analyzer  /android-code-reviewer"
    echo "   /compose-screen-builder  /compose-ui-reviewer"
    echo "   Android skills:"
    echo "   /android-tdd  /compose-review  /compose-migration  /kotlin-modernize"
    echo "   /android-code-review  /proguard-rules"
    fi
    if [[ "$PLATFORM" == "ios" || "$PLATFORM" == "all" ]]; then
    echo ""
    echo "   iOS agents:"
    echo "   /swift  /ios-crash-analyzer  /swift-reviewer"
    echo "   iOS skills:"
    echo "   /ios-tdd  /swiftui-review  /swift-review  /swiftui-state  /swift-concurrency"
    echo "   /data-persistence  /ios-networking  /ios-performance  /ios-unit-testing"
    echo "   /xcode-warnings"
    fi
    if [[ "$PLATFORM" == "flutter" || "$PLATFORM" == "all" ]]; then
    echo ""
    echo "   Flutter agents:"
    echo "   /dart  /bloc-feature-builder  /widget-generator"
    echo "   Flutter skills:"
    echo "   /flutter-tdd  /flutter-review  /dart-modernize  /widget-extract  /widget-gen"
    fi
    if [[ "$PLATFORM" == "rn" || "$PLATFORM" == "all" ]]; then
    echo ""
    echo "   React Native agents:"
    echo "   /bridge  /rn-performance-optimizer"
    echo "   React Native skills:"
    echo "   /rn-tdd  /rn-review  /bridge-audit  /expo-optimize  /new-arch-migrate"
    echo "   /rn-performance"
    fi
    if [[ "$PLATFORM" == "gaming" || "$PLATFORM" == "all" ]]; then
    echo ""
    echo "   Gaming agents:"
    echo "   /forge  /unreal  /shader-generator  /blueprint-advisor"
    echo "   Gaming skills:"
    echo "   /shader-gen  /game-perf  /blueprint-to-cpp  /unity-tdd  /shader-review"
    fi
    echo ""
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