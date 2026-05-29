# Skill — iOS Networking

**Platform:** iOS / macOS (Swift)  
**Category:** Code Quality  
**Composable With:** agents/ios/swift-reviewer/agent.md, skills/shared/security-scan.md

---

## Purpose

Reviews iOS networking code for correctness, safety, and idiomatic Swift patterns. Covers URLSession, async/await, error handling, response decoding, certificate pinning, and cancellation.

## When to Use

- Reviewing any class that makes HTTP requests
- When migrating Alamofire or Combine networking to async/await
- As a pre-code-review checklist for API client classes

---

## Skill Prompt

```
When reviewing iOS Swift networking code, enforce these rules:

ASYNC/AWAIT PATTERNS
- Prefer URLSession.shared.data(from:) async throws over dataTask completion handlers in new code.
- Flag completion handler callbacks that aren't marked @escaping when they outlive the call site.
- For cancellable requests, store a Task handle as a property and cancel in deinit or onDisappear:
  private var fetchTask: Task<Void, Never>?
  func load() { fetchTask?.cancel(); fetchTask = Task { try? await fetch() } }
- Do not use URLSession in a struct that can be copied — retain the Task handle in a class or actor.

ERROR HANDLING
- Network errors should be modelled as a typed enum, not raw Error or String:
  enum NetworkError: Error { case invalidResponse(Int), decodingFailed(Error), noConnection }
- Flag catch { } with no body — silently swallowed network errors mask bugs.
- Flag `try?` on network calls — it silently discards all error information. Use `do/catch`.
- HTTP status codes must be checked: a 404 or 500 returns a URLResponse, not an error.
  guard let httpResponse = response as? HTTPURLResponse,
        (200..<300).contains(httpResponse.statusCode) else { throw NetworkError.invalidResponse(code) }

DECODING
- Always decode on a background thread, not MainActor, then publish the result on Main:
  let decoded = try JSONDecoder().decode(T.self, from: data)  // runs on caller's context
  await MainActor.run { self.result = decoded }
- Use codingKeys or a custom dateDecodingStrategy — never rely on default ISO8601 parsing
  without explicitly setting it: decoder.dateDecodingStrategy = .iso8601
- Flag forced try! on JSONDecoder().decode() — server responses can always be malformed.

SECURITY
- Flag URLSession configurations with URLSessionConfiguration that disables TLS validation:
  session.delegate implementing didReceive challenge without real certificate evaluation → MitM risk.
- Flag http:// (cleartext) base URLs — use https:// exclusively.
- For sensitive endpoints (auth, payment), certificate pinning must be implemented in
  URLSession.urlSession(_:didReceive:completionHandler:).

THREADING
- URLSession completion handlers run on an arbitrary background queue by default.
  Any UI update after a completion handler must be dispatched to the main queue.
  With async/await + @MainActor, this is handled automatically — prefer it.
- Flag URLSession.shared used in extensions or when a custom configuration is needed
  (timeouts, caching policy, background transfers) — create a dedicated session instead.

MEMORY
- URLSession holds a strong reference to its delegate. The delegate must NOT hold a strong
  reference back to the session object — this creates a retain cycle.
  Fix: make the delegate weak (if possible) or use URLSession(configuration:) without a delegate
  and use async/await instead.

For each issue: state the file/line, what is wrong, the risk, and the corrected Swift snippet.
```

---

## Example

**Input:**
```swift
func fetchUser(id: String) {
    URLSession.shared.dataTask(with: URL(string: "http://api.example.com/users/\(id)")!) { data, _, _ in
        if let data = data {
            self.user = try! JSONDecoder().decode(User.self, from: data)
        }
    }.resume()
}
```

**Output:**
```
Line 2 — Cleartext HTTP URL
  Risk: All traffic is intercepted in plaintext. Use https://.

Line 2 — Force unwrap on URL(string:)
  Risk: If the URL string is ever malformed (bad id encoding), the app crashes.
  Fix: guard let url = URL(string: "https://api.example.com/users/\(id)") else { return }

Line 3 — No HTTP status code check
  Risk: A 404 or 500 response will appear as "success" — the body may not be a User.

Line 3 — Strong self capture in completion handler (retain cycle risk)
  Risk: If self is deallocated before the network call completes, accessing self.user crashes (if unowned) or leaks (if strong).
  Fix: [weak self] guard let self else { return }

Line 4 — try! on JSONDecoder
  Risk: If the server returns an error body or schema changes, the app crashes.
  Fix: do { self.user = try JSONDecoder().decode(User.self, from: data) } catch { /* handle */ }

Line 3 — UI mutation on background queue
  Risk: self.user likely drives the UI. Mutating it off the main thread is a data race.
  Fix: DispatchQueue.main.async { self.user = decoded }

Idiomatic async/await replacement:
  @MainActor
  func fetchUser(id: String) async throws {
      guard let url = URL(string: "https://api.example.com/users/\(id)") else { return }
      let (data, response) = try await URLSession.shared.data(from: url)
      guard let http = response as? HTTPURLResponse, (200..<300).contains(http.statusCode) else {
          throw NetworkError.invalidResponse((response as? HTTPURLResponse)?.statusCode ?? 0)
      }
      user = try JSONDecoder().decode(User.self, from: data)
  }
```

---

## Composition Example

```
Combine with skills/shared/security-scan.md for a full networking security audit:
[paste networking skill] + [paste security-scan skill] → paste your API client class.
```

---

## Notes

- Alamofire adds its own validation layer (`validate()`) — when reviewing Alamofire code, check that `.validate()` is called on every request chain.
- Background URLSession (for large uploads/downloads) requires a separate `URLSessionConfiguration.background(withIdentifier:)` — document this if used.
