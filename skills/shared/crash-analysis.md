# Skill — Crash Log Analysis

**Platform:** Cross-Platform (Android / iOS)  
**Category:** Debugging & Crash Analysis  
**Composable With:** agents/android/crash-analyzer/agent.md

---

## Purpose

Teaches an LLM how to read and triage mobile crash logs. Useful as a standalone skill for quick triage or as a module inside a larger debugging workflow.

## When to Use

- When you paste a crash log into a chat and want a quick explanation
- When composing a workflow that processes multiple crash logs in bulk
- When onboarding a junior developer on how to read stack traces

---

## Skill Prompt

```
When analyzing a mobile crash log (Android logcat / iOS .crash file), follow this process:

1. IDENTIFY THE CRASH TYPE
   - Exception class (Java/Kotlin): NullPointerException, IllegalStateException,
     IndexOutOfBoundsException, OutOfMemoryError, etc.
   - Signal (native/NDK): SIGSEGV (null dereference), SIGABRT (assertion/abort),
     SIGBUS (unaligned memory access)
   - ANR: Look for "ANR in" at the top. Check the main thread stack for blocking calls.
   - OOM: "java.lang.OutOfMemoryError" — look at heap allocation chain.

2. FIND THE FIRST APPLICATION FRAME
   - Skip system frames: android.*, java.*, kotlin.*, kotlinx.*, com.google.*, androidx.*
   - The first frame with YOUR package name is where the crash originated in your code.
   - That frame is the starting point for root-cause analysis — not just the exception site.

3. TRACE THE CALL CHAIN
   - Read the stack trace bottom-to-top (entry point → crash site).
   - Identify the user action or lifecycle event that triggered the chain.
   - Note thread name (main thread crash vs. background thread crash).

4. STATE THE ROOT CAUSE
   - Do not just say "null pointer at line 42." Explain WHY the value was null,
     or WHY the index was out of bounds, given the code path.
   - Common root causes by exception type:
     NPE: async result used before completion; activity/fragment reference held after destroy
     IOOB: list modified during iteration; off-by-one in manual index calculation
     ISE: Fragment transaction after onSaveInstanceState
     OOM: bitmap not recycled; memory leak accumulating over time
     ANR: network/disk I/O on main thread; lock contention

5. REMEDIATION
   - State a concrete code fix, not "add null check."
   - If the fix involves async timing, explain the correct lifecycle hook to use.
   - Suggest a test case that would have caught this crash.
```

---

## Example

**Input:**
```
Fatal Exception: java.lang.IllegalStateException: Fragment ProfileFragment not attached to a context.
   at androidx.fragment.app.Fragment.requireContext(Fragment.java:947)
   at com.example.app.ProfileFragment.updateUI(ProfileFragment.kt:88)
   at com.example.app.ProfileViewModel$loadProfile$1.invokeSuspend(ProfileViewModel.kt:41)
```

**Output:**
```
Crash Type: IllegalStateException — Fragment not attached to context
First App Frame: ProfileFragment.updateUI (line 88)

Root Cause:
The ViewModel's coroutine completes and calls back into the Fragment after the Fragment
has been detached (e.g., user navigated away). requireContext() throws if the Fragment
is not currently attached to an Activity.

Fix:
In ProfileFragment.updateUI, guard with `if (!isAdded) return` before calling
requireContext(). Better: collect the ViewModel's StateFlow in onViewCreated using
`viewLifecycleOwner.lifecycleScope`, which automatically cancels when the view is destroyed,
preventing the callback from reaching the Fragment at all.

Test Case:
Navigate to Profile screen → trigger a slow network call → immediately navigate back →
confirm no crash in Crashlytics within 5 minutes of the scenario.
```

---

## Composition Example

```
Use this skill as a lightweight triage step before running the full Crash Log Analyzer agent.
Paste the skill prompt, then paste the crash log for a quick 3-sentence explanation.
For full structured output (root cause + AFFECTED SURFACE + REMEDIATION steps),
run agents/android/crash-analyzer/agent.md instead.
```

---

## Notes

- Works for both Android and iOS crash reports.
- For symbolicated iOS crashes, the skill assumes the crash file has already been symbolicated via `symbolicatecrash` or Xcode Organizer.
- ANR analysis requires the full `traces.txt` dump from `/data/anr/` — a single-thread excerpt is insufficient.
