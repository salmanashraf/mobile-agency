# Mobile Memory

Mobile Memory is a mobile-specific AI memory and knowledge graph system for Mobile Agency. It captures project architecture, session decisions, agent findings, health risks, code state, and the next executable action into local project memory and a portable `MOBILE_MEMORY.md` handoff file.

The goal is simple: when tokens run out or a developer switches tools, the next AI session can continue without asking for the same explanation again.

---

## Why It Exists

Generic AI coding sessions lose context:

- Architecture decisions vanish between sessions.
- Agent findings from AXIOM, CRASHER, DART, SWIFT, and BRIDGE are forgotten.
- Mid-edit files become risky because the next AI cannot see what was already decided.
- Large codebases cost too many tokens to reload from scratch.

Mobile Memory preserves the mobile-specific parts of context that matter most:

- ViewModels, repositories, use cases, widgets, screens, services, APIs, databases, tests
- Edges like `OBSERVES`, `CALLS`, `INJECTS`, `EMITS`, `NAVIGATES_TO`, and `VIOLATES`
- CRITICAL/WARNING/DEBT health nodes
- The exact `NEXT ACTION`

---

## Token Reduction Math

Mobile Memory reduces tokens by replacing raw files with a graph and a session state summary.

Typical Android feature:

| Source | Files | Avg tokens | Total |
|---|---:|---:|---:|
| Compose screens | 4 | 2,500 | 10,000 |
| ViewModels | 3 | 2,000 | 6,000 |
| Use cases | 5 | 700 | 3,500 |
| Repositories | 3 | 1,800 | 5,400 |
| API/DAO/models | 12 | 600 | 7,200 |
| Tests | 8 | 1,200 | 9,600 |
| Prior chat context | 1 | 18,000 | 18,000 |
| Total raw context | 36 | - | 59,700 |

A high-quality Mobile Memory checkpoint for the same feature is usually 700-1,200 tokens:

```text
59,700 raw tokens / 750 Mobile Memory tokens = 79.6x reduction
```

That is where the "up to 80x" claim comes from. Smaller snippets reduce less. Large mobile features reduce more because repeated code bodies collapse into graph nodes, edges, health findings, and decisions.

---

## How It Differs From Generic Memory Tools

Tools like Recallium, mem0, and agentmemory are useful generic memory layers. Mobile Memory is different because it understands mobile architecture.

| Generic memory tools | Mobile Memory |
|---|---|
| Store arbitrary facts | Stores mobile architecture state |
| Remember text snippets | Builds UI/VM/Domain/Data/Net/DB graphs |
| Need manual meaning | Knows ViewModel, ObservableObject, StateNotifier, Context, MonoBehaviour |
| Generic links | Mobile edge types: OBSERVES, EMITS, NAVIGATES_TO, VIOLATES |
| Generic risk | Flags GlobalScope, force unwraps, exposed MutableStateFlow, bridge hot paths, Update() abuse |
| Session recall | Session recall plus executable NEXT ACTION |

Mobile Memory has two layers:

| Layer | Storage | Purpose |
|---|---|---|
| Local memory | `.mobile-agency/memory/events.jsonl` | Persistent project event history for search, timeline, and context injection |
| Portable checkpoint | `MOBILE_MEMORY.md` | Tool-agnostic handoff file that any AI can read |

Raw local memory stays out of git by default. Commit `MOBILE_MEMORY.md` only when the context is useful for review, handoff, or long-running work.

---

## Local Memory Store

Initialize memory inside any app project:

```bash
npx mobile-agency memory init
```

This creates:

```text
.mobile-agency/
├── .gitignore
└── memory/
    ├── config.json
    ├── events.jsonl
    └── index.md
```

Capture memory events:

```bash
npx mobile-agency memory capture --type decision --title "Use Room" --text "Persist habits locally with Room."
npx mobile-agency memory capture --type finding --title "PRD gap" --text "Restart persistence is missing."
npx mobile-agency memory capture --type next-action --text "Implement HabitDao and restart persistence test."
```

You can also pipe content:

```bash
git diff | npx mobile-agency memory capture --type code-state --title "Current diff"
```

Search and inject context:

```bash
npx mobile-agency memory search persistence
npx mobile-agency memory timeline --limit 20
npx mobile-agency memory inject
```

Generate the portable checkpoint:

```bash
npx mobile-agency memory checkpoint
```

This writes `MOBILE_MEMORY.md` from the captured memory events. Review it before committing.

Privacy rule: do not capture secrets, customer data, private logs, tokens, credentials, or proprietary crash payloads. Text inside `<private>...</private>` is removed during capture.

---

## Graphify Integration

Graphify can be used first to create a general graph of a project. Mobile Memory enhances that output with mobile semantics:

1. Run Graphify to discover broad dependency structure.
2. Run `/mobile-memory graph` on the relevant mobile files.
3. Merge Graphify's broad nodes with Mobile Memory's mobile-specific node types and health labels.
4. Save the result in `MOBILE_MEMORY.md`.

Mobile Memory uses confidence tags similar to graph-first tools:

- `EXTRACTED`: direct code evidence exists
- `INFERRED`: relationship is strongly implied
- `AMBIGUOUS`: relationship may exist but needs more code

---

## Portable Checkpoint Format

```markdown
---
# Mobile Memory
**Project:** [name]
**Platform:** [Android/iOS/Flutter/RN/Unity/Unreal]
**Stack:** [language, framework, key libraries]
**Architecture:** [pattern]
**Saved:** [date]
**Compatible:** Claude Code · Cursor · Windsurf · ChatGPT · Gemini · Copilot
**Token reduction:** [X× vs reading raw files]

---

## ⚡ INSTANT RESUME
[2-4 sentences. Fully self-contained. No assumed knowledge. What project, what task, what decisions, what to do next.]

---

## 🗺️ Knowledge Graph

### Nodes
| Node | Type | Layer | Health |
|---|---|---|---|
| [ClassName] | [VM/REPO/UI/etc] | [UI/Domain/Data] | [OK/CRITICAL/WARNING] |

### Key Edges
| From | Edge | To | Note |
|---|---|---|---|
| [Node] | OBSERVES | [Node] | [why this matters] |

### God Nodes
| Node | Connections | Platform Risk | Recommendation |
|---|---|---|---|

### Architecture Violations
- [Class] VIOLATES [rule] — [explanation] → [fix]

---

## 🏥 Health Report
### 🚨 CRITICAL
- [Node]: [issue] → [fix]

### ⚠️ WARNING
- [Node]: [issue] → [fix]

### 🏦 Tech Debt
- [Node]: [debt] → [migration path]

---

## 🎯 Session Context

### Current Task
[Exact task in one paragraph]

### Decisions Made
| Decision | Reason | Rejected |
|---|---|---|

### Progress
✅ Done: [list]
🔄 In Progress: [exact state of anything mid-edit]
⏭️ NEXT ACTION: [specific, executable, no assumed context]
🚧 Blocked: [list or "Nothing"]

### Open Questions
- [question 1]
- [question 2]

---

## 🤖 Agent State
| Agent | Last Action | Finding | Pending |
|---|---|---|---|
| AXIOM | [what it reviewed] | [what it found] | [what remains] |

---

## 📄 Code State
[For any file mid-edit, paste current state here]

---

## 🔄 Resume Instructions

**Claude Code:**
Start new session → paste INSTANT RESUME → paste full MOBILE_MEMORY.md → say "Continue"

**Cursor/Windsurf:**
Save as MOBILE_MEMORY.md in project root → next prompt: "Read MOBILE_MEMORY.md and continue"

**ChatGPT/Gemini:**
Paste full file as first message → "Resume from NEXT ACTION"

**Same tool, new session:**
Paste full file → /mobile-memory restore
---
```

---

## Commands

Preferred CLI:

| Command | Use |
|---|---|
| `mobile-agency memory init` | Create local project memory |
| `mobile-agency memory capture` | Save decisions, findings, progress, and next actions |
| `mobile-agency memory search` | Search local project memory |
| `mobile-agency memory timeline` | Show recent memory events |
| `mobile-agency memory inject` | Print compact context for a new AI session |
| `mobile-agency memory checkpoint` | Generate `MOBILE_MEMORY.md` |

Legacy slash aliases:

| Command | Use |
|---|---|
| `/mobile-memory save` | Produce full `MOBILE_MEMORY.md` |
| `/mobile-memory restore` | Load a pasted `MOBILE_MEMORY.md` and continue |
| `/mobile-memory graph` | Build the knowledge graph from code files |
| `/mobile-memory-search` | Search local `.mobile-agency/memory/` output and continue from relevant context |
| `/mobile-memory update` | Update an existing checkpoint |
| `/mobile-memory status` | Print only progress state |
| `/mobile-memory health` | Print CRITICAL and WARNING nodes |
| `/mobile-memory next` | Print only NEXT ACTION |
| `/mobile-memory decisions` | Print decisions from the session |
| `/mobile-memory diff` | Show changes since last save |

---

## FAQ

### Is Mobile Memory a replacement for reading code?

No. It is a resume layer. Use it to restore context quickly, then read the exact files needed for the next action.

### Should MOBILE_MEMORY.md be committed?

Commit `MOBILE_MEMORY.md` when the context is useful for handoff, review, or long-lived work. Do not commit `.mobile-agency/memory/events.jsonl` unless your team explicitly wants raw local event history in source control. Do not commit secrets, private logs, customer data, or proprietary crash payloads.

### How often should I capture memory?

Capture memory after major architectural decisions, after agent findings, before switching tools, and when the session is long enough that re-explaining would be expensive.

### Why does it include health nodes?

Mobile projects fail at boundaries: lifecycle, state ownership, navigation, threading, persistence, and platform APIs. Health nodes preserve those risks so the next AI does not repeat unsafe work.

### Can ChatGPT or Gemini use it?

Yes. Paste the full file as the first message and say: "Resume from NEXT ACTION." Mobile Memory checkpoints are plain Markdown and do not depend on a specific AI tool.
