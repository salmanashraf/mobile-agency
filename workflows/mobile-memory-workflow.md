# Workflow — Mobile Memory Context Loop

**Type:** AI session continuity  
**Agents Used:** Mobile Memory, AXIOM, CRASHER, SWIFT, DART, BRIDGE, SENTINEL, PERF
**Skills Used:** /mobile-memory-save, /mobile-memory-graph, /mobile-memory-search, /grill-mobile, /crash-triage, /release-prep

---

## When to Use

Use this workflow when a mobile project will span multiple AI sessions, multiple tools, or multiple teammates. It prevents context loss when tokens run out, a session resets, or a teammate needs to continue from the exact current state.

---

## Quick Reference

```text
Session Start
    ↓
mobile-agency memory inject
    ↓
/mobile-memory restore
    ↓
/grill-mobile → decisions captured
    ↓
Build / refactor / debug
    ↓
AXIOM / CRASHER / DART / SWIFT findings captured
    ↓
mobile-agency memory capture
    ↓
/mobile-memory save before context runs out
    ↓
Commit MOBILE_MEMORY.md for handoff
    ↓
Next AI tool reads MOBILE_MEMORY.md and continues from NEXT ACTION
```

---

## Full Loop

### 1. Initialize Local Memory

Run once per project:

```bash
npx mobile-agency memory init
```

Capture durable events during the project:

```bash
npx mobile-agency memory capture --type decision --text "Use Room for offline persistence."
npx mobile-agency memory capture --type finding --text "PRD verification failed because restart persistence is missing."
npx mobile-agency memory capture --type next-action --text "Implement HabitDao and restart persistence test."
```

Raw events are stored in `.mobile-agency/memory/events.jsonl` and ignored by git by default.

### 2. Session Start

Run:

```bash
npx mobile-agency memory inject
```

Paste the output into the new AI session, or ask the AI to run it when the tool has terminal access.

Then run:

```text
/mobile-memory restore
```

Then paste the existing `MOBILE_MEMORY.md`. Mobile Memory summarizes the project in five bullets, briefs the active agent state, and continues from `NEXT ACTION`.

Output to expect:

```text
Mobile Memory loaded. Here is what I know:
- Platform, stack, and architecture
- Current task
- Decisions already made
- Health risks and active agent findings
- The exact NEXT ACTION
```

### 3. During Development

Run:

```text
/grill-mobile
```

Capture requirements and decisions directly into the next Mobile Memory update:

- Target platform and OS constraints
- Architecture decisions
- State management choices
- API, persistence, navigation, and test decisions
- Rejected alternatives

Also capture durable decisions into local memory:

```bash
npx mobile-agency memory capture --type decision --title "State management" --text "Use StateFlow in ViewModels and collectAsStateWithLifecycle in Compose."
```

### 4. Code Review

Run the platform agent:

```text
@AXIOM review CartViewModel.kt
/flutter-review checkout_page.dart
@SWIFT review ProfileViewModel.swift
```

Write findings into the `Agent State` and `Health Report` sections:

```text
AXIOM → CartViewModel → CRITICAL: direct repository construction → pending DI refactor
```

Capture the finding:

```bash
npx mobile-agency memory capture --type finding --title "AXIOM CartViewModel" --text "CRITICAL: direct repository construction; pending DI refactor."
```

### 5. Crash Analysis

Run:

```text
/crash-triage
@CRASHER analyze crash.log
```

Mobile Memory stores:

- Crash type and severity
- Failure path
- Root cause
- Regression test
- Pending fix

Critical crash findings belong in `Health Report > CRITICAL`.

### 6. Search Before Continuing

When returning to a project after days or weeks, search local memory before re-reading the full codebase:

```bash
npx mobile-agency memory search persistence
npx mobile-agency memory timeline --limit 20
```

Use `/mobile-memory-search` to turn search output into confirmed context, assumptions, files to read next, and one `NEXT ACTION`.

### 7. Token Warning

When the session covers several topics, writes large code, or produces agent findings, run:

```text
/mobile-memory save
```

This creates the full `MOBILE_MEMORY.md` checkpoint. A new session can load it and continue without reading the entire codebase again.

You can also generate `MOBILE_MEMORY.md` from local memory:

```bash
npx mobile-agency memory checkpoint
```

### 8. Feature Complete

Run:

```text
/mobile-memory update
```

Update `MOBILE_MEMORY.md` with:

- Completed files
- Final decisions
- Agent findings resolved
- Remaining tech debt
- Next release or review action

Commit `MOBILE_MEMORY.md` with the feature branch when the session context is valuable for review or handoff.

### 9. Team Handoff

Commit or send `MOBILE_MEMORY.md`. The teammate opens any AI tool and says:

```text
Read MOBILE_MEMORY.md and continue from NEXT ACTION.
```

No re-explanation required. The teammate's AI sees the architecture, graph, decisions, health report, and exact next step.

---

## Integration Points

| Moment | Tool | Memory Section Updated |
|---|---|---|
| Memory setup | `mobile-agency memory init` | Local event store |
| Session start | `mobile-agency memory inject`, `/mobile-memory restore` | Instant Resume, Progress |
| Requirements | `/grill-mobile` | Decisions Made, Open Questions |
| Durable decision | `mobile-agency memory capture` | `.mobile-agency/memory/events.jsonl` |
| Memory search | `mobile-agency memory search`, `/mobile-memory-search` | Relevant context |
| Architecture map | `/mobile-memory graph` | Knowledge Graph |
| Android review | `AXIOM` | Agent State, Health Report |
| Crash debug | `CRASHER` | Health Report, Current Task |
| Token warning | `/mobile-memory save` | Full checkpoint |
| Feature complete | `/mobile-memory update` | Progress, NEXT ACTION |
| Team handoff | Committed `MOBILE_MEMORY.md` | Resume Instructions |

---

## Output

- A portable `MOBILE_MEMORY.md`
- A mobile architecture knowledge graph
- A preserved list of decisions and rejected alternatives
- Agent findings that survive session resets
- One executable `NEXT ACTION`

---

## Failure Modes

- If `NEXT ACTION` is vague, rewrite it before saving.
- If a relationship is inferred from naming only, mark it `INFERRED`.
- If a file is mid-edit, paste enough current code in `Code State` for a new AI to avoid guessing.
- If a finding is resolved, move it from `CRITICAL` or `WARNING` to `Done` or `Tech Debt`.
