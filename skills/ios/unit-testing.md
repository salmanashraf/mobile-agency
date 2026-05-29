# Skill — iOS Unit Testing

**Platform:** iOS / macOS (Swift)  
**Category:** Code Quality  
**Composable With:** agents/ios/swift-reviewer/agent.md, skills/ios/swift-review.md

---

## Purpose

Reviews iOS unit tests (XCTest and Swift Testing) and guides generation of new tests. Covers async test patterns, mocking, isolation, and test naming conventions.

## When to Use

- When reviewing or writing tests for ViewModels, services, or use cases
- When onboarding a developer new to Swift Testing (iOS 17+)
- As a checklist before merging code with new untested logic

---

## Skill Prompt

```
When reviewing or writing iOS unit tests, enforce these rules:

FRAMEWORK SELECTION
- iOS 17+ / Swift 5.9+: prefer Swift Testing (@Test, @Suite, #expect, #require).
  It is more expressive, supports parameterized tests, and integrates with Xcode 16.
- iOS 16 and below: use XCTest (XCTestCase, XCTAssertEqual, async throws methods).
- Do not mix frameworks in the same test target — pick one and be consistent.

SWIFT TESTING PATTERNS (@Test)
- Use #expect() for soft assertions (test continues on failure).
  Use #require() for hard assertions (test stops on failure, like XCTUnwrap).
- Name tests as plain sentences: @Test("returns nil when userId is empty")
- Parameterized tests: @Test("validates email", arguments: ["", "bad", "a@b.com"])
  func validateEmail(_ email: String) { ... }
- Group related tests: @Suite("ProfileViewModel") struct ProfileViewModelTests { }
- Async tests: mark the @Test func as async — no extra setup needed.
  @Test func fetchProfileSucceeds() async throws { ... }

XCTEST PATTERNS
- Async tests: func testFetchProfile() async throws { ... } — no XCTestExpectation needed for async throws.
- For Combine publishers: use XCTestExpectation + sink, or use the async sequence publisher.
- @MainActor on the test class if testing @MainActor-isolated code:
  @MainActor final class ProfileViewModelTests: XCTestCase { }

MOCKING
- Use protocol-based dependencies for all testable classes. Never mock concrete types.
  protocol ProfileServiceProtocol { func fetchProfile(id: String) async throws -> Profile }
  struct MockProfileService: ProfileServiceProtocol { var result: Result<Profile, Error> }
- Mocks should be minimal structs defined in the test file, not external libraries.
- Avoid Sourcery, SwiftMock, or OHHTTPStubs for unit tests — they add fragility.
  Use URLProtocol subclasses for integration tests that hit URLSession.

TEST ISOLATION
- Each test must set up its own dependencies in setUp / @Test init — never share mutable state across tests.
- Avoid singletons in tests — inject all dependencies. If testing a singleton, reset it in tearDown.
- Use @TestStorage (Swift Testing) or static properties reset in setUp/tearDown to isolate global state.

ASSERTIONS
- Assert behavior, not implementation. Test what the system does, not how it does it.
  Good: #expect(viewModel.state == .loaded(user))
  Bad: #expect(mockService.fetchWasCalled == true) — tests the mock, not the ViewModel.
- Test the unhappy path equally: empty input, network error, decoding failure, cancellation.
- For async state (StateFlow, @Published): collect the state sequence with a timeout,
  don't sleep(0.1) hoping the state has settled.

NAMING
- XCTest: func testGivenEmptyId_whenFetchCalled_thenReturnsError()
- Swift Testing: @Test("returns error when id is empty")
- One behavior per test. If a test method has two XCTAssert calls for unrelated things, split it.

For each issue found: state the test name, what is wrong, and the corrected test code.
```

---

## Example

**Input:**
```swift
class ProfileViewModelTests: XCTestCase {
    func testLoad() async {
        let vm = ProfileViewModel(service: ProfileService())  // real service
        await vm.loadProfile(id: "1")
        XCTAssertNotNil(vm.profile)
        XCTAssertNil(vm.errorMessage)
        XCTAssertEqual(vm.state, .loaded)  // 3 assertions for same scenario
    }
}
```

**Output:**
```
testLoad — uses real ProfileService (not a mock)
  Problem: The test hits the real network. It will fail in CI, be slow, and be non-deterministic.
  Fix: Inject a MockProfileService that returns a canned result.

testLoad — three assertions in one test
  Problem: If the first assert fails, the others don't run, hiding additional failures.
  Fix: One assertion per test, or use one assertion that covers the whole expected state.

Corrected:
  struct MockProfileService: ProfileServiceProtocol {
      var result: Result<Profile, Error> = .success(Profile(id: "1", name: "Alice"))
      func fetchProfile(id: String) async throws -> Profile {
          try result.get()
      }
  }

  @MainActor
  final class ProfileViewModelTests: XCTestCase {
      func testLoadSucceeds() async throws {
          let vm = ProfileViewModel(service: MockProfileService())
          await vm.loadProfile(id: "1")
          XCTAssertEqual(vm.profile?.name, "Alice")
      }

      func testLoadSetsErrorOnFailure() async throws {
          let service = MockProfileService(result: .failure(URLError(.notConnectedToInternet)))
          let vm = ProfileViewModel(service: service)
          await vm.loadProfile(id: "1")
          XCTAssertNotNil(vm.errorMessage)
          XCTAssertNil(vm.profile)
      }
  }
```

---

## Composition Example

```
Use before generating tests with prompts/ios/generate-unit-test.md:
paste this skill → paste the class to test → "generate a unit test following these rules."
```

---

## Notes

- Swift Testing is available from Xcode 16 / iOS 17+ minimum deployment target. For older targets, stick with XCTest.
- `@MainActor` on the test class is required when the ViewModel under test is `@MainActor` — otherwise actor isolation warnings become errors in Swift 6.
