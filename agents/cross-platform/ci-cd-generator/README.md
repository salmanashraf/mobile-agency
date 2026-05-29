# CI/CD Pipeline Generator Agent

> Describe your platform, distribution, and requirements. Get a complete, working GitHub Actions / Bitrise / Fastlane configuration with secrets reference, caching, and step-by-step setup guide.

---

## What This Agent Does

Generates complete, working CI/CD pipeline configuration files for mobile apps:

- **PR check** — lint + unit tests only; never deploys
- **Staging build** — builds, signs, and deploys to Firebase App Distribution / TestFlight
- **Production release** — full pipeline including GitHub Release creation and store upload

Every generated config:
- Uses **environment variables** for all secrets — no hardcoded credentials
- Adds **Gradle / CocoaPods / pub / node_modules caching** to minimize build time
- Includes a **Secrets Reference table** (what each secret is, where to get it, where to set it)
- Provides a numbered **Setup Guide** for first-time configuration

---

## Files

| File | Purpose |
|---|---|
| [`agent.md`](agent.md) | Input format, output format, full system prompt |
| [`example-input.md`](example-input.md) | Android + Firebase + Slack notification request |
| [`example-output.md`](example-output.md) | Complete GitHub Actions YAML for all three pipeline types |

---

## Quick Start

```
PLATFORM: <Android | iOS | Flutter | React Native>
CI_SYSTEM: <github-actions | bitrise | fastlane>
PIPELINE_TYPE: <pr-check | staging-build | production-release | all>
DISTRIBUTION: <firebase-app-distribution | testflight | play-store | app-store | none>
BUILD_TOOL: <gradle | xcodebuild | flutter | metro>
SIGNING: <keystore | app-store-connect | none>
TEST_FRAMEWORK: <junit | xctest | flutter-test | jest | none>
REQUIREMENTS:
[special requirements: Slack notifications, specific JDK version, screenshot tests, etc.]
```

---

## Supported Combinations

| Platform | CI System | Distribution |
|---|---|---|
| Android | GitHub Actions | Firebase App Distribution, Play Store |
| iOS | GitHub Actions | TestFlight, App Store |
| Flutter | GitHub Actions | Firebase (Android) + TestFlight (iOS) |
| React Native | GitHub Actions | Firebase (Android) + TestFlight (iOS) |
| Any | Fastlane | Any (Fastfile with lanes) |
| Any | Bitrise | Any (bitrise.yml) |

---

## Related Agents

- [`agents/cross-platform/release-notes-generator`](../release-notes-generator/) — generate the changelog for each release
- `prompts/android/gradle-dependency-audit.md` — audit Gradle before setting up CI
