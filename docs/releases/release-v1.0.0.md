# Release v0.1.0 — Foundation

**Released:** 2026-05-29  
**Tag:** `v0.1.0`  
**Type:** Initial public release

---

## Overview

v0.1.0 is the foundation release of **Mobile Dev Skill Agents** — an open-source AI productivity toolkit for mobile and game developers.

This release ships 14 production-ready agents, 10+ skills, 22 prompts, and tool integration files for Claude Code, Cursor, ChatGPT, and GitHub Copilot. Every agent includes a structured input format, typed output format, and a real worked example verified against at least one major LLM.

---

## What's Included

### Agents (14)

#### Android
| Agent | Description |
|---|---|
| Android Code Reviewer | Kotlin/Compose Clean Architecture, coroutines, anti-patterns — CRITICAL/WARNING/INFO findings |
| Android Crash Analyzer | 9-section crash report: root cause, fix, edge cases, test checklist, prevention tips |
| Android Compose UI Reviewer | Recomposition scope, `remember`/`derivedStateOf`, `LazyColumn` keys, side effects |
| Android Compose Screen Builder | Full screen generation: ViewModel, StateFlow, Material 3, Navigation, Hilt |
| Android BLoC-compatible crash debugging | Detailed coroutine, lifecycle, and RecyclerView crash analysis |

#### iOS
| Agent | Description |
|---|---|
| Swift Code Reviewer | ARC, retain cycles, `@MainActor`, async/await, force-unwrap audit |
| iOS Crash Analyzer | Symbolicated crash reports → 9-section analysis (EXC_BAD_ACCESS, SIGSEGV, watchdog) |

#### Flutter
| Agent | Description |
|---|---|
| Flutter Widget Generator | Production Dart widget from plain-English description |
| Flutter BLoC Feature Builder | Complete layered feature: Cubit/BLoC, Repository, Dio, domain entities, test stubs |

#### React Native
| Agent | Description |
|---|---|
| RN Performance Optimizer | Re-renders, `useCallback`/`useMemo`, FlatList config, bridge overhead |

#### Game Development
| Agent | Description |
|---|---|
| Unity Shader Generator | Full `.shader` file from visual description (URP, HDRP, Built-in) |
| Unreal Blueprint Advisor | Blueprint analysis, tick optimization, C++ migration candidates |

#### Cross-Platform
| Agent | Description |
|---|---|
| Release Notes Generator | `git log` → App Store copy + developer changelog + QA notes |
| CI/CD Pipeline Generator | GitHub Actions / Fastlane for Android, iOS, Flutter, React Native |
| Store Listing Writer | ASO-optimized App Store + Play Store listings with character counts |
| Mobile Security Scanner | OWASP Mobile Top 10 — exploitability analysis + concrete fix per finding |
| Accessibility Auditor | WCAG 2.2 audit across Compose, SwiftUI, Flutter, React Native |

---

### Skills (16 composable prompt modules)

| Platform | Skills |
|---|---|
| Android | Code review (coroutines, Clean Architecture, Compose) |
| iOS | Swift review, SwiftUI state, Networking, Unit testing, Performance, Data persistence |
| Flutter | Widget generation rules |
| React Native | Performance, Bridge audit |
| Unity | Shader review |
| Shared | Crash analysis, Accessibility audit, Security scan |

---

### Prompts (22)

| Platform | Prompts |
|---|---|
| Android | Unit test generation, Migration guide, Compose layout, Gradle dependency audit, Flow explainer |
| iOS | Swift concurrency explainer, Unit test generation, SwiftUI accessibility audit, Combine → async/await |
| Flutter | Widget from design, Riverpod migration, Golden test, Performance audit |
| React Native | Component audit, New Architecture migration, Navigation setup, Detox E2E test |
| Game Dev | Shader from reference, Blueprint to C++, Game object architecture, Game balance table, Level design review |

---

### Tool Integrations

| Tool | File | How |
|---|---|---|
| Claude Code | `CLAUDE.md` | Loaded automatically on repo open |
| Cursor | `.cursorrules` | Loaded automatically — full agent index + platform rules |
| ChatGPT | `docs/chatgpt-integration.md` | Paste-ready Custom GPT system prompt |
| GitHub Copilot | `.github/copilot-instructions.md` | Loaded via `@workspace` |

---

### Examples

Real code examples paired with agents:
- `examples/android/ProfileViewModel.kt` — paired with Android Code Reviewer
- `examples/android/sample-crash-log.txt` — paired with Android Crash Analyzer
- `examples/ios/ProfileViewModel.swift` — paired with Swift Code Reviewer
- `examples/flutter/expandable_card.dart` — paired with Flutter Widget Generator
- `examples/react-native/FeedScreen.tsx` — paired with RN Performance Optimizer
- `examples/game-dev/HolographicScanline.shader` — paired with Unity Shader Generator

---

## Metrics

| Metric | Value |
|---|---|
| Agents | 14 |
| Skills | 16 |
| Standalone prompts | 22 |
| Example files | 6 |
| Lines of markdown / code | ~12,000+ |
| Platforms covered | 7 (Android, iOS, Flutter, React Native, Unity, Unreal, Cross-Platform) |
| LLM compatibility | Claude Sonnet 4.6, GPT-4o, Gemini 1.5 Pro |
| Tool integrations | 4 (Claude Code, Cursor, ChatGPT, GitHub Copilot) |

---

## Known Limitations

- Agents are prompt-based — output quality scales with the model. GPT-3.5 and smaller models produce weaker structured output.
- The iOS Crash Analyzer requires symbolicated crash reports. Unsymbolicated `.crash` files return limited analysis.
- The CI/CD Pipeline Generator produces starter configs. Secrets management and advanced signing workflows may require manual adaptation.
- Game Dev agents (Unity, Unreal) are marked `Beta` — coverage for HDRP, Niagara, and GAS is limited in v0.1.0.

---

## Upgrade Notes

This is the first public release — no migration needed.

---

## What's Next

See [`docs/roadmap/github-issues.md`](../roadmap/github-issues.md) for the full v0.2.0 roadmap.

Top priorities for v0.2.0:
- Android APK/AAB size analyzer agent
- iOS App Store Review Guidelines compliance checker
- Flutter state architecture advisor (when to use Riverpod vs BLoC vs setState)
- Windsurf and VS Code extension integration guides
- Multi-file review workflow (review entire feature folder, not one file at a time)

---

## Contributors

This release was authored by [Salman Ashraf](https://github.com/salmanashraf).

Want to contribute? See [CONTRIBUTING.md](../../CONTRIBUTING.md) and open an issue before starting large work.

---

## License

[MIT](../../LICENSE) — free to use, modify, and distribute. Attribution appreciated.
