# Mobile Dev Skill Agents

> An open-source AI productivity toolkit for mobile and game developers.

[![Version](https://img.shields.io/badge/version-v1.0.0-blue)](https://github.com/salmanashraf/mobile-dev-skills/releases/tag/v1.0.0)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Platforms](https://img.shields.io/badge/platforms-Android%20%7C%20iOS%20%7C%20Flutter%20%7C%20React%20Native%20%7C%20Unity%20%7C%20Unreal-blue)](#-platforms)

Drop any agent into **Claude Code**, **Cursor**, **ChatGPT**, or **GitHub Copilot** and get structured, actionable output immediately — no setup, no plugins, just paste and go.

---

## What Is This?

**Mobile Dev Skill Agents** is a curated collection of AI agents, reusable skill prompts, and standalone prompts designed for mobile and game developers.

**Every agent has:**
- A clear **purpose** and supported use cases
- A typed **input format** — you know exactly what to paste
- A structured **output format** — consistent, parseable results every time
- A real **worked example** — tested input and verified output, not placeholder text

**Use it to:**
- Debug and analyze crashes (Android, iOS) in seconds
- Generate complete features — Compose screens, Flutter BLoC layers, shaders
- Review code for Clean Architecture, memory safety, performance, security, and accessibility
- Write release notes, CI/CD pipelines, and App Store listings
- Design game object architectures and Blueprint → C++ migrations

---

## Works With

| Tool | How It Loads | Guide |
|---|---|---|
| **Claude Code** | `CLAUDE.md` loaded automatically when repo is open | [Getting Started](docs/getting-started.md) |
| **Cursor** | `.cursorrules` loaded automatically — full agent index + platform rules | [Cursor Guide](docs/cursor-integration.md) |
| **ChatGPT** | Paste system prompt, or use the ready-made Custom GPT instructions | [ChatGPT Guide](docs/chatgpt-integration.md) |
| **GitHub Copilot** | `.github/copilot-instructions.md` loaded via `@workspace` | [Copilot Guide](docs/vscode-copilot-integration.md) |

---

## Quick Start

**3 steps to use any agent:**

**1. Open the agent folder**
```
agents/android/android-crash-analyzer/
```

**2. Copy the System Prompt**  
Open `agent.md`, find the `## System Prompt` section, copy it.

**3. Paste into your tool**
```
# Claude Code / Cursor / ChatGPT:
[paste the system prompt]

# Then paste your code using the Input Format from agent.md
PLATFORM: Android
APP_VERSION: 3.7.1
CRASH_LOG:
[paste your crash log]
```

That's it. See [`docs/getting-started.md`](docs/getting-started.md) for the full guide, or [`docs/wiki.md`](docs/wiki.md) for a comprehensive reference.

---

## Platforms

| Platform | Agents | Skills | Prompts |
|---|---|---|---|
| Android | 4 | 1 | 5 |
| iOS | 2 | 6 | 4 |
| Flutter | 2 | 1 | 4 |
| React Native | 1 | 2 | 4 |
| Unity | 1 | 1 | 2 |
| Unreal Engine | 1 | 0 | 5 |
| Cross-Platform | 5 | 3 (shared) | — |
| **Total** | **16** | **14** | **22** |

---

## All 16 Agents

Each agent folder contains: `README.md` (quick start) · `agent.md` (full spec + system prompt) · `example-input.md` · `example-output.md`

### Android

| Agent | What It Does |
|---|---|
| [Code Reviewer](agents/android/code-reviewer/) | Reviews Kotlin/Compose for Clean Architecture violations, coroutine leaks, anti-patterns |
| [Crash Analyzer](agents/android/android-crash-analyzer/) | Paste a crash log → 9-section report: root cause, fix, edge cases, test checklist |
| [Compose Screen Builder](agents/android/compose-screen-builder/) | Describe a screen → complete ViewModel + StateFlow + Material 3 + Navigation code |
| [Compose UI Reviewer](agents/android/compose-ui-reviewer/) | Compose-only: recomposition scope, `remember`/`derivedStateOf`, `LazyColumn` keys |

### iOS

| Agent | What It Does |
|---|---|
| [Swift Code Reviewer](agents/ios/swift-reviewer/) | Reviews Swift/SwiftUI for ARC cycles, `@MainActor`, async/await, force-unwrap |
| [Crash Analyzer](agents/ios/crash-analyzer/) | Symbolicated `.crash` report → 9-section analysis (EXC_BAD_ACCESS, watchdog, force-unwrap) |

### Flutter

| Agent | What It Does |
|---|---|
| [Widget Generator](agents/flutter/widget-generator/) | Describe a widget → complete null-safe Dart widget with theming and accessibility |
| [BLoC Feature Builder](agents/flutter/bloc-feature-builder/) | Describe a feature → full Clean Architecture layer: Cubit/BLoC + Repository + Dio |

### React Native

| Agent | What It Does |
|---|---|
| [Performance Optimizer](agents/react-native/performance-optimizer/) | Finds re-render bottlenecks, FlatList issues, bridge overhead — with corrected TypeScript |

### Unity

| Agent | What It Does |
|---|---|
| [Shader Generator](agents/unity/shader-generator/) | Describe a visual effect → complete `.shader` file (URP / HDRP / Built-in) |

### Unreal Engine

| Agent | What It Does |
|---|---|
| [Blueprint Advisor](agents/unreal/blueprint-advisor/) | Analyzes Blueprint logic → Tick audit + C++ migration candidates + C++ code |

### Cross-Platform

| Agent | What It Does |
|---|---|
| [Security Scanner](agents/cross-platform/security-scanner/) | OWASP Mobile Top 10 audit — hardcoded keys, insecure storage, WebView, permissions |
| [Accessibility Auditor](agents/cross-platform/accessibility-auditor/) | WCAG 2.2 audit across Compose, SwiftUI, Flutter, React Native |
| [Release Notes Generator](agents/cross-platform/release-notes-generator/) | `git log` → App Store copy + developer changelog + QA regression notes |
| [CI/CD Pipeline Generator](agents/cross-platform/ci-cd-generator/) | GitHub Actions / Bitrise / Fastlane configs with signing, caching, and secrets reference |
| [Store Listing Writer](agents/cross-platform/store-listing-writer/) | ASO-optimized App Store + Play Store listings with keyword density analysis |

---

## Real Examples

### Android Crash Debugging

**Input:**
```
PLATFORM: Android
USER_ACTION: User tapped Back while profile photo was uploading.
CRASH_LOG:
Fatal Exception: java.lang.IllegalStateException:
Fragment ProfileFragment not attached to a context.
  at ProfileFragment.showUploadSuccess(ProfileFragment.kt:124)
  at ProfileFragment$observeViewModel$1.onChanged(ProfileFragment.kt:89)
```

**Agent identifies two compounding bugs:**
1. LiveData observed with `this` instead of `viewLifecycleOwner` — stays active after view is destroyed
2. `requireContext()` called inside that observer fires after Fragment detaches

**Generated fix:**
```kotlin
// Before — observer stays alive after screen is gone
viewModel.uploadState.observe(this) { state ->
    showUploadSuccess(state.photoUrl)  // requireContext() throws → CRASH
}

// After — auto-cancels when view is destroyed
viewLifecycleOwner.lifecycleScope.launch {
    repeatOnLifecycle(Lifecycle.State.STARTED) {
        viewModel.uploadState.collect { state ->
            showUploadSuccess(state.photoUrl)
        }
    }
}
```
→ Full 9-section report: [`agents/android/android-crash-analyzer/example-output.md`](agents/android/android-crash-analyzer/example-output.md)

---

### Flutter BLoC Feature Generation

**Input:** Describe a paginated product catalog with filter chips, pull-to-refresh, and load-more.

**Output in under 10 minutes:**
```
✓ domain/entities/product.dart
✓ domain/repositories/product_catalog_repository.dart
✓ domain/usecases/get_products_usecase.dart
✓ data/models/product_model.dart
✓ data/datasources/product_catalog_remote_datasource.dart   — Dio + error handling
✓ data/repositories/product_catalog_repository_impl.dart    — Either<Failure, T>
✓ presentation/cubit/product_catalog_state.dart             — 5 sealed states
✓ presentation/cubit/product_catalog_cubit.dart             — load, loadMore, refresh, filter
✓ presentation/pages/product_catalog_page.dart              — BlocBuilder + PullToRefresh
✓ presentation/widgets/product_card.dart
✓ test/product_catalog_cubit_test.dart                      — bloc_test stubs
✓ get_it DI registration snippet
✓ pubspec.yaml additions
```
→ Full output: [`agents/flutter/bloc-feature-builder/example-output.md`](agents/flutter/bloc-feature-builder/example-output.md)

---

### React Native Performance Audit

**Input:** FeedScreen with 4 performance problems.

**Output:**
```
[HIGH]   renderItem recreated on every render → useCallback fix
[HIGH]   Inline style object per cell → useMemo fix
[MEDIUM] onLike closure per cell → stable callback pattern
[LOW]    FlatList missing getItemLayout → fix provided

Before: ~15 re-renders per state change
After : ~0 re-renders for unrelated state changes
```
→ Full audit: [`agents/react-native/performance-optimizer/example-output.md`](agents/react-native/performance-optimizer/example-output.md)

---

## Skills (14 Composable Modules)

Skills are lightweight prompt modules — paste one at the start of any LLM session to add focused analysis rules.

| Platform | Skills |
|---|---|
| **Android** | Coroutines, Clean Architecture, Compose |
| **iOS** | Swift memory safety · SwiftUI state · Networking · Unit testing · Performance · Data persistence |
| **Flutter** | Widget generation rules |
| **React Native** | Performance · Bridge audit |
| **Unity** | Shader budget review |
| **Shared** | Crash analysis · Accessibility (WCAG 2.2) · Security (OWASP Mobile) |

Browse: [`skills/`](skills/) — each platform folder has a `README.md` index.

---

## Prompts (22 Standalone)

Ready-to-paste prompts for focused one-shot tasks.

| Platform | Prompts |
|---|---|
| **Android** | Unit test generation · Migration guide · Compose layout · Gradle audit · Flow explainer |
| **iOS** | Swift concurrency explainer · Unit test generation · SwiftUI accessibility · Combine → async |
| **Flutter** | Widget from design · Riverpod migration · Golden test · Performance audit |
| **React Native** | Component audit · New Architecture migration · Navigation setup · Detox E2E test |
| **Game Dev** | Shader from reference · Blueprint → C++ · Game object architecture · Balance table · Level design review |

Browse: [`prompts/`](prompts/) — each platform folder has a `README.md` index.

---

## Repo Structure

```
mobile-dev-skill-agents/
│
├── agents/                        ← Start here — 16 AI agents
│   ├── android/
│   │   ├── android-crash-analyzer/    ← Crash logs → 9-section report
│   │   ├── code-reviewer/             ← Kotlin/Compose review
│   │   ├── compose-screen-builder/    ← Full screen from description
│   │   └── compose-ui-reviewer/       ← Compose-specific deep review
│   ├── ios/
│   │   ├── crash-analyzer/            ← iOS crash reports
│   │   └── swift-reviewer/            ← Swift/SwiftUI review
│   ├── flutter/
│   │   ├── bloc-feature-builder/      ← Full BLoC feature layer
│   │   └── widget-generator/          ← Widget from description
│   ├── react-native/
│   │   └── performance-optimizer/     ← Re-render + FlatList audit
│   ├── unity/
│   │   └── shader-generator/          ← HLSL shader from description
│   ├── unreal/
│   │   └── blueprint-advisor/         ← Blueprint review + C++ migration
│   └── cross-platform/
│       ├── accessibility-auditor/     ← WCAG 2.2 across all platforms
│       ├── ci-cd-generator/           ← GitHub Actions / Fastlane
│       ├── release-notes-generator/   ← git log → release notes
│       ├── security-scanner/          ← OWASP Mobile Top 10
│       └── store-listing-writer/      ← ASO-optimized store copy
│
├── skills/                        ← 14 composable prompt modules
│   ├── android/                   ← README index inside each folder
│   ├── ios/                       ← 6 skills (most complete platform)
│   ├── flutter/
│   ├── react-native/
│   ├── unity/
│   └── shared/                    ← Cross-platform: crash, a11y, security
│
├── prompts/                       ← 22 standalone one-shot prompts
│   ├── android/
│   ├── ios/
│   ├── flutter/
│   ├── react-native/
│   └── game-dev/
│
├── examples/                      ← Real code files paired with agents
│   ├── android/                   ← ProfileViewModel.kt, crash log
│   ├── ios/                       ← ProfileViewModel.swift
│   ├── flutter/                   ← expandable_card.dart
│   ├── react-native/              ← FeedScreen.tsx
│   └── game-dev/                  ← HolographicScanline.shader
│
├── templates/                     ← Scaffold for contributors
│   ├── agent-template.md
│   ├── skill-template.md
│   └── prompt-template.md
│
├── docs/                          ← Guides and reference
│   ├── wiki.md                    ← Full reference (start here)
│   ├── getting-started.md
│   ├── agent-guide.md
│   ├── cursor-integration.md
│   ├── chatgpt-integration.md
│   ├── vscode-copilot-integration.md
│   ├── skill-categories.md
│   ├── releases/
│   │   └── release-v1.0.0.md
│   └── roadmap/
│       └── github-issues.md
│
├── .cursorrules                   ← Cursor AI auto-loads this
├── CLAUDE.md                      ← Claude Code auto-loads this
├── .github/copilot-instructions.md ← Copilot @workspace loads this
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
└── LICENSE                        ← MIT
```

---

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the complete guide.

**Short version:**
1. Copy [`templates/agent-template.md`](templates/agent-template.md) into `agents/<platform>/<name>/agent.md`
2. Fill every section — no placeholders
3. Test on at least one real example and paste the real output into `example-output.md`
4. Open a GitHub issue using the [New Agent template](.github/ISSUE_TEMPLATE/new_agent.md) before large work
5. Submit a PR

**Contribution ideas:** See [`docs/roadmap/github-issues.md`](docs/roadmap/github-issues.md) for 10 planned agents.

---

## Release

**Current version:** [v1.0.0](https://github.com/salmanashraf/mobile-dev-skills/releases/tag/v1.0.0)  
Full release notes: [`docs/releases/release-v1.0.0.md`](docs/releases/release-v1.0.0.md)

---

## License

[MIT](LICENSE) — free to use, modify, and distribute.

---

*Built for developers, by developers. Every agent solves a problem we've actually hit.*
