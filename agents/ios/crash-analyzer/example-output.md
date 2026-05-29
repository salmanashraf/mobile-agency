# Example Output — iOS Crash Analyzer

Full agent response to the input in [`example-input.md`](example-input.md).

---

## Crash Summary

`EXC_BAD_ACCESS (SIGSEGV)` at `ProfileViewModel.swift:72` — the upload completion closure captures `self` with `[unowned self]`. The ViewModel was deallocated when the user dismissed the Profile screen, but the upload callback fired on the network thread afterward. Accessing a deallocated `unowned` reference is undefined behavior that always crashes. **CRITICAL** severity — reproducible whenever the user dismisses the screen while an upload is in flight (proportional to upload latency and user navigation speed).

---

## Root Cause

`[unowned self]` creates a non-optional, non-retaining reference to `self`. Unlike `[weak self]`, it does **not** nil-check before access — it simply assumes `self` is always alive when the closure runs.

Timeline of the crash:
1. User taps Upload → `uploadAvatar()` is called → `uploadService.upload(data:completion:)` starts async network work on Thread 3
2. User dismisses `ProfileViewController` → `ProfileViewController` releases its reference to `ProfileViewModel`
3. No other strong reference to `ProfileViewModel` exists → ARC deallocates it immediately
4. Upload completes on Thread 3 → the completion closure tries to access `self` via the `unowned` reference
5. The memory at that address has been freed → `swift_unknownObjectRetain` crashes with `KERN_INVALID_ADDRESS`

---

## Why This Happens

Think of `unowned` like a library card that promises the library will always exist. If the library closes (ViewModel deallocated), presenting the card crashes the system — there's nothing there anymore.

`weak` is the safe version: it's a membership that automatically becomes nil when the library closes. Checking `guard let self` before proceeding means if the library is gone, you simply walk away rather than crashing.

`unowned` is only safe when you can **guarantee** the captured object outlives the closure — for example, closures stored inside the same object, or in parent→child hierarchies where the parent always outlives the child. A network upload callback that can complete after the user navigates away is not that situation.

---

## Risk Level

**CRITICAL**  
Reproducibility: **Intermittent** — only when upload is in flight during dismissal  
Frequency increases with: upload file size, network latency, back-navigation speed  
Expected: top 5 Crashlytics issue on any app with image upload + navigation

---

## Recommended Fix

**Step 1:** Replace `[unowned self]` with `[weak self]` in the upload completion closure.  
**Step 2:** Add `guard let self else { return }` to safely unwrap before any access.  
**Step 3:** Remove the force-unwrap on `jpegData` — it can return nil.  
**Step 4 (optional):** Cancel the in-flight upload when the ViewModel is deallocated by storing a reference to the upload task.

---

## Updated Code

```swift
// Before — ProfileViewModel.swift
class ProfileViewModel {
    var onUploadComplete: (() -> Void)?

    func uploadAvatar(image: UIImage) {
        let data = image.jpegData(compressionQuality: 0.8)!       // crash if nil
        uploadService.upload(data: data) { [unowned self] success in  // CRASH: unowned + dealloc
            if success {
                self.onUploadComplete?()
            }
        }
    }
}

// After — ProfileViewModel.swift
class ProfileViewModel {
    var onUploadComplete: (() -> Void)?
    private var uploadTask: URLSessionTask?

    func uploadAvatar(image: UIImage) {
        // Guard: jpegData can return nil for certain image types or under memory pressure
        guard let data = image.jpegData(compressionQuality: 0.8) else {
            // notify caller of encoding failure
            return
        }

        uploadTask = uploadService.upload(data: data) { [weak self] success in
            // Safe: self is nil if ViewModel was deallocated — block exits cleanly
            guard let self else { return }
            if success {
                self.onUploadComplete?()
            }
        }
    }

    deinit {
        // Cancel the in-flight upload if the ViewModel is released (user navigated away)
        uploadTask?.cancel()
    }
}
```

---

## Edge Cases

- **Any other `[unowned self]` in escaping closures** in this class — audit all `uploadService`, `URLSession`, `Timer`, `NotificationCenter`, and `DispatchQueue.async` closures for the same pattern.
- **`onUploadComplete` itself** — if `onUploadComplete` captures a `UIViewController` strongly (e.g., to show an alert), and the VC is dismissed, calling it after dismiss may crash. Verify the block's capture list.
- **Background URLSession** — if using `URLSessionConfiguration.background`, completion is delivered to the `URLSessionDelegate`, not a closure. The delegate must hold a `weak` reference back to any object it notifies.
- **SwiftUI view that drives the upload** — if a `@StateObject` ViewModel hosts this logic, it is owned by the view hierarchy and lives as long as the view. The crash would not occur with `@StateObject` — but it would still occur with `@ObservedObject` if the parent is dismissed.

---

## Testing Checklist

- [ ] Tap Upload → immediately tap Back → confirm **no crash** in Xcode console or Crashlytics
- [ ] Tap Upload on a throttled network (Network Link Conditioner → 3G) → tap Back → no crash
- [ ] Run the app with Address Sanitizer (Xcode scheme → Diagnostics → Address Sanitizer) → upload → navigate away → confirm no use-after-free report
- [ ] Verify in Instruments (Leaks) that `ProfileViewModel` is deallocated after screen dismissal — not retained by a leaked closure
- [ ] Confirm `uploadTask?.cancel()` is called in `deinit` by adding a `print("upload cancelled")` in `deinit` temporarily

---

## Prevention Tips

- **Default to `[weak self]`** for all escaping closures in network, timer, and notification callbacks. Use `[unowned self]` only in non-escaping closures or when you can document the lifetime guarantee in a comment.
- **Add a SwiftLint rule:** `unowned_variable_capture` — flags `unowned` in escaping closure capture lists.
- **Enable Address Sanitizer** in CI test runs — it catches use-after-free at test time before they reach production.
- **Migrate to async/await:** `async throws` functions structured with `Task { [weak self] in ... }` make capture semantics explicit and eliminate most completion-handler memory issues.
- **Code review checklist:** Any PR with a network or timer callback must document the capture list choice (`weak` vs `unowned` vs strong) and the reason.
