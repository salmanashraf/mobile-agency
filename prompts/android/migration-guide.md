# Prompt — Android Migration Guide

**Platform:** Android (Kotlin)  
**Category:** Code Quality  
**Type:** one-shot

---

## Purpose

Generates a step-by-step migration plan for common Android API migrations (LiveData → StateFlow, View system → Compose, RxJava → Coroutines, Java → Kotlin, etc.).

---

## Prompt

```
You are a senior Android engineer. Generate a step-by-step migration guide for the migration
described below.

For each step:
1. State what to change and why (what problem the old approach has).
2. Provide a before/after code snippet (Kotlin).
3. Flag any gotchas, breaking changes, or testing considerations.
4. Estimate effort: Quick (< 1 hour per file), Medium (half day per file), High (multi-day).

End with:
- A migration order recommendation (which parts of the codebase to migrate first and why).
- A list of Gradle dependency changes needed.
- A testing strategy (what to run after each step to verify correctness).

Migration to perform:
FROM: [DESCRIBE CURRENT APPROACH]
TO:   [DESCRIBE TARGET APPROACH]

Affected code (paste representative examples):
```
[PASTE 1–3 REPRESENTATIVE CODE EXAMPLES]
```
```

---

## Example Usage

**What you paste:**
```
Migration to perform:
FROM: LiveData + observe() in Fragments
TO:   StateFlow + repeatOnLifecycle(STARTED) + collectAsStateWithLifecycle() in Compose

Affected code:
```
// ViewModel
val user = MutableLiveData<User>()

// Fragment
viewModel.user.observe(viewLifecycleOwner) { user ->
    binding.nameText.text = user.name
}
```
```

**Expected output:**
```
MIGRATION GUIDE: LiveData → StateFlow

Step 1 — Replace MutableLiveData with MutableStateFlow in ViewModel
Effort: Quick per ViewModel

Why: StateFlow is a Kotlin-first API that supports structured concurrency, is easier to
test without Android framework, and integrates directly with Compose.

Before:
val user = MutableLiveData<User>()
fun load() { viewModelScope.launch { user.value = repo.getUser() } }

After:
private val _user = MutableStateFlow<User?>(null)
val user: StateFlow<User?> = _user.asStateFlow()
fun load() { viewModelScope.launch { _user.value = repo.getUser() } }

Gotcha: StateFlow requires an initial value. Use null for optional state, or a sealed
Loading/Success/Error class for state machines.

---

Step 2 — Replace observe() in Fragments/Activities
Effort: Quick per screen

Before:
viewModel.user.observe(viewLifecycleOwner) { user ->
    binding.nameText.text = user.name
}

After:
viewLifecycleOwner.lifecycleScope.launch {
    repeatOnLifecycle(Lifecycle.State.STARTED) {
        viewModel.user.collect { user ->
            user?.let { binding.nameText.text = it.name }
        }
    }
}

Gotcha: Do NOT use lifecycleScope.launch { flow.collect {} } without repeatOnLifecycle.
Without it, the collector keeps running in the background when the Fragment is paused,
wasting resources and potentially causing crashes.

---

Gradle Changes:
// No new dependency needed — StateFlow is part of kotlinx-coroutines-core

Testing Strategy:
1. After each ViewModel migration: run existing unit tests. StateFlow values can be
   tested without Android framework using Turbine: testScope.run { flow.test { ... } }
2. After each Fragment migration: run UI tests or manual regression on the affected screen.
3. Run full regression suite before merging.

Migration Order:
1. Shared ViewModels (used by multiple Fragments) — highest leverage.
2. Screen-level ViewModels — one screen at a time.
3. Leave Fragment observers until the ViewModel is migrated — don't mix LiveData + StateFlow.
```

---

## Variations

- **RxJava → Coroutines:** Replace FROM/TO with "RxJava Observable/Single" → "Kotlin Flow/suspend functions"
- **Java → Kotlin:** Add "Focus on idiomatic Kotlin: data classes, extension functions, null safety, and removing boilerplate"
- **View system → Compose:** Add "Highlight interop via ComposeView and AndroidView for incremental migration"
