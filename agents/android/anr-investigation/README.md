# Android ANR Investigation Agent

> ANR traces, Play Console clusters, and thread dumps -> root cause, production fix, and verification plan.

---

## What It Does

- Reads Play Console ANR clusters, Crashlytics ANR reports, `traces.txt`, bug reports, and `ApplicationExitInfo`
- Classifies input dispatch, service, foreground service, broadcast receiver, JobService, startup, binder, lock, and deadlock ANRs
- Finds the main thread state and any thread that owns the dependency blocking it
- Detects main-thread database, disk, network, startup, rendering, SDK, and synchronization bottlenecks
- Produces production-ready Kotlin fixes with structured concurrency and lifecycle-safe ownership
- Defines verification steps using StrictMode, system traces, macrobenchmarks, low-end devices, and Play Console monitoring

---

## Files

| File | Purpose |
|---|---|
| [`agent.md`](agent.md) | Input/output contract and system prompt |
| [`example-input.md`](example-input.md) | Real ANR-style trace and related code |
| [`example-output.md`](example-output.md) | Full deterministic investigation output |

---

## Quick Start

```text
Use the agent at agents/android/anr-investigation/agent.md.

APP_VERSION: 4.8.0 (480)
ANDROID_VERSION: 14
DEVICE: Pixel 6a
ANR_SOURCE: Play Console
ANR_REASON:
Input dispatching timed out
USER_ACTION:
Cold launch, then tapped Sign in.
TRACE:
<paste full ANR trace or thread dump>
RELATED_CODE:
<paste Activity, ViewModel, repository, service, receiver, or database code>
```

Install only this agent:

```bash
npx mobile-ai-agents add agent anr-investigation
```

---

## Design Principles

- The main thread is often the victim, not the cause.
- A high-confidence ANR report needs the main thread plus lock owner, binder peer, or blocking dependency.
- Do not wrap unknown code in `Dispatchers.IO` blindly.
- Keep receiver, service, and job lifecycle callbacks short.
- Reduce lock scope instead of moving lock contention to another thread.
- Every fix needs a reproducible timeout test or measurable performance check.

---

## Related

- [`skills/android/anr-investigation.md`](../../../skills/android/anr-investigation.md)
- [`agents/android/android-crash-analyzer`](../android-crash-analyzer/)
- [`agents/android/code-reviewer`](../code-reviewer/)
- [`agents/android/axiom`](../axiom/)

---

## Official References

- [Android Developers: ANRs](https://developer.android.com/topic/performance/vitals/anr)
- [Android Developers: Diagnose performance issues](https://developer.android.com/topic/performance)
