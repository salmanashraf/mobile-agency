# Example Output — CI/CD Pipeline Generator

Full agent response to the input in [`example-input.md`](example-input.md).

Three complete GitHub Actions workflow files are generated. Key sections shown below — see `agent.md` for the full output of all three files, which matches what the agent produces.

---

## File: .github/workflows/pr-check.yml

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

      - name: Cache Gradle
        uses: actions/cache@v4
        with:
          path: |
            ~/.gradle/caches
            ~/.gradle/wrapper
          key: gradle-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
          restore-keys: gradle-

      - name: Grant gradlew permission
        run: chmod +x gradlew

      - name: Run Lint
        run: ./gradlew lintDebug

      - name: Run Unit Tests
        run: ./gradlew testDebugUnitTest

      - name: Upload Lint Report (on failure)
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

---

## File: .github/workflows/staging-build.yml

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

      - name: Cache Gradle
        uses: actions/cache@v4
        with:
          path: |
            ~/.gradle/caches
            ~/.gradle/wrapper
          key: gradle-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
          restore-keys: gradle-

      - name: Grant gradlew permission
        run: chmod +x gradlew

      - name: Run Unit Tests
        run: ./gradlew testDebugUnitTest

      - name: Decode Keystore
        run: echo "${{ secrets.KEYSTORE_BASE64 }}" | base64 -d > keystore.jks

      - name: Build Signed APK
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
          firebase appdistribution:distribute \
            app/build/outputs/apk/release/app-release.apk \
            --app "${{ secrets.FIREBASE_APP_ID }}" \
            --token "${{ secrets.FIREBASE_TOKEN }}" \
            --groups "internal-testers" \
            --release-notes "Staging build from ${{ github.sha }}"

      - name: Notify Slack — Success
        if: success()
        uses: slackapi/slack-github-action@v1.27.0
        with:
          webhook: ${{ secrets.SLACK_WEBHOOK_URL }}
          webhook-type: incoming-webhook
          payload: |
            {"text": "✅ *Staging deployed* — ${{ github.repository }} @ `${{ github.sha }}`"}

      - name: Notify Slack — Failure
        if: failure()
        uses: slackapi/slack-github-action@v1.27.0
        with:
          webhook: ${{ secrets.SLACK_WEBHOOK_URL }}
          webhook-type: incoming-webhook
          payload: |
            {"text": "❌ *Staging FAILED* — ${{ github.repository }} @ `${{ github.sha }}`\n<${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|View run>"}
```

---

## File: .github/workflows/production-release.yml

```yaml
name: Production Release

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  release:
    name: Build, Sign & Publish
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'

      - name: Cache Gradle
        uses: actions/cache@v4
        with:
          path: |
            ~/.gradle/caches
            ~/.gradle/wrapper
          key: gradle-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
          restore-keys: gradle-

      - name: Grant gradlew permission
        run: chmod +x gradlew

      - name: Run Lint
        run: ./gradlew lintRelease

      - name: Run Unit Tests
        run: ./gradlew testReleaseUnitTest

      - name: Decode Keystore
        run: echo "${{ secrets.KEYSTORE_BASE64 }}" | base64 -d > keystore.jks

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
          packageName: com.example.yourapp   # ← update this
          releaseFiles: app/build/outputs/bundle/release/app-release.aab
          track: internal
          status: completed

      - name: Notify Slack — Released
        if: success()
        uses: slackapi/slack-github-action@v1.27.0
        with:
          webhook: ${{ secrets.SLACK_WEBHOOK_URL }}
          webhook-type: incoming-webhook
          payload: |
            {"text": "🚀 *${{ github.ref_name }} submitted to Play Store* — ${{ github.repository }}"}
```

---

## Secrets Reference

| Secret | Where to Get It | Where to Set It |
|---|---|---|
| `KEYSTORE_BASE64` | `base64 -i release.jks \| pbcopy` | GitHub → Settings → Secrets |
| `KEYSTORE_PASSWORD` | Your keystore password | GitHub → Settings → Secrets |
| `KEY_ALIAS` | From `keytool` when creating the keystore | GitHub → Settings → Secrets |
| `KEY_PASSWORD` | Your key password | GitHub → Settings → Secrets |
| `FIREBASE_APP_ID` | Firebase Console → Project Settings → Your Apps | GitHub → Settings → Secrets |
| `FIREBASE_TOKEN` | `firebase login:ci` in your terminal | GitHub → Settings → Secrets |
| `SLACK_WEBHOOK_URL` | Slack App → Incoming Webhooks | GitHub → Settings → Secrets |
| `PLAY_SERVICE_ACCOUNT_JSON` | Google Play Console → API access → Service accounts → JSON key | GitHub → Settings → Secrets |

---

## Setup Guide

1. Generate a release keystore: `keytool -genkey -v -keystore release.jks -alias my-key -keyalg RSA -keysize 2048 -validity 10000`
2. Base64-encode it: `base64 -i release.jks | pbcopy` — paste as `KEYSTORE_BASE64` secret
3. Add all secrets from the table above in GitHub → repository → Settings → Secrets and variables → Actions
4. Create a Firebase project and register your Android app to get `FIREBASE_APP_ID`
5. Run `firebase login:ci` locally to get `FIREBASE_TOKEN`
6. Create a Google Play service account with Release Manager role and download the JSON key
7. For production releases, push a version tag: `git tag v1.2.0 && git push origin v1.2.0`
8. Update `packageName: com.example.yourapp` in the production workflow to match your app's package
