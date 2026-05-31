# Skill — /compose-review

**Platform:** Android (Jetpack Compose)
**Slash Command:** `/compose-review`
**Composable With:** agents/android/axiom/agent.md

---

## Purpose

Recomposition audit for Jetpack Compose files. Flags unnecessary recompositions, incorrect state usage, missing `const` constructors, and lambda instability before PR merge.

---

## Skill Prompt

```
Audit the provided Jetpack Compose code for recomposition issues:

1. UNNECESSARY RECOMPOSITIONS
   - Lambdas passed as parameters that are recreated every composition.
     Fix: wrap in remember { } or move to ViewModel.
   - Objects created inline in composable bodies (val list = listOf(...) inside Composable).
     Fix: hoist to remember { } or to the ViewModel.
   - Reading State inside a composable that also writes it (causes infinite recomposition).

2. STATE USAGE
   - remember vs rememberSaveable: use rememberSaveable for state that survives config changes.
   - derivedStateOf: use when computing a value that depends on other state to minimize recompositions.
   - collectAsStateWithLifecycle: always prefer over collectAsState for lifecycle safety.
   - mutableStateListOf / mutableStateMapOf: flag direct mutations that don't trigger recomposition.

3. COMPOSITION KEYS
   - LazyList items missing key parameter → unnecessary recomposition on list changes.
   - key { } block containing a mutable value that changes without semantic identity change.

4. SIDE EFFECTS
   - Bare code in composable body that has side effects (file I/O, network, logging).
     Fix: wrap in SideEffect, LaunchedEffect, or DisposableEffect as appropriate.
   - LaunchedEffect with Unit key that should restart on specific input changes.

5. PERFORMANCE
   - Composables that could be @Stable or marked as stable data classes.
   - Heavy computations not wrapped in remember { } with appropriate keys.

For each issue: state the composable name, line (if given), what triggers the recomposition, and the fix.
```

---

## Example

**Input:**
```kotlin
@Composable
fun UserList(users: List<User>) {
    val filtered = users.filter { it.isActive }
    LazyColumn {
        items(filtered) { user ->
            UserRow(user = user, onClick = { navigateToProfile(user.id) })
        }
    }
}
```

**Output:**
```
Line 3 — List filtered in composable body
  Every recomposition re-runs users.filter { } creating a new list.
  Fix: val filtered = remember(users) { users.filter { it.isActive } }

LazyColumn items — missing key parameter
  Without key, LazyColumn re-renders ALL items when the list changes.
  Fix: items(filtered, key = { it.id }) { user -> ... }

Line 4 — Lambda { navigateToProfile(user.id) } recreated per item per recomposition
  Fix: val onUserClick = remember(user.id) { { navigateToProfile(user.id) } }
```
