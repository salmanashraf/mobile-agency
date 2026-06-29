# Example Output — Android ANR Investigation Agent

````text
ANDROID ANR INVESTIGATION
=========================
Result: CONFIRMED
Confidence: HIGH
ANR Type: Lock contention causing input dispatch timeout
Trigger: Cold launch while session refresh holds the SessionStore monitor

EVIDENCE SUMMARY
----------------
| Evidence | Observation |
|---|---|
| ANR reason | Input dispatching timed out |
| Main thread | BLOCKED in `SessionStore.read(SessionStore.kt:42)` |
| Lock | Main waits for monitor `0x1234` |
| Owner thread | `DefaultDispatcher-worker-3` owns `0x1234` |
| Owner work | Blocking OkHttp refresh inside `SessionStore.refresh()` |

THREAD ANALYSIS
---------------
| Thread | State | Waiting On / Work | Significance |
|---|---|---|---|
| main | BLOCKED | Waiting for `SessionStore` monitor `0x1234` | Cannot finish launch or process input |
| DefaultDispatcher-worker-3 | RUNNABLE | Blocking network call while holding `SessionStore` monitor | Prevents main from reading cached session |

ROOT CAUSE
----------
`SessionStore.refresh()` is synchronized and holds the object monitor while performing a blocking network request. During cold launch, `MainActivity.onCreate()` calls `AuthRepository.currentSession()`, which calls the synchronized `SessionStore.read()`. Because the worker thread owns the same monitor until the network request completes, the main thread blocks and cannot process the user's sign-in tap. That produces the input dispatch timeout.

FIX
---
1. Do not hold the `SessionStore` monitor during network I/O.
2. Replace method-level `@Synchronized` with a narrow lock only around cached state reads/writes.
3. Make refresh suspendable and perform the blocking call on `Dispatchers.IO` only for the network operation.
4. Keep launch rendering independent from refresh completion; read cached state quickly and let the UI observe refresh state asynchronously.

UPDATED CODE
------------
```kotlin
class SessionStore(
    private val api: SessionApi,
) {
    private val lock = Any()
    private var cachedSession: Session? = null

    fun read(): Session? = synchronized(lock) {
        cachedSession
    }

    suspend fun refresh(): Session {
        val session = withContext(Dispatchers.IO) {
            api.refreshTokenBlocking().toSession()
        }

        synchronized(lock) {
            cachedSession = session
        }

        return session
    }
}

class AuthRepository(
    private val sessionStore: SessionStore,
) {
    fun currentSession(): Session? = sessionStore.read()

    suspend fun refreshSession(): Session = sessionStore.refresh()
}

class MainActivity : ComponentActivity() {
    @Inject lateinit var authRepository: AuthRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val cachedSession = authRepository.currentSession()

        setContent {
            App(session = cachedSession)
        }
    }
}
```

VERIFICATION
------------
- Add a test fake that delays `refreshTokenBlocking()` by 10 seconds while launching `MainActivity`.
- Confirm `MainActivity.onCreate()` returns without waiting for refresh.
- Enable StrictMode and verify no main-thread disk/network violations during startup.
- Capture a Perfetto trace during cold launch and confirm the main thread is not BLOCKED on `SessionStore`.
- Run startup on a low-end Android device or emulator with CPU throttling.
- Monitor the Play Console ANR cluster after staged rollout.

MISSING EVIDENCE
----------------
- None

NEXT ACTION
-----------
Replace method-level synchronization in `SessionStore` with narrow cached-state locking, then rerun the delayed-refresh cold-launch reproduction.
````
