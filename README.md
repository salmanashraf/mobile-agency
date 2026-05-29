# Mobile Dev Skill Agents

> An open-source productivity toolkit for mobile and game developers powered by AI agents, skills, and prompts.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Platforms](https://img.shields.io/badge/platforms-Android%20%7C%20iOS%20%7C%20Flutter%20%7C%20React%20Native%20%7C%20Unity%20%7C%20Unreal-blue)](#platforms)

---

## What Is This?

**Mobile Dev Skill Agents** is a curated collection of AI agents, reusable skill prompts, and developer tools designed specifically for mobile and game development workflows.

Each agent has a **clear purpose**, **defined input/output format**, and **real example usage** — not just theoretical prompts. You can drop these into Claude Code, any LLM-powered IDE extension, or your own AI pipeline.

This toolkit helps you:

- Accelerate code reviews for Android, iOS, Flutter, and React Native
- Generate and debug shaders, blueprints, and game logic
- Analyze crash logs and performance bottlenecks
- Write store listings, release notes, and documentation
- Set up CI/CD pipelines tailored to mobile stacks

---

## Platforms

| Platform | Status | Agents | Skills | Prompts |
|---|---|---|---|---|
| Android | Stable | 3 | 1 | 5 |
| iOS | Stable | 2 | 2 | 4 |
| Flutter | Stable | 1 | 1 | 4 |
| React Native | Stable | 1 | 2 | 4 |
| Unity | Beta | 1 | 1 | 2 |
| Unreal Engine | Beta | 1 | 0 | 2 |
| Cross-Platform | Stable | 5 | 2 | 5 |

---

## Folder Structure

```
mobile-dev-skill-agents/
├── README.md                        # This file
├── LICENSE                          # MIT License
├── CONTRIBUTING.md                  # How to contribute
├── CODE_OF_CONDUCT.md               # Community standards
│
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── new_agent.md
│   └── PULL_REQUEST_TEMPLATE.md
│
├── agents/                          # Self-contained AI agents
│   ├── android/
│   │   ├── code-reviewer/           # Agent 01
│   │   └── crash-analyzer/          # Agent 02
│   ├── ios/
│   │   └── swift-reviewer/          # Agent 03
│   ├── flutter/
│   │   └── widget-generator/        # Agent 04
│   ├── react-native/
│   │   └── performance-optimizer/   # Agent 05
│   ├── unity/
│   │   └── shader-generator/        # Agent 06
│   ├── unreal/
│   │   └── blueprint-advisor/       # Agent 07
│   └── cross-platform/
│       ├── release-notes-generator/ # Agent 08
│       ├── ci-cd-generator/         # Agent 09
│       └── store-listing-writer/    # Agent 10
│
├── skills/                          # Reusable skill prompt modules
│   ├── android/
│   ├── ios/
│   ├── flutter/
│   ├── react-native/
│   ├── unity/
│   └── shared/
│
├── prompts/                         # Standalone prompt collections
│   ├── android/
│   ├── ios/
│   ├── flutter/
│   ├── react-native/
│   └── game-dev/
│
├── templates/                       # Templates for creating new agents/skills
│   ├── agent-template.md
│   ├── skill-template.md
│   └── prompt-template.md
│
├── examples/                        # Real code examples for agents to operate on
│   ├── android/
│   ├── ios/
│   ├── flutter/
│   ├── react-native/
│   └── game-dev/
│
└── docs/                            # Extended documentation
    ├── getting-started.md
    ├── agent-guide.md
    └── skill-categories.md
```

---

## Skill Categories

### Code Quality
Review, refactor, and enforce best practices per platform.

### Performance & Optimization
Profile bottlenecks, reduce frame drops, shrink APK/IPA size.

### UI & Design
Generate widgets, layouts, composables, and shader effects.

### Debugging & Crash Analysis
Parse crash logs, symbolicate stack traces, identify root causes.

### DevOps & Release
Generate CI/CD configs, changelogs, and store listings.

### Game Development
Shader authoring, blueprint logic, game object architecture.

### Documentation
Auto-generate API docs, inline comments, and README files.

---

## The First 10 Agents

| # | Agent | Platform | Purpose |
|---|---|---|---|
| 01 | [Android Code Reviewer](agents/android/code-reviewer/agent.md) | Android | Reviews Kotlin/Compose code for correctness and Clean Architecture |
| 02 | [Android Crash Analyzer](agents/android/crash-analyzer/agent.md) | Android | Parses crash logs → 9-section report with root cause, fix, and test checklist |
| 03 | [Android Compose UI Reviewer](agents/android/compose-ui-reviewer/agent.md) | Android | Compose-specific: recomposition scope, state hoisting, LazyColumn, side effects |
| 04 | [Swift Code Reviewer](agents/ios/swift-reviewer/agent.md) | iOS | Reviews Swift/SwiftUI code for memory safety and idiomatic patterns |
| 05 | [iOS Crash Analyzer](agents/ios/crash-analyzer/agent.md) | iOS | Analyzes symbolicated iOS crash reports → root cause, fix, test checklist |
| 06 | [Flutter Widget Generator](agents/flutter/widget-generator/agent.md) | Flutter | Generates Dart widget code from a plain-English description |
| 07 | [RN Performance Optimizer](agents/react-native/performance-optimizer/agent.md) | React Native | Identifies re-render bottlenecks and bridge call overhead |
| 08 | [Unity Shader Generator](agents/unity/shader-generator/agent.md) | Unity | Produces HLSL/ShaderLab shaders from a visual description |
| 09 | [Unreal Blueprint Advisor](agents/unreal/blueprint-advisor/agent.md) | Unreal Engine | Advises on Blueprint-to-C++ migration and logic optimization |
| 10 | [Release Notes Generator](agents/cross-platform/release-notes-generator/agent.md) | All | Converts git commit history into user-facing release notes |
| 11 | [CI/CD Pipeline Generator](agents/cross-platform/ci-cd-generator/agent.md) | All | Produces GitHub Actions / Bitrise / Fastlane configs for mobile |
| 12 | [Store Listing Writer](agents/cross-platform/store-listing-writer/agent.md) | All | Writes App Store / Play Store descriptions optimized for ASO |
| 13 | [Mobile Security Scanner](agents/cross-platform/security-scanner/agent.md) | All | OWASP Mobile Top 10 vulnerability scan with exploitability and fix |
| 14 | [Accessibility Auditor](agents/cross-platform/accessibility-auditor/agent.md) | All | a11y audit: labels, touch targets, roles, focus order, dynamic announcements |

---

## Works With

| Tool | How | Guide |
|---|---|---|
| **Claude Code** | `CLAUDE.md` loaded automatically | [Getting Started](docs/getting-started.md) |
| **Cursor** | `.cursorrules` loaded automatically | [Cursor Integration](docs/cursor-integration.md) |
| **ChatGPT** | Paste system prompt or use Custom GPT builder | [ChatGPT Integration](docs/chatgpt-integration.md) |
| **GitHub Copilot** | `.github/copilot-instructions.md` loaded via `@workspace` | [Copilot Integration](docs/vscode-copilot-integration.md) |

---

## Roadmap

Contributions welcome for any of these:

**New Agents**
- [ ] iOS App Size Optimizer — analyze IPA binary for size reduction opportunities
- [ ] Android ProGuard/R8 Advisor — review keep rules and shrinking configuration
- [ ] Flutter State Architecture Advisor — recommend state management approach for a given project
- [ ] Game Localization Helper — generate i18n string tables and flag hardcoded strings

**Skills**
- [ ] skills/unreal/blueprint-review.md
- [ ] skills/shared/localization-audit.md
- [ ] skills/shared/api-design-review.md

**Prompts**
- [ ] prompts/android/proguard-rules.md
- [ ] prompts/ios/app-clip-setup.md
- [ ] prompts/flutter/app-size-reduction.md

---

## Quick Start

### Using an Agent with Claude Code

1. Open any agent file (e.g. `agents/android/code-reviewer/agent.md`)
2. Copy the **System Prompt** section into your Claude Code session
3. Paste your code/input into the **Input** field
4. Run the agent and review the structured output

### Using a Skill Prompt Directly

```bash
# Example: paste into Claude Code chat
cat skills/android/code-review.md
```

### Running the Examples

Each example file in `examples/` pairs with an agent. See the agent's `agent.md` for the exact usage.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

**Short version:**
- Follow the [agent template](templates/agent-template.md) for new agents
- Follow the [skill template](templates/skill-template.md) for new skills
- Each agent needs: purpose, input format, output format, and a working example
- Open an issue using the [New Agent template](.github/ISSUE_TEMPLATE/new_agent.md) before starting large work

---

## License

[MIT](LICENSE) — free to use, modify, and distribute. Attribution appreciated.

---

## Community

- Issues: GitHub Issues tab
- Discussions: GitHub Discussions
- Contact: open a PR or issue

> Built for developers, by developers. Every agent in this repo solves a problem we've actually hit.
