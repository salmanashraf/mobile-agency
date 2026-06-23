# Skill — /anr-investigation

**Platform:** Android  
**Slash Command:** `/anr-investigation`  
**Composable With:** Android Crash Analyzer, AXIOM, PERF, MOBILE-HARNESS

---

## Purpose

Investigate Android ANRs from Play Console, Firebase Crashlytics, `traces.txt`, `/data/anr/anr_*`, `ApplicationExitInfo`, bug reports, or source code. Identify the unresponsive thread, blocking dependency, root cause, safe fix, and verification plan.

This skill is evidence-first. Do not blame the top app frame without checking thread state, locks, binder calls, and owner threads.

---

## Input Format

```text
COMMAND: /anr-investigation
APP_VERSION: <version/build>
ANDROID_VERSION: <version or unknown>
DEVICE: <model or unknown>
ANR_SOURCE: <Play Console | Crashlytics | traces.txt | bugreport | ApplicationExitInfo>
ANR_REASON:
<reason, cluster title, or timeout message>
USER_ACTION:
<what the user was doing>
TRACE:
<full ANR trace or all available thread stacks>
RELATED_CODE:
<relevant Activity, ViewModel, repository, service, receiver, worker, or database code>
```

---

## Skill Prompt

````text
Investigate the Android ANR using the supplied evidence.

STEP 1 — VERIFY EVIDENCE
- Confirm whether the full trace and ANR reason are present.
- Require the main thread plus any thread that may own a lock or binder response.
- If only one frame or a partial trace is available, mark confidence LOW and list the missing evidence.
- Do not invent line numbers, locks, timing, or thread ownership.

STEP 2 — CLASSIFY THE ANR
Classify as one of:
- Input dispatch timeout
- Service execution timeout
- Foreground service start timeout
- BroadcastReceiver timeout
- JobService timeout
- Main-thread I/O or computation
- Binder stall
- Lock contention
- Deadlock
- Slow startup
- Unknown

STEP 3 — READ THREAD STATES
- Locate the "main" thread and record RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, or NATIVE.
- RUNNABLE: inspect expensive computation, disk/network/database I/O, class loading, Compose/layout work, or synchronous SDK initialization.
- BLOCKED: identify the monitor/lock and find the owning thread.
- WAITING: identify Future.get, CountDownLatch.await, join, runBlocking, wait, semaphore, mutex, or synchronous callback.
- NATIVE: inspect binder, file, database, graphics, or native SDK frames.
- For deadlocks, show the complete wait-for cycle.

STEP 4 — CORRELATE WITH CODE
Check for:
- Disk, Room/SQLite, SharedPreferences commit, file, JSON, bitmap, crypto, or network work on main.
- runBlocking, Future.get, Thread.join, CountDownLatch.await, synchronized, locks, semaphores, or blocking callbacks.
- Slow Application/ContentProvider/Activity startup and eager dependency initialization.
- BroadcastReceiver.onReceive doing long work or goAsync without PendingResult.finish.
- Service lifecycle methods doing blocking work.
- startForegroundService without startForeground within the required window.
- JobService callbacks blocking instead of returning quickly.
- Synchronous binder calls or third-party SDK initialization.
- Compose recomposition/layout loops only when trace evidence supports them.

STEP 5 — PROPOSE THE SMALLEST SAFE FIX
- Fix the proven blocking path, not merely the top stack frame.
- Use structured coroutines and appropriate dispatchers, but do not wrap unknown code in Dispatchers.IO blindly.
- Avoid replacing one ANR with lost work, races, lifecycle leaks, or unbounded background work.
- Use WorkManager for deferrable persistent work; keep receiver/service/job callbacks short.
- Reduce lock scope or redesign ownership for contention/deadlock.
- Provide before/after Kotlin when source is available.

STEP 6 — VERIFY
Include:
- Deterministic reproduction steps.
- StrictMode or tracing setup where relevant.
- Low-end device and cold-start testing.
- Macrobenchmark/startup measurement where relevant.
- Regression test or test seam.
- Play Console ANR cluster and user-perceived ANR monitoring.

Output normal Markdown. Do not wrap the full report in a code block.

ANDROID ANR INVESTIGATION
=========================
Result: CONFIRMED | LIKELY | INCONCLUSIVE
Confidence: HIGH | MEDIUM | LOW
ANR Type:
Trigger:

Evidence Summary:
| Evidence | Observation |
|---|---|

Thread Analysis:
| Thread | State | Waiting On / Work | Significance |
|---|---|---|---|

Root Cause:
<proven causal chain, or what remains unknown>

Fix:
<smallest safe fix>

Updated Code:
```kotlin
<corrected code, or "Not available without related source">
```

Verification:
- <step>

Missing Evidence:
- <item or "None">

Next Action:
<one concrete action>
````

---

## Example

### Input

```text
COMMAND: /anr-investigation
APP_VERSION: 4.8.0 (480)
ANDROID_VERSION: 14
DEVICE: Pixel 6a
ANR_SOURCE: Play Console
ANR_REASON:
Input dispatching timed out
USER_ACTION:
Cold launch, then tapped Sign in.
TRACE:
"main" prio=5 tid=1 Blocked
  at com.example.session.SessionStore.read(SessionStore.kt:42)
  - waiting to lock <0x1234> held by thread 18
  at com.example.MainActivity.onCreate(MainActivity.kt:31)

"DefaultDispatcher-worker-3" prio=5 tid=18 Runnable
  at com.example.session.SessionStore.refresh(SessionStore.kt:68)
  - locked <0x1234>
  at com.example.session.SessionRepository.refresh(SessionRepository.kt:51)
RELATED_CODE:
class SessionStore {
    @Synchronized
    fun read(): Session? = cachedSession

    @Synchronized
    fun refresh(): Session {
        val response = blockingApi.refreshToken()
        return response.toSession().also { cachedSession = it }
    }
}
```

### Output

````markdown
ANDROID ANR INVESTIGATION
=========================
Result: CONFIRMED
Confidence: HIGH
ANR Type: Lock contention causing input dispatch timeout
Trigger: Cold launch while token refresh holds SessionStore monitor

Evidence Summary:
| Evidence | Observation |
|---|---|
| Main thread | BLOCKED in SessionStore.read |
| Monitor | `0x1234`, owned by thread 18 |
| Owner thread | Performs blocking token refresh |
| Timeout reason | Input dispatching timed out |

Thread Analysis:
| Thread | State | Waiting On / Work | Significance |
|---|---|---|---|
| main | BLOCKED | SessionStore monitor | Cannot process input |
| worker-3 | RUNNABLE | Blocking network refresh | Holds required monitor |

Root Cause:
`SessionStore.refresh()` holds the object monitor during a blocking network request. `MainActivity.onCreate()` calls `read()`, which requires the same monitor. The main thread remains blocked until the network request returns, causing the input timeout.

Fix:
Do not hold the session lock during network I/O. Perform refresh outside the critical section and lock only the in-memory assignment. Expose session reads without waiting on network work.

Updated Code:
```kotlin
class SessionStore(
    private val api: SessionApi,
) {
    @Volatile
    private var cachedSession: Session? = null

    fun read(): Session? = cachedSession

    suspend fun refresh(): Session {
        val refreshed = withContext(Dispatchers.IO) {
            api.refreshToken().toSession()
        }
        cachedSession = refreshed
        return refreshed
    }
}
```

Verification:
- Reproduce cold launch while delaying refresh by 10 seconds.
- Enable StrictMode and confirm no main-thread network/disk violations.
- Capture a system trace and verify main remains runnable.
- Repeat launch and sign-in on a low-end Android device.
- Monitor the Play Console ANR cluster after staged rollout.

Missing Evidence:
- None

Next Action:
Remove network I/O from the SessionStore monitor, then rerun the delayed-refresh cold-launch test.
````

---

## Usage Notes

- A full thread dump is required for high-confidence lock and deadlock analysis.
- The main thread's top frame can be a victim rather than the cause; always inspect the thread holding its dependency.
- Pair with PERF for startup/system-trace work and Android Crash Analyzer for broader incident triage.
- This skill supports issue #2; a dedicated ANR agent can embed it and add expanded examples.

## Official Reference

- [Android Developers: ANRs](https://developer.android.com/topic/performance/vitals/anr)
