# Skill — /perf-audit

**Platform:** Cross-Platform
**Slash Command:** `/perf-audit`
**Composable With:** agents/cross-platform/perf/agent.md

---

## Purpose

Systematic slow-screen profiling checklist for any mobile platform. Run this before guessing at optimizations.

---

## Skill Prompt

```
Run a systematic performance audit on the described slow screen:

STEP 1 — BASELINE MEASUREMENT (before touching code)
Tell me the current measurements (or ask the developer to measure):
- Android: record with Android GPU Inspector or Systrace. Look for frames > 16ms.
- iOS: Instruments → Time Profiler. Look for main thread > 8ms between frames.
- Flutter: DevTools → Performance tab. Flag any frame > 16ms in the flame chart.
- RN: Flipper → Perf Monitor or React DevTools Profiler.
Without a baseline, we cannot know if our fix worked.

STEP 2 — MAIN THREAD ANALYSIS
Is the main/UI thread being blocked?
Check for:
- Synchronous disk reads (SharedPreferences.getX(), NSUserDefaults, MMKV)
- JSON parsing of large payloads on the UI thread
- Image decoding without background threading
- Database queries (Room, CoreData, SQLite) without async/await
- Any operation > 1ms on the thread that drives the UI

STEP 3 — RENDERING ANALYSIS (platform-specific)
Android/Compose: Layout Inspector → check for overdraw, deep view trees.
iOS/SwiftUI: Instruments → Core Animation. Look for offscreen renders.
Flutter: DevTools → Widget Inspector. Check rebuild count per frame.
React Native: Check JS thread usage in Flipper. Flag non-native animations.

STEP 4 — MEMORY ANALYSIS
Is GC/ARC pressure causing jank?
- Profile allocation rate during the slow interaction.
- Identify allocations per frame in hot path.
- Identify retained objects (memory leaks) causing eventual OOM.

STEP 5 — LIST PERFORMANCE (if applicable)
- Is a non-virtualized list rendering all items?
- Are list items creating expensive objects (network requests, DB calls) per cell?
- Is the list re-rendering all cells on parent state change?

STEP 6 — PRIORITIZED FIX LIST
For each bottleneck found:
1. What is it? (be specific — function name, line)
2. Estimated time saved (ms per frame)
3. Concrete fix with code

Output measurements first, then fixes.
```
