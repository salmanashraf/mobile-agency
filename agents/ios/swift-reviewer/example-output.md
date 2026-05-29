# Example Output — iOS Swift Code Reviewer

Full agent response to the input in [`example-input.md`](example-input.md).

---

```
REVIEW SUMMARY
==============
File: Sources/Profile/ProfileViewModel.swift
Layer: ViewModel
Issues Found: 5
Critical: 3  Warning: 2  Info: 0

FINDINGS
--------

[CRITICAL] Line 38 — Strong self capture in fetchUser completion (retain cycle + threading)
  Problem : The closure captures `self` strongly with no capture list. If `ProfileService`
            retains the completion block (standard for async operations), a retain cycle
            forms: ViewModel → Service → completion → ViewModel. Neither will be deallocated.
            Additionally, the callback fires on `DispatchQueue.global()`, but `self.user = user`
            mutates a `@Published` property — this must happen on the Main thread or it causes
            a data race and undefined behavior in SwiftUI.
  Fix     :
  service.fetchUser(id: id) { [weak self] result in
      guard let self else { return }
      DispatchQueue.main.async {
          switch result {
          case .success(let user): self.user = user
          case .failure(let error): self.error = error.localizedDescription
          }
      }
  }
  Better: migrate to async/await (see INFO below).

[CRITICAL] Line 46 — Force unwrap on jpegData(compressionQuality:)
  Problem : `UIImage.jpegData(compressionQuality:)` returns `Data?` — it can return nil
            for image formats that cannot be JPEG-encoded (some CGImage configurations)
            or under memory pressure. The `!` will crash at runtime with:
            "Unexpectedly found nil while implicitly unwrapping an Optional value."
  Fix     :
  guard let data = image.jpegData(compressionQuality: 0.8) else {
      self.error = "Failed to encode image for upload"
      return
  }
  Note: also prefer 0.8 compression quality over 1.0 to reduce upload size and memory.

[CRITICAL] Line 47 — [unowned self] in escaping upload completion (crash after dealloc)
  Problem : `[unowned self]` does NOT nil-check before access. If the ViewModel is
            deallocated before the upload callback fires (e.g., user dismisses the screen),
            accessing `self` via an unowned reference causes an EXC_BAD_ACCESS crash.
            Network callbacks are inherently async — the ViewModel cannot guarantee it
            outlives them.
  Fix     :
  service.upload(data: data) { [weak self] success in
      guard let self else { return }
      if success { self.user?.avatarUpdated = true }
  }

[WARNING]  Line 35 — Concrete ProfileService type (not injectable, not testable)
  Problem : `let service = ProfileService()` constructs a concrete dependency directly.
            Unit-testing ProfileViewModel requires hitting the real ProfileService (and
            its network calls). There is no way to inject a mock.
  Fix     : Declare the service using the protocol type and inject via initializer:
  private let service: ProfileServiceProtocol

  init(service: ProfileServiceProtocol = ProfileService()) {
      self.service = service
  }
  Now tests can pass MockProfileService(). The default argument keeps callsites unchanged.

[WARNING]  Lines 38–44 — Completion-handler API should be migrated to async/await
  Problem : Completion handlers are the legacy Swift concurrency model. async/await:
            - Eliminates the retain cycle risk in closures
            - Handles `@MainActor` automatically when the ViewModel is annotated
            - Supports structured cancellation
            - Is significantly more readable
  Fix     :
  @MainActor
  class ProfileViewModel: ObservableObject {
      @Published var user: User?
      @Published var error: String?
      private let service: ProfileServiceProtocol

      init(service: ProfileServiceProtocol = ProfileService()) {
          self.service = service
      }

      func loadUser(id: String) async {
          do {
              user = try await service.fetchUser(id: id)
          } catch {
              self.error = error.localizedDescription
          }
      }

      func uploadAvatar(image: UIImage) async {
          guard let data = image.jpegData(compressionQuality: 0.8) else {
              error = "Failed to encode image"
              return
          }
          let success = try? await service.upload(data: data)
          if success == true { user?.avatarUpdated = true }
      }
  }

MEMORY SAFETY
-------------
Retain cycles detected: Yes
  → Strong self capture in fetchUser completion (line 38).
unowned misuse detected: Yes
  → [unowned self] in upload callback (line 47) — can crash after ViewModel dealloc.

CONCURRENCY
-----------
Actor isolation issues: Yes
  → @Published properties mutated on DispatchQueue.global() background thread (lines 40–41).
    Add @MainActor to the class or dispatch mutations explicitly to the main queue.
Sendable conformance gaps: No

TESTABILITY SCORE: 3/10
  → Concrete service type and completion-handler API make unit testing require real network calls.
    After applying the warning fixes, testability rises to ~8/10.

OVERALL VERDICT: NEEDS WORK
```
