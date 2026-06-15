# Skill — /security-audit

**Platform:** Android / iOS / Flutter / React Native  
**Slash Command:** `/security-audit`  
**Composable With:** SENTINEL, agents/cross-platform/security-scanner/agent.md, MOBILE-HARNESS, APPFORGE

---

## Purpose

Run a complete mobile app security audit across code, configuration, storage, networking, authentication, permissions, build settings, logging, WebViews, deep links, dependencies, and release readiness.

Use this when the user wants more than a quick code scan. This skill is intended for app-wide pre-release review and should be paired with SENTINEL or `security-scanner` for detailed exploit analysis.

---

## Input Format

```text
COMMAND: /security-audit
PLATFORM: <Android | iOS | Flutter | React Native>
APP_TYPE: <consumer | fintech | health | enterprise | game | other>
SCOPE:
<repo tree, changed files, manifests, config files, auth/storage/network files>
DATA_HANDLED:
<tokens, PII, payments, health, location, files, messages, analytics>
CODE_OR_FINDINGS:
<paste code, config, dependency list, or previous scan output>
```

---

## Skill Prompt

```text
Run a complete app security audit for the provided mobile app scope.

Use OWASP Mobile Top 10 as the baseline, but also check platform release risks.

Audit these areas:

1. DATA CLASSIFICATION AND THREAT MODEL
- Identify sensitive data: credentials, tokens, PII, payment data, health data, precise location, contacts, messages, photos, files, analytics identifiers.
- Identify trust boundaries: app, backend, third-party SDKs, WebViews, deep links, push notifications, local storage, clipboard, logs.
- If data classification is missing, infer it from the code and mark assumptions.

2. SECRETS AND CREDENTIALS
- No API keys, tokens, passwords, client secrets, private keys, signing configs, keystore passwords, or service account JSON in source.
- Check Android Gradle files, BuildConfig, string resources, google-services files, local.properties misuse, CI files.
- Check iOS Info.plist, .xcconfig, entitlements, project files, Swift constants.
- Check Flutter .env assets, Dart constants, Android/iOS folders.
- Check React Native JS bundles, env files, native config, Metro output risk.

3. STORAGE SECURITY
- Tokens and credentials must use Keychain, EncryptedSharedPreferences, Android Keystore, Secure Enclave where appropriate, expo-secure-store, or react-native-keychain.
- AsyncStorage, SharedPreferences, UserDefaults, plain SQLite, files, cache, logs, and clipboard must not hold secrets.
- Sensitive databases need encryption or documented risk acceptance.
- Backup behavior must be safe: Android allowBackup/dataExtractionRules and iOS backup exclusions for sensitive files.

4. NETWORK AND TRANSPORT
- HTTPS required for production APIs.
- No cleartext traffic unless explicitly justified for local/dev and blocked in release.
- TLS validation must not be disabled.
- Certificate pinning required for high-risk auth, payment, health, or enterprise apps.
- No permissive TrustManager, HostnameVerifier, URLSession delegate, ATS exception, or debug proxy config in release.
- API errors must not leak secrets.

5. AUTHENTICATION AND SESSION MANAGEMENT
- Tokens expire and refresh safely.
- Logout clears local sensitive data.
- Biometric/PIN gates protect highly sensitive local data when required.
- No credentials in URLs.
- No weak password reset, magic link, or OTP handling in app code.
- Session state is not stored in globally mutable objects without lifecycle handling.

6. AUTHORIZATION AND BUSINESS LOGIC
- Client does not enforce critical authorization alone.
- Feature flags, premium/subscription checks, admin flags, and role checks must be validated server-side.
- Local tampering must not unlock paid or privileged behavior.

7. INPUT VALIDATION, DEEP LINKS, AND IPC
- Deep links validate scheme, host, path, parameters, and auth state before navigation.
- Android exported activities/services/receivers are minimal and protected.
- iOS URL schemes/universal links validate allowed hosts and paths.
- Push notification payloads are validated before navigation or data mutation.
- File imports, intents, document pickers, and share extensions validate size, type, and path.

8. WEBVIEW AND JAVASCRIPT BRIDGES
- WebViews load only trusted origins.
- JavaScript bridges are disabled unless strictly required and origin-gated.
- File access, universal file URL access, mixed content, and arbitrary navigation are blocked.
- User-controlled input is never passed directly into evaluateJavaScript/loadUrl.

9. LOGGING, ANALYTICS, AND PRIVACY
- No tokens, passwords, OTPs, PII, payment data, or health data in logs, crashes, analytics, breadcrumbs, or screenshots.
- Debug logging disabled in release.
- Privacy policy and app store data safety declarations match actual SDK/data behavior.
- Third-party SDKs are reviewed for data collection.

10. DEPENDENCIES AND SUPPLY CHAIN
- Identify outdated, vulnerable, abandoned, or risky dependencies.
- Check dependency pinning, lockfiles, Gradle plugins, CocoaPods/SPM, npm packages, Flutter packages.
- Flag dynamic code loading, remote config executing logic, reflection/plugin loading risk.

11. PLATFORM HARDENING
- Android: release debuggable false, minify/shrink where appropriate, signing config protected, exported components explicit, backup rules safe, network security config release-safe.
- iOS: ATS enabled, Keychain access groups correct, entitlements minimal, jailbreak-sensitive apps document protections, release builds do not enable debug menus.
- Flutter: native Android/iOS configs audited too, not only Dart.
- React Native: JS bundle secrets checked, dev menu disabled in release, native configs audited too.

12. RELEASE GATE
- Map findings to OWASP Mobile Top 10 where possible.
- Assign severity: CRITICAL, HIGH, MEDIUM, LOW, INFO.
- Include exploit scenario and concrete fix.
- State what could not be verified from provided files.

Output exactly:

Table formatting rules:
- Output normal Markdown. Do not wrap the final report in a fenced code block.
- Keep every table cell short, ideally under 8 words.
- Do not put full paragraphs, logs, stack traces, secrets, or multi-sentence fixes inside table cells.
- Put long evidence, exploit scenarios, and fixes in `Finding Details`.
- Use stable IDs (`SEC-001`, `SEC-002`) to connect summary rows to detail sections.

MOBILE SECURITY AUDIT REPORT
============================
Platform:
App Type:
Data Handled:
Result: PASS | FAIL | BLOCKED

Executive Summary:
- <short risk summary>

Findings Summary:
| ID | Severity | OWASP | Area | Evidence | Fix Summary |
|---|---|---|---|---|---|

Finding Details:
### SEC-001 — <short title>
- Severity:
- OWASP:
- Area:
- Evidence:
- Exploit Scenario:
- Fix:
- Verification:

Security Checklist:
| Area | Status | Notes |
|---|---|---|
| Secrets | PASS/FAIL/UNKNOWN | |
| Storage | PASS/FAIL/UNKNOWN | |
| Network/TLS | PASS/FAIL/UNKNOWN | |
| Auth/Session | PASS/FAIL/UNKNOWN | |
| Authorization | PASS/FAIL/UNKNOWN | |
| Deep Links/IPC | PASS/FAIL/UNKNOWN | |
| WebView | PASS/FAIL/UNKNOWN | |
| Logging/Analytics | PASS/FAIL/UNKNOWN | |
| Dependencies | PASS/FAIL/UNKNOWN | |
| Platform Hardening | PASS/FAIL/UNKNOWN | |
| Privacy/Store Data Safety | PASS/FAIL/UNKNOWN | |

Files Needed For Complete Audit:
- <file or "None">

Release Gate:
PASS only if no CRITICAL or HIGH findings remain, and UNKNOWN items are either verified or explicitly risk-accepted.

Next Actions:
1. <highest priority fix>
2. <next fix>
3. <next fix>
```

---

## Example

### Input

```text
COMMAND: /security-audit
PLATFORM: Android
APP_TYPE: consumer finance
DATA_HANDLED: auth tokens, payment history, email, phone
CODE_OR_FINDINGS:
- AndroidManifest has android:debuggable="true"
- network_security_config permits cleartextTrafficPermitted="true"
- TokenRepository stores auth_token in SharedPreferences
```

### Output

```text
MOBILE SECURITY AUDIT REPORT
============================
Platform: Android
App Type: consumer finance
Data Handled: auth tokens, payment history, email, phone
Result: FAIL

Executive Summary:
- Release is blocked by plaintext token storage, release debugging, and cleartext network policy.

Findings Summary:
| ID | Severity | OWASP | Area | Evidence | Fix Summary |
|---|---|---|---|---|---|
| SEC-001 | CRITICAL | M2 | Storage | Token in SharedPreferences | Use encrypted token storage |
| SEC-002 | CRITICAL | M8 | Platform Hardening | Release debuggable true | Disable release debugging |
| SEC-003 | HIGH | M3 | Network/TLS | Cleartext allowed | Disable cleartext in release |

Finding Details:
### SEC-001 — Auth token stored in plaintext preferences
- Severity: CRITICAL
- OWASP: M2 Insecure Data Storage
- Area: Storage
- Evidence: `auth_token` is stored in `SharedPreferences`.
- Exploit Scenario: Device compromise, root access, or debug backup can expose session tokens.
- Fix: Store tokens in `EncryptedSharedPreferences` backed by Android Keystore.
- Verification: Confirm token writes use encrypted storage and logout clears the encrypted value.

### SEC-002 — Release build is debuggable
- Severity: CRITICAL
- OWASP: M8 Security Misconfiguration
- Area: Platform Hardening
- Evidence: `android:debuggable="true"`.
- Exploit Scenario: Attackers can attach a debugger to the release app and inspect runtime state.
- Fix: Ensure release builds set `debuggable false` and remove debug-only menus.
- Verification: Inspect merged release manifest and release APK flags.

### SEC-003 — Cleartext traffic allowed
- Severity: HIGH
- OWASP: M3 Insecure Communication
- Area: Network/TLS
- Evidence: `cleartextTrafficPermitted="true"`.
- Exploit Scenario: Traffic can be intercepted or modified on hostile networks.
- Fix: Disable cleartext in release network security config.
- Verification: Confirm release config blocks HTTP endpoints and test API calls over HTTPS only.

Security Checklist:
| Area | Status | Notes |
|---|---|---|
| Secrets | UNKNOWN | Gradle and CI files not provided |
| Storage | FAIL | Token stored in plaintext |
| Network/TLS | FAIL | Cleartext enabled |
| Auth/Session | UNKNOWN | Refresh/logout code not provided |
| Authorization | UNKNOWN | Server-side checks not provided |
| Deep Links/IPC | UNKNOWN | Manifest intent filters not fully provided |
| WebView | UNKNOWN | No WebView files provided |
| Logging/Analytics | UNKNOWN | Logging files not provided |
| Dependencies | UNKNOWN | Dependency lockfiles not provided |
| Platform Hardening | FAIL | Debuggable release |
| Privacy/Store Data Safety | UNKNOWN | Store declarations not provided |

Files Needed For Complete Audit:
- app/build.gradle
- AndroidManifest.xml
- network_security_config.xml
- TokenRepository
- dependency lockfile
- logging and analytics wrappers

Release Gate:
PASS only if no CRITICAL or HIGH findings remain, and UNKNOWN items are either verified or explicitly risk-accepted.

Next Actions:
1. Move auth token storage to EncryptedSharedPreferences.
2. Disable release debugging and cleartext traffic.
3. Provide Gradle, manifest, dependency, auth, and logging files for full verification.
```

---

## Usage Notes

- Use `/security-scan` for quick inline code review.
- Use `/security-audit` for app-wide release gates.
- Pair with SENTINEL or `agents/cross-platform/security-scanner/agent.md` when exploitability analysis and OWASP evidence need to be deeper.
- Inside MOBILE-HARNESS, run this before launch prep and whenever auth, payments, storage, deep links, or WebViews change.
