# Prompt — Migrate Combine to async/await

**Platform:** iOS (Swift)  
**Category:** Code Quality  
**Type:** one-shot

---

## Purpose

Migrates a Combine publisher chain to Swift async/await. Produces idiomatic Swift 5.5+ code that is easier to read, test, and cancel.

---

## Prompt

```
You are a senior iOS engineer. Migrate the Combine publisher chain below to Swift async/await
and structured concurrency.

Migration rules:
1. Replace AnyPublisher<T, Error> return types with async throws -> T.
2. Replace sink(receiveCompletion:receiveValue:) with try await.
3. Replace flatMap with sequential await calls or async let for parallel work.
4. Replace Publishers.CombineLatest with async let for parallel fetching.
5. Replace debounce with Task.sleep or a debounce helper.
6. Replace PassthroughSubject / CurrentValueSubject for state with Actor or @Published on @MainActor class.
7. Store cancellables → store Task handles; cancel with task.cancel().
8. If a stream of values is needed (not a one-shot), use AsyncStream or AsyncThrowingStream.
9. Add structured cancellation: wrap top-level calls in a Task stored as a property; cancel in deinit or onDisappear.
10. Preserve error handling — map publisher failure types to thrown errors.

For each transformation: show before (Combine) and after (async/await) side by side.
Explain any non-obvious decisions (why AsyncStream vs single await, why async let vs sequential, etc.).

Combine code to migrate:
```
[PASTE YOUR COMBINE CODE HERE]
```
```

---

## Example Usage

**What you paste:**
```
Combine code to migrate:
```
class SearchViewModel: ObservableObject {
    @Published var results: [SearchResult] = []
    private var cancellables = Set<AnyCancellable>()

    func search(query: String) {
        searchService.search(query: query)
            .debounce(for: .milliseconds(300), scheduler: DispatchQueue.main)
            .flatMap { [weak self] results in
                guard let self else { return Empty<[EnrichedResult], Error>().eraseToAnyPublisher() }
                return self.enrichmentService.enrich(results)
            }
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { _ in },
                receiveValue: { [weak self] in self?.results = $0 }
            )
            .store(in: &cancellables)
    }
}
```
```

**Expected output:**
```swift
// Before (Combine):
func search(query: String) {
    searchService.search(query: query)
        .debounce(for: .milliseconds(300), scheduler: DispatchQueue.main)
        .flatMap { results in enrichmentService.enrich(results) }
        .receive(on: DispatchQueue.main)
        .sink(receiveCompletion: { _ in }, receiveValue: { self?.results = $0 })
        .store(in: &cancellables)
}

// After (async/await):
@MainActor
class SearchViewModel: ObservableObject {
    @Published var results: [SearchResult] = []
    private var searchTask: Task<Void, Never>?

    func search(query: String) {
        searchTask?.cancel()  // cancel previous search before starting new one
        searchTask = Task {
            try? await Task.sleep(for: .milliseconds(300))  // debounce
            guard !Task.isCancelled else { return }

            do {
                let rawResults = try await searchService.search(query: query)
                let enriched = try await enrichmentService.enrich(rawResults)
                results = enriched  // @MainActor guarantees main thread
            } catch is CancellationError {
                // User typed again — ignore silently
            } catch {
                // Handle search/enrich failure
                results = []
            }
        }
    }
}

// Why async let wasn't used here:
// enrichmentService.enrich() depends on the output of searchService.search() —
// they must run sequentially, not in parallel. async let is for INDEPENDENT parallel work.
// Example of async let (if search and a separate "trending" call ran in parallel):
//   async let searchResults = searchService.search(query: query)
//   async let trending = trendingService.fetch()
//   results = try await searchResults + trending
```

---

## Variations

- **PassthroughSubject → AsyncStream:** Add "The Combine code uses a PassthroughSubject to broadcast events. Migrate to AsyncStream<Event> and an async for loop."
- **CombineLatest → async let:** Add "The code combines two publishers. Use async let to fetch both values in parallel and combine them."
