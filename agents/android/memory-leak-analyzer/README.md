# Android Memory Leak Analyzer

> LeakCanary and heap-retention reports -> root cause, lifetime owner, corrected Android code, and regression tests.

---

## What It Does

- Reads LeakCanary traces from GC root to leaked object
- Identifies the first app-controlled reference with the wrong lifetime
- Reviews Activity, Fragment, ViewBinding, adapter, observer, coroutine, Flow, Rx, singleton, and listener leaks
- Explains why the object stayed reachable after its expected lifecycle ended
- Produces production-ready Kotlin fixes
- Adds a verification plan using LeakCanary, rotation, navigation, and repeated-flow testing

---

## Files

| File | Purpose |
|---|---|
| [`agent.md`](agent.md) | Input/output contract and system prompt |
| [`example-input.md`](example-input.md) | Real LeakCanary-style report and related code |
| [`example-output.md`](example-output.md) | Full deterministic investigation output |

---

## Quick Start

```text
Use the agent at agents/android/memory-leak-analyzer/agent.md.

APP: SampleShop
ANDROID_VERSION: 14
DEVICE: Pixel 8
LEAK_SOURCE: LeakCanary
EXPECTED_LIFECYCLE: ProfileFragment view should be destroyed after navigating back.
REPRO_STEPS:
- Open Profile
- Rotate once
- Navigate back
LEAK_TRACE:
<paste full LeakCanary trace>
RELATED_CODE:
<paste related Kotlin/Java>
```

Install only this agent:

```bash
npx mobile-ai-agents add agent memory-leak-analyzer
```

---

## Design Principles

- The reference path is the evidence.
- Fix the first app-controlled owner with the wrong lifetime.
- Do not hide leaks with `WeakReference` unless ownership is genuinely optional.
- Fragment views die before Fragments.
- ViewModels must not own Activity, Fragment, View, Adapter, or binding objects.
- Singletons must not keep screen-scoped callbacks, contexts, or UI objects.
- Every fix needs a lifecycle regression test or repeatable manual verification.

---

## Related

- [`skills/android/memory-leak-investigation.md`](../../../skills/android/memory-leak-investigation.md)
- [`agents/android/code-reviewer`](../code-reviewer/)
- [`agents/android/axiom`](../axiom/)

---

## Official References

- [LeakCanary: Fixing a memory leak](https://square.github.io/leakcanary/fundamentals-fixing-a-memory-leak/)
- [Android memory overview](https://developer.android.com/topic/performance/memory-overview)
