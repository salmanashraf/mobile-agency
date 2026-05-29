# Example Input — Release Notes Generator

```bash
# Get the log with:
git log v3.1.0..HEAD --oneline
```

---

```
APP_NAME: Taskly
VERSION: 3.2.0
PLATFORM: iOS
AUDIENCE: both
TONE: friendly
GIT_LOG:
a1b2c3d Fix crash when opening notification while app is backgrounded
e4f5g6h Add recurring task support with custom intervals
i7j8k9l Improve task list loading speed by 40%
m1n2o3p Update onboarding flow for new users
q4r5s6t Fix incorrect due date display in widget
u7v8w9x Merge branch 'feature/recurring-tasks' into main
y1z2a3b Bump build version to 312
c4d5e6f Fix typo in settings screen label
g7h8i9j Remove deprecated legacy sync API
k1l2m3n Add haptic feedback on task completion
o4p5q6r Fix push notification badge count after clearing tasks
s7t8u9v Refactor CoreData stack to use background contexts
w1x2y3z Add dark mode support for task detail screen
```

---

## What to Expect

The agent produces all three sections. See [`example-output.md`](example-output.md).

**Noise filtered out:** `u7v8w9x` (merge commit), `y1z2a3b` (version bump), `c4d5e6f` (typo fix)

**Key rewrites:**
- "Improve task list loading speed by 40%" → "Taskly opens and loads your tasks noticeably faster"
- "Refactor CoreData stack to use background contexts" → QA note (internal only, not user-facing)
- "Remove deprecated legacy sync API" → Deprecation warning in QA notes

---

## Variations

### Android Play Store (500-char short description)
```
APP_NAME: Taskly
VERSION: 3.2.0
PLATFORM: Android
AUDIENCE: users
TONE: friendly
FORMAT: play-store
GIT_LOG:
[same log]
```

### Terse developer changelog only
```
APP_NAME: Taskly
VERSION: 3.2.0
PLATFORM: All
AUDIENCE: developers
TONE: terse
GIT_LOG:
[same log]
ISSUES: TASK-412 recurring tasks, TASK-389 widget date bug, TASK-401 notification badge
```
