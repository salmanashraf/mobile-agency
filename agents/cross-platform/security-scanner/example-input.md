# Example Input — Mobile Security Scanner

---

```
PLATFORM: Android
FILE_PATH: data/remote/ApiClient.kt
SECURITY_FOCUS: all
CODE:
object ApiClient {
    private const val API_KEY = "sk-live-a1b2c3d4e5f6g7h8i9j0"
    private const val BASE_URL = "http://api.example.com/"

    fun create(): Retrofit {
        val client = OkHttpClient.Builder()
            .addInterceptor { chain ->
                val request = chain.request().newBuilder()
                    .addHeader("X-API-Key", API_KEY)
                    .build()
                chain.proceed(request)
            }
            .build()

        return Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(client)
            .build()
    }
}
```

---

## What to Expect

The agent identifies three security issues. See [`example-output.md`](example-output.md).

**Issue map:**
1. Hardcoded live API key in source — CRITICAL (M9 Reverse Engineering)
2. HTTP base URL — CRITICAL (M3 Insecure Communication)
3. API key transmitted in every request header — MEDIUM (M9)

---

## Variations

### SharedPreferences token storage
```
PLATFORM: Android
FILE_PATH: data/local/SessionManager.kt
SECURITY_FOCUS: storage
CODE:
object SessionManager {
    private val prefs = App.context.getSharedPreferences("session", Context.MODE_PRIVATE)
    fun saveToken(token: String) = prefs.edit().putString("auth_token", token).apply()
    fun getToken(): String? = prefs.getString("auth_token", null)
}
```

### WebView with JavaScript bridge
```
PLATFORM: Android
FILE_PATH: ui/web/WebViewActivity.kt
SECURITY_FOCUS: webview
CODE:
class WebViewActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val webView = WebView(this)
        webView.settings.javaScriptEnabled = true
        webView.addJavascriptInterface(NativeBridge(this), "AndroidBridge")
        val url = intent.getStringExtra("url") ?: "https://app.example.com"
        webView.loadUrl(url)
    }
}
```
Issues: `url` from Intent is unvalidated — an attacker can pass any URL; combined with `addJavascriptInterface`, this is Remote Code Execution if the WebView loads attacker-controlled content.
