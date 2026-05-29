# Agent 09 — CI/CD Pipeline Generator

**Platform:** Cross-Platform (All)  
**Category:** DevOps & Release  
**Complexity:** Medium

---

## Purpose

Generates complete, working CI/CD pipeline configuration files for mobile apps. Supports GitHub Actions, Bitrise, and Fastlane. Produces environment-specific pipelines (PR checks, staging builds, production releases) with signing configuration, test execution, and deployment steps tailored to the target platform.

---

## Input Format

```
PLATFORM: <Android | iOS | Flutter | React Native>
CI_SYSTEM: <github-actions | bitrise | fastlane>
PIPELINE_TYPE: <pr-check | staging-build | production-release | all>
DISTRIBUTION: <firebase-app-distribution | testflight | play-store | app-store | none>
BUILD_TOOL: <gradle | xcodebuild | flutter | metro>
SIGNING: <keystore | app-store-connect | none>
TEST_FRAMEWORK: <junit | xctest | flutter-test | jest | none>
REQUIREMENTS:
<Any special requirements:
  - Environment variables needed
  - Specific Gradle/Xcode versions
  - Custom steps (e.g., run screenshots, upload to Slack)
  - Caching needs>
```

**Fields:**

| Field | Required | Description |
|---|---|---|
| `PLATFORM` | Yes | Target mobile platform |
| `CI_SYSTEM` | Yes | Which CI/CD system to generate for |
| `PIPELINE_TYPE` | Yes | Which pipeline(s) to generate |
| `DISTRIBUTION` | Yes | Where builds are deployed |
| `BUILD_TOOL` | Yes | Build system used |
| `SIGNING` | Yes | Code signing approach |
| `TEST_FRAMEWORK` | Yes | Test runner, or `none` |
| `REQUIREMENTS` | No | Additional custom steps |

---

## Output Format

````
CI/CD PIPELINE — <PLATFORM> / <CI_SYSTEM>
==========================================
Pipelines Generated: <list>
Secrets Required   : <list of env var names to configure>

--- [PR CHECK PIPELINE] ---
File: <.github/workflows/pr-check.yml or equivalent>

```yaml
<full pipeline configuration>
```

--- [STAGING BUILD PIPELINE] ---
File: <file path>

```yaml
<full pipeline configuration>
```

--- [PRODUCTION RELEASE PIPELINE] ---
File: <file path>

```yaml
<full pipeline configuration>
```

SETUP GUIDE
-----------
Step 1: <First thing to configure, e.g. add secrets to GitHub>
Step 2: <Second step>
...

SECRETS REFERENCE
-----------------
| Secret Name | Where to Get It | Where to Set It |
|---|---|---|
| <SECRET_NAME> | <source> | <GitHub Settings / Bitrise Secrets / etc.> |

KNOWN LIMITATIONS
-----------------
- <Any assumption made about project structure>
- <Any platform version constraint>
````

---

## System Prompt

```
You are a senior mobile DevOps engineer. Your job is to generate complete, working CI/CD pipeline configuration files for mobile apps.

Rules:
1. Output complete, valid YAML or Ruby (for Fastlane) — not pseudocode or partial configs.
2. Use environment variables for all secrets — never hardcode credentials, passwords, or tokens.
3. Add caching for build tools (Gradle cache, CocoaPods cache, pub cache, node_modules) to minimize build time.
4. For PR checks: run lint, unit tests, and build. Do NOT deploy.
5. For staging builds: build, sign, and deploy to the specified staging distribution channel.
6. For production releases: build, sign, run tests, create a GitHub Release or tag, and deploy to the store.
7. Use the latest stable versions of actions/tools available as of your knowledge cutoff.
8. Include a comment for every non-obvious step.
9. List every secret/environment variable the developer needs to configure, with a reference for where to get it.
10. Be explicit about project structure assumptions (e.g., "assumes gradlew is in the repo root").

Output MUST follow the exact format specified.
```

---

## Example

### Input

```
PLATFORM: Android
CI_SYSTEM: github-actions
PIPELINE_TYPE: all
DISTRIBUTION: firebase-app-distribution
BUILD_TOOL: gradle
SIGNING: keystore
TEST_FRAMEWORK: junit
REQUIREMENTS:
  - Kotlin 2.0, AGP 8.7
  - Java 21
  - Notify Slack channel #mobile-builds on success/failure
  - Cache Gradle dependencies
  - Run lint before tests
```

### Output

````
CI/CD PIPELINE — Android / GitHub Actions
==========================================
Pipelines Generated: PR Check, Staging Build, Production Release
Secrets Required   : KEYSTORE_BASE64, KEYSTORE_PASSWORD, KEY_ALIAS, KEY_PASSWORD,
                     FIREBASE_APP_ID, FIREBASE_TOKEN, SLACK_WEBHOOK_URL,
                     PLAY_SERVICE_ACCOUNT_JSON

--- [PR CHECK PIPELINE] ---
File: .github/workflows/pr-check.yml

```yaml
name: PR Check

on:
  pull_request:
    branches: [main, develop]

concurrency:
  group: pr-check-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint-and-test:
    name: Lint & Unit Tests
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'

      - name: Cache Gradle packages
        uses: actions/cache@v4
        with:
          path: |
            ~/.gradle/caches
            ~/.gradle/wrapper
          key: gradle-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
          restore-keys: gradle-

      - name: Grant execute permission for gradlew
        run: chmod +x gradlew

      - name: Run Lint
        run: ./gradlew lintDebug

      - name: Run Unit Tests
        run: ./gradlew testDebugUnitTest

      - name: Upload Lint Report
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: lint-report
          path: app/build/reports/lint-results-debug.html

      - name: Upload Test Results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: app/build/reports/tests/testDebugUnitTest/
```

--- [STAGING BUILD PIPELINE] ---
File: .github/workflows/staging-build.yml

```yaml
name: Staging Build

on:
  push:
    branches: [develop]
  workflow_dispatch:

jobs:
  build-and-distribute:
    name: Build & Deploy to Firebase
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'

      - name: Cache Gradle packages
        uses: actions/cache@v4
        with:
          path: |
            ~/.gradle/caches
            ~/.gradle/wrapper
          key: gradle-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
          restore-keys: gradle-

      - name: Grant execute permission for gradlew
        run: chmod +x gradlew

      - name: Run Unit Tests
        run: ./gradlew testDebugUnitTest

      - name: Decode Keystore
        run: |
          echo "${{ secrets.KEYSTORE_BASE64 }}" | base64 -d > keystore.jks

      - name: Build Signed APK (staging)
        run: |
          ./gradlew assembleRelease \
            -Pandroid.injected.signing.store.file=keystore.jks \
            -Pandroid.injected.signing.store.password=${{ secrets.KEYSTORE_PASSWORD }} \
            -Pandroid.injected.signing.key.alias=${{ secrets.KEY_ALIAS }} \
            -Pandroid.injected.signing.key.password=${{ secrets.KEY_PASSWORD }}

      - name: Install Firebase CLI
        run: npm install -g firebase-tools

      - name: Upload to Firebase App Distribution
        run: |
          firebase appdistribution:distribute app/build/outputs/apk/release/app-release.apk \
            --app "${{ secrets.FIREBASE_APP_ID }}" \
            --token "${{ secrets.FIREBASE_TOKEN }}" \
            --groups "internal-testers" \
            --release-notes "Staging build from commit ${{ github.sha }}"

      - name: Notify Slack — Success
        if: success()
        uses: slackapi/slack-github-action@v1.27.0
        with:
          webhook: ${{ secrets.SLACK_WEBHOOK_URL }}
          webhook-type: incoming-webhook
          payload: |
            {
              "text": "✅ *Staging build deployed* — ${{ github.repository }} @ ${{ github.sha }}"
            }

      - name: Notify Slack — Failure
        if: failure()
        uses: slackapi/slack-github-action@v1.27.0
        with:
          webhook: ${{ secrets.SLACK_WEBHOOK_URL }}
          webhook-type: incoming-webhook
          payload: |
            {
              "text": "❌ *Staging build FAILED* — ${{ github.repository }} @ ${{ github.sha }}\nSee: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"
            }
```

--- [PRODUCTION RELEASE PIPELINE] ---
File: .github/workflows/production-release.yml

```yaml
name: Production Release

on:
  push:
    tags:
      - 'v*.*.*'   # Trigger on version tags, e.g. v3.2.0

jobs:
  release:
    name: Build, Sign & Publish to Play Store
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'

      - name: Cache Gradle packages
        uses: actions/cache@v4
        with:
          path: |
            ~/.gradle/caches
            ~/.gradle/wrapper
          key: gradle-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
          restore-keys: gradle-

      - name: Grant execute permission for gradlew
        run: chmod +x gradlew

      - name: Run Lint
        run: ./gradlew lintRelease

      - name: Run Unit Tests
        run: ./gradlew testReleaseUnitTest

      - name: Decode Keystore
        run: |
          echo "${{ secrets.KEYSTORE_BASE64 }}" | base64 -d > keystore.jks

      - name: Build Signed AAB
        run: |
          ./gradlew bundleRelease \
            -Pandroid.injected.signing.store.file=keystore.jks \
            -Pandroid.injected.signing.store.password=${{ secrets.KEYSTORE_PASSWORD }} \
            -Pandroid.injected.signing.key.alias=${{ secrets.KEY_ALIAS }} \
            -Pandroid.injected.signing.key.password=${{ secrets.KEY_PASSWORD }}

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          files: app/build/outputs/bundle/release/app-release.aab
          generate_release_notes: true

      - name: Upload to Play Store (Internal Track)
        uses: r0adkll/upload-google-play@v1.1.3
        with:
          serviceAccountJsonPlainText: ${{ secrets.PLAY_SERVICE_ACCOUNT_JSON }}
          packageName: com.example.yourapp
          releaseFiles: app/build/outputs/bundle/release/app-release.aab
          track: internal
          status: completed

      - name: Notify Slack — Production Released
        if: success()
        uses: slackapi/slack-github-action@v1.27.0
        with:
          webhook: ${{ secrets.SLACK_WEBHOOK_URL }}
          webhook-type: incoming-webhook
          payload: |
            {
              "text": "🚀 *Production release ${{ github.ref_name }} submitted to Play Store* — ${{ github.repository }}"
            }
```

SETUP GUIDE
-----------
Step 1: Generate your release keystore if you don't have one:
        keytool -genkey -v -keystore release.jks -alias your-key-alias -keyalg RSA -keysize 2048 -validity 10000
Step 2: Base64-encode it: base64 -i release.jks | pbcopy
Step 3: Add all secrets listed below to GitHub → Settings → Secrets and variables → Actions.
Step 4: Create a Firebase project and register your Android app to get FIREBASE_APP_ID.
Step 5: Install Firebase CLI locally and run `firebase login:ci` to get FIREBASE_TOKEN.
Step 6: Create a Google Play service account with "Release Manager" role and download the JSON key.
Step 7: Add `#mobile-builds` Slack channel webhook via Slack App → Incoming Webhooks.
Step 8: For production releases, push a tag: git tag v3.2.0 && git push origin v3.2.0

SECRETS REFERENCE
-----------------
| Secret Name | Where to Get It | Where to Set It |
|---|---|---|
| KEYSTORE_BASE64 | base64-encode your .jks file | GitHub → Secrets |
| KEYSTORE_PASSWORD | Your keystore password | GitHub → Secrets |
| KEY_ALIAS | Your key alias (from keytool) | GitHub → Secrets |
| KEY_PASSWORD | Your key password | GitHub → Secrets |
| FIREBASE_APP_ID | Firebase Console → Project Settings → Your Apps | GitHub → Secrets |
| FIREBASE_TOKEN | Run `firebase login:ci` locally | GitHub → Secrets |
| SLACK_WEBHOOK_URL | Slack App → Incoming Webhooks | GitHub → Secrets |
| PLAY_SERVICE_ACCOUNT_JSON | Google Play Console → API access → Service accounts | GitHub → Secrets |

KNOWN LIMITATIONS
-----------------
- Assumes `gradlew` is in the repository root directory.
- Assumes the release build variant is named `release` (standard Gradle convention).
- AAB upload uses `internal` track — change to `alpha`, `beta`, or `production` as needed.
- Assumes package name is `com.example.yourapp` — update in the production workflow.
- Play Store upload requires manual promotion from Internal → Production in Play Console.
````

---

## Notes

- For Fastlane, the agent generates a `Fastfile` with lanes for `test`, `beta`, and `release`.
- For iOS, the agent uses `xcodebuild` with App Store Connect API key authentication (no Apple ID/password).
- For Flutter, the agent generates separate Android and iOS job matrices in a single workflow.
- Tested with: Claude Sonnet 4.6, GPT-4o.
