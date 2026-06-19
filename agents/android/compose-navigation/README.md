# Android Compose Navigation Architect

> Generate or review scalable Jetpack Compose navigation with type-safe routes, nested graphs, bottom navigation, deep links, and tests.

---

## What It Does

- Generates Navigation Compose 2.8+ type-safe routes using `@Serializable`
- Creates root and feature-level graph-builder extensions
- Designs nested auth, onboarding, checkout, or other subflows
- Implements bottom navigation with state restoration
- Handles typed arguments through `toRoute<T>()`
- Shows `SavedStateHandle.toRoute<T>()` for ViewModels
- Defines deep-link and authentication behavior
- Reviews duplicate routes, unsafe arguments, incorrect `popUpTo`, and back-stack bugs
- Generates navigation tests

---

## Files

| File | Purpose |
|---|---|
| [`agent.md`](agent.md) | Input/output contract and system prompt |
| [`example-input.md`](example-input.md) | Real app navigation requirements |
| [`example-output.md`](example-output.md) | Complete generated navigation architecture |

---

## Quick Start

```text
Use the agent at agents/android/compose-navigation/agent.md.

MODE: GENERATE
PACKAGE: com.example.shop
NAVIGATION_VERSION: 2.8.9
KOTLIN_VERSION: 2.0
...
```

Install only this agent:

```bash
npx mobile-agency add agent compose-navigation
```

---

## Design Principles

- Routes are types, not strings.
- Screens expose callbacks, not `NavController`.
- Feature modules own their internal destinations.
- Route arguments contain IDs, not full objects.
- Bottom tabs preserve independent state.
- Back-stack changes are deliberate and documented.
- Deep links are validated before privileged navigation.
- Navigation behavior is covered by tests.

---

## Related Agents

- [`compose-screen-builder`](../compose-screen-builder/) for screen implementation
- [`compose-ui-reviewer`](../compose-ui-reviewer/) for UI quality
- [`axiom`](../axiom/) for Android architecture review

---

## Official References

- [Navigation with Compose](https://developer.android.com/develop/ui/compose/navigation)
- [Type safety in Kotlin DSL and Navigation Compose](https://developer.android.com/guide/navigation/design/type-safety)
- [Test Navigation](https://developer.android.com/guide/navigation/testing)
