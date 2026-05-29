# Prompt — Generate iOS Unit Test

**Platform:** iOS (Swift)  
**Category:** Code Quality  
**Type:** one-shot

---

## Purpose

Generates a complete XCTest or Swift Testing unit test for an iOS Swift class (ViewModel, Service, Repository, or UseCase).

---

## Prompt

```
You are a senior iOS engineer. Generate a complete, compilable unit test for the Swift class below.

Choose the test framework based on the deployment target:
- iOS 17+ / Swift 5.9+: use Swift Testing framework (@Test, #expect, #require, @Suite)
- iOS 16 and below: use XCTest (XCTestCase, XCTAssertEqual, async/await with expectation)

Rules:
1. Mock dependencies using protocols — create a minimal mock struct/class inline in the test file.
2. Test names should describe behavior: "loadProfile succeeds when service returns valid data"
3. Cover: happy path, error path, edge cases (empty input, nil, zero).
4. For async functions: use async test methods (Swift Testing natively supports; XCTest needs async throws).
5. For Combine publishers: use XCTestExpectation or swift-async-algorithms.
6. For @Published / StateFlow equivalents: collect values and assert the sequence.
7. Output a complete, standalone test file with all imports and mock types.

Class to test:
```
[PASTE YOUR SWIFT CLASS HERE]
```
```

---

## Example Usage

**What you paste:**
```
Class to test:
```
@MainActor
class ProfileViewModel: ObservableObject {
    @Published var profile: Profile?
    @Published var errorMessage: String?
    private let service: ProfileServiceProtocol

    init(service: ProfileServiceProtocol) { self.service = service }

    func loadProfile(id: String) async {
        do {
            profile = try await service.fetchProfile(id: id)
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
```
```

**Expected output:**
```swift
import Testing
import Foundation
@testable import YourApp

// MARK: - Mock

struct MockProfileService: ProfileServiceProtocol {
    var result: Result<Profile, Error> = .success(Profile(id: "1", name: "Alice"))

    func fetchProfile(id: String) async throws -> Profile {
        switch result {
        case .success(let profile): return profile
        case .failure(let error): throw error
        }
    }
}

// MARK: - Tests

@Suite("ProfileViewModel")
@MainActor
struct ProfileViewModelTests {

    @Test("loads profile successfully when service returns data")
    func loadProfileSuccess() async {
        let service = MockProfileService(result: .success(Profile(id: "1", name: "Alice")))
        let viewModel = ProfileViewModel(service: service)

        await viewModel.loadProfile(id: "1")

        #expect(viewModel.profile?.name == "Alice")
        #expect(viewModel.errorMessage == nil)
    }

    @Test("sets errorMessage when service throws")
    func loadProfileFailure() async {
        let error = URLError(.notConnectedToInternet)
        let service = MockProfileService(result: .failure(error))
        let viewModel = ProfileViewModel(service: service)

        await viewModel.loadProfile(id: "1")

        #expect(viewModel.profile == nil)
        #expect(viewModel.errorMessage != nil)
    }

    @Test("handles empty id gracefully")
    func loadProfileEmptyId() async {
        let service = MockProfileService()
        let viewModel = ProfileViewModel(service: service)

        await viewModel.loadProfile(id: "")

        // Expectation: service is still called; empty ID behavior is service's responsibility
        // If the ViewModel should validate, adjust accordingly
        #expect(viewModel.errorMessage == nil || viewModel.profile != nil)
    }
}
```

---

## Variations

- **For XCTest (iOS 16 targets):** Add "Use XCTestCase. For async tests, mark the test function `async throws`."
- **For Combine publishers:** Add "Use Combine's sink and XCTestExpectation to collect published values."
- **For URLSession network tests:** Add "Use URLProtocol subclass to intercept HTTP requests instead of a mock."
