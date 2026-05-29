# Android Code Reviewer Agent

> Paste a Kotlin file. Get a structured CRITICAL / WARNING / INFO review with exact line numbers, root-cause explanations, and corrected code for every finding.

---

## What This Agent Does

Reviews Android Kotlin source files across six dimensions and returns a structured report:

- **Clean Architecture** — layer boundary violations, Android imports in domain layer, repository calls in ViewModel
- **Kotlin idioms** — `!!` force-unwrap, missing `sealed class`, `LiveData` vs `StateFlow`, idiomatic null handling
- **Coroutine safety** — `GlobalScope`, wrong dispatcher for UI updates, missing `CoroutineExceptionHandler`
- **Jetpack Compose** — `remember`/`derivedStateOf` misuse, side effects outside `LaunchedEffect`, missing `key` in lists
- **Dependency injection** — direct instantiation of repositories, untestable singletons, hardcoded dependencies
- **Testability** — injectable interfaces, pure functions, no hidden state

Every finding includes severity, line number, root-cause explanation, and corrected Kotlin code.

---

## Supported File Types

- `ViewModel` — architecture, coroutines, state exposure
- `Fragment` / `Activity` — lifecycle, observer registration, view binding
- `Repository` / `UseCase` — layer purity, error handling, suspend function patterns
- `@Composable` functions — recomposition, state, side effects
- `Mapper` / `Adapter` classes — data transformation, null safety

---

## Files

| File | Purpose |
|---|---|
| [`agent.md`](agent.md) | Input format, output format, full system prompt |
| [`example-input.md`](example-input.md) | Real ViewModel with intentional issues |
| [`example-output.md`](example-output.md) | Full CRITICAL/WARNING/INFO review report |

---

## Quick Start

### Claude Code
```
Use the system prompt from agents/android/code-reviewer/agent.md
Then paste your Kotlin file using the input format.
```

### Cursor
```
@agents/android/code-reviewer/agent.md
Review this file for Clean Architecture violations and coroutine safety:
[paste your Kotlin file]
```

### ChatGPT
1. Copy the **System Prompt** from `agent.md`
2. Paste as the first message
3. Follow with your code using the input format

---

## Input Format

```
PLATFORM: Android
KOTLIN_VERSION: <e.g. 2.0>
COMPOSE_VERSION: <e.g. 1.7 — or "none" for View-based UI>
FILE_PATH: <relative path, e.g. app/src/main/.../ProfileViewModel.kt>
CODE:
<paste the full Kotlin file or relevant class>
```

---

## Output Preview

```
REVIEW SUMMARY
==============
File: app/.../ProfileViewModel.kt
Layer: ViewModel
Issues Found: 6  |  Critical: 3  Warning: 2  Info: 1

[CRITICAL] Line 7 — GlobalScope used instead of viewModelScope
  Problem : Not tied to ViewModel lifecycle — coroutine leaks after ViewModel clears.
  Fix     : Replace with viewModelScope.launch { ... }
```

Full example: [`example-output.md`](example-output.md)

---

## Best Practices

- Paste the **full class**, not a snippet — context from imports and field declarations matters
- Set `FILE_PATH` accurately — the agent infers the architectural layer from the path convention
- For multi-file reviews, run one file at a time and combine findings
- Set `COMPOSE_VERSION: none` for XML/View-based UI to suppress Compose checks

---

## Related Agents

- [`agents/android/compose-ui-reviewer`](../compose-ui-reviewer/) — deeper Compose-only analysis (recomposition scope, `derivedStateOf`)
- [`agents/android/android-crash-analyzer`](../android-crash-analyzer/) — debug crashes in the reviewed code
- [`agents/android/compose-screen-builder`](../compose-screen-builder/) — generate a new screen following the patterns this agent enforces
