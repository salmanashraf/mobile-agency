# Workflow — New Project Setup

**Type:** Project bootstrapping
**Agents Used:** AXIOM / SWIFT / DART / BRIDGE, PIPELINE, SENTINEL, FIGMA
**Skills Used:** /grill-mobile, /android-tdd or /ios-tdd or /flutter-tdd

---

## When to Use

Starting a new mobile project from scratch. Do this once, do it right.

---

## Steps

```
1. DEFINE — /grill-mobile (full 20 questions)
   ↓ All 20 questions. No shortcuts.
   ↓ This conversation determines every architecture decision that follows.
   ↓ Output: confirmed understanding of the app's purpose, audience, and constraints.

2. ARCHITECTURE — AXIOM / SWIFT / DART / BRIDGE
   ↓ Generate the project structure based on /grill-mobile answers:
     - Package/module structure
     - Layer breakdown (data / domain / presentation)
     - State management choice and why
     - Navigation approach
     - Dependency injection setup
   ↓ Output: folder structure + base classes for each layer.

3. CI FROM DAY ONE — PIPELINE
   ↓ Set up CI before writing any feature code.
   ↓ PR check: lint + unit tests (< 5 min)
   ↓ Merge to main: build + deploy to Firebase App Distribution
   ↓ Output: working CI pipeline on first commit.

4. SECURITY BASELINE — SENTINEL
   ↓ Review the project template for default insecure configurations.
   ↓ Network security config (no cleartext traffic).
   ↓ Keychain / Keystore setup for credentials.
   ↓ Certificate pinning setup for production API.

5. TEST INFRASTRUCTURE — /android-tdd or /ios-tdd or /flutter-tdd
   ↓ Set up the test structure before any feature tests are needed.
   ↓ Base test class for ViewModel tests.
   ↓ Test doubles / mock infrastructure.
   ↓ First test: a trivial "project compiles and one test passes" smoke test.

6. DESIGN HANDOFF — FIGMA (if Figma access available)
   ↓ Set up design token mapping to code tokens.
   ↓ Generate base theme from design system.
   ↓ Typography and color system in code.

7. READY TO BUILD
   ↓ Clean architecture structure ✓
   ↓ CI running on first PR ✓
   ↓ Security baseline in place ✓
   ↓ Test infrastructure ready ✓
   ↓ Design tokens wired up ✓
```

---

## Project Setup Checklist

```
[ ] Version control: .gitignore includes keystore, local.properties, .env files
[ ] README: setup instructions that work on a fresh checkout
[ ] Architecture: documented decision (why this pattern, not just what)
[ ] CI: first pipeline run successful
[ ] Signing: debug keystore committed, release keystore in CI secrets only
[ ] API environment: dev/staging/prod configs separated (not hardcoded)
[ ] Analytics: event tracking structure decided before first feature
[ ] Crash reporting: Firebase Crashlytics or Sentry configured
```

---

## Inputs

- App concept and target audience (from /grill-mobile)
- Platform and minimum OS version
- Team size and development timeline

---

## Outputs

- Complete project scaffold with architecture
- Working CI pipeline
- Security-baseline configuration
- Test infrastructure ready for first feature
