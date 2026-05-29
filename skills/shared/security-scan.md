# Skill — Mobile Security Scan

**Platform:** Cross-Platform (Android / iOS / Flutter / React Native)  
**Category:** Code Quality / Security  
**Composable With:** agents/cross-platform/security-scanner/agent.md

---

## Purpose

Reviews mobile source code for the most exploitable OWASP Mobile Top 10 vulnerabilities. Use as a pre-release security gate or as part of a code review for security-sensitive features (auth, payments, deep links).

## When to Use

- Before any release that touches auth, payments, or data storage
- When reviewing code that handles user credentials or tokens
- When adding a new deep link or URL scheme handler

---

## Skill Prompt

```
When scanning mobile code for security vulnerabilities, check for:

HARDCODED SECRETS (M9 — Insecure Authentication)
- API keys, tokens, passwords, or cryptographic keys hardcoded as string literals.
  Common patterns: const val API_KEY = "sk-...", let apiKey = "Bearer ...", "password123"
- Android: check BuildConfig fields, string resources, and gradle.properties committed to git.
- iOS: check Info.plist, .xcconfig files, and Swift/ObjC string constants.
- Fix: use environment variables, secrets managers (AWS Secrets Manager, HashiCorp Vault),
  or runtime fetching from a secure endpoint. Never commit secrets to git.
- Severity: CRITICAL

INSECURE DATA STORAGE (M2)
- Android SharedPreferences storing tokens, passwords, PII, or session IDs in clear text.
  Fix: use EncryptedSharedPreferences (Jetpack Security Crypto).
- iOS NSUserDefaults storing tokens or credentials.
  Fix: use the Keychain (KeychainAccess library, or Security framework directly).
- SQLite databases storing sensitive data without SQLCipher encryption.
- Files written to external storage (Environment.EXTERNAL_STORAGE_DIR) with sensitive content.
- React Native AsyncStorage storing tokens in clear text — AsyncStorage is unencrypted.
  Fix: use react-native-keychain or expo-secure-store.
- Severity: CRITICAL for tokens/passwords, HIGH for PII

UNVALIDATED DEEP LINKS / URL SCHEMES (M10 — Insufficient Input/Output Validation)
- Deep link handlers that read query parameters and use them directly in navigation,
  SQL queries, or web view URLs without validation or sanitization.
- Android intent-filter handlers that accept arbitrary schemes without host/path validation.
- iOS Universal Links and Custom URL Scheme handlers that don't validate the source or
  whitelist allowed paths.
- Fix: whitelist allowed hosts and paths; sanitize all URL parameters before use;
  never pass raw URL parameters to a WebView loadUrl() or SQL query.
- Severity: HIGH

MISSING CERTIFICATE PINNING (M3 — Insecure Communication)
- Apps that handle financial data, health data, or authentication without certificate pinning
  are vulnerable to MitM attacks on hostile networks (coffee shops, corporate proxies).
- Android: check for TrustManager implementations that override checkServerTrusted() without
  real validation — this defeats TLS entirely.
- iOS: check for NSAllowsArbitraryLoads: true in Info.plist — this disables ATS globally.
- Fix (Android): use OkHttp CertificatePinner or Network Security Config XML.
- Fix (iOS): implement URLSessionDelegate.urlSession(_:didReceive:completionHandler:) with
  pinned certificate fingerprint validation.
- Severity: HIGH for auth/payment endpoints, MEDIUM otherwise

INSECURE WEBVIEW CONFIGURATION (M1 — Improper Platform Usage)
- Android WebView: setJavaScriptEnabled(true) with addJavascriptInterface() exposes a Java
  bridge to any JS running in the WebView. If the WebView loads untrusted content, this is RCE.
- Android WebView: setAllowFileAccessFromFileURLs(true) allows file:// URLs to read other files.
- iOS WKWebView: evaluateJavaScript with user-controlled input is XSS.
- Fix: never load untrusted URLs in a WebView with JS enabled + native bridge.
  Use a Content Security Policy. Whitelist allowed origins.
- Severity: CRITICAL if loading untrusted content, HIGH otherwise

EXCESSIVE PERMISSIONS (M1)
- Android manifest permissions that are not required by the app's features.
  Common over-grants: READ_CONTACTS, ACCESS_FINE_LOCATION, RECORD_AUDIO, CAMERA
  when the feature only needs ACCESS_COARSE_LOCATION or doesn't use the camera.
- iOS Info.plist usage description strings that are overly broad ("App needs location")
  rather than specific and accurate.
- Fix: request only the minimum permission needed; use ACCESS_COARSE_LOCATION for maps,
  ACCESS_FINE_LOCATION only for navigation.
- Severity: MEDIUM

WEAK OR MISSING CRYPTOGRAPHY (M5)
- MD5 or SHA-1 used for password hashing or token signing — these are broken for security.
  Fix: use bcrypt, Argon2, or SHA-256+ for passwords; HMAC-SHA256 for HMAC.
- ECB mode AES encryption — deterministic, leaks patterns.
  Fix: use AES-GCM or AES-CBC with a random IV.
- Hardcoded encryption keys (covered under HARDCODED SECRETS, but call out if it's a crypto key specifically).
- Severity: CRITICAL for auth/payment, HIGH otherwise

For each issue: identify the file/line, assign severity (CRITICAL / HIGH / MEDIUM / LOW),
explain why it's exploitable, and give the concrete fix.
```

---

## Example

**Input:**
```kotlin
// Android — ProfileRepository.kt
object ProfileRepository {
    private val prefs = App.context.getSharedPreferences("profile", Context.MODE_PRIVATE)

    fun saveToken(token: String) {
        prefs.edit().putString("auth_token", token).apply()
    }
}
```

**Output:**
```
CRITICAL — Auth token stored in plaintext SharedPreferences
  Problem: SharedPreferences files are stored at /data/data/<package>/shared_prefs/ and are
           accessible to any app with root access or via ADB on a debug/unlocked device.
           Storing auth tokens in plaintext means an attacker with device access can steal
           session tokens without knowing the user's password.
  Fix:
  // Use EncryptedSharedPreferences (requires androidx.security:security-crypto)
  val masterKey = MasterKey.Builder(context)
      .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
      .build()
  val encryptedPrefs = EncryptedSharedPreferences.create(
      context, "profile_secure", masterKey,
      EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
      EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
  )
  encryptedPrefs.edit().putString("auth_token", token).apply()
```

---

## Composition Example

```
Prepend this skill to any code review that touches auth, storage, deep links, or WebViews.
For a full structured security audit across an entire codebase with OWASP references
and a severity-ranked findings report, run agents/cross-platform/security-scanner/agent.md.
```

---

## Notes

- This skill covers code-level vulnerabilities only. Network-level (TLS configuration, certificate validity), server-side, and binary-level vulnerabilities require dedicated tooling (MobSF, Frida, Burp Suite).
- Static analysis tools (Android Lint security checks, SwiftLint, Semgrep mobile rules) can automate some of these checks — this skill is for the gaps they miss.
