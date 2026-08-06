# Performance Loop

Performance is a first-class Mobile AI Agents loop. Use it when a mobile app is slow, janky, freezing, leaking memory, draining battery, using too much network, or growing too large.

The loop is evidence-first: measure the symptom, choose the right agent or skill, apply the smallest fix, re-measure, save the baseline, and monitor for regressions.

---

## What It Covers

| Area | Symptoms | Best Starting Point |
|---|---|---|
| Startup | Cold start, hot start, slow splash, app open delay | `@PERF`, `/perf-audit` |
| ANR | Frozen UI, input timeout, Play Console ANR | `@FREEZE`, `/anr-investigation` |
| Memory leaks | Retained Fragment/View/Activity, growing heap, OOM | `@RETAINER`, `/memory-leak-investigation` |
| Frame drops / jank | Slow scroll, dropped frames, animation stutter | `@PERF`, `/perf-audit`, platform reviewer |
| Battery | High CPU wakeups, background work, location abuse | `@PERF`, `/perf-audit` |
| Network | Chatty requests, large payloads, retry storms | `@PERF`, `/perf-audit` |
| Bundle / app size | Large APK/AAB/IPA, slow download, bloated assets | `@PERF`, `/perf-audit` |
| Slow screens | Heavy render, blocking IO, expensive lists | `@PERF`, `/perf-audit` |
| Regression monitoring | Performance gets worse after a PR or release | `perf-sprint`, Mobile Harness |

---

## Agent And Skill Map

| Need | Agent Or Skill | Use It For |
|---|---|---|
| Broad performance diagnosis | `@PERF` | Find bottlenecks, prioritize fixes, define measurements |
| Android ANR investigation | `@FREEZE`, `/anr-investigation` | Thread, lock, binder, and timeout analysis |
| Android memory leak analysis | `@RETAINER`, `/memory-leak-investigation` | LeakCanary reference path and lifecycle ownership |
| Screen-level profiling | `/perf-audit` | Main thread, rendering, memory, list, and fix ranking |
| Compose UI jank | `/compose-review`, `compose-ui-reviewer` | Recomposition, LazyColumn keys, effects, state stability |
| Flutter rebuilds | `/flutter-review`, `@DART` | Widget rebuilds, state, layout, async handling |
| React Native re-renders | `performance-optimizer`, `/rn-performance`, `@BRIDGE` | React memoization, FlatList, bridge hot paths |
| Unity frame budget | `@FORGE`, `/game-perf` | Update loops, GC allocations, draw calls, physics |
| Device validation | `/mobile-mcp-qa`, `device-proof-report` | Verify performance-sensitive flows on a target device |
| Delivery orchestration | `@MOBILE-HARNESS`, `perf-sprint` | Run checks after implementation and save evidence |

---

## Loop Steps

```text
1. IDENTIFY SYMPTOM
   -> Startup, ANR, memory leak, jank, battery, network, size, or slow screen.

2. COLLECT EVIDENCE
   -> Device model, OS, app version, commit, user flow, baseline numbers, traces, screenshots, logs.

3. CHOOSE ROUTE
   -> Select the smallest matching agent or skill from the map.

4. ANALYZE ROOT CAUSE
   -> Name the hot function, blocked thread, retained owner, expensive render path, or oversized asset.

5. APPLY SMALLEST SAFE FIX
   -> Change one bottleneck at a time so improvement can be attributed.

6. VERIFY WITH MEASUREMENTS
   -> Re-run the same flow on the same target and compare before/after numbers.

7. SAVE PERFORMANCE BASELINE
   -> Write `PERFORMANCE_AUDIT_REPORT.md` and store trace/screenshot links.

8. MONITOR REGRESSIONS
   -> Add a test, CI threshold, release gate, or follow-up task when possible.
```

---

## Evidence To Collect

| Platform | Evidence |
|---|---|
| Android | Play Console ANR cluster, `traces.txt`, Perfetto/Systrace, Android Studio Profiler, LeakCanary trace, APK Analyzer output, device model, API level |
| iOS | Instruments Time Profiler, Core Animation, Allocations/Leaks, MetricKit, Xcode Organizer reports, device model, iOS version |
| Flutter | Flutter DevTools Performance and Memory tabs, rebuild counts, timeline flame chart, package size output |
| React Native | React DevTools Profiler, Flipper Perf Monitor, Hermes profile, Metro bundle size, native traces |
| Unity | Unity Profiler, frame debugger, memory snapshot, draw call count, texture memory, target device |
| Unreal | Unreal Insights, stat unit, stat game, stat RHI, render thread timing, packaged build size |

If there is no baseline, the result is `BLOCKED` or `UNKNOWN`. Do not claim a performance fix without re-measuring.

---

## Android Examples

### ANR During Startup

```text
Symptom: Play Console reports "Input dispatching timed out" during app launch.
Evidence: ANR trace shows main thread blocked in RoomDatabase.query().
Route: @FREEZE + /anr-investigation.
Fix: Move startup database read to Dispatchers.IO and defer non-critical initialization.
Verify: Compare cold start time and confirm no main-thread DB query appears in trace.
Report: PERFORMANCE_AUDIT_REPORT.md with ANR cluster link, before/after startup time, and trace links.
```

### Fragment Memory Leak

```text
Symptom: Heap grows after opening and closing ProfileFragment.
Evidence: LeakCanary shows RecyclerView retaining ProfileAdapter, which retains Fragment views.
Route: @RETAINER + /memory-leak-investigation.
Fix: Clear RecyclerView adapter in onDestroyView() and remove view references from adapter callbacks.
Verify: Reopen/close ProfileFragment five times and confirm LeakCanary no longer reports retained Fragment.
Report: PERFORMANCE_AUDIT_REPORT.md with retained size before/after and LeakCanary evidence.
```

---

## Cross-Platform Examples

| Platform | Symptom | Route | Verification |
|---|---|---|---|
| iOS | Slow SwiftUI list scroll | `@PERF`, `@SWIFT`, `/ios-performance` | Instruments Core Animation frame times improve |
| Flutter | Product grid rebuilds every item | `@DART`, `/flutter-review`, `/perf-audit` | DevTools shows fewer rebuilds and frame times under 16ms |
| React Native | Feed drops frames on like button | `performance-optimizer`, `/rn-performance` | React Profiler shows fewer row renders |
| Unity | Mobile level spikes GC every few seconds | `@FORGE`, `/game-perf` | Unity Profiler shows no hot-path GC.Alloc spikes |
| Unreal | Blueprint Tick runs expensive logic | `@UNREAL`, `/game-perf` | Unreal Insights shows reduced game thread time |

---

## Report Format

Create:

```text
PERFORMANCE_AUDIT_REPORT.md
```

Use this deterministic format:

```markdown
# Performance Audit Report

## Summary
Result: PASS | FAIL | BLOCKED
Platform:
Device:
OS Version:
App Version:
Commit:
Flow:
Performance Area: Startup | ANR | Memory | Frame | Battery | Network | Size | Slow Screen | Regression

## Baseline
| Metric | Before | Target | Evidence |
|---|---:|---:|---|

## Findings
| ID | Severity | Area | Evidence | Root Cause | Fix Summary |
|---|---|---|---|---|---|

## Finding Details
### PERF-001 - <short title>
- Severity:
- Area:
- Evidence:
- Root Cause:
- Fix:
- Verification:
- Regression Guard:

## Changes Made
| File | Change | Reason |
|---|---|---|

## Verification
| Metric | Before | After | Result | Evidence |
|---|---:|---:|---|---|

## Device Or Trace Evidence
- <trace, screenshot, profiler export, issue, or report link>

## Regression Monitoring
- <test, CI threshold, dashboard, alert, or follow-up issue>

## Next Actions
1. <highest priority next fix or "None">
2. <next fix or "None">
3. <next fix or "None">
```

---

## Pass/Fail Rules

- `PASS`: The measured bottleneck improved or meets target, and evidence is attached.
- `FAIL`: The bottleneck remains, got worse, or lacks a safe fix.
- `BLOCKED`: Required evidence, device, build, credentials, or profiler access is missing.

Performance work is complete only when the report includes before/after measurements and a regression monitoring decision.
