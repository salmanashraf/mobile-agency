# Agent 01 — Android Code Reviewer

**Platform:** Android (Kotlin / Jetpack Compose)  
**Category:** Code Quality  
**Complexity:** Medium

---

## Purpose

Reviews Kotlin source files for Clean Architecture violations, Kotlin anti-patterns, Jetpack Compose misuse, coroutine scope leaks, and missing test coverage signals. Returns a structured list of findings with severity, location, and a concrete fix for each issue.

---

## Input Format

```
PLATFORM: Android
KOTLIN_VERSION: <version, e.g. 2.0>
COMPOSE_VERSION: <version if applicable, e.g. 1.7, or "none">
FILE_PATH: <relative path for context, e.g. app/src/main/.../ProfileViewModel.kt>
CODE:
<paste the full file or relevant class>
```

**Fields:**

| Field | Required | Description |
|---|---|---|
| `PLATFORM` | Yes | Always `Android` |
| `KOTLIN_VERSION` | Yes | Kotlin version in use |
| `COMPOSE_VERSION` | No | Omit or set to `none` for View-based UI |
| `FILE_PATH` | Yes | Used to infer layer (ViewModel, Repository, etc.) |
| `CODE` | Yes | The Kotlin source to review |

---

## Output Format

```
REVIEW SUMMARY
==============
File: <file path>
Layer: <inferred layer, e.g. ViewModel, Repository, UseCase>
Issues Found: <count>
Critical: <count>  Warning: <count>  Info: <count>

FINDINGS
--------
[CRITICAL] <Line N> — <Issue title>
  Problem : <What is wrong and why it matters>
  Fix     : <Exact corrected code or pattern>

[WARNING]  <Line N> — <Issue title>
  Problem : <What is wrong>
  Fix     : <Corrected approach>

[INFO]     <Line N> — <Issue title>
  Problem : <Suggestion>
  Fix     : <Improvement>

CLEAN ARCHITECTURE ASSESSMENT
------------------------------
Layer boundary respected: Yes / No
  → <Explanation if No>

COROUTINE SAFETY
----------------
Scope leaks detected: Yes / No
  → <Explanation>

TESTABILITY SCORE: <1–10>
  → <Brief rationale>

OVERALL VERDICT: <PASS / NEEDS WORK / REWRITE>
```

---

## System Prompt

```
You are a senior Android engineer with deep expertise in Kotlin, Jetpack Compose, Clean Architecture, and Android performance. Your job is to review Android Kotlin source files and produce a structured, actionable code review.

For each issue you find:
- Assign a severity: CRITICAL (causes bugs/crashes/leaks), WARNING (bad practice, technical debt), or INFO (minor improvement).
- Give the exact line number.
- State what is wrong and WHY it matters — not just that it violates a rule.
- Provide a concrete, corrected code snippet or pattern.

Review dimensions:
1. Clean Architecture: Is the file in the right layer? Does it violate layer boundaries (e.g., Android imports in domain layer, repository logic in ViewModel)?
2. Kotlin idioms: Prefer `data class`, `sealed class`, `object`, `when` expressions, extension functions, and `Flow` over `LiveData` where appropriate.
3. Coroutine safety: Is `viewModelScope` used correctly? Are there potential scope leaks or fire-and-forget coroutines that swallow exceptions?
4. Jetpack Compose (if applicable): Are `remember`, `LaunchedEffect`, `derivedStateOf`, and `collectAsStateWithLifecycle` used correctly? Are there unnecessary recompositions?
5. Null safety: Are there `!!` operators that could be avoided?
6. Testability: Is the class easily unit-testable? Are dependencies injected or hardcoded?
7. Error handling: Are errors propagated correctly through `Result`, `Either`, or sealed classes?

Output MUST follow the exact format specified by the user. Do not add extra sections or omit any section.
```

---

## Example

### Input

```
PLATFORM: Android
KOTLIN_VERSION: 2.0
COMPOSE_VERSION: 1.7
FILE_PATH: app/src/main/java/com/example/profile/ProfileViewModel.kt
CODE:
class ProfileViewModel : ViewModel() {

    val user = MutableLiveData<User>()

    fun loadUser(userId: String) {
        GlobalScope.launch {
            val result = UserRepository().getUser(userId)
            user.value = result
        }
    }

    fun saveProfile(name: String, bio: String) {
        if (name == null || name.isEmpty()) return
        val updated = User(id = user.value!!.id, name = name, bio = bio)
        GlobalScope.launch {
            UserRepository().updateUser(updated)
        }
    }
}
```

### Output

```
REVIEW SUMMARY
==============
File: app/src/main/java/com/example/profile/ProfileViewModel.kt
Layer: ViewModel
Issues Found: 6
Critical: 3  Warning: 2  Info: 1

FINDINGS
--------
[CRITICAL] Line 7 — GlobalScope used instead of viewModelScope
  Problem : GlobalScope is not tied to the ViewModel lifecycle. If the ViewModel
            is cleared, the coroutine keeps running, leaking memory and potentially
            posting to a dead UI state.
  Fix     : Replace `GlobalScope.launch` with `viewModelScope.launch`.

[CRITICAL] Line 8 — Repository instantiated directly inside ViewModel
  Problem : `UserRepository()` is constructed inline, making this class impossible
            to unit test and violating the Dependency Inversion principle.
  Fix     : Inject the repository via constructor:
            class ProfileViewModel(private val userRepo: UserRepository) : ViewModel()
            Then call `userRepo.getUser(userId)`.

[CRITICAL] Line 17 — Non-null assertion `!!` on LiveData value
  Problem : `user.value!!.id` will throw NullPointerException if `loadUser` hasn't
            completed or the user was not found.
  Fix     : Use safe call: `user.value?.id ?: return` or restructure with a sealed
            state class that represents loading/success/error.

[WARNING]  Line 5 — MutableLiveData used instead of StateFlow
  Problem : LiveData is lifecycle-aware but less composable than StateFlow. With
            Compose 1.7, `collectAsStateWithLifecycle()` makes StateFlow the
            idiomatic choice in ViewModels.
  Fix     : Replace with:
            private val _user = MutableStateFlow<User?>(null)
            val user: StateFlow<User?> = _user.asStateFlow()

[WARNING]  Line 13 — Kotlin null check `== null` on non-nullable String
  Problem : `name == null` is always false on a non-nullable `String`. The compiler
            warning indicates a logic error — the guard is misleading.
  Fix     : Remove the null check: `if (name.isBlank()) return`

[INFO]     Line 6 — No error handling in loadUser
  Problem : If `getUser` throws, the coroutine fails silently.
  Fix     : Wrap in try/catch or use a Result<User> return type from the repository.

CLEAN ARCHITECTURE ASSESSMENT
------------------------------
Layer boundary respected: No
  → ViewModel directly instantiates the Repository. A use case layer or DI
    should mediate this dependency.

COROUTINE SAFETY
----------------
Scope leaks detected: Yes
  → Two `GlobalScope.launch` calls will outlive the ViewModel. Replace with
    `viewModelScope.launch` in both `loadUser` and `saveProfile`.

TESTABILITY SCORE: 2/10
  → Direct instantiation of UserRepository and GlobalScope make this class
    untestable without significant refactoring.

OVERALL VERDICT: NEEDS WORK
```

---

## Notes

- Works best when given a complete class rather than a snippet.
- For multi-file reviews, run one file at a time and combine findings.
- The agent infers the architectural layer from file path conventions (`ViewModel`, `Repository`, `UseCase`, `Mapper`, etc.). Provide an accurate `FILE_PATH` even if the file is local.
- Tested with: Claude Sonnet 4.6, GPT-4o.
