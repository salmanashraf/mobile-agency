# Android Compose UI Reviewer Agent

> A focused Compose-only reviewer. Paste a `@Composable` function and get a recomposition scope analysis, state hoisting assessment, `remember`/`derivedStateOf` correctness check, and `LazyColumn` performance audit.

---

## What This Agent Does

Specialized for Compose-specific issues that the general Android Code Reviewer misses. Analyzes:

- **Recomposition scope** — is state read inside the smallest possible lambda to minimize rebuild cost?
- **`remember` vs `rememberSaveable` vs `derivedStateOf`** — is the right tool being used? Are `remember` keys correct?
- **State hoisting** — is mutable state owned at the right level? Is there split-brain state?
- **`LazyColumn` / `LazyRow`** — `key`, `contentType`, expensive operations inside `items { }`, `Column { items.forEach }` anti-pattern
- **Side effects** — `LaunchedEffect`, `SideEffect`, `DisposableEffect` placement and key correctness
- **Slot API design** — is complex child content passed as a `@Composable () -> Unit` lambda?
- **Stability** — are unstable types (`List`, `Map`, regular classes) causing unnecessary recompositions?

---

## When to Use This Instead of the General Code Reviewer

| Situation | Agent to Use |
|---|---|
| Full file review (architecture, coroutines, Compose) | `agents/android/code-reviewer` |
| Compose-specific performance issue (jank, recompositions) | **This agent** |
| LazyColumn scrolling is slow | **This agent** |
| Unexplained UI flicker or state loss | **This agent** |
| Compose compiler metrics showing unstable types | **This agent** |

---

## Files

| File | Purpose |
|---|---|
| [`agent.md`](agent.md) | Input format, output format, full system prompt |
| [`example-input.md`](example-input.md) | FeedScreen with LazyColumn and recomposition issues |
| [`example-output.md`](example-output.md) | Full recomposition + state hoisting report |

---

## Quick Start

```
COMPOSE_VERSION: 1.7
KOTLIN_VERSION: 2.0
FILE_PATH: ui/feed/FeedScreen.kt
CODE:
[paste your @Composable function]
```

---

## Output Preview

```
[CRITICAL] FeedScreen — SimpleDateFormat instantiated inside LazyColumn items lambda
  Problem : Created fresh for every post on every recomposition — expensive object allocation.
  Fix     : remember(post.createdAt) { SimpleDateFormat(...).format(post.createdAt) }
            Or: format in the ViewModel and expose pre-formatted strings.

[WARNING]  FeedScreen — LazyColumn items missing key parameter
  Problem : Without key, any list change causes PostItem to lose its isExpanded state.
  Fix     : items(posts, key = { it.id }) { post -> ... }
```

---

## Related Agents

- [`agents/android/code-reviewer`](../code-reviewer/) — full-file review including architecture and coroutines
- [`agents/android/compose-screen-builder`](../compose-screen-builder/) — generate Compose screens that follow these patterns from the start
