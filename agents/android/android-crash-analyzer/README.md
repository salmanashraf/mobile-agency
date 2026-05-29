# Android Crash Analyzer Agent

> Paste a crash log. Get a root-cause analysis, a production-ready fix, and a testing checklist — in seconds.

---

## What This Agent Does

The Android Crash Analyzer reads raw crash logs, ANR traces, and Firebase Crashlytics exports and returns a structured 9-section report:

1. **Crash Summary** — type, severity, reproducibility
2. **Root Cause** — what actually went wrong, not just which line
3. **Why This Happens** — plain-English explanation for any team member
4. **Risk Level** — Critical / High / Medium / Low + affected user estimate
5. **Recommended Fix** — step-by-step, lifecycle-aware solution
6. **Updated Code** — before/after Kotlin snippets with inline comments
7. **Edge Cases** — other places the same bug can hide
8. **Testing Checklist** — concrete steps to verify the fix
9. **Prevention Tips** — architecture, lint rules, tooling

---

## Supported Crash Types

| Category | Examples |
|---|---|
| Null & Type | NullPointerException, ClassCastException, IllegalArgumentException |
| Lifecycle | Fragment not attached, Activity after finish(), View after onDestroyView |
| Concurrency | GlobalScope leak, UI update off main thread, race condition on shared state |
| Coroutines | Unhandled exception, wrong dispatcher, missing CoroutineExceptionHandler |
| RecyclerView | Invalid adapter position, DiffUtil conflict, view holder type mismatch |
| Memory | OOM from bitmap, leak from static context reference, Handler not cleared |
| ANR | Main thread blocked by I/O, lock contention, broadcast timeout |
| Firebase / Crashlytics | Symbolicated and unsymbolicated exports |
| Custom | Any stack trace you paste — the agent infers the crash type |

---

## Files

| File | Purpose |
|---|---|
| [`agent.md`](agent.md) | Full agent spec: input format, output format, system prompt |
| [`example-input.md`](example-input.md) | Real Android crash log ready to paste |
| [`example-output.md`](example-output.md) | Full 9-section analysis of that crash |

---

## Quick Start

### Claude Code

```
# In your Claude Code session:
Use the system prompt from agents/android/android-crash-analyzer/agent.md
Then paste the input from example-input.md — or replace it with your own crash log.
```

### ChatGPT / Cursor

1. Open `agent.md`
2. Copy the **System Prompt** section
3. Paste it as your first message
4. Follow with your crash log using the input format

### Cursor `.cursorrules`

The agent rules are already loaded via `.cursorrules` at the repo root. In Cursor Chat:

```
@agents/android/android-crash-analyzer/agent.md
Analyze this crash: [paste log]
```

---

## Input Format

```
PLATFORM: Android
APP_VERSION: <version>
OS_VERSION: <Android version>
DEVICE: <device model>
USER_ACTION: <what the user was doing>
CRASH_LOG:
<full stack trace or ANR trace>
RELATED_CODE: <optional — paste the code around the crash site>
```

---

## Output Example

See [`example-output.md`](example-output.md) for the full 9-section report.

**Preview:**

```
## Crash Summary
IllegalStateException in ProfileFragment.kt:88 when a coroutine posts to a
LiveData observer after the Fragment is detached. HIGH severity — reproducible
on slow networks when the user navigates back during a request.

## Root Cause
viewModelScope survives the Fragment's view lifecycle. When the coroutine
completes and sets _profile.value, the LiveData observer fires. By then,
requireContext() throws because the Fragment has no attached context.
```

---

## Best Practices

- Paste the **full** stack trace — truncated traces miss the first app frame
- Include `USER_ACTION` — it is the single most useful field for lifecycle crashes
- For Firebase exports, paste the full event (not just the stack) — metadata matters
- For ANR traces, paste the complete `traces.txt` file from `/data/anr/`
- For LeakCanary output, paste the full reference chain

---

## Related Agents

- [`agents/android/code-reviewer`](../code-reviewer/) — pre-crash code quality review
- [`agents/android/compose-ui-reviewer`](../compose-ui-reviewer/) — Compose-specific issues
- [`agents/ios/crash-analyzer`](../../ios/crash-analyzer/) — same workflow for iOS

---

## Contributing

Found a crash type this agent handles poorly? Open an issue using the
[Bug Report template](../../../.github/ISSUE_TEMPLATE/bug_report.md) and paste the
anonymized crash log. We'll improve the system prompt and add it as a new example.
