# Skill — Android Code Review

**Platform:** Android (Kotlin)  
**Category:** Code Quality  
**Composable With:** agents/android/code-reviewer/agent.md, skills/shared/clean-architecture-check.md

---

## Purpose

Adds Android-specific code review rules to any LLM session. Use this as a skill module to prime a review session without running the full agent.

## When to Use

- When you want a quick inline review during a pair-programming session
- When composing a larger review workflow that covers multiple files
- When you want only Android-specific checks without the full structured output format

---

## Skill Prompt

```
When reviewing Android Kotlin code, check for these issues:

COROUTINE SAFETY
- Never use GlobalScope. Use viewModelScope (in ViewModel), lifecycleScope (in Activity/Fragment), or a custom CoroutineScope with a Job that is cancelled appropriately.
- Coroutines that call suspend functions should handle exceptions with try/catch or a CoroutineExceptionHandler. Fire-and-forget coroutines that swallow exceptions are bugs waiting to happen.
- UI state updates (LiveData.value, StateFlow updates) must happen on the Main dispatcher.

KOTLIN IDIOMS
- Prefer data class for value-holding types.
- Prefer sealed class for state/result types over Boolean flags or nullable + exception patterns.
- Prefer StateFlow + collectAsStateWithLifecycle over LiveData in new code.
- Use `?.let`, `?.run`, `?:` for null safety. Flag every `!!` operator as a candidate for removal.
- Prefer `when` expressions over chains of if/else.

DEPENDENCY INJECTION
- No `new MyRepository()` inside a ViewModel or Fragment. Dependencies must be injected (Hilt, Koin, manual constructor injection).
- No singletons held as companion object properties for testability-sensitive objects.

CLEAN ARCHITECTURE
- Domain layer (use cases, entities): zero Android framework imports.
- Data layer (repositories, data sources): no UI-level types, no Context except for file/preference access.
- Presentation layer (ViewModel): no database calls directly, no network calls directly — only use cases.

COMPOSE (if applicable)
- Side effects belong in LaunchedEffect, not in composable bodies.
- Expensive calculations belong in remember { } or derivedStateOf { }.
- Avoid reading mutableStateOf values outside of composition.
- collectAsStateWithLifecycle is preferred over collectAsState for lifecycle awareness.

For each issue found, state: the line or function, what is wrong, and a concrete fix.
```

---

## Example

**Input (after applying skill prompt):**
```
Review this ViewModel:

class OrderViewModel : ViewModel() {
    fun placeOrder(items: List<Item>) {
        GlobalScope.launch {
            OrderRepository().submit(items)
        }
    }
}
```

**Output:**
```
Line 3 — GlobalScope leak: Replace with viewModelScope.launch { ... }
Line 4 — Direct repository instantiation: Inject OrderRepository via constructor.
No error handling: If submit() throws, the exception is silently dropped.
Suggestion: Wrap in try/catch and expose error state via a StateFlow<OrderState>.
```

---

## Composition Example

```
Prepend this skill prompt before the Android Code Reviewer system prompt to add
a focused lens on coroutines and Compose alongside the full structured review output.

Or use standalone in a Claude Code chat session — paste this skill, then paste
your Kotlin file and ask "Review this for the issues listed above."
```

---

## Notes

- This skill covers Kotlin only. For Java Android code, the coroutine rules do not apply but the DI and Clean Architecture rules still hold.
- Compose checks require Compose to be in use — skip those rules for View-based UIs.
