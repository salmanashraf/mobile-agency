# Skill — /clean-code-audit

**Platform:** Android / iOS / Flutter / React Native  
**Slash Command:** `/clean-code-audit`  
**Composable With:** AXIOM, SWIFT, DART, BRIDGE, MOBILE-HARNESS, APPFORGE

---

## Purpose

Audit a mobile app or feature for clean code, maintainable architecture, file organization, naming, dependency boundaries, and model separation. Use this before merge, during refactors, or inside MOBILE-HARNESS after implementation.

This skill is stricter than a normal code review. It looks for structural problems that make the app hard to scale, test, or hand off.

---

## Input Format

```text
COMMAND: /clean-code-audit
PLATFORM: <Android | iOS | Flutter | React Native>
ARCHITECTURE: <MVVM | MVI | Clean Architecture | BLoC | Redux | other>
SCOPE:
<files, folders, feature name, or pasted tree>
CODE:
<paste code or provide file list>
RULES:
<optional project-specific rules>
```

---

## Skill Prompt

```text
Run a strict clean-code and architecture audit for the provided mobile app scope.

Check these areas:

1. MODEL AND TYPE ORGANIZATION
- Data models, DTOs, entities, UI models, state classes, events, and navigation models must be in separate files when reused or non-trivial.
- Do not define reusable data classes, sealed classes, enums, DTOs, or interfaces inside ViewModels, Activities, Fragments, Composables, SwiftUI Views, React components, or BLoCs.
- Nested types are allowed only when they are private, tiny, and used exclusively by the enclosing type.
- API response models must not be reused directly as domain models or UI models.
- Domain entities must not import platform UI, networking, database, or serialization frameworks.

2. LAYER BOUNDARIES
- Presentation depends on domain abstractions, not concrete data sources.
- ViewModels/BLoCs/controllers must not construct repositories, Retrofit/Dio/URLSession clients, Room/CoreData databases, SQLite handles, or HTTP clients directly.
- Domain/use-case layer must not import Android Context, SwiftUI/UIKit, Flutter widgets, React Native APIs, database annotations, or JSON serializers.
- Data layer may depend on API/database models and maps them to domain models.
- UI layer may map domain models to UI models, but formatting logic should live in mappers or presentation models, not scattered through views.

3. FILE AND PACKAGE STRUCTURE
- One primary production type per file unless the extra types are private implementation details.
- Feature files should be grouped by layer or clear feature slice.
- File names must match the main type or responsibility.
- Avoid dumping unrelated classes into `Utils`, `Helpers`, `Common`, `Extensions`, or `Manager` files.
- Generated files, platform config, and test fixtures must not be mixed with production logic.

4. NAMING AND RESPONSIBILITY
- Names must reveal role: `UserDto`, `UserEntity`, `UserUiModel`, `UserRepository`, `FetchUserUseCase`.
- Avoid ambiguous suffixes: `Data`, `Info`, `Manager`, `Helper`, `Util`, `Handler` unless the responsibility is narrow and clear.
- Classes should have one reason to change.
- Functions should do one thing and stay readable without excessive comments.

5. STATE AND MUTABILITY
- Expose immutable state to UI.
- Keep mutable collections and mutable state private.
- Avoid global mutable singletons for app state.
- Prefer explicit state models over loose booleans and nullable fields.
- UI state, events, and side effects should be clearly separated.

6. DEPENDENCY INJECTION AND TESTABILITY
- Constructor inject dependencies where possible.
- Avoid service locators in business logic.
- Avoid static/global calls for time, UUID, dispatchers, schedulers, analytics, storage, or networking; wrap them behind interfaces when needed.
- Use interfaces/protocols/abstract classes at boundaries that need tests or replacement.
- Business logic should be testable without launching UI or real network/database.

7. PLATFORM-SPECIFIC CHECKS
- Android/Kotlin: no repository creation in ViewModel; no Context in domain; DTOs/entities/UI models split; no large Composable with embedded business logic; no public MutableStateFlow.
- iOS/Swift: no networking/storage inside SwiftUI View; no ObservableObject doing everything; DTOs/domain/view models split; no force unwraps in model mapping.
- Flutter/Dart: no API model inside Widget/BLoC file when reused; no BuildContext in domain/repository; no large widget with business logic; separate entity/model/state/event files for non-trivial features.
- React Native/TypeScript: no API DTOs reused as component props when UI model differs; no fetch/storage directly inside render components; no large component containing reducers, API code, and presentation together.

8. DEAD CODE AND DUPLICATION
- Flag duplicate models, duplicate mappers, unused abstractions, stale TODOs, unreachable branches, and copied validation rules.
- Flag premature abstractions that hide simple logic without reducing real duplication.

Severity:
- CRITICAL: boundary violation that blocks testing, risks data corruption, or creates hidden runtime coupling.
- WARNING: maintainability, scaling, or readability issue likely to cause future defects.
- INFO: small cleanup or naming improvement.

Output exactly:

Table formatting rules:
- Output normal Markdown. Do not wrap the final report in a fenced code block.
- Keep every table cell short, ideally under 8 words.
- Do not put full paragraphs, stack traces, code blocks, or multi-sentence fixes inside table cells.
- Put long evidence, explanation, and fixes in `Finding Details`.
- Use stable IDs (`CCA-001`, `CCA-002`) to connect summary rows to detail sections.

CLEAN CODE AUDIT REPORT
=======================
Platform:
Scope:
Architecture:
Result: PASS | FAIL

Summary:
- <short summary>

Findings Summary:
| ID | Severity | Area | File | Issue | Fix Summary |
|---|---|---|---|---|---|

Finding Details:
### CCA-001 — <short title>
- Severity:
- Rule:
- Location:
- Problem:
- Why it matters:
- Fix:
- Suggested file move, if any:

Model Separation:
| Type | Current Location | Expected Location | Result |
|---|---|---|---|

Layer Boundary Check:
| Layer | Violation | Result |
|---|---|---|

Refactor Plan:
1. <highest impact fix>
2. <next fix>
3. <next fix>

Merge Gate:
PASS only if no CRITICAL findings remain.
```

---

## Example

### Input

```kotlin
@HiltViewModel
class ProfileViewModel @Inject constructor() : ViewModel() {
    data class ProfileResponse(val id: String, val name: String)

    private val api = Retrofit.Builder()
        .baseUrl("https://api.example.com")
        .build()
        .create(ProfileApi::class.java)

    val state = MutableStateFlow(ProfileResponse("", ""))
}
```

### Output

```text
CLEAN CODE AUDIT REPORT
=======================
Platform: Android
Scope: ProfileViewModel
Architecture: MVVM + Clean Architecture
Result: FAIL

Summary:
- ProfileViewModel owns API construction, exposes mutable state, and defines a reusable DTO inside the ViewModel.

Findings Summary:
| ID | Severity | Area | File | Issue | Fix Summary |
|---|---|---|---|---|---|
| CCA-001 | CRITICAL | Layer Boundaries | ProfileViewModel | Constructs Retrofit directly | Inject repository/use case |
| CCA-002 | WARNING | Model Organization | ProfileViewModel | Nested reusable DTO | Move DTO to data model file |
| CCA-003 | CRITICAL | State | ProfileViewModel | Public MutableStateFlow | Expose immutable StateFlow |

Finding Details:
### CCA-001 — ViewModel constructs networking dependency
- Severity: CRITICAL
- Rule: Layer Boundaries
- Location: ProfileViewModel
- Problem: The ViewModel constructs Retrofit and creates ProfileApi directly.
- Why it matters: Presentation is coupled to networking and cannot be tested without real infrastructure.
- Fix: Inject a ProfileRepository or FetchProfileUseCase through Hilt.
- Suggested file move, if any: None.

### CCA-002 — Reusable DTO is nested inside ViewModel
- Severity: WARNING
- Rule: Model Organization
- Location: ProfileViewModel.ProfileResponse
- Problem: ProfileResponse is an API/data model but lives inside a presentation class.
- Why it matters: The DTO cannot be reused cleanly and mixes API contract with UI state.
- Fix: Move it to `data/remote/model/ProfileResponse.kt` and map it to a domain `Profile`.
- Suggested file move, if any: `ProfileViewModel` → `data/remote/model/ProfileResponse.kt`.

### CCA-003 — Mutable state exposed publicly
- Severity: CRITICAL
- Rule: State and Mutability
- Location: ProfileViewModel.state
- Problem: UI callers can mutate ViewModel state directly.
- Why it matters: External mutation breaks unidirectional data flow and makes bugs hard to trace.
- Fix: Keep `MutableStateFlow` private and expose `StateFlow`.
- Suggested file move, if any: None.

Model Separation:
| Type | Current Location | Expected Location | Result |
|---|---|---|---|
| ProfileResponse | ProfileViewModel | data/remote/model/ProfileResponse.kt | FAIL |

Layer Boundary Check:
| Layer | Violation | Result |
|---|---|---|
| Presentation | Constructs Retrofit/API client | FAIL |

Refactor Plan:
1. Move ProfileResponse into the data remote model package.
2. Add ProfileRepository and inject it into ProfileViewModel.
3. Expose immutable StateFlow from the ViewModel.

Merge Gate:
PASS only if no CRITICAL findings remain.
```

---

## Usage Notes

- Pair with `/security-audit` for pre-release quality gates.
- Pair with platform reviewers when code is platform-specific: AXIOM, SWIFT, DART, or BRIDGE.
- Inside MOBILE-HARNESS, run this after implementation and before marking a task complete.
