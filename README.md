# mobile-dev-skills

**The complete AI dev team for mobile engineers. Specialists who never sleep.**

13 personality-driven agents · 28 composable skills · 9 end-to-end workflows  
Android · iOS · Flutter · React Native · Unity · Unreal

```bash
# One-liner (no clone needed)
npx mobile-agency install

# Or clone and run locally
git clone https://github.com/salmanashraf/mobile-dev-skills
./install.sh

# Install by platform
./install.sh --platform android
./install.sh --platform ios
./install.sh --platform flutter
```

---

## Why This Exists

Every viral AI toolkit in 2026 solves one specific problem exceptionally well.

Nobody has done it for mobile. Not one repo covers Android + iOS + Flutter + React Native + Unity + Unreal with real, opinionated, personality-driven agents that know your platform from the inside.

This is that repo.

---

## The Agent Roster

Each agent has a name, a personality, and a clear mission. They're not generic "code reviewer" prompts — they're specialists with opinions.

### Platform Agents

| Agent | Platform | Personality | Mission |
|---|---|---|---|
| **AXIOM** | Android | Battle-scarred architect. Zero tolerance for GlobalScope. Has survived 3 Jetpack migrations. | Reviews Kotlin/Compose for Clean Architecture, leaks, and anti-patterns |
| **SWIFT** | iOS | Elegant, memory-safety obsessed. Will shame your retain cycles if necessary. | Reviews Swift/SwiftUI for memory safety, concurrency, and idiomatic patterns |
| **DART** | Flutter | Pixel-perfect widget obsessive. Counts rebuilds like a miser counts coins. | Reviews Flutter for rebuild efficiency, state management, and performance |
| **BRIDGE** | React Native | JSI evangelist. Tracks every bridge crossing like a border guard. | Finds bridge bottlenecks, re-renders, and New Architecture migration paths |
| **FORGE** | Unity | Game systems architect. Frame budget is sacred. | Reviews C# for GC pressure, Update() abuse, and draw call inefficiency |
| **UNREAL** | Unreal Engine | Blueprint-to-C++ enforcer. | Blueprint optimization, C++ migration, and Tick() abuse |

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

## The Skills Library (28 skills)

Skills are smaller than agents — focused prompt modules you can use inline or compose into agents.

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
| Skill | Why It Gets Shared |
|---|---|
| `/grill-mobile` | 20 questions before any mobile code is written — the most shareable skill |
| `/crash-triage` | Paste stacktrace → root cause → fix |
| `/perf-audit` | Slow screen → systematic profiling guide |
| `/store-listing` | Conversation → ASO-optimized listing copy |
| `/feature-slice` | Epic → independently shippable tickets |
| `/release-prep` | Full release checklist from freeze to store |
| `/accessibility-audit` | WCAG 2.1 AA + platform accessibility review |
| `/api-versioning` | API deprecation strategy for mobile clients |
| `/deeplink-debug` | Diagnoses broken deep links across Android and iOS |

---

## The Workflows (9 workflows)

End-to-end processes that combine agents and skills. This is the differentiator — no other mobile AI toolkit has these.

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

Add it to your project's CLAUDE.md. Share it independently. It's designed to travel.

```
Rule 1 — Ask the API level before assuming
Rule 2 — Check for existing platform components first
Rule 3 — Never touch what wasn't asked
Rule 4 — Performance is a feature, not an afterthought
```

---

## Real Examples

Every agent comes with a real worked example (not toy pseudocode):

| Example | Input | Output |
|---|---|---|
| Android review | [`examples/android-code-review/input.kt`](examples/android-code-review/input.kt) | [`output.md`](examples/android-code-review/output.md) |
| Crash triage | [`examples/crash-triage/input.txt`](examples/crash-triage/input.txt) | [`output.md`](examples/crash-triage/output.md) |
| Flutter review | [`examples/flutter-review/input.dart`](examples/flutter-review/input.dart) | [`output.md`](examples/flutter-review/output.md) |
| Store listing | [`examples/store-listing/input.md`](examples/store-listing/input.md) | [`output.md`](examples/store-listing/output.md) |
| New screen workflow | [`examples/new-screen-workflow/figma-spec.md`](examples/new-screen-workflow/figma-spec.md) | [`output.kt`](examples/new-screen-workflow/output.kt) |

---

## Multi-Tool Support

| Tool | Install |
|---|---|
| Claude Code | `./install.sh` |
| Claude Code (npx) | `npx mobile-agency install` |
| Cursor | `./install.sh --tool cursor` |
| Windsurf | `./install.sh --tool windsurf` |
| Xcode (2026) | `./scripts/install-xcode.sh` |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

Short version:
- Every agent needs a personality, not just a function
- Every agent needs a real worked example
- Run your agent against at least 2 real files before submitting
- Skills must have a slash command name

---

## Community

- [GitHub Discussions](../../discussions) — share your output, ask questions
- [Issues](../../issues) — bug reports, new agent requests

---

*Skills for Real Mobile Engineers. Straight from the trenches.*
