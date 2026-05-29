# iOS Crash Analyzer Agent

> Paste a symbolicated iOS crash report. Get a 9-section root-cause analysis — what crashed, why, how to fix it, and how to verify the fix.

---

## What This Agent Does

Analyzes iOS crash reports, Xcode Organizer exports, and Firebase Crashlytics iOS logs and returns a structured 9-section report:

1. **Crash Summary** — type, severity, reproducibility
2. **Root Cause** — precise technical explanation
3. **Why This Happens** — plain-English explanation for any team member
4. **Risk Level** — Critical / High / Medium / Low
5. **Recommended Fix** — step-by-step, ARC-safe solution
6. **Updated Code** — before/after Swift with inline comments
7. **Edge Cases** — other places the same bug can hide
8. **Testing Checklist** — reproducible steps to verify the fix
9. **Prevention Tips** — SwiftLint rules, Instruments, architectural patterns

---

## Supported Crash Types

| Signal / Exception | Description |
|---|---|
| `EXC_BAD_ACCESS (SIGSEGV)` | Null dereference, use-after-free (most commonly `unowned` after dealloc) |
| `EXC_BAD_ACCESS (SIGBUS)` | Unaligned memory access |
| `SIGABRT` | Assertion failure, `fatalError()`, uncaught ObjC exception |
| Force-unwrap `!` | `unexpectedly found nil while unwrapping` |
| Swift runtime | Index out of range, forced cast failure |
| `0x8badf00d` | Watchdog termination (background task expired) |
| Main thread checker | UI update on background thread |
| SwiftUI state | `@StateObject`/`@ObservedObject` lifecycle crashes |
| Objective-C | `doesNotRecognizeSelector`, `NSInvalidArgumentException` |

---

## Files

| File | Purpose |
|---|---|
| [`agent.md`](agent.md) | Input format, output format, full system prompt |
| [`example-input.md`](example-input.md) | Real EXC_BAD_ACCESS crash from unowned reference |
| [`example-output.md`](example-output.md) | Full 9-section analysis with Swift fix |

---

## Quick Start

```
PLATFORM: iOS
APP_VERSION: <version>
OS_VERSION: <iOS version>
DEVICE: <device model>
USER_ACTION: <what the user was doing>
CRASH_LOG:
[paste symbolicated .crash content]
RELATED_CODE: [optional]
```

> **Important:** The crash report must be **symbolicated**. Unsymbolicated reports show hex addresses that cannot be analyzed. Symbolicate using Xcode Organizer or `symbolicatecrash` before pasting.

---

## Related Agents

- [`agents/ios/swift-reviewer`](../swift-reviewer/) — pre-crash code review that catches the same issues before they ship
- [`agents/android/android-crash-analyzer`](../../android/android-crash-analyzer/) — same workflow for Android
