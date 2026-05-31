# CRASHER Report — ProfileFragment NPE

**Agent:** CRASHER  
**Input:** examples/crash-triage/input.txt

---

## Output

```
CRASHER REPORT
==============
Platform: Android
Crash Type: NullPointerException
Severity: P1
Reproduction Rate: 8.3%

ROOT CAUSE
----------
navigateToProfile() is called from inside HomeViewModel's loadDashboard coroutine.
When the coroutine resumes after an async operation, it calls navigation directly on
the Activity, which triggers Fragment creation. ProfileFragment.onViewCreated then
accesses a view binding or ViewModel property that is null because the Fragment has
not yet completed its lifecycle initialization. The 8.3% rate confirms a timing race.

FAILURE PATH
------------
1. HomeViewModel.loadDashboard suspends (line 62) — async operation starts.
2. Coroutine resumes and calls MainActivity.navigateToProfile (line 89) directly.
3. Fragment back stack transaction begins, ProfileFragment is created.
4. ProfileFragment.onViewCreated fires before state is initialized — NPE at line 47.

CRASH LOCATION
--------------
File: profile/ProfileFragment.kt
Line: 47
Function: onViewCreated

THE FIX
-------
Two changes required:

1. Never call navigation from a ViewModel coroutine. Emit a navigation event instead.

```kotlin
// HomeViewModel.kt
sealed class NavEvent {
    data class ToProfile(val userId: String) : NavEvent()
}

private val _navEvent = MutableSharedFlow<NavEvent>(extraBufferCapacity = 1)
val navEvent: SharedFlow<NavEvent> = _navEvent.asSharedFlow()

// In loadDashboard, replace direct navigation call:
_navEvent.emit(NavEvent.ToProfile(userId))
```

```kotlin
// MainActivity.kt — observe in lifecycle scope
lifecycleScope.launch {
    repeatOnLifecycle(Lifecycle.State.STARTED) {
        viewModel.navEvent.collect { event ->
            when (event) {
                is NavEvent.ToProfile -> navigateToProfile(event.userId)
            }
        }
    }
}
```

2. Guard the null access in ProfileFragment.onViewCreated:
```kotlin
// ProfileFragment.kt line 47 area — add null guard
val viewModel: ProfileViewModel by viewModels()
// Ensure viewModel is accessed after viewLifecycleOwner is ready:
viewLifecycleOwner.lifecycleScope.launch {
    viewModel.profileState.collect { state -> updateUI(state) }
}
```

REGRESSION TEST
---------------
```kotlin
@Test
fun `HomeViewModel emits NavEvent not calls navigation directly`() {
    val viewModel = HomeViewModel(fakeRepository)
    val events = mutableListOf<NavEvent>()
    val job = testScope.launch { viewModel.navEvent.toList(events) }
    viewModel.loadDashboard()
    testScope.advanceUntilIdle()
    assertTrue(events.any { it is NavEvent.ToProfile })
    job.cancel()
}
```

PREVENTION
----------
1. Add a lint rule or Detekt rule that flags Activity method calls from ViewModel classes.
2. Establish team convention: ViewModels communicate via SharedFlow<Event>, never direct references.
3. In ProfileFragment.onViewCreated, always access ViewModel state via viewLifecycleOwner.lifecycleScope.

VERDICT: FIXED
```
