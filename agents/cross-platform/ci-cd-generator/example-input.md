# Example Input — CI/CD Pipeline Generator

---

```
PLATFORM: Android
CI_SYSTEM: github-actions
PIPELINE_TYPE: all
DISTRIBUTION: firebase-app-distribution
BUILD_TOOL: gradle
SIGNING: keystore
TEST_FRAMEWORK: junit
REQUIREMENTS:
  - Kotlin 2.0, AGP 8.7, Java 21
  - Notify #mobile-builds Slack channel on success and failure
  - Cache Gradle dependencies to speed up builds
  - Run Android Lint before unit tests on PR check
  - Staging distributes to "internal-testers" Firebase group
  - Production uploads signed AAB to Play Store internal track
  - Production creates a GitHub Release with auto-generated release notes
```

---

## What to Expect

Three complete GitHub Actions YAML files. See [`example-output.md`](example-output.md).

Generated pipelines:
- **PR Check** (`.github/workflows/pr-check.yml`) — lint → unit tests → upload reports on failure
- **Staging Build** (`.github/workflows/staging-build.yml`) — build → sign APK → upload to Firebase → Slack
- **Production Release** (`.github/workflows/production-release.yml`) — lint → tests → build AAB → GitHub Release → Play Store internal → Slack

---

## Variations

### Flutter (Android + iOS)
```
PLATFORM: Flutter
CI_SYSTEM: github-actions
PIPELINE_TYPE: all
DISTRIBUTION: firebase-app-distribution
BUILD_TOOL: flutter
SIGNING: keystore
TEST_FRAMEWORK: flutter-test
REQUIREMENTS:
  - Flutter 3.27, Dart 3.6
  - Matrix build: Android + iOS in parallel
  - Run flutter analyze and flutter test before build
  - iOS distributes to TestFlight
  - Cache pub cache
```

### iOS with Fastlane
```
PLATFORM: iOS
CI_SYSTEM: fastlane
PIPELINE_TYPE: all
DISTRIBUTION: testflight
BUILD_TOOL: xcodebuild
SIGNING: app-store-connect
TEST_FRAMEWORK: xctest
REQUIREMENTS:
  - Swift 5.10, Xcode 16
  - Use App Store Connect API key (no Apple ID password)
  - Run SwiftLint before tests
  - Upload dSYMs to Firebase Crashlytics after each build
```
