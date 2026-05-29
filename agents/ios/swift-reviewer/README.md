# iOS Swift Code Reviewer Agent

> Paste a Swift file. Get a structured CRITICAL / WARNING / INFO review covering ARC memory safety, Swift concurrency, SwiftUI state, force-unwrap removal, and testability.

---

## What This Agent Does

Reviews Swift and SwiftUI source files across six dimensions:

- **ARC memory safety** — retain cycles in closures (`[weak self]` vs `[unowned self]`), delegate leak patterns, `NotificationCenter` observer cleanup
- **Concurrency** — `@MainActor` annotation correctness, `async/await` vs completion handlers, `Task.detached` misuse, actor isolation violations
- **SwiftUI state** — `@State`/`@StateObject`/`@ObservedObject`/`@EnvironmentObject` selection, expensive `body` computations, lifecycle pitfalls
- **Force unwrap** — every `!` operator flagged with a safe alternative
- **Testability** — protocol-based dependencies, no singletons in testable code, injectable services
- **Idiomatic Swift** — `guard let`, `if let`, `??`, completion handlers vs async, `Sendable` gaps

---

## Files

| File | Purpose |
|---|---|
| [`agent.md`](agent.md) | Input format, output format, full system prompt |
| [`example-input.md`](example-input.md) | ProfileViewModel.swift with memory and concurrency issues |
| [`example-output.md`](example-output.md) | Full CRITICAL/WARNING/INFO review |

---

## Quick Start

```
PLATFORM: iOS
SWIFT_VERSION: 5.10
SWIFTUI: true
FILE_PATH: Sources/Profile/ProfileViewModel.swift
CODE:
[paste your Swift file]
```

---

## Output Preview

```
REVIEW SUMMARY
==============
File: Sources/Profile/ProfileViewModel.swift
Layer: ViewModel
Issues Found: 5  |  Critical: 2  Warning: 2  Info: 1

[CRITICAL] Line 10 — Strong self capture in completion handler (retain cycle risk)
  Problem : Capturing self strongly in fetchUser closure creates a retain cycle.
  Fix     : service.fetchUser(id: id) { [weak self] result in
                guard let self else { return }
                ...
            }
```

Full example: [`example-output.md`](example-output.md)

---

## Related Agents

- [`agents/ios/crash-analyzer`](../crash-analyzer/) — debug crashes in the reviewed code
- `skills/ios/swift-review.md` — lightweight skill module for quick inline reviews
- `skills/ios/swiftui-state.md` — focused SwiftUI state management checklist
