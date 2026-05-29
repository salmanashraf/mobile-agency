# Android Skills

Reusable skill prompt modules for Android (Kotlin / Jetpack Compose) code reviews and analysis. Compose with agents or use standalone in any LLM session.

## Index

| Skill | File | When to Use |
|---|---|---|
| Android Code Review | [code-review.md](code-review.md) | Quick inline review of Kotlin files — coroutines, Clean Architecture, Compose, DI |

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
