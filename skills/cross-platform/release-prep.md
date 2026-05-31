# Skill — /release-prep

**Platform:** Cross-Platform
**Slash Command:** `/release-prep`
**Composable With:** agents/cross-platform/scribe/agent.md, agents/cross-platform/pipeline/agent.md

---

## Purpose

Full release checklist from feature freeze to store submission. Replaces 20 Confluence pages. Adapts to Android, iOS, Flutter, or React Native.

---

## Skill Prompt

```
Run the mobile release checklist for the provided platform and version:

PRE-RELEASE (Feature Freeze → Branch Cut)
[ ] Version code / build number incremented
[ ] Version name updated (semantic versioning: MAJOR.MINOR.PATCH)
[ ] Release branch cut from main/develop
[ ] All feature flags for this release enabled/disabled correctly
[ ] CHANGELOG updated with this version's changes
[ ] Third-party SDK versions audited for known CVEs

BUILD QUALITY
[ ] All CI checks passing on release branch (lint, tests, build)
[ ] No CRITICAL or HIGH severity issues from security scan (SENTINEL)
[ ] Performance baseline measured and no regressions > 5% from previous release
[ ] Crash-free rate from previous version noted (baseline for this release)
[ ] ProGuard/R8 mapping file backed up (Android)
[ ] Debug symbols uploaded (dSYM for iOS, mapping.txt for Android → Firebase/Sentry)

STORE PREPARATION
[ ] Store listing updated if features changed (screenshots, description)
[ ] Release notes written for both stores (SCRIBE)
[ ] App Store review notes prepared (if new permissions or flows)
[ ] Age rating correct for new content (if applicable)
[ ] Privacy policy updated if new data collection added

ANDROID SPECIFIC
[ ] targetSdkVersion up to date (Google requires current year's target SDK by August)
[ ] Adaptive icon tested on Android 8+ devices
[ ] 64-bit APK / AAB includes both ARM64 and x86_64
[ ] Play App Signing enrolled
[ ] Internal testing → Closed testing → Open testing → Production rollout plan set

iOS SPECIFIC
[ ] All required privacy usage description strings in Info.plist
[ ] App Transport Security exceptions justified
[ ] In-app purchase products reviewed if applicable
[ ] TestFlight beta distributed to testers, feedback collected
[ ] Notarization complete (macOS if applicable)

ROLLOUT STRATEGY
[ ] Staged rollout planned: 1% → 5% → 20% → 100%
[ ] Monitoring dashboard ready (Firebase, Crashlytics, Sentry)
[ ] Rollback plan documented: which version to roll back to and how
[ ] On-call engineer assigned for first 48 hours post-launch

Flag any unchecked items as blockers before submission.
```
