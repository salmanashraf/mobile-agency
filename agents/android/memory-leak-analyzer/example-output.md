# Example Output — Android Memory Leak Analyzer

```text
MEMORY LEAK INVESTIGATION
=========================
Verdict: LEAK CONFIRMED
Severity: HIGH

EVIDENCE SUMMARY
----------------
LeakCanary watched ProfileFragment after Fragment#onDestroy(), but the fragment is still strongly reachable from AnalyticsTracker.listeners. The retained object keeps 1.8 MB across 432 objects, so this is not just a short-lived post-destroy delay. The expected lifecycle says the Profile screen should be released after back navigation.

REFERENCE PATH
--------------
GC Root: Global variable in native code
Retaining owner: AnalyticsTracker.listeners static mutable list
First wrong lifetime: AnalyticsTracker.listeners stores a screen-scoped anonymous ProfileEventListener
Leaked object: ProfileFragment captured by ProfileFragment$onViewCreated$1.this$0

ROOT CAUSE
----------
ProfileFragment registers an anonymous listener in onViewCreated(), and that listener captures the Fragment through this$0. AnalyticsTracker keeps the listener in a static list, which has process lifetime. The listener is never removed in onDestroyView() or onDestroy(), so the process-scoped list keeps the screen-scoped Fragment alive after navigation.

The binding access inside the callback makes the bug worse: if an event arrives after onDestroyView(), _binding is null and binding throws. Even without that crash, the listener still leaks the Fragment.

FIX
---
1. Make AnalyticsTracker expose removeListener().
2. Store the listener in a Fragment property so the same instance can be removed.
3. Register the listener when the view exists.
4. Remove the listener in onDestroyView() because the callback updates the Fragment view.
5. Keep AnalyticsTracker instance-scoped through DI if possible; do not use a public static mutable listener list.

UPDATED CODE
------------
```kotlin
// Before
class AnalyticsTracker @Inject constructor() {
    companion object {
        val listeners = mutableListOf<ProfileEventListener>()
    }

    fun addListener(listener: ProfileEventListener) {
        listeners.add(listener)
    }
}

@AndroidEntryPoint
class ProfileFragment : Fragment(R.layout.fragment_profile) {
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        analyticsTracker.addListener(object : AnalyticsTracker.ProfileEventListener {
            override fun onProfileEvent(event: String) {
                binding.lastEventText.text = event
            }
        })
    }
}

// After
class AnalyticsTracker @Inject constructor() {
    interface ProfileEventListener {
        fun onProfileEvent(event: String)
    }

    private val listeners = LinkedHashSet<ProfileEventListener>()

    fun addListener(listener: ProfileEventListener) {
        listeners.add(listener)
    }

    fun removeListener(listener: ProfileEventListener) {
        listeners.remove(listener)
    }

    fun track(event: String) {
        listeners.toList().forEach { it.onProfileEvent(event) }
    }
}

@AndroidEntryPoint
class ProfileFragment : Fragment(R.layout.fragment_profile) {

    @Inject lateinit var analyticsTracker: AnalyticsTracker
    private var _binding: FragmentProfileBinding? = null
    private val binding get() = checkNotNull(_binding) {
        "Binding is only valid between onViewCreated and onDestroyView"
    }

    private val profileEventListener = object : AnalyticsTracker.ProfileEventListener {
        override fun onProfileEvent(event: String) {
            _binding?.lastEventText?.text = event
        }
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        _binding = FragmentProfileBinding.bind(view)
        analyticsTracker.addListener(profileEventListener)
    }

    override fun onDestroyView() {
        analyticsTracker.removeListener(profileEventListener)
        _binding = null
        super.onDestroyView()
    }
}
```

VERIFICATION
------------
- Run the original repro path: open Profile, edit, rotate, back, wait for LeakCanary.
- Repeat the repro 5 times. Expected result: no retained ProfileFragment.
- Trigger AnalyticsTracker.track() after leaving Profile. Expected result: no binding crash and no ProfileFragment callback.
- Add a FragmentScenario regression test that moves the Fragment to DESTROYED and verifies removeListener() was called with a fake AnalyticsTracker.
- Inspect heap after the fix if LeakCanary still reports retention; the new path should not include AnalyticsTracker.listeners.

PREVENTION
----------
- Do not put mutable UI listener lists in companion objects or singletons.
- Any addListener/registerObserver call in a Fragment must have a matching remove/unregister call at the correct lifecycle boundary.
- If a callback touches the view or binding, unregister it in onDestroyView().
- If a callback only needs the Fragment lifecycle, unregister in onDestroy().
- Prefer Flow with repeatOnLifecycle for screen events when the producer can be lifecycle-aware.

MISSING EVIDENCE
----------------
None.
```
