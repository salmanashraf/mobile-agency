# Mobile Agency

**The complete AI dev team for mobile engineers.**

13 personality-driven agents · 28 composable skills · 9 end-to-end workflows  
Android · iOS · Flutter · React Native · Unity · Unreal

[![npm](https://img.shields.io/npm/v/mobile-agency?color=CB3837&label=npm)](https://www.npmjs.com/package/mobile-agency)
[![npm downloads](https://img.shields.io/npm/dm/mobile-agency?color=CB3837)](https://www.npmjs.com/package/mobile-agency)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/salmanashraf/mobile-agency?style=social)](https://github.com/salmanashraf/mobile-agency/stargazers)
[![Platform](https://img.shields.io/badge/platforms-Android%20%7C%20iOS%20%7C%20Flutter%20%7C%20RN%20%7C%20Unity%20%7C%20Unreal-brightgreen)](#agent-roster)

[Installation Guide](docs/installation.md) · [Wiki](https://github.com/salmanashraf/mobile-agency/wiki) · [Getting Started](docs/getting-started.md) · [Contributing](CONTRIBUTING.md)

> Most AI coding toolkits are generic. Mobile Agency is built specifically for mobile and game development workflows — with agents that know your platform from the inside.

---

## Install

New to AI coding tools? Start with the step-by-step [Installation Guide](docs/installation.md).

Fast path:

```bash
npx mobile-agency install
```

This installs Mobile Agency for Claude Code. For Cursor, Windsurf, GitHub Copilot, Codex, platform-only installs, and troubleshooting, see [docs/installation.md](docs/installation.md).

Common installs:

| I use... | Run this |
|---|---|
| Claude Code | `npx mobile-agency install` |
| Cursor | `npx mobile-agency install --tool cursor` |
| Windsurf | `npx mobile-agency install --tool windsurf` |
| GitHub Copilot | `npx mobile-agency install --tool copilot` |
| Codex / OpenAI | `npx mobile-agency install --tool codex` |
| All supported tools | `npx mobile-agency install --tool all` |

Local clone install:

```bash
git clone https://github.com/salmanashraf/mobile-agency
cd mobile-agency
./install.sh --platform android
./install.sh --platform flutter --tool cursor
./install.sh --tool all
```

---

## See It In Action

`/flutter-review` on a real Flutter project — prioritized findings, zero setup:

https://github.com/user-attachments/assets/427422db-b6b1-4e93-96d0-ad5dd2843f53

`@AXIOM` reviewing Android Kotlin/Compose code — Clean Architecture, lifecycle leaks, coroutine misuse, and Compose anti-patterns:

https://github.com/user-attachments/assets/ee8bbd61-9c64-47bf-a9b3-7812cc12412c

More context: [AXIOM discussion](https://github.com/salmanashraf/mobile-agency/discussions/5)

---

## How It Works

```
1. Install          npx mobile-agency install
2. Open project     Claude Code · Cursor · Windsurf · Copilot · Codex
3. Invoke           @AXIOM · @CRASHER · /flutter-review · /perf-audit
4. Get results      Platform-specific findings, ranked by severity, with fixes
```

**Examples:**

```
@AXIOM review HomeViewModel.kt
@CRASHER analyze crash.log
/flutter-review lib/home_screen.dart
/perf-audit startup
```

---

## Start Here

Not sure where to begin? Pick your situation:

| I want to… | Use this |
|---|---|
| Debug a crash | `@CRASHER` + paste your stacktrace |
| Review Android code | `@AXIOM` + paste your Kotlin file |
| Review Flutter code | `/flutter-review` + paste your Dart file |
| Optimize a slow screen | `/perf-audit` + describe the screen |
| Prepare a release | `/release-prep` |
| Generate release notes | `@SCRIBE` + paste your git log |

---

## Before vs After

### Android — Memory Leak

| | |
|---|---|
| **Input** | `HomeViewModel` holding a `Context` reference |
| **Agent** | `@AXIOM` |
| **Output** | `CRITICAL: Context leak via ViewModel — replace with ApplicationContext or use WeakReference` |
| **Result** | Leak eliminated before PR merge |

### Android — ANR

| | |
|---|---|
| **Input** | Network call on main thread in `onCreate()` |
| **Agent** | `@AXIOM` |
| **Output** | `CRITICAL: Blocking IO on main thread — move to viewModelScope.launch(Dispatchers.IO)` |
| **Result** | ANR fixed with coroutine scope and dispatcher |

### Flutter — Widget Review

| | |
|---|---|
| **Input** | `HomeScreen` with setState on a 400-line widget |
| **Agent** | `/flutter-review` |
| **Output** | 9 ranked findings: draft hydration in build(), ScrollController leak, missing semanticLabels, touch targets below 48dp |
| **Result** | Findings fixed before merge, accessibility score improved |

---

## Why Mobile Agency?

| | Generic AI prompt repos | Mobile Agency |
|---|---|---|
| Platform knowledge | Generic | Android · iOS · Flutter · React Native · Unity · Unreal |
| Agent personalities | None | 13 named specialists with opinions |
| Real workflows | No | 9 end-to-end processes |
| Real examples | Toy pseudocode | Production code input/output pairs |
| Installable | Copy-paste | `npx mobile-agency install` |
| Severity levels | None | CRITICAL · WARNING · INFO |
| Slash commands | No | 28 composable skills |

---

## Agent Roster

### Platform Agents

| Agent | Platform | Personality | Mission |
|---|---|---|---|
| **AXIOM** | Android | Battle-scarred architect. Zero tolerance for GlobalScope. Has survived 3 Jetpack migrations. | Reviews Kotlin/Compose for Clean Architecture, leaks, and anti-patterns |
| **SWIFT** | iOS | Elegant, memory-safety obsessed. Will shame your retain cycles. | Reviews Swift/SwiftUI for memory safety, concurrency, and idiomatic patterns |
| **DART** | Flutter | Pixel-perfect widget obsessive. Counts rebuilds like a miser counts coins. | Reviews Flutter for rebuild efficiency, state management, and performance |
| **BRIDGE** | React Native | JSI evangelist. Tracks every bridge crossing like a border guard. | Finds bridge bottlenecks, re-renders, and New Architecture migration paths |
| **FORGE** | Unity | Game systems architect. Frame budget is sacred. | Reviews C# for GC pressure, Update() abuse, and draw call inefficiency |
| **UNREAL** | Unreal Engine | Blueprint-to-C++ enforcer. Every Tick() must earn its place. | Blueprint optimization, C++ migration, and Tick() abuse |

### Cross-Platform Agents

| Agent | Personality | Mission |
|---|---|---|
| **CRASHER** | Forensic investigator. Nothing escapes. | Crash log → root cause → concrete fix, all platforms |
| **SENTINEL** | Paranoid by design. Every input is malicious until proven otherwise. | OWASP Mobile Top 10 security audit |
| **LAUNCHPAD** | ASO-obsessed conversion scientist. | Play Store + App Store copy, keywords, screenshot brief |
| **PIPELINE** | Automation purist. If it's done manually twice, it's a pipeline waiting to exist. | GitHub Actions / Bitrise / Fastlane configuration |
| **PERF** | Frame-rate zealot. Carries a stopwatch everywhere. | Profile slow screens → concrete optimization plan |
| **SCRIBE** | User-first writer. Translates git commits into things humans understand. | Git log → polished release notes |
| **FIGMA** | Pixel-perfect or it didn't happen. | Figma spec → Compose / SwiftUI / Flutter / RN code |

---

## Skills Library

28 focused prompt modules — use inline or compose with agents.

### Android
| Skill | What It Does |
|---|---|
| `/android-tdd` | Red-green-refactor loop for JUnit5 + Compose UI tests |
| `/compose-review` | Recomposition audit before PR |
| `/compose-migration` | XML layouts → Jetpack Compose |
| `/kotlin-modernize` | Old Kotlin → modern idioms |
| `/proguard-rules` | R8/ProGuard rules from your dependency list |

### iOS
| Skill | What It Does |
|---|---|
| `/ios-tdd` | XCTest TDD loop for Swift/SwiftUI |
| `/swiftui-review` | View lifecycle + memory audit + unnecessary redraws |
| `/swift-concurrency` | Completion handlers → async/await safely |
| `/xcode-warnings` | Explains and fixes Xcode warnings in plain English |

### Flutter
| Skill | What It Does |
|---|---|
| `/flutter-tdd` | Widget test + unit test + Bloc test loop |
| `/flutter-review` | Widget tree audit, const constructors, state management |
| `/widget-extract` | Extracts oversized build() into reusable components |
| `/dart-modernize` | Pre-null-safety Dart → Dart 3.x patterns |

### React Native
| Skill | What It Does |
|---|---|
| `/rn-tdd` | Jest + React Native Testing Library loop |
| `/rn-review` | Bridge calls audit + re-render profiling |
| `/new-arch-migrate` | Step-by-step New Architecture migration |
| `/expo-optimize` | Expo config + OTA + bundle size audit |

### Gaming
| Skill | What It Does |
|---|---|
| `/unity-tdd` | NUnit + Unity Test Runner (EditMode + PlayMode) |
| `/shader-gen` | Plain English → HLSL/ShaderLab shader |
| `/game-perf` | Frame budget audit + draw call optimizer |
| `/blueprint-to-cpp` | Unreal Blueprint → C++ with explanation |

### Cross-Platform
| Skill | What It Does |
|---|---|
| `/grill-mobile` | 20 questions before any mobile code is written |
| `/crash-triage` | Paste stacktrace → root cause → fix |
| `/perf-audit` | Slow screen → systematic profiling guide |
| `/store-listing` | Conversation → ASO-optimized listing copy |
| `/feature-slice` | Epic → independently shippable tickets |
| `/release-prep` | Full release checklist from freeze to store |
| `/accessibility-audit` | WCAG 2.1 AA + platform accessibility review |
| `/api-versioning` | API deprecation strategy for mobile clients |
| `/deeplink-debug` | Diagnoses broken deep links across Android and iOS |

---

## Workflows

9 end-to-end processes that chain agents and skills together.

| Workflow | What It Covers |
|---|---|
| `feature-ship` | Ticket → /grill-mobile → /feature-slice → implement → review → test → PR |
| `crash-to-fix` | Crash alert → CRASHER → fix → regression test → deploy |
| `app-launch` | Release build → SENTINEL → PERF → LAUNCHPAD → SCRIBE → /release-prep → store |
| `new-screen` | Figma spec → FIGMA → implement → review → performance check |
| `ci-setup` | PIPELINE → generate config → secrets → test → document |
| `release-cycle` | Feature freeze → CRASHER → SENTINEL → SCRIBE → /release-prep → staged rollout |
| `perf-sprint` | Baseline → /perf-audit → fix → re-measure → document |
| `game-level` | Design doc → FORGE/UNREAL → /shader-gen → /game-perf → /unity-tdd → playtest |
| `new-project-setup` | /grill-mobile → architecture → CI → security baseline → test infrastructure |

---

## The Viral File

**[mobile-karpathy.md](mobile-karpathy.md)** — 4 rules that stop AI coding agents shipping broken mobile apps.

Add it to your project's `CLAUDE.md`. Share it independently. It's designed to travel.

```
Rule 1 — Ask the API level before assuming
Rule 2 — Check for existing platform components first
Rule 3 — Never touch what wasn't asked
Rule 4 — Performance is a feature, not an afterthought
```

---

## Real Examples

Every agent ships with a real worked example — production code in, structured findings out.

| Example | Input | Output |
|---|---|---|
| Android review | [`examples/android-code-review/input.kt`](examples/android-code-review/input.kt) | [`output.md`](examples/android-code-review/output.md) |
| Crash triage | [`examples/crash-triage/input.txt`](examples/crash-triage/input.txt) | [`output.md`](examples/crash-triage/output.md) |
| Flutter review | [`examples/flutter-review/input.dart`](examples/flutter-review/input.dart) | [`output.md`](examples/flutter-review/output.md) |
| Store listing | [`examples/store-listing/input.md`](examples/store-listing/input.md) | [`output.md`](examples/store-listing/output.md) |
| New screen workflow | [`examples/new-screen-workflow/figma-spec.md`](examples/new-screen-workflow/figma-spec.md) | [`output.kt`](examples/new-screen-workflow/output.kt) |

---

## Multi-Tool Support

| Tool | How to Use |
|---|---|
| Claude Code | `npx mobile-agency install` |
| Cursor | `npx mobile-agency install --tool cursor` |
| Windsurf | `npx mobile-agency install --tool windsurf` |
| GitHub Copilot | Paste agent system prompt into Copilot instructions |
| Codex / OpenAI | Use agents as system prompts via API or CLI |
| Local repo | `git clone` + `./install.sh` |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

- Every agent needs a personality, not just a function
- Every agent needs a real worked example using production code
- Run your agent against at least 2 real files before submitting
- Skills must have a slash command name
- Workflows must list every agent and skill used, step by step

---

## Community

- [GitHub Discussions](https://github.com/salmanashraf/mobile-agency/discussions) — share your output, ask questions, show and tell
- [Issues](https://github.com/salmanashraf/mobile-agency/issues) — bug reports, new agent requests

If Mobile Agency saved you time, a star helps others find it.  
[![GitHub Stars](https://img.shields.io/github/stars/salmanashraf/mobile-agency?style=social)](https://github.com/salmanashraf/mobile-agency/stargazers)

---

*Built for mobile engineers who ship real apps.*
