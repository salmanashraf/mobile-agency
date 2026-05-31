# Skill — /swiftui-review

**Platform:** iOS (SwiftUI)
**Slash Command:** `/swiftui-review`
**Composable With:** agents/ios/swift/agent.md

---

## Purpose

SwiftUI view lifecycle audit — unnecessary redraws, incorrect state ownership, @StateObject vs @ObservedObject misuse, and performance issues.

---

## Skill Prompt

```
Audit the provided SwiftUI code for view lifecycle and performance issues:

1. STATE OWNERSHIP
   - @StateObject: owns the object lifecycle (use in the view that CREATES the object).
   - @ObservedObject: receives an externally owned object (use in child views).
   - Confusing these causes: premature deallocation (@ObservedObject in root view) or
     memory leaks (new @StateObject created on every parent redraw).
   - @State: local, ephemeral state only. Never use for shared or persisted data.

2. UNNECESSARY REDRAWS
   - Large ObservableObject with many @Published properties: every published change
     triggers ALL views observing it. Split into focused models.
   - body computed from non-@State, non-@Published values that change outside SwiftUI.
   - Expensive operations in body (sorting, filtering large arrays): move to
     computed properties on the ViewModel or use .task { } for async work.

3. LIFECYCLE HOOKS
   - .onAppear: correct for view-visible triggers but fires again on navigation return.
     Use .task { } for async work that should be cancellable and lifecycle-aware.
   - .onDisappear: ensure async tasks are cancelled; use structured concurrency.

4. ENVIRONMENT
   - @EnvironmentObject without ensuring injection — causes runtime crash if missing.
   - Overuse of @EnvironmentObject for data not needed by every child.

5. ANIMATIONS
   - Animations triggered by @Published changes: wrap in withAnimation { } at the
     call site, not inside the view.
   - matchedGeometryEffect: requires @Namespace in the parent view, not the child.

For each issue: view name, property/modifier, what causes the redraw, and the fix.
```
