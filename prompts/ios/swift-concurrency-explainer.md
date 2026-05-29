# Prompt — Swift Concurrency Explainer

**Platform:** iOS / macOS (Swift)  
**Category:** Documentation / Code Quality  
**Type:** one-shot

---

## Purpose

Explains Swift async/await, actors, and Sendable in a given code block in plain English — ideal for onboarding developers new to Swift concurrency.

---

## Prompt

```
You are a senior iOS engineer explaining Swift concurrency to a developer who knows Swift
basics but is new to async/await and actors.

For the code below, explain:
1. Which functions are asynchronous and why (what would block if they were synchronous).
2. What `await` means at each call site — what the thread does while waiting.
3. If actors are used: what state they protect and why that's important.
4. If @MainActor is used: why that annotation is there and what happens without it.
5. Threading: which thread does each part of the code run on?
6. Cancellation: can this code be cancelled? What happens if it is?
7. Any potential issues (data races, unstructured Tasks, missing error handling).

Use simple analogies where helpful. Do not use jargon without explaining it first.

Code to explain:
```
[PASTE YOUR SWIFT CODE HERE]
```
```

---

## Example Usage

**What you paste:**
```
Code to explain:
```
@MainActor
class ProfileViewModel: ObservableObject {
    @Published var profile: Profile?
    @Published var error: String?
    private let service: ProfileService

    init(service: ProfileService) { self.service = service }

    func loadProfile(id: String) async {
        do {
            profile = try await service.fetchProfile(id: id)
        } catch {
            self.error = error.localizedDescription
        }
    }
}
```
```

**Expected output:**
```
Here's what's happening in this code:

1. @MainActor — The Whole Class Lives on the Main Thread
   The @MainActor annotation means every method and property in this class runs on
   the main thread (the UI thread). This is important because @Published properties
   (profile, error) drive the SwiftUI UI — changing them from a background thread
   would cause crashes or visual glitches.

2. func loadProfile(id:) async — This Is an Async Function
   The `async` keyword means this function can pause without blocking the thread.
   Think of it like a restaurant waiter: instead of standing at the kitchen door
   waiting for the food (blocking), the waiter takes other orders while the kitchen
   works (non-blocking).

3. try await service.fetchProfile(id:) — The Pause Point
   `await` is where the pause happens. When the code hits this line:
   - The function suspends (pauses)
   - The main thread is FREED to do other work (update the UI, respond to taps)
   - When fetchProfile finishes (network call returns), the function resumes on the main thread
   - This is why `profile = ...` after the await is safe — we're back on @MainActor

4. Threading Summary:
   loadProfile starts on: Main thread (@MainActor)
   During await fetchProfile: Main thread is free; fetchProfile likely runs on a background thread internally
   After await completes: Resumes on Main thread
   profile = ... assignment: Main thread ✓ (safe for @Published)

5. Error Handling:
   The do/catch wraps the await — if fetchProfile throws (network error, decoding failure,
   etc.), the catch block runs and stores the error message. The function doesn't crash —
   it handles the failure gracefully.

6. Cancellation:
   async functions support Swift structured concurrency cancellation. If the Task that
   calls loadProfile is cancelled (e.g., the view disappears), a cancellation error is
   thrown at the await point. This code catches it in the generic catch block and shows
   it as an error message — consider checking for CancellationError specifically and
   ignoring it:
   } catch is CancellationError {
       // User navigated away — do nothing
   } catch {
       self.error = error.localizedDescription
   }

7. One Potential Issue:
   This ViewModel doesn't expose a way to cancel an in-flight loadProfile call. If the
   user triggers loadProfile twice quickly, both calls run concurrently and the last one
   to finish "wins" — the earlier result may briefly flash before being overwritten.
   Fix: store a Task handle and cancel it before starting a new one:
   private var loadTask: Task<Void, Never>?
   func loadProfile(id: String) {
       loadTask?.cancel()
       loadTask = Task { await _loadProfile(id: id) }
   }
```

---

## Variations

- **For actors:** Add "Also explain what the actor keyword protects and when you need `await` to access actor-isolated state."
- **For Sendable:** Add "Explain why Sendable conformance is required and what happens if a non-Sendable type crosses actor boundaries."
