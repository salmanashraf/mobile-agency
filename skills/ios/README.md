# iOS Skills

Reusable skill prompt modules for iOS / macOS (Swift / SwiftUI) code reviews and analysis. The most comprehensive platform coverage in the repo — 6 skills covering memory, concurrency, networking, testing, performance, and persistence.

## Index

| Skill | File | When to Use |
|---|---|---|
| Swift Code Review | [swift-review.md](swift-review.md) | ARC retain cycles, `[weak self]`, `[unowned self]`, `@MainActor`, force-unwrap |
| SwiftUI State Management | [swiftui-state.md](swiftui-state.md) | `@State`/`@StateObject`/`@ObservedObject` selection, expensive `body`, lifecycle |
| iOS Networking | [networking.md](networking.md) | URLSession, async/await, HTTP status checks, certificate pinning, threading |
| iOS Unit Testing | [unit-testing.md](unit-testing.md) | Swift Testing vs XCTest, async tests, mocking with protocols |
| iOS Performance | [performance.md](performance.md) | Main thread blocking, Core Data N+1, image decoding, background task expiration |
| iOS Data Persistence | [data-persistence.md](data-persistence.md) | UserDefaults vs Keychain vs Core Data vs SwiftData, file encryption |

## Usage

Paste a skill prompt at the start of any LLM session:

```
# Focused review
[paste skill prompt from swift-review.md]

Now review this Swift class: [paste code]
```

## Composable Pattern

Combine skills for a comprehensive review:

```
[paste swift-review.md skill]
[paste swiftui-state.md skill]

Review this SwiftUI ViewModel: [paste code]
```

## Composable With

- [`agents/ios/swift-reviewer`](../../agents/ios/swift-reviewer/) — full structured review
- [`agents/ios/crash-analyzer`](../../agents/ios/crash-analyzer/) — crash debugging

## Contributing

New skills for iOS should cover one concern. Ideas: `combine-patterns.md`, `observable-macro.md` (iOS 17+), `swift-testing-advanced.md`. Copy `templates/skill-template.md`.
