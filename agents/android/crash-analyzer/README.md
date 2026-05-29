# Android Crash Analyzer (Legacy)

> **This agent has been superseded by the enhanced [`android-crash-analyzer`](../android-crash-analyzer/).**

---

## What Changed

The original crash analyzer at `agents/android/crash-analyzer/` used a 6-section output format and covered Android and iOS in a single agent.

It has been replaced by two specialized agents:

| New Agent | Platform | What's Better |
|---|---|---|
| [`android/android-crash-analyzer`](../android-crash-analyzer/) | Android | 9-section output, ANR support, LeakCanary, RecyclerView, Firebase Crashlytics, coroutine-specific rules |
| [`ios/crash-analyzer`](../../ios/crash-analyzer/) | iOS | ARC, force-unwrap, EXC_BAD_ACCESS, watchdog terminations, SwiftUI crashes |

---

## Migrate in 30 Seconds

**Before:**
```
# Using the old agent
Use agents/android/crash-analyzer/agent.md system prompt
```

**After:**
```
# Use the enhanced Android agent
Use agents/android/android-crash-analyzer/agent.md system prompt
```

The new input format is identical — just add the `USER_ACTION` field for significantly better lifecycle crash analysis:

```
PLATFORM: Android
APP_VERSION: <version>
OS_VERSION: <Android version>
DEVICE: <device model>
USER_ACTION: <what the user was doing>   ← new, highly recommended
CRASH_LOG:
<paste the full crash log>
RELATED_CODE: <optional>
```

---

## Why This File Exists

The `agents/android/crash-analyzer/` folder is kept to avoid breaking existing links and bookmarks. The `agent.md` inside still works, but the enhanced version produces significantly better output.

**Recommendation:** Update any team documentation, Cursor rules, or chat session bookmarks to point to `agents/android/android-crash-analyzer/`.
