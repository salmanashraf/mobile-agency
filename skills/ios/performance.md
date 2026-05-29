# Skill — iOS Performance

**Platform:** iOS / macOS (Swift / SwiftUI / UIKit)  
**Category:** Performance & Optimization  
**Composable With:** agents/ios/swift-reviewer/agent.md, skills/ios/swiftui-state.md

---

## Purpose

Reviews iOS code for common performance pitfalls: main thread blocking, expensive view body, Core Data N+1 queries, image loading overhead, and background task misuse. Use as a pre-profiling code review before reaching for Instruments.

## When to Use

- When a screen feels laggy or slow to appear
- Before profiling with Instruments (eliminate obvious issues first)
- When reviewing any code that touches Core Data, images, or the main thread

---

## Skill Prompt

```
When reviewing iOS Swift code for performance, check for:

MAIN THREAD VIOLATIONS
- Disk I/O (FileManager, UserDefaults, CoreData fetch without async) on the main thread blocks
  the UI thread. Any operation that could take >1ms must be on a background actor or DispatchQueue.global().
- URLSession.shared.dataTask result handling that mutates UI without dispatching to main.
- JSONDecoder().decode() on large payloads on the main thread — move to a Task { } or background queue.
- Flag: try FileManager.default.contentsOfDirectory(...) called directly in viewDidLoad or body.

SWIFTUI VIEW BODY
- body is called frequently. It must be a pure, cheap computation.
- Flag: DateFormatter() or NumberFormatter() instantiated inside body — these are expensive to create.
  Fix: store as @State private var formatter = ... or as a static property.
- Flag: sorting, filtering, or mapping large arrays inside body.
  Fix: use .onChange(of:) to recompute and store in @State, or use a ViewModel computed property with caching.
- Flag: body reading from UserDefaults directly — triggers a body re-evaluation on every read
  if wrapped in @AppStorage, but UserDefaults is also synchronous disk access.

CORE DATA / SWIFTDATA
- N+1 query: fetching a list of objects, then accessing a relationship on each object in a loop
  without prefetching. Each relationship access fires a new fetch.
  Fix: set fetchRequest.relationshipKeyPathsForPrefetching = ["items"] to batch-load relationships.
- Fetching on the main context (viewContext) — heavy fetches block the UI.
  Fix: use NSManagedObjectContext.perform { } or fetch on a background context with
  PersistenceController.shared.container.performBackgroundTask { context in ... }
- Saving on every change instead of batching — each save triggers a write to disk.
  Fix: batch saves with a debounced save call or save on significant lifecycle events only.

IMAGE LOADING
- Loading UIImage(named:) for large images synchronously on the main thread blocks rendering.
  Fix: use async image loading (AsyncImage in SwiftUI, or a library like Kingfisher/Nuke).
- Decoding full-resolution images for thumbnail display — decoding a 4K image to show in a 80×80 cell wastes memory and CPU.
  Fix: use ImageIO to decode at target size:
  let options: [CFString: Any] = [kCGImageSourceThumbnailMaxPixelSize: 80,
                                   kCGImageSourceCreateThumbnailFromImageAlways: true]
- Not reusing images — storing UIImage objects without a cache in a list causes repeated disk reads.

BACKGROUND TASKS
- BGTaskScheduler tasks that do work on the main thread inside the task handler.
  Fix: dispatch all work to a background thread inside the handler; call setTaskCompleted() in ALL code paths.
- Long-running background tasks (>30 seconds) that don't call setTaskCompleted() fast enough — watchdog kills the app (0x8badf00d).
- Doing CoreLocation, HealthKit, or CloudKit fetches in a UIBackgroundTask without proper expiration handling.

COLLECTION VIEW / TABLE VIEW
- dequeueReusableCell not called — creating new cells on every cellForRow is O(n) allocation per scroll event.
- Synchronous image loading inside cellForRow/itemForIndexPath — each scroll event blocks the main thread.
  Fix: load images asynchronously and cancel on cell reuse (store the task in prepareForReuse).
- Recalculating cell heights in heightForRowAt with expensive layout passes — cache heights.

For each issue: state the file/line, the performance impact (what it blocks or how often it runs), and the corrected code.
```

---

## Example

**Input:**
```swift
struct PostListView: View {
    let posts: [Post]

    var body: some View {
        let sorted = posts.sorted { $0.date > $1.date }  // every rebuild
        List(sorted) { post in
            Text(DateFormatter().string(from: post.date))  // new formatter per cell
        }
    }
}
```

**Output:**
```
body — sorted array computed on every rebuild
  Impact: .sorted is O(n log n). With 500 posts, this runs on every body call triggered
          by any parent state change, causing visible lag during scroll.
  Fix:
  // In ViewModel or parent:
  @State private var sortedPosts = posts.sorted { $0.date > $1.date }
  // Update only when posts changes with .onChange(of: posts) { sortedPosts = ... }

body — DateFormatter instantiated per cell per rebuild
  Impact: DateFormatter initialization is expensive (locale setup, calendar, timezone).
          With 20 visible cells and frequent rebuilds, this creates hundreds of objects per second.
  Fix:
  private static let dateFormatter: DateFormatter = {
      let f = DateFormatter()
      f.dateStyle = .medium
      return f
  }()
  // Or use .formatted() with a FormatStyle (no allocation):
  Text(post.date.formatted(date: .abbreviated, time: .omitted))
```

---

## Notes

- Instruments > Time Profiler is the ground truth for main thread blocking — use this skill for pre-profiling review, not as a replacement for measurement.
- SwiftUI's view body performance has improved significantly in iOS 17 with the `@Observable` macro — less state change propagation overhead compared to `ObservableObject`.
