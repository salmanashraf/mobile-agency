# Android Skills

Reusable skill prompt modules for Android (Kotlin / Jetpack Compose) code reviews and analysis. Compose with agents or use standalone in any LLM session.

## Index

| Skill | File | When to Use |
|---|---|---|
| Android ANR Investigation | [anr-investigation.md](anr-investigation.md) | Classify ANRs, trace blocking dependencies, propose a safe fix, and define verification |
| Android Code Review | [code-review.md](code-review.md) | Quick inline review of Kotlin files — coroutines, Clean Architecture, Compose, DI |
| Android Memory Leak Investigation | [memory-leak-investigation.md](memory-leak-investigation.md) | Trace GC-root ownership, find lifecycle leaks, propose a focused fix, and verify collection |

## Usage

Paste a skill prompt at the start of any LLM session, then paste your Kotlin code:

```
# Quick review session
[paste skill prompt from code-review.md]

Now review this ViewModel: [paste code]
```

## Composable With

- [`agents/android/code-reviewer`](../../agents/android/code-reviewer/) — full structured review using these rules
- [`agents/android/compose-ui-reviewer`](../../agents/android/compose-ui-reviewer/) — Compose-specific depth

## Contributing

New skills should cover one focused concern (e.g., "Hilt injection patterns", "Room query optimization"). Copy `templates/skill-template.md` and open a PR.
