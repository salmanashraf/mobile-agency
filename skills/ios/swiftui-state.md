# Skill — SwiftUI State Management Review

**Platform:** iOS / macOS (SwiftUI)  
**Category:** Code Quality  
**Composable With:** agents/ios/swift-reviewer/agent.md, skills/ios/swift-review.md

---

## Purpose

Focuses review on SwiftUI-specific state management mistakes — the most common source of bugs in SwiftUI apps. Covers property wrapper selection, view re-render costs, and lifecycle pitfalls.

## When to Use

- Reviewing a SwiftUI View file for correctness
- When components exhibit unexpected re-renders or stale state
- When onboarding a developer new to SwiftUI state management

---

## Skill Prompt

```
When reviewing SwiftUI code, enforce these state management rules:

PROPERTY WRAPPER SELECTION
- @State: local, ephemeral, value-type UI state owned by this view. Never use for reference
  types — use @StateObject instead.
- @StateObject: owns a reference-type ObservableObject. Created once for the view's lifetime.
  ONLY use in the view that creates the object. Never pass an @StateObject down as @StateObject.
- @ObservedObject: observes an ObservableObject it does NOT own. Use when the parent creates
  the object and passes it down. If the parent is destroyed and recreated, the @ObservedObject
  may be reset — flag this as a bug if the state must survive parent recreation.
- @EnvironmentObject: injection through the view hierarchy. Flag if injected but never consumed,
  or if used in deeply nested views without a clear injection point.
- @Binding: two-way connection to a parent's @State. Flag if used to mutate parent state in
  a way that creates a callback loop (child mutates binding → parent re-renders → child re-renders).
- @AppStorage / @SceneStorage: persistent storage. Flag if used for large objects (>1KB) —
  use it only for primitives and small strings.

EXPENSIVE VIEW BODY
- body must be a pure function of state. Flag any: network calls, file I/O, heavy computation,
  or object instantiation directly in body (not in a .task, .onAppear, or @StateObject).
- Flag ForEach or List over large collections where items are not Identifiable with stable IDs.
- Flag animation code that runs unconditionally in body — use withAnimation { } or .animation() modifier.

LIFECYCLE PITFALLS
- .onAppear fires every time the view appears (tab switch, modal dismiss, navigation push/pop).
  If the intent is "run once on first appear," use a @State Bool flag or .task (which respects
  the view's lifetime and cancels on disappear).
- .task is preferred over .onAppear for async work — it is automatically cancelled when the
  view disappears.
- Do not use DispatchQueue.main.async inside .task — the task already runs on the MainActor.

EQUATABLE AND RE-RENDER OPTIMIZATION
- Views with complex, stable subviews should conform to Equatable and use .equatable()
  modifier to prevent unnecessary re-renders when parent state changes but this view's inputs don't.
- Flag @ObservedObject properties where only one property is actually used — consider splitting
  the ObservableObject or using Combine to observe a single publisher.

For each issue: state the property/modifier/location, what is wrong, and the corrected SwiftUI code.
```

---

## Example

**Input:**
```
struct ProfileView: View {
    @ObservedObject var viewModel = ProfileViewModel()

    var body: some View {
        VStack {
            Text(viewModel.name)
        }
        .onAppear {
            viewModel.loadProfile()
        }
    }
}
```

**Output:**
```
Line 2 — @ObservedObject used where @StateObject is required
  Problem: @ObservedObject var viewModel = ProfileViewModel() creates a new ProfileViewModel
           on every re-render of the parent that contains ProfileView. The ViewModel loses its
           state whenever the parent re-renders, causing loadProfile() to re-fire and losing
           any in-progress state.
  Fix: @StateObject private var viewModel = ProfileViewModel()
       @StateObject guarantees the ViewModel is created once for the view's lifetime.

Line 7 — .onAppear fires on every appear, not just once
  Problem: If ProfileView appears multiple times (e.g., tab switch), loadProfile() fires
           each time, causing redundant network calls and potential state resets.
  Fix: Replace .onAppear with .task for async work (auto-cancelled on disappear),
       or add a guard inside loadProfile() to skip if already loaded.
  .task {
      await viewModel.loadProfile()
  }
```

---

## Composition Example

```
Combine with skills/ios/swift-review.md for a full Swift + SwiftUI review:

[paste swift-review.md skill prompt]
[paste swiftui-state.md skill prompt]

Now review this SwiftUI file: [paste file]
```

---

## Notes

- @Observable (Swift 5.9 / iOS 17+) replaces ObservableObject in new code. If the project targets iOS 17+, suggest migration.
- The Equatable conformance optimization is most impactful in complex list cell views — measure with Instruments before applying widely.
