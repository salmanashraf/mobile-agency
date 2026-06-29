# Example Input — Android ANR Investigation Agent

```text
APP_VERSION: 4.8.0 (480)
ANDROID_VERSION: Android 14 / API 34
DEVICE: Pixel 6a
ANR_SOURCE: Play Console
ANR_REASON:
Input dispatching timed out. The application was too busy to process user input.
USER_ACTION:
Cold launch, then tapped Sign in while session refresh was running.

TRACE:
"main" prio=5 tid=1 BLOCKED
  at com.sampleshop.session.SessionStore.read(SessionStore.kt:42)
  - waiting to lock <0x1234> (a com.sampleshop.session.SessionStore) held by thread 18
  at com.sampleshop.auth.AuthRepository.currentSession(AuthRepository.kt:27)
  at com.sampleshop.ui.MainActivity.onCreate(MainActivity.kt:31)
  at android.app.Activity.performCreate(Activity.java:8595)

"DefaultDispatcher-worker-3" prio=5 tid=18 RUNNABLE
  at java.net.SocketInputStream.socketRead0(Native Method)
  at okhttp3.internal.connection.RealCall.execute(RealCall.kt:153)
  at com.sampleshop.session.SessionApi.refreshTokenBlocking(SessionApi.kt:21)
  at com.sampleshop.session.SessionStore.refresh(SessionStore.kt:68)
  - locked <0x1234> (a com.sampleshop.session.SessionStore)
  at com.sampleshop.session.SessionRepository.refresh(SessionRepository.kt:51)

RELATED_CODE:
class SessionStore(
    private val api: SessionApi
) {
    private var cachedSession: Session? = null

    @Synchronized
    fun read(): Session? = cachedSession

    @Synchronized
    fun refresh(): Session {
        val response = api.refreshTokenBlocking()
        val session = response.toSession()
        cachedSession = session
        return session
    }
}

class AuthRepository(
    private val sessionStore: SessionStore
) {
    fun currentSession(): Session? = sessionStore.read()
}

class MainActivity : ComponentActivity() {
    @Inject lateinit var authRepository: AuthRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val session = authRepository.currentSession()
        setContent { App(session = session) }
    }
}
```
