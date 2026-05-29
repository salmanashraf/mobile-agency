# Example Output — Release Notes Generator

Full agent response to the input in [`example-input.md`](example-input.md).

---

```
═══════════════════════════════════════
RELEASE NOTES — Taskly 3.2.0
═══════════════════════════════════════

[USER-FACING — App Store / Play Store]
(1,284 / 4,000 characters)

What's New in 3.2.0
--------------------
• Recurring Tasks — Set any task to repeat daily, weekly, monthly, or on a
  completely custom schedule. Your routines, automated.

• Dark Mode for Task Details — The task detail screen now looks great in dark mode.

• A satisfying haptic pulse when you complete a task — small joy, big motivation.

• Fresh onboarding — New users get a cleaner, friendlier welcome experience.

• Taskly opens and loads your tasks noticeably faster — about 40% faster in our tests.

Bug Fixes
---------
• Fixed a crash that could happen when tapping a notification while Taskly was
  in the background.

• Fixed the home screen widget showing the wrong due date for some tasks.

• Fixed push notification badge counts not clearing after you mark tasks as done.

---

[DEVELOPER CHANGELOG]

## 3.2.0

### Features
- Add recurring task support with custom intervals [e4f5g6h]
- Add dark mode support for task detail screen [w1x2y3z]
- Add haptic feedback on task completion [k1l2m3n]
- Update onboarding flow for new users [m1n2o3p]

### Fixes
- Fix crash when opening notification while app is backgrounded [a1b2c3d]
- Fix incorrect due date display in widget [q4r5s6t]
- Fix push notification badge count after clearing tasks [o4p5q6r]

### Performance
- Improve task list loading speed by ~40% [i7j8k9l]
- Refactor CoreData stack to use background contexts [s7t8u9v]

### Internal / Infra
- Remove deprecated legacy sync API [g7h8i9j]

### Filtered (noise)
- Merge branch 'feature/recurring-tasks' into main [u7v8w9x] — merge commit
- Bump build version to 312 [y1z2a3b] — version bump
- Fix typo in settings screen label [c4d5e6f] — cosmetic

---

[QA NOTES]
(Internal — regression testing priorities)

Risk Areas This Release:

- Recurring Tasks (NEW FEATURE): End-to-end test all interval types (daily, weekly,
  monthly, custom). Critical path: create recurring task → complete it → verify it
  reappears correctly. Edge cases: timezone change mid-recurrence, recurring task due
  today on first app launch, recurrence across month/year boundary.

- CoreData Background Context Refactor (HIGH RISK): This is a structural change —
  test ALL task CRUD operations. Priority: create task → force-quit → relaunch →
  task persists. Concurrent writes: rapidly create multiple tasks while sync is running.
  No data loss acceptable.

- Push Notification Badge: Test badge count resets to 0 after clearing all tasks.
  Test on iOS 17 and iOS 18 separately (UNUserNotificationCenter behavior changed in 17.4).

- Widget Due Date: Verify widget refreshes after task is edited. Test all three widget
  sizes. Test after device restart (widget cache invalidation).

- Notification Crash: Navigate to app via notification while app is suspended (not just
  backgrounded). Confirm no crash across iOS 16, 17, 18.

Deprecated / Removed:
- Legacy sync API removed [g7h8i9j] — confirm no remaining call sites in the codebase.
  QA: on first launch after updating from 3.1.x, verify no sync errors appear in
  Console.app logs. Check Settings → Account → Sync Status shows healthy.
```
