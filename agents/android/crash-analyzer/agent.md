# Agent 02 — Crash Log Analyzer

**Platform:** Android / iOS  
**Category:** Debugging & Crash Analysis  
**Complexity:** Medium

---

## Purpose

Parses Android crash logs (logcat / Firebase Crashlytics) or iOS crash reports and returns a structured root-cause analysis with a severity assessment, affected surface, and concrete remediation steps. Works for both Java/Kotlin exceptions and native (NDK) crashes.

---

## Input Format

```
PLATFORM: <Android | iOS>
APP_VERSION: <e.g. 3.2.1 (build 412)>
OS_VERSION: <e.g. Android 14 / iOS 17.4>
DEVICE: <e.g. Pixel 8 Pro / iPhone 15 Pro>
CRASH_LOG:
<paste the full crash log or stack trace here>
```

**Fields:**

| Field | Required | Description |
|---|---|---|
| `PLATFORM` | Yes | `Android` or `iOS` |
| `APP_VERSION` | Yes | Helps correlate with release history |
| `OS_VERSION` | No | Narrows OS-specific bugs |
| `DEVICE` | No | Narrows device-specific bugs |
| `CRASH_LOG` | Yes | Full logcat output, Crashlytics report, or `.crash` file content |

---

## Output Format

```
CRASH ANALYSIS REPORT
=====================
App Version : <version>
Platform    : <platform>
Crash Type  : <Exception type or signal, e.g. NullPointerException / SIGSEGV>
Severity    : CRITICAL | HIGH | MEDIUM | LOW
Reproducibility: Always | Intermittent | Rare | Unknown

ROOT CAUSE
----------
<2–4 sentence explanation of why the crash occurred, written for a developer
who did not write the crashing code.>

CRASH CHAIN
-----------
1. <First thing that went wrong>
2. <What triggered the crash>
3. <The fatal line>

AFFECTED SURFACE
----------------
Feature     : <user-facing feature, e.g. "Profile photo upload">
Code Path   : <rough call chain, e.g. ProfileActivity → ImagePicker → BitmapUtils>
First Frame : <fully qualified class + method + line if parseable>

REMEDIATION
-----------
[Step 1] <Concrete code change or guard to add>
[Step 2] <Follow-up hardening>
[Step 3] <Test case to add>

SIMILAR PATTERNS TO WATCH
--------------------------
- <Other places in a typical codebase where the same root cause might lurk>

REFERENCES
----------
- <Android/iOS documentation link or known issue if applicable>
```

---

## System Prompt

```
You are an expert mobile platform engineer specializing in crash analysis for Android (Java/Kotlin, NDK) and iOS (Swift/Objective-C). Your job is to read a raw crash log and produce a clear, structured root-cause analysis that a developer can act on immediately.

Steps to follow:
1. Identify the exception type or signal (NPE, SIGABRT, ANR, OOM, etc.).
2. Find the first application frame in the stack trace (skip framework/system frames).
3. Trace the call chain upward to determine what the developer's code was doing.
4. Identify the root cause — not just the line that crashed, but WHY that state was reached.
5. Assign severity: CRITICAL (crash on critical path, high volume), HIGH (reproducible but narrow), MEDIUM (intermittent), LOW (edge case).
6. Write remediation steps as concrete code changes, not vague advice like "add null check."
7. Flag similar patterns elsewhere in a typical codebase.

Output MUST follow the exact format specified. Do not add extra sections. If a field cannot be determined from the log, write "Unknown" rather than guessing.
```

---

## Example

### Input

```
PLATFORM: Android
APP_VERSION: 2.1.0 (build 189)
OS_VERSION: Android 13
DEVICE: Samsung Galaxy S22
CRASH_LOG:
Fatal Exception: java.lang.NullPointerException: Attempt to invoke virtual method 'android.graphics.Bitmap android.graphics.drawable.BitmapDrawable.getBitmap()' on a null object reference
       at com.example.app.ui.profile.AvatarUtils.resizeBitmap(AvatarUtils.kt:42)
       at com.example.app.ui.profile.ProfileFragment.displayAvatar(ProfileFragment.kt:118)
       at com.example.app.ui.profile.ProfileFragment.onUserLoaded(ProfileFragment.kt:97)
       at com.example.app.ui.profile.ProfileViewModel$loadUser$1.invokeSuspend(ProfileViewModel.kt:63)
       at kotlin.coroutines.jvm.internal.BaseContinuationImpl.resumeWith(ContinuationImpl.kt:33)
       at kotlinx.coroutines.DispatchedTask.run(DispatchedTask.kt:106)
       at android.os.Handler.handleMessage(Handler.java:942)
```

### Output

```
CRASH ANALYSIS REPORT
=====================
App Version : 2.1.0 (build 189)
Platform    : Android
Crash Type  : NullPointerException
Severity    : HIGH
Reproducibility: Intermittent

ROOT CAUSE
----------
`AvatarUtils.resizeBitmap()` calls `getBitmap()` on a `BitmapDrawable` that is null.
The drawable comes from the user's avatar URL, which may not have loaded yet (or failed
to load) when `displayAvatar` is called. The code assumes the drawable is always a
non-null BitmapDrawable, but this is only true after a successful image load.

CRASH CHAIN
-----------
1. ViewModel finishes loading user data and calls `onUserLoaded`
2. Fragment immediately calls `displayAvatar`, which calls `AvatarUtils.resizeBitmap`
3. The drawable cast to BitmapDrawable returns null (image not loaded), causing NPE at line 42

AFFECTED SURFACE
----------------
Feature     : User profile avatar display
Code Path   : ProfileViewModel → ProfileFragment.onUserLoaded → displayAvatar → AvatarUtils.resizeBitmap
First Frame : com.example.app.ui.profile.AvatarUtils.resizeBitmap(AvatarUtils.kt:42)

REMEDIATION
-----------
[Step 1] In AvatarUtils.resizeBitmap, guard the drawable cast:
         val bitmap = (drawable as? BitmapDrawable)?.bitmap ?: return defaultBitmap
[Step 2] In ProfileFragment.displayAvatar, only call resizeBitmap after confirming
         the image library (Coil/Glide) has successfully loaded the image, using its
         success callback rather than calling it immediately after data load.
[Step 3] Add a unit test for AvatarUtils.resizeBitmap that passes a null and a
         non-BitmapDrawable to verify it handles both gracefully.

SIMILAR PATTERNS TO WATCH
--------------------------
- Any other call site that casts `Drawable` to `BitmapDrawable` without a safe cast
- Image views that call getBitmap() before an async image load completes
- RecyclerView adapters that use cached drawables that may have been recycled

REFERENCES
----------
- https://developer.android.com/reference/android/graphics/drawable/BitmapDrawable#getBitmap()
```

---

## Notes

- For symbolicated iOS `.crash` files, paste the full symbolicated content (post `symbolicatecrash`).
- ANR traces (from `traces.txt`) are supported — provide the full ANR dump.
- NDK/native crashes: include the entire tombstone file. The agent will identify the faulting address and library.
- The agent does not have access to your source code beyond what you paste, so first-frame identification relies on package name conventions.
