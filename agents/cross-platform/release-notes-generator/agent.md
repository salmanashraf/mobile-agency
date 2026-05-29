# Agent 08 — Release Notes Generator

**Platform:** Cross-Platform (All)  
**Category:** DevOps & Release  
**Complexity:** Low

---

## Purpose

Converts raw git commit history and optional Jira/GitHub issue references into polished, user-facing release notes. Outputs separate sections for App Store / Play Store descriptions, developer changelogs, and internal QA notes. Filters noise (merge commits, CI fixes, typos) and groups changes by feature area.

---

## Input Format

```
APP_NAME: <e.g. Taskly>
VERSION: <e.g. 3.2.0>
PLATFORM: <iOS | Android | Flutter | React Native | All>
AUDIENCE: <users | developers | both>
TONE: <friendly | professional | terse>
GIT_LOG:
<paste output of: git log v3.1.0..HEAD --oneline>
ISSUES: <optional: comma-separated Jira/GitHub issue summaries>
```

**Fields:**

| Field | Required | Description |
|---|---|---|
| `APP_NAME` | Yes | Used in headings |
| `VERSION` | Yes | Version number for the heading |
| `PLATFORM` | Yes | Affects platform-specific phrasing |
| `AUDIENCE` | Yes | `users` = App Store copy; `developers` = changelog; `both` = both |
| `TONE` | Yes | Affects language style |
| `GIT_LOG` | Yes | Raw `git log --oneline` output |
| `ISSUES` | No | Optional Jira/GitHub issue titles for cross-reference |

---

## Output Format

```
═══════════════════════════════════════
RELEASE NOTES — <APP_NAME> <VERSION>
═══════════════════════════════════════

[USER-FACING — App Store / Play Store]
(Max 4000 characters; suitable for direct submission)

What's New in <VERSION>
-----------------------
<bullet list of user-visible changes, grouped by area>

Bug Fixes
---------
<bullet list of user-visible bug fixes>

---

[DEVELOPER CHANGELOG]
(For GitHub Releases, internal wiki, or team communication)

## <VERSION> — <date>

### Features
- <commit summary> [<issue-ref>]

### Fixes
- <commit summary> [<issue-ref>]

### Performance
- <commit summary>

### Internal / Infra
- <commit summary>

---

[QA NOTES]
(Internal — what regression areas to test)

Risk Areas This Release:
- <Area 1>: <what changed and what to test>
- <Area 2>: <what changed and what to test>

Deprecated / Removed:
- <Anything removed that QA should confirm is gone>
```

---

## System Prompt

```
You are a technical writer and release manager for a mobile app team. Your job is to transform raw git commit messages into polished release notes for multiple audiences.

Steps:
1. Filter out noise: merge commits ("Merge branch"), CI/CD commits ("Update pipeline", "Bump version"), and pure formatting commits ("Fix typo").
2. Group remaining commits by type: Features (new user-visible functionality), Fixes (bug fixes), Performance, and Internal/Infra.
3. For the user-facing section: rewrite technical commit messages into benefit-driven language a non-developer user can understand. Max one sentence per item. Do not mention branch names, file names, or internal class names.
4. For the developer changelog: keep technical accuracy. Include commit hash or issue reference if provided.
5. For QA notes: identify the highest-risk changes (new features, refactored core flows, removed code) and describe what regression testing is needed.
6. Keep the user-facing section under 4000 characters (App Store limit).
7. Use the specified TONE: friendly = casual language ("We fixed a crash that..."), professional = formal ("Resolved an issue where..."), terse = minimal words ("Fix: crash on login").

Output MUST follow the exact format specified.
```

---

## Example

### Input

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

### Output

```
═══════════════════════════════════════
RELEASE NOTES — Taskly 3.2.0
═══════════════════════════════════════

[USER-FACING — App Store / Play Store]

What's New in 3.2.0
--------------------
• Recurring Tasks — Set tasks to repeat daily, weekly, monthly, or on a custom
  interval. Never forget a routine again.
• Dark Mode for Task Details — The task detail screen now looks great in dark mode.
• A satisfying haptic buzz when you complete a task — small joy, big motivation.
• Fresh onboarding experience — New users get a cleaner, friendlier welcome flow.

Bug Fixes
---------
• Fixed a crash that could happen when tapping a notification while Taskly was
  in the background.
• Fixed the widget showing the wrong due date for some tasks.
• Fixed push notification badge counts not clearing after you mark tasks as done.

---

[DEVELOPER CHANGELOG]

## 3.2.0

### Features
- Add recurring task support with custom intervals [a1b2c3d]
- Update onboarding flow for new users [m1n2o3p]
- Add haptic feedback on task completion [k1l2m3n]
- Add dark mode support for task detail screen [w1x2y3z]

### Fixes
- Fix crash when opening notification while app is backgrounded [a1b2c3d]
- Fix incorrect due date display in widget [q4r5s6t]
- Fix push notification badge count after clearing tasks [o4p5q6r]

### Performance
- Improve task list loading speed by ~40% [i7j8k9l]
- Refactor CoreData stack to use background contexts [s7t8u9v]

### Internal / Infra
- Remove deprecated legacy sync API [g7h8i9j]

---

[QA NOTES]

Risk Areas This Release:

- Recurring Tasks (NEW): End-to-end test all interval types (daily, weekly, monthly,
  custom). Verify recurrence after app restart and after device timezone change.
  Test edge case: recurring task due today when task list first loads.

- CoreData Background Context Refactor: High risk — regression test all task CRUD
  operations. Confirm no data loss on write during concurrent background sync.
  Test: create task, force-quit app, relaunch — task should persist.

- Push Notification Badge: Verify badge count resets to 0 after clearing all tasks.
  Test on iOS 17 and iOS 18 (UNUserNotificationCenter API behavior differs).

- Widget Due Date: Verify widget refreshes after task edit. Test on all widget sizes.

Deprecated / Removed:
- Legacy sync API removed [g7h8i9j] — confirm no remaining call sites. QA: verify
  no sync errors in Console.app on first launch after update from 3.1.x.
```

---

## Notes

- For Android Play Store, the user-facing section is capped at 500 characters for the "short description" — add `FORMAT: play-store` to your input to get the condensed version.
- The agent cannot access your Jira or GitHub directly — paste issue titles in the `ISSUES` field for cross-referencing.
- For monorepo projects, filter your `git log` to the relevant app directory before pasting.
- Tested with: Claude Sonnet 4.6, GPT-4o.
