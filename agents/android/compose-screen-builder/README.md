# Android Compose Screen Builder Agent

> Describe a screen. Get a complete, production-ready Jetpack Compose implementation — ViewModel, StateFlow, Navigation, Material 3, Clean Architecture wiring, and all.

---

## What This Agent Does

Takes a plain-English screen description and returns a full, compilable Kotlin implementation including:

- `@Composable` screen function with Material 3 components
- `ViewModel` with `StateFlow`-based UI state
- Sealed `UiState` class with `Loading`, `Success`, and `Error` states
- `collectAsStateWithLifecycle()` for lifecycle-safe collection
- `NavController` integration with typed navigation arguments
- Accessibility semantics and dark-mode theming
- `@Preview` annotations (light + dark)
- Hilt `@HiltViewModel` dependency injection setup
- Clean Architecture layer boundaries respected

---

## When to Use

- Starting a new screen from scratch
- Converting a design mockup or Figma spec into Compose code
- Generating boilerplate so you can focus on business logic
- Onboarding a developer to your Compose + Clean Architecture patterns

---

## Files

| File | Purpose |
|---|---|
| [`agent.md`](agent.md) | Input format, output format, full system prompt |
| [`example-input.md`](example-input.md) | Real screen description ready to paste |
| [`example-output.md`](example-output.md) | Full generated screen implementation |

---

## Quick Start

```
# Claude Code session:
Use the system prompt from agents/android/compose-screen-builder/agent.md
Then describe your screen using the input format.
```

---

## Input Format

```
SCREEN_NAME: <e.g. OrderHistoryScreen>
DESCRIPTION: <plain-English description of the screen>
STATE_FIELDS: <list of data fields the screen displays>
ACTIONS: <list of user actions the screen supports>
NAVIGATION: <where this screen navigates to, and what params it receives>
DEPENDENCIES: <optional — Hilt modules, repository names already in your project>
COMPOSE_VERSION: <e.g. 1.7>
KOTLIN_VERSION: <e.g. 2.0>
```

---

## What Gets Generated

```
screen/
├── <ScreenName>Screen.kt       — @Composable screen + sub-composables + Previews
├── <ScreenName>ViewModel.kt    — @HiltViewModel + StateFlow + use case calls
└── <ScreenName>UiState.kt      — sealed UiState, UiEvent (optional)
```

---

## Design Principles

Every generated screen follows these non-negotiables:

- **No business logic in Composables.** Data fetching, transformation, and decisions live in the ViewModel or below.
- **Single source of truth.** One sealed `UiState` drives the entire screen. No parallel boolean flags (`isLoading`, `hasError`, `isEmpty`).
- **Lifecycle-safe collection.** `collectAsStateWithLifecycle()` (not `collectAsState()`) throughout.
- **Stable keys.** `LazyColumn` items always have `key = { it.id }`.
- **Material 3 theming.** All colors, typography, and shapes from `MaterialTheme`. No hardcoded hex.
- **Accessibility.** `contentDescription` on all icons, minimum 48dp tap targets, `Semantics` on custom components.

---

## Related Agents

- [`agents/android/code-reviewer`](../code-reviewer/) — review the generated code for issues
- [`agents/android/compose-ui-reviewer`](../compose-ui-reviewer/) — Compose-specific review
- [`agents/android/android-crash-analyzer`](../android-crash-analyzer/) — debug crashes in generated screens
