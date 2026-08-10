# Workflow - Mobile Flight Recorder

**Type:** Persistent project context and AI handoff  
**Agents Used:** Mobile Memory, MOBILE-HARNESS, APPFORGE, CRASHER, PERF, SENTINEL  
**Skills Used:** /mobile-memory-save, /mobile-memory-search, /mobile-memory-graph, /prd-verification, /mobile-mcp-qa

---

## When to Use

Use this workflow at the end of every meaningful mobile AI session, before switching tools, before tokens run out, before handing work to another developer, after device QA, or before opening a PR.

The goal is to create one durable project flight recorder that answers:

- What is this app?
- What did the agents decide?
- What changed?
- What is still broken?
- What exact action should the next AI or developer take?

This is the viral demo angle: before Flight Recorder, an AI session forgets the project. After Flight Recorder, any AI tool can resume from one file.

---

## Inputs

Collect these facts from the current session, repo, issue, PR, test output, and device evidence:

```text
PROJECT:
PLATFORM:
STACK:
REPO:
CURRENT BRANCH:
CURRENT GOAL:
DELIVERY PROFILE:
DESIGN SOURCE:
DEVICE / MOBILE MCP SETUP:
ARCHITECTURE:
IMPLEMENTED FEATURES:
CURRENT TASK:
PENDING TASKS:
KNOWN BUGS / RISKS:
TEST AND BUILD COMMANDS:
RECENT AGENT FINDINGS:
DECISIONS:
CHANGED FILES:
EVIDENCE:
LINKS:
NEXT RECOMMENDED ACTION:
```

If a field is unknown, write `UNKNOWN` instead of inventing it.

---

## Workflow

### 1. Restore Existing Context

Read these files when present:

```text
MOBILE_AGENCY_CONTEXT.md
MOBILE_MEMORY.md
MRECALL.md
.mobile-ai-agents/memory/index.md
PRD.md
DESIGN.md
TASKS.md
ROADMAP.md
```

Then search local memory if available:

```bash
npx mobile-ai-agents memory search "<current feature or issue>"
npx mobile-ai-agents memory timeline --limit 20
```

Use `/mobile-memory-search` when the search output needs to be converted into confirmed context, assumptions, files to read, and the next action.

### 2. Capture Session Events

Save important facts into local Mobile Memory when terminal access is available:

```bash
npx mobile-ai-agents memory capture --type decision --title "<decision>" --text "<why it was chosen>"
npx mobile-ai-agents memory capture --type finding --title "<agent finding>" --text "<risk, evidence, and status>"
npx mobile-ai-agents memory capture --type code-state --title "<changed files>" --text "<current diff or file summary>"
npx mobile-ai-agents memory capture --type next-action --text "<one executable next action>"
```

Do not capture secrets, customer data, private logs, tokens, credentials, signing keys, or proprietary crash payloads.

### 3. Update MOBILE_AGENCY_CONTEXT.md

Create or update `MOBILE_AGENCY_CONTEXT.md` with the stable schema below. Keep it concise enough to paste into any AI tool, but concrete enough that the next session does not need the user to repeat context.

````markdown
# Mobile Agency Context

**Last Updated:** YYYY-MM-DD HH:mm TZ
**Project:** <name>
**Platform:** <Android/iOS/Flutter/React Native/KMP/Unity/Unreal>
**Stack:** <language, framework, key libraries>
**Repo:** <repo URL or local path>
**Current Branch:** <branch>
**Current Goal:** <goal>
**Delivery Profile:** <prototype/MVP/release/hotfix>

## Design Source
<Figma link, screenshot path, PRD/design docs, or UNKNOWN>

## Device / Mobile MCP Setup
<device, emulator, simulator, app id, build variant, test account, or UNKNOWN>

## Architecture
<current architecture, module boundaries, state management, persistence, API layer>

## Implemented Features
- <feature and evidence>

## Current Task
<the work in progress>

## Pending Tasks
- <task, owner/tool if known, expected evidence>

## Known Bugs / Risks
- <bug/risk, severity, evidence, suggested fix>

## Test And Build Commands
```bash
<commands that are known to work>
````

## Recent Agent Findings
| Agent/Skill | Finding | Status |
|---|---|---|
| <name> | <finding> | <open/fixed/needs verification> |

## Decisions
| Decision | Reason | Rejected |
|---|---|---|
| <decision> | <reason> | <alternative> |

## Changed Files
- `<path>`: <what changed>

## Evidence
- <test output, screenshot, device proof report, PR link, issue link>

## Links
- <issue, PR, wiki, release, design>

## Next Recommended Action
<exactly one executable next step>

## Resume Prompt
Read `MOBILE_AGENCY_CONTEXT.md` and `MOBILE_MEMORY.md` if present. Continue from `Next Recommended Action`. Before editing, inspect the files listed in `Changed Files`, preserve existing user changes, and update this file before stopping.
```

### 4. Generate Mobile Memory Checkpoint

When local memory has useful events, generate the portable memory file:

```bash
npx mobile-ai-agents memory checkpoint
```

When there is no local memory store or time is short, run:

```text
/mobile-memory-save
```

Use `MOBILE_MEMORY.md` for compact session continuity and `MOBILE_AGENCY_CONTEXT.md` for the broader project flight recorder.

### 5. Verify The Handoff

Before stopping, check:

- `Next Recommended Action` is one command or one implementation step.
- Known bugs include severity and evidence.
- Test commands are real commands, not generic advice.
- Device setup says exactly what was tested or says `UNKNOWN`.
- Changed files are specific enough for review.
- Resume prompt works in Claude Code, Cursor, Windsurf, Codex, ChatGPT, Gemini, and Copilot.

---

## End-of-Session Prompt

Use this prompt at the end of a session:

```text
Run Mobile Flight Recorder. Update MOBILE_AGENCY_CONTEXT.md and MOBILE_MEMORY.md if useful. Capture decisions, files changed, tests run, known bugs, device setup, links, and exactly one Next Recommended Action. Do not include secrets.
```

Use this prompt to resume:

```text
Read MOBILE_AGENCY_CONTEXT.md and MOBILE_MEMORY.md if present. Continue from Next Recommended Action. Inspect changed files before editing and update the flight recorder before stopping.
```

---

## Output

- Updated `MOBILE_AGENCY_CONTEXT.md`
- Optional updated `MOBILE_MEMORY.md`
- Optional `.mobile-ai-agents/memory/` events
- One tool-agnostic resume prompt
- One executable next action

---

## Failure Modes

- If the next action has multiple steps, split it and keep only the first executable step.
- If device evidence is missing, write `UNKNOWN` and list the Mobile MCP/device command needed next.
- If a decision has no reason, mark it `NEEDS CONFIRMATION`.
- If a bug has no evidence, mark it as a risk instead of a confirmed bug.
- If the file would expose secrets or private logs, redact them before saving.
