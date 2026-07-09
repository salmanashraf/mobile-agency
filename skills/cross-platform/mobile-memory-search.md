# Skill — /mobile-memory-search

**Platform:** Cross-Platform  
**Slash Command:** `/mobile-memory-search`  
**Composable With:** Mobile Memory, MOBILE-HARNESS, APPFORGE, `/mobile-memory-save`, `/mobile-memory-graph`

---

## Purpose

Search and inject local Mobile Agency memory captured in `.mobile-agency/memory/` so an AI session can resume with the right project context without reading every file or asking the user to repeat decisions.

Use this when a project has been worked on across multiple days, tools, agents, or tasks.

---

## Input Format

```text
COMMAND: /mobile-memory-search
QUERY:
<decision, feature, bug, file name, agent finding, release step, or task>
MEMORY_SOURCE:
<optional output from `mobile-agency memory search`, `timeline`, or `inject`>
NEXT_STEP:
<optional current task>
```

---

## Skill Prompt

```text
Use local Mobile Agency memory to restore relevant context.

If the user has not provided memory output, ask them to run one of:

- `npx mobile-agency memory inject`
- `npx mobile-agency memory search <query>`
- `npx mobile-agency memory timeline --limit 20`

When memory output is provided:

1. Identify the project, platform, active feature, and most recent next action.
2. Pull out decisions, rejected alternatives, unresolved findings, files touched, and blockers.
3. Separate confirmed memory from assumptions.
4. Recommend exact files to read before editing.
5. Continue from the latest NEXT ACTION if it is clear.

Output exactly:

MOBILE MEMORY SEARCH RESULT
=====================
Query:
Project:
Platform:

Relevant Memory:
| Time | Type | Title | Why It Matters |
|---|---|---|---|

Decisions:
- <decision or "None found">

Open Risks:
- <risk or "None found">

Files To Read Next:
- <file or "Unknown">

Confirmed Context:
- <fact>

Assumptions:
- <assumption or "None">

NEXT ACTION:
1. <single executable action>
```

---

## CLI Workflow

```bash
npx mobile-agency memory init
npx mobile-agency memory capture --type decision --title "Use Room" --text "Persist habits locally with Room."
npx mobile-agency memory capture --type next-action --text "Implement HabitDao and restart persistence test."
npx mobile-agency memory search persistence
npx mobile-agency memory inject
npx mobile-agency memory checkpoint
```

---

## Example

### Input

```text
COMMAND: /mobile-memory-search
QUERY: persistence
MEMORY_SOURCE:
Project: Habit Pulse
Platform: Android
Events: 3

## Recent Memory
- 2026-07-09T04:00:00Z · decision · Use Room — Persist habits locally with Room instead of SharedPreferences.
- 2026-07-09T04:03:00Z · finding · PRD verification failed — Restart persistence is missing.
- 2026-07-09T04:05:00Z · next-action · Implement HabitDao — Implement HabitDao and restart persistence test.
```

### Output

```text
MOBILE MEMORY SEARCH RESULT
=====================
Query: persistence
Project: Habit Pulse
Platform: Android

Relevant Memory:
| Time | Type | Title | Why It Matters |
|---|---|---|---|
| 2026-07-09T04:00:00Z | decision | Use Room | Persistence approach chosen |
| 2026-07-09T04:03:00Z | finding | PRD verification failed | Restart behavior missing |
| 2026-07-09T04:05:00Z | next-action | Implement HabitDao | Current task |

Decisions:
- Use Room instead of SharedPreferences for habit persistence.

Open Risks:
- Restart persistence has not passed PRD verification.

Files To Read Next:
- Habit entity, DAO, database, repository, and current home screen state files.

Confirmed Context:
- The next implementation step is HabitDao plus restart persistence test.

Assumptions:
- Exact file paths were not present in memory output.

NEXT ACTION:
1. Read persistence-related files, then implement HabitDao and a restart persistence test.
```

---

## Notes

- This skill searches local memory output; it does not replace reading source files before editing.
- Keep secrets out of memory captures. Wrap sensitive text in `<private>...</private>` before capture.
