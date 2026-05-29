# Example Output — Mobile Security Scanner

Full agent response to the input in [`example-input.md`](example-input.md).

---

```
SECURITY SCAN REPORT
====================
File: data/remote/ApiClient.kt
Platform: Android
Focus: all
Vulnerabilities Found: 3
Critical: 2  High: 0  Medium: 1  Low: 0

FINDINGS (ranked by severity)
------------------------------

[CRITICAL] M9 Reverse Engineering — Hardcoded live API key in source code
  Location    : Line 2 — API_KEY constant
  Exploitable : Any developer with repository access OR anyone who decompiles the APK
                using `apktool d app.apk && grep -r "sk-live-"` can extract this key in
                under 60 seconds. The "sk-live-" prefix indicates a production credential.
                An attacker can make authenticated API calls, access user data, exhaust
                rate limits, or incur charges — all at the app owner's expense.
  Fix         :
  ```kotlin
  // Option 1 (recommended): Fetch a short-lived token from YOUR backend at runtime.
  // Your backend holds the real API key; the app receives a scoped, expiring token.
  // The client binary never contains the real key.

  // Option 2: If the key MUST be in the binary (e.g., public read-only API),
  // store it in local.properties (git-ignored) and access via BuildConfig:

  // local.properties (add to .gitignore):
  // API_KEY=sk-live-a1b2c3d4...

  // build.gradle.kts:
  // val apiKey = properties.getProperty("API_KEY") ?: error("API_KEY not set")
  // buildConfigField("String", "API_KEY", "\"$apiKey\"")

  // ApiClient.kt:
  // private val API_KEY = BuildConfig.API_KEY
  // ⚠ Note: BuildConfig fields are extractable from APKs — treat as obfuscation,
  // NOT true security. Only use for non-sensitive or public keys.
  ```
  Action required: IMMEDIATELY rotate the sk-live-* key — it is compromised by being
  in version control history. Run: git log --all --grep="sk-live-" to find all commits.

[CRITICAL] M3 Insecure Communication — HTTP base URL (cleartext traffic)
  Location    : Line 3 — BASE_URL = "http://..."
  Exploitable : All API traffic is sent over HTTP in cleartext. An attacker on the same
                network (public WiFi, corporate proxy, cellular interception, hotel network)
                can read ALL requests and responses — including:
                - The API key from the X-API-Key header
                - User data returned by the API
                - Any credentials, tokens, or PII in request bodies
                This is a trivial attack with freely available tools (Wireshark, mitmproxy).
  Fix         :
  ```kotlin
  // Change to HTTPS — non-negotiable for any production API
  private const val BASE_URL = "https://api.example.com/"

  // Additionally, add certificate pinning to prevent MitM even on HTTPS:
  val client = OkHttpClient.Builder()
      .certificatePinner(
          CertificatePinner.Builder()
              .add("api.example.com", "sha256/YOUR_CERTIFICATE_SHA256_HERE")
              .build()
      )
      .addInterceptor { chain ->
          chain.proceed(
              chain.request().newBuilder()
                  .addHeader("X-API-Key", BuildConfig.API_KEY)
                  .build()
          )
      }
      .build()

  // Get your certificate pin:
  // openssl s_client -connect api.example.com:443 | openssl x509 -pubkey -noout |
  // openssl rsa -pubin -outform der | openssl dgst -sha256 -binary | base64
  ```

[MEDIUM] M9 Reverse Engineering — API key transmitted in every request header
  Location    : Line 9 — addHeader("X-API-Key", API_KEY)
  Exploitable : Even after moving the key out of source code, sending it in a header
                on every request means it appears in:
                - HTTP access logs (on both client and server)
                - Proxy captures (Burp Suite, Charles Proxy)
                - Crash reports that include request headers (Sentry, Firebase)
                - Android Profiler network inspector in debug builds
  Fix         :
  ```kotlin
  // Replace static key with HMAC request signing.
  // The key never leaves the device; only the HMAC digest is transmitted.
  // The server verifies the digest against the same key it holds.

  private fun signRequest(request: Request, secretKey: ByteArray): Request {
      val timestamp = System.currentTimeMillis().toString()
      val body = request.body?.let {
          val buffer = okio.Buffer()
          it.writeTo(buffer)
          buffer.readUtf8()
      } ?: ""
      val message = "${request.method}${request.url}$timestamp$body"
      val mac = Mac.getInstance("HmacSHA256").apply {
          init(SecretKeySpec(secretKey, "HmacSHA256"))
      }
      val signature = Base64.encodeToString(mac.doFinal(message.toByteArray()), Base64.NO_WRAP)
      return request.newBuilder()
          .addHeader("X-Timestamp", timestamp)
          .addHeader("X-Signature", signature)
          .build()
  }
  ```

OWASP COVERAGE SUMMARY
-----------------------
| OWASP Category | Status |
|---|---|
| M1 Improper Platform Usage | Not applicable (no WebView, deep links, or permissions in this file) |
| M2 Insecure Data Storage | Not applicable (no storage code in this file) |
| M3 Insecure Communication | ✓ Checked — CRITICAL found (HTTP URL) |
| M4 Insecure Authentication | ✓ Checked — impacted by hardcoded key |
| M5 Insufficient Cryptography | Not applicable (no crypto in this file) |
| M6 Insecure Authorization | Not applicable |
| M7 Client Code Quality | Not applicable |
| M8 Code Tampering | Not applicable |
| M9 Reverse Engineering | ✓ Checked — CRITICAL found (hardcoded key) |
| M10 Extraneous Functionality | Not applicable |

RECOMMENDED NEXT STEPS
-----------------------
1. IMMEDIATELY rotate the sk-live-* API key — assume it is already compromised
2. Switch BASE_URL to HTTPS and add OkHttp CertificatePinner for api.example.com
3. Add truffleHog or gitleaks to your CI pipeline to prevent future secret commits:
   git config --global core.hooksPath ~/.git-hooks
   # or use GitHub's Secret Scanning (automatically enabled on public repos)
4. Scan git history for other secrets: gitleaks detect --source . --report-format json
```
