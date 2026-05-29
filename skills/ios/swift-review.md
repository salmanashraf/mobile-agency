# Skill — Swift Code Review

**Platform:** iOS / macOS (Swift)  
**Category:** Code Quality  
**Composable With:** agents/ios/swift-reviewer/agent.md

---

## Purpose

Primes an LLM with the most common Swift safety rules for a focused code review session. Use standalone for quick reviews or compose into the full Swift Reviewer agent.

## When to Use

- Quick inline review of a Swift class during a pair-programming session
- When you want only memory safety and concurrency checks, not the full structured report
- As a pre-commit hook prompt for Swift files

---

## Skill Prompt

```
When reviewing Swift code, enforce these rules:

MEMORY SAFETY (ARC)
- Every escaping closure that captures self must use [weak self] unless there is an explicit
  documented reason to use [unowned self]. Unowned is only safe when self is guaranteed to
  outlive the closure (e.g., non-escaping closures, closures stored inside self).
- After [weak self], always guard let self = self else { return } before accessing self.
- Flag every delegate property that is not declared weak — strong delegates create retain cycles.
- Flag NotificationCenter observers not removed in deinit (use addObserver with a token
  and store it as a property for automatic cleanup).

FORCE UNWRAP
- Every ! operator is a candidate for removal.
- Preferred alternatives:
  guard let x = optional else { return/throw/break }
  optional ?? defaultValue
  if let x = optional { ... }
- The only acceptable ! is in @IBOutlet and in unit test assertions.

MAIN THREAD SAFETY
- All UIKit/SwiftUI mutations must occur on the main thread.
- Flag any DispatchQueue.global().async block that writes to a @Published property,
  UILabel, UIImageView, or any UI element without DispatchQueue.main.async wrapping.
- Prefer @MainActor annotation on ObservableObject classes over scattered DispatchQueue.main.async.

CONCURRENCY (Swift 5.9+)
- Prefer async/await over completion handlers for new code.
- Flag Task.detached — it loses the actor context and should be used only with explicit justification.
- Flag unstructured Task { } in view bodies — use .task { } modifier instead (auto-cancelled on disappear).
- Sendable conformance: types shared across actors must be Sendable or @unchecked Sendable with a comment.

TESTABILITY
- No singletons accessed directly: NetworkManager.shared, DatabaseManager.shared accessed
  from within a class under test make it untestable — inject via protocol.
- All testable classes should accept dependencies via init parameters with protocol types.

For each issue: state the line or property name, what is wrong, and the corrected Swift snippet.
```

---

## Example

**Input (after applying skill):**
```
Review this Swift class:

class ImageLoader: ObservableObject {
    @Published var image: UIImage?

    func load(url: URL) {
        URLSession.shared.dataTask(with: url) { data, _, _ in
            if let data = data {
                self.image = UIImage(data: data)  // Main thread violation
            }
        }.resume()
    }
}
```

**Output:**
```
Line 6 — Strong self capture in completion handler
  Problem: self.image is a @Published property that drives SwiftUI/UIKit updates.
           Assigning it from a background URLSession callback is a main thread violation.
  Fix:
  URLSession.shared.dataTask(with: url) { [weak self] data, _, _ in
      guard let self, let data = data else { return }
      DispatchQueue.main.async {
          self.image = UIImage(data: data)
      }
  }.resume()

Better — use async/await instead:
  @MainActor
  func load(url: URL) async throws {
      let (data, _) = try await URLSession.shared.data(from: url)
      image = UIImage(data: data)
  }
  // @MainActor guarantees all property mutations are on the main thread.
```

---

## Composition Example

```
Prepend this skill prompt before the Swift Code Reviewer system prompt to add
ARC, force-unwrap, and concurrency checks alongside the full structured output.

Or use standalone: paste this skill, then paste your Swift class and ask
"Review this for the issues listed above."
```

---

## Notes

- Swift 6 strict concurrency makes many of these runtime errors into compile-time errors.
  Set `SWIFT_STRICT_CONCURRENCY = complete` in your Xcode build settings to catch them early.
- Objective-C interop files may require @objc annotations — the skill does not cover ObjC patterns.
