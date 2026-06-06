# Workflow — MRecall Context Loop

**Type:** AI session continuity  
**Agents Used:** MRECALL, AXIOM, CRASHER, SWIFT, DART, BRIDGE, SENTINEL, PERF  
**Skills Used:** /mrecall-save, /mrecall-graph, /grill-mobile, /crash-triage, /release-prep

---

## When to Use

Use this workflow when a mobile project will span multiple AI sessions, multiple tools, or multiple teammates. It prevents context loss when tokens run out, a session resets, or a teammate needs to continue from the exact current state.

---

## Quick Reference

```text
Session Start
    ↓
/mrecall restore
    ↓
/grill-mobile → decisions captured
    ↓
Build / refactor / debug
    ↓
AXIOM / CRASHER / DART / SWIFT findings captured
    ↓
/mrecall save before context runs out
    ↓
Commit MRECALL.md for handoff
    ↓
Next AI tool reads MRECALL.md and continues from NEXT ACTION
```

---

## Full Loop

### 1. Session Start

Run:

```text
/mrecall restore
```

Then paste the existing `MRECALL.md`. MRECALL summarizes the project in five bullets, briefs the active agent state, and continues from `NEXT ACTION`.

Output to expect:

```text
MRECALL loaded. Here is what I know:
- Platform, stack, and architecture
- Current task
- Decisions already made
- Health risks and active agent findings
- The exact NEXT ACTION
```

### 2. During Development

Run:

```text
/grill-mobile
```

Capture requirements and decisions directly into the next MRECALL update:

- Target platform and OS constraints
- Architecture decisions
- State management choices
- API, persistence, navigation, and test decisions
- Rejected alternatives

### 3. Code Review

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

### 4. Crash Analysis

Run:

```text
/crash-triage
@CRASHER analyze crash.log
```

MRECALL stores:

- Crash type and severity
- Failure path
- Root cause
- Regression test
- Pending fix

Critical crash findings belong in `Health Report > CRITICAL`.

### 5. Token Warning

When the session covers several topics, writes large code, or produces agent findings, run:

```text
/mrecall save
```

This creates the full `MRECALL.md` checkpoint. A new session can load it and continue without reading the entire codebase again.

### 6. Feature Complete

Run:

```text
/mrecall update
```

Update `MRECALL.md` with:

- Completed files
- Final decisions
- Agent findings resolved
- Remaining tech debt
- Next release or review action

Commit `MRECALL.md` with the feature branch when the session context is valuable for review or handoff.

### 7. Team Handoff

Commit or send `MRECALL.md`. The teammate opens any AI tool and says:

```text
Read MRECALL.md and continue from NEXT ACTION.
```

No re-explanation required. The teammate's AI sees the architecture, graph, decisions, health report, and exact next step.

---

## Integration Points

| Moment | Tool | MRECALL Section Updated |
|---|---|---|
| Session start | `/mrecall restore` | Instant Resume, Progress |
| Requirements | `/grill-mobile` | Decisions Made, Open Questions |
| Architecture map | `/mrecall graph` | Knowledge Graph |
| Android review | `AXIOM` | Agent State, Health Report |
| Crash debug | `CRASHER` | Health Report, Current Task |
| Token warning | `/mrecall save` | Full checkpoint |
| Feature complete | `/mrecall update` | Progress, NEXT ACTION |
| Team handoff | Committed `MRECALL.md` | Resume Instructions |

---

## Output

- A portable `MRECALL.md`
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
