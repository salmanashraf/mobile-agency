# Skill — /memory-leak-investigation

**Platform:** Android  
**Slash Command:** `/memory-leak-investigation`  
**Composable With:** Android Code Reviewer, AXIOM, PERF, MOBILE-HARNESS

---

## Purpose

Investigate Android memory leaks from LeakCanary traces, heap summaries, retained-object reports, or related Kotlin code. Trace the strong-reference path from a GC root to the retained object, identify the reference that outlives its intended lifecycle, propose the smallest ownership fix, and define repeatable verification.

This skill is evidence-first. A retained object is not automatically the source of the leak, and replacing strong references with weak references is not a valid default fix.

---

## Input Format

```text
COMMAND: /memory-leak-investigation
APP_VERSION: <version/build>
ANDROID_VERSION: <version or unknown>
DEVICE: <model or unknown>
REPORT_SOURCE: <LeakCanary | heap dump | profiler | test | other>
EXPECTED_LIFECYCLE:
<when the retained object should become unreachable>
REPRODUCTION:
<steps that increase retained objects or memory>
LEAK_TRACE:
<complete GC-root-to-retained-object path or available heap summary>
RELATED_CODE:
<Activity, Fragment, ViewModel, adapter, callback, coroutine, observer, singleton, or SDK code>
```

---

## Skill Prompt

````text
Investigate the Android memory leak using the supplied evidence.

STEP 1 — VERIFY EVIDENCE
- Confirm that the retained object, expected lifecycle, and strongest available reference path are present.
- Distinguish a confirmed leak from temporary retention, cache behavior, or high allocation pressure.
- If the trace is truncated or lacks the GC root/reference chain, mark confidence LOW and list the missing evidence.
- Do not invent fields, object ownership, retained sizes, or lifecycle events.

STEP 2 — READ THE REFERENCE PATH
- Start at the GC root and follow every strong reference to the retained object.
- Separate framework and collection implementation details from references controlled by app code.
- Use LeakCanary's Leaking: YES/NO/UNKNOWN evidence to narrow suspect references.
- Identify the first app-controlled reference that should have been cleared, replaced, unregistered, or scoped differently.
- Explain why the retaining object outlives the retained object.

STEP 3 — CLASSIFY THE LEAK
Classify as one of:
- Activity or Fragment instance
- Fragment view or ViewBinding
- RecyclerView adapter/listener
- Context held by singleton/static object
- Observer, callback, listener, or broadcast registration
- Coroutine, Flow, Rx, executor, or delayed task
- ViewModel or SavedState ownership
- Dialog, Window, animation, drawable, or WebView
- Service, receiver, worker, or SDK lifecycle
- Native/JNI resource
- Cache or collection without eviction
- Unknown

STEP 4 — CORRELATE WITH CODE
Check for:
- Fragment bindings or adapters surviving onDestroyView.
- Anonymous callbacks, listeners, observers, or receivers that are never removed.
- Singleton/static fields retaining Activity, Fragment, View, adapter, or callback instances.
- applicationScope, GlobalScope, custom scopes, handlers, runnables, timers, or executors retaining UI owners.
- Flow/Rx collection not bound to the correct lifecycle.
- ViewModel retaining Views, Activities, Fragments, adapters, or short-lived Context objects.
- Long-lived caches or maps without bounded eviction.
- WebView, Dialog, Window, animation, drawable callback, or third-party SDK cleanup requirements.
- Native resources that require close, release, recycle, unregister, or destroy.

STEP 5 — PROPOSE THE SMALLEST OWNERSHIP FIX
- Remove the proven strong-reference path or scope it to the correct lifecycle.
- Prefer lifecycle-aware collection, explicit unregister/cleanup, bounded ownership, and application Context only when semantically correct.
- Do not recommend WeakReference as a generic repair.
- Do not clear unrelated state or add onDestroy cleanup without proving that lifecycle owns the reference.
- Provide before/after Kotlin when source is available.

STEP 6 — VERIFY
Include:
- Deterministic reproduction with repeated create/destroy cycles.
- LeakCanary or heap-dump confirmation that the object becomes collectible.
- Retained-object and memory trend checks after forced GC/idle periods.
- Lifecycle regression tests or instrumentation where practical.
- Rotation, back-stack, navigation, and process-recreation checks where relevant.

Output normal Markdown. Do not wrap the full report in a code block.

ANDROID MEMORY LEAK INVESTIGATION
=================================
Result: CONFIRMED | LIKELY | INCONCLUSIVE
Confidence: HIGH | MEDIUM | LOW
Leak Type:
Retained Object:
Expected Collection Point:

Evidence Summary:
| Evidence | Observation |
|---|---|

Reference Path:
| From | Reference | To | Assessment |
|---|---|---|---|

Root Cause:
<proven ownership/lifecycle chain, or what remains unknown>

Fix:
<smallest ownership fix>

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
COMMAND: /memory-leak-investigation
APP_VERSION: 3.2.0 (320)
ANDROID_VERSION: 15
DEVICE: Pixel 7
REPORT_SOURCE: LeakCanary
EXPECTED_LIFECYCLE:
ProfileFragment view should be collectible after onDestroyView.
REPRODUCTION:
Open Profile, navigate back, repeat five times.
LEAK_TRACE:
┬───
│ GC Root: System class
├─ com.example.App instance
│    ↓ App.profileAdapters
├─ java.util.ArrayList instance
│    ↓ ArrayList.elementData
├─ com.example.profile.ProfileAdapter instance
│    ↓ ProfileAdapter.onAvatarClick
├─ com.example.profile.ProfileFragment$onViewCreated$1 instance
│    ↓ ProfileFragment$onViewCreated$1.this$0
╰→ com.example.profile.ProfileFragment instance
     Leaking: YES
RELATED_CODE:
class App : Application() {
    val profileAdapters = mutableListOf<ProfileAdapter>()
}

class ProfileFragment : Fragment(R.layout.profile) {
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        val adapter = ProfileAdapter { openAvatar() }
        recyclerView.adapter = adapter
        (requireContext().applicationContext as App).profileAdapters += adapter
    }
}
```

### Output

````markdown
ANDROID MEMORY LEAK INVESTIGATION
=================================
Result: CONFIRMED
Confidence: HIGH
Leak Type: Fragment retained by application-owned collection
Retained Object: `ProfileFragment`
Expected Collection Point: After `onDestroyView()` and Fragment removal

Evidence Summary:
| Evidence | Observation |
|---|---|
| GC root | Application-reachable system class path |
| Long-lived owner | `App.profileAdapters` |
| Callback | Adapter lambda captures `ProfileFragment` |
| Retained object | LeakCanary marks `ProfileFragment` as leaking |

Reference Path:
| From | Reference | To | Assessment |
|---|---|---|---|
| `App` | `profileAdapters` | `ArrayList` | App-controlled, process-long ownership |
| `ArrayList` | element | `ProfileAdapter` | Adapter survives Fragment lifecycle |
| `ProfileAdapter` | `onAvatarClick` | Fragment lambda | Captures Fragment instance |
| Lambda | `this$0` | `ProfileFragment` | Direct retaining reference |

Root Cause:
`App.profileAdapters` gives each adapter process-long lifetime. The adapter's click lambda captures `ProfileFragment`, so navigating away cannot make the Fragment unreachable.

Fix:
Do not store screen adapters in the Application. Keep the adapter owned by the Fragment view lifecycle and detach it in `onDestroyView()`.

Updated Code:
```kotlin
class ProfileFragment : Fragment(R.layout.profile) {
    private var adapter: ProfileAdapter? = null

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        adapter = ProfileAdapter { openAvatar() }
        recyclerView.adapter = adapter
    }

    override fun onDestroyView() {
        recyclerView.adapter = null
        adapter = null
        super.onDestroyView()
    }
}
```

Verification:
- Open and close Profile ten times with LeakCanary enabled.
- Confirm destroyed `ProfileFragment` instances are no longer retained.
- Capture a heap dump after idle/GC and verify no path through `App.profileAdapters`.
- Rotate and navigate rapidly to exercise view recreation.
- Add a FragmentScenario test that destroys the Fragment view and checks adapter detachment.

Missing Evidence:
- None

Next Action:
Remove `App.profileAdapters`, detach the RecyclerView adapter in `onDestroyView()`, then repeat the LeakCanary reproduction.
````

---

## Usage Notes

- A leak trace is a strong-reference path, not a stack trace. Diagnose ownership from the GC root toward the retained object.
- The leaking object is often the victim; the actionable defect is usually an earlier app-controlled reference in the path.
- Pair with PERF when the symptom is memory growth without a confirmed retention path.
- This skill supports issue #1; a dedicated memory leak agent can embed it and add heap-dump and LeakCanary examples.

## Official References

- [LeakCanary: Fixing a memory leak](https://square.github.io/leakcanary/fundamentals-fixing-a-memory-leak/)
- [Android Developers: Memory management overview](https://developer.android.com/topic/performance/memory-overview)
