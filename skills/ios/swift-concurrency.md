# Skill — /swift-concurrency

**Platform:** iOS (Swift)
**Slash Command:** `/swift-concurrency`

---

## Purpose

Safely converts completion handler callbacks to Swift async/await. Handles nested callbacks, error mapping, DispatchQueue patterns, and Combine pipelines.

---

## Skill Prompt

```
Convert the provided Swift completion handler code to async/await safely:

CONVERSION PATTERNS:
1. Simple callback → async function:
   func fetchUser(id: String, completion: @escaping (User?, Error?) -> Void)
   → func fetchUser(id: String) async throws -> User

2. Result-based callback → async throws:
   func loadData(completion: @escaping (Result<Data, Error>) -> Void)
   → func loadData() async throws -> Data

3. Nested callbacks → sequential await:
   Flatten callback pyramids into sequential async calls.

4. DispatchQueue.main.async callback → @MainActor:
   func updateUI() { DispatchQueue.main.async { self.label.text = "done" } }
   → @MainActor func updateUI() { label.text = "done" }

5. Withstand continuations for legacy APIs:
   Use withCheckedThrowingContinuation for APIs you can't change:
   func legacyFetch() async throws -> Data {
       try await withCheckedThrowingContinuation { continuation in
           legacyAPI.fetch { data, error in
               if let error { continuation.resume(throwing: error) }
               else { continuation.resume(returning: data!) }
           }
       }
   }

6. Combine → AsyncStream / async sequence:
   publisher.values async sequence in for await loops.

SAFETY CHECKLIST:
- [ ] continuation.resume called exactly once (not zero, not twice)
- [ ] No @escaping closures capturing self strongly after async conversion
- [ ] @MainActor added to functions that update UI
- [ ] Task { } used only when fire-and-forget is intentional; add error handling

Show before and after for each function converted. Flag any pattern that cannot be
safely converted without changing the calling contract.
```
