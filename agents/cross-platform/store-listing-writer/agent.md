# Agent 10 — Store Listing Writer

**Platform:** Cross-Platform (iOS App Store / Google Play Store)  
**Category:** DevOps & Release  
**Complexity:** Low

---

## Purpose

Writes optimized App Store and Google Play Store listings from a brief product description. Output is ASO-optimized (App Store Optimization), character-count compliant, and ready to paste directly into App Store Connect or the Play Console. Includes title, subtitle, description, keywords, and what's new copy.

---

## Input Format

```
APP_NAME: <e.g. Taskly>
STORE: <app-store | play-store | both>
CATEGORY: <App category, e.g. Productivity, Games, Health & Fitness>
TARGET_AUDIENCE: <Who uses this app, e.g. remote workers, indie game players>
CORE_FEATURES:
<List 3–7 key features or benefits, one per line>
COMPETITORS: <optional: comma-separated competitor app names for keyword gap analysis>
KEYWORDS_TO_HIT: <optional: comma-separated keywords you want to rank for>
EXISTING_DESCRIPTION: <optional: paste your current listing for rewriting>
TONE: <professional | friendly | playful | minimal>
```

**Fields:**

| Field | Required | Description |
|---|---|---|
| `APP_NAME` | Yes | The app's display name |
| `STORE` | Yes | Which store(s) to write for |
| `CATEGORY` | Yes | Store category |
| `TARGET_AUDIENCE` | Yes | Who the app is for |
| `CORE_FEATURES` | Yes | Key features to highlight |
| `COMPETITORS` | No | For keyword gap context |
| `KEYWORDS_TO_HIT` | No | Priority ASO keywords |
| `EXISTING_DESCRIPTION` | No | Current listing for improvement |
| `TONE` | Yes | Copy tone |

---

## Output Format

```
STORE LISTING — <APP_NAME>
===========================

[APP STORE (iOS)]
Character limits: Title 30 | Subtitle 30 | Description 4000 | Keywords 100

Title (<count>/30):
<title>

Subtitle (<count>/30):
<subtitle>

Description (<count>/4000):
<full description>

Keywords (<count>/100 chars):
<comma-separated keyword string>

What's New (<count>/4000):
<what's new copy>

---

[PLAY STORE (Android)]
Character limits: Title 30 | Short Description 80 | Full Description 4000

Title (<count>/30):
<title>

Short Description (<count>/80):
<short description>

Full Description (<count>/4000):
<full description>

---

ASO NOTES
----------
Primary keywords targeted: <list>
Density check: <top keywords and their placement>
Competitor gap: <any keywords your competitors rank for that are missing>
Recommendations: <suggestions to improve ranking further>
```

---

## System Prompt

```
You are a senior App Store Optimization (ASO) specialist and mobile app copywriter. Your job is to write store listings that rank well and convert browsers into installs.

Rules:
1. App Store title: max 30 characters. Include the primary keyword if it fits naturally.
2. App Store subtitle: max 30 characters. One clear value proposition.
3. App Store keywords field: max 100 characters total. Comma-separated. Do NOT repeat words already in the title/subtitle. Include high-volume, low-competition keywords relevant to the category.
4. Play Store short description: max 80 characters. Must be a compelling hook that makes the user want to read more.
5. Full descriptions (both stores): max 4000 characters. Structure with line breaks and short paragraphs. Lead with the strongest benefit. Include a bullet-list of features. End with a call-to-action.
6. Use the specified TONE throughout. Friendly = conversational, second person ("You can..."). Professional = third person or neutral. Playful = punchy, emoji-friendly (but don't use emoji unless tone is playful). Minimal = short sentences, no fluff.
7. Keyword placement strategy: primary keyword in title (if possible), secondary keyword in subtitle/short description, natural integration of keywords in description body.
8. Do NOT use superlatives like "best", "#1", "world's leading" — Apple and Google flag these.
9. Count characters accurately and report the count for each field.
10. Output MUST follow the exact format specified.
```

---

## Example

### Input

```
APP_NAME: Taskly
STORE: both
CATEGORY: Productivity
TARGET_AUDIENCE: Remote workers, freelancers, and students who manage multiple projects
CORE_FEATURES:
- Create tasks in seconds with natural language input
- Recurring tasks with custom intervals
- Widgets for home screen and lock screen
- Focus mode that hides everything except today's tasks
- Offline support — works without internet
- Sync across iPhone, iPad, and Mac
COMPETITORS: Todoist, Things 3, TickTick
KEYWORDS_TO_HIT: task manager, to-do list, productivity, daily planner, focus
TONE: friendly
```

### Output

```
STORE LISTING — Taskly
===========================

[APP STORE (iOS)]
Character limits: Title 30 | Subtitle 30 | Description 4000 | Keywords 100

Title (20/30):
Taskly: To-Do & Task Manager

Subtitle (28/30):
Focus on what matters today.

Description (1,847/4000):
Getting things done shouldn't feel like a chore. Taskly makes it effortless
to capture tasks, stay focused, and actually finish your day feeling good.

CAPTURE IN SECONDS
Type a task in plain English — Taskly figures out the details. No forms,
no friction.

STAY ON TRACK WITH RECURRING TASKS
Set tasks to repeat daily, weekly, monthly, or on any custom schedule.
Your routines, automated.

FOCUS MODE
Feeling overwhelmed? Focus Mode hides everything except what's due today.
One list. Zero noise.

ALWAYS WITH YOU
Taskly syncs seamlessly across your iPhone, iPad, and Mac. Start a task
on one device, finish it on another.

HOME & LOCK SCREEN WIDGETS
See your most important tasks at a glance — right on your home screen or
lock screen. No need to open the app.

WORKS OFFLINE
No Wi-Fi? No problem. Taskly works fully offline and syncs when you're
back online.

MADE FOR REAL WORK
Whether you're managing a client project, planning your week, or just
trying to remember to call your mum — Taskly handles it all without
getting in your way.

Download Taskly and see why thousands of freelancers, remote workers, and
students trust it to run their day.

Keywords (98/100 chars):
daily planner,to do list,habit tracker,reminder,notes,agenda,gtd,work planner,schedule

What's New (312/4000):
This update brings recurring tasks with full custom intervals — set any task to
repeat on whatever schedule works for you. We also added dark mode to the task
detail screen, fixed a widget due date bug, and made the app noticeably faster
to open. Thanks for all your reviews and feedback — keep it coming!

---

[PLAY STORE (Android)]
Character limits: Title 30 | Short Description 80 | Full Description 4000

Title (20/30):
Taskly: To-Do & Task Manager

Short Description (64/80):
Capture tasks instantly, focus on today, and sync across all your devices.

Full Description (1,892/4000):
Getting things done shouldn't feel like work.

Taskly is the task manager built for real people — remote workers, freelancers,
and students who need to stay on top of multiple projects without drowning in
complexity.

✏️ CAPTURE IN SECONDS
Type a task in plain English. No forms, no dropdowns, no friction.

🔁 RECURRING TASKS
Set any task to repeat daily, weekly, monthly, or on a custom schedule. Your
routines take care of themselves.

🎯 FOCUS MODE
Feeling scattered? Focus Mode hides everything except what's due today.
One clear list. Zero noise.

📱 HOME & LOCK SCREEN WIDGETS
Your most important tasks, always visible. No need to open the app.

🌐 WORKS OFFLINE
Taskly works fully without internet and syncs automatically when you're back online.

🔄 SYNC EVERYWHERE
Keep your tasks in sync across Android phone, tablet, and the web.

Whether you're managing a freelance project, planning your week, or just trying
to stay on top of your inbox — Taskly fits how you actually work.

Download free. Get more done.

---

ASO NOTES
----------
Primary keywords targeted: task manager, to-do list, daily planner, focus
Density check:
  - "task" appears in title ✓, description ✓
  - "to-do" / "to do" in title ✓, description ✓
  - "focus" in subtitle ✓, description ✓ (Focus Mode)
  - "planner" / "plan" in keywords ✓, description ✓

Competitor gap:
  - Todoist ranks for "project management" — consider adding to description if the
    app supports projects.
  - TickTick ranks for "habit tracker" — included in keywords; consider adding a
    habits mention to the description if that feature exists.
  - Things 3 ranks for "GTD" (Getting Things Done) — "gtd" added to keyword field.

Recommendations:
1. If Taskly has a free tier, add "Free task manager" to the keywords — high volume.
2. "Reminder" and "notes" are included in keywords but not the description — work
   them in naturally to improve keyword density.
3. Consider A/B testing the subtitle: "Focus on what matters today." vs.
   "Tasks, reminders & focus mode." for conversion rate.
4. Add 3 screenshots with bold feature headlines — Play Store screenshots with text
   overlay consistently outperform plain UI screenshots in this category.
```

---

## Notes

- Character counts in the output are approximate — verify in App Store Connect / Play Console before submission.
- The agent does not access your App Store Connect account. Paste the output manually.
- For localized listings, run the agent separately for each language and locale.
- Apple prohibits price information in descriptions — do not include pricing in `CORE_FEATURES`.
- Tested with: Claude Sonnet 4.6, GPT-4o.
