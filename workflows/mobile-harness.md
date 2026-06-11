# Workflow — Mobile Harness

**Type:** Top-level mobile delivery orchestration  
**Agents Used:** MOBILE-HARNESS, APPFORGE, MRECALL, AXIOM / SWIFT / DART / BRIDGE, CRASHER, PERF, LAUNCHPAD, SCRIBE, PIPELINE  
**Skills Used:** /mobile-mcp-qa, /accessibility-audit, /perf-audit, /mrecall-save, /release-prep, /store-listing

---

## When to Use

Use this workflow when a user wants one orchestrator that can manage the complete mobile app lifecycle: idea, planning, implementation, verification, multi-session memory, device QA, and launch preparation.

This workflow is intentionally strict. It prevents the common AI failure mode of building code without proving it matches the product plan, design, and real-device behavior.

The goal is near-zero human effort. MOBILE-HARNESS should do routine product, engineering, QA, documentation, and release-prep work itself. The user should mainly provide the initial goal, approve major gates, and supply credentials or business decisions that cannot be inferred safely.

---

## Autonomy Contract

MOBILE-HARNESS is autonomous by default:

- Create missing docs instead of asking the user to write them.
- Choose practical MVP defaults when requirements are underspecified.
- Generate PRD, design plan, tasks, dependencies, roadmap, QA report, memory, and launch docs.
- Select the next safe task from `TASKS.md`.
- Implement one scoped task at a time.
- Run available tests, linters, builds, reviewers, and Mobile MCP QA.
- Compare behavior against `PRD.md` and UI against the design artifact.
- Fix failures that are inside the current task scope.
- Update `MRECALL.md` so work can resume days or weeks later.

Ask the user only for:

- Product or business decisions that change the MVP.
- Credentials, API keys, certificates, billing, or store account access.
- Paid, destructive, irreversible, or public release actions.
- Legal/privacy policy content that requires the owner.
- Approval before first implementation starts, unless the user has already approved the plan.
- External systems that are unavailable to the harness.

---

## Lifecycle Map

```text
0. START
   ↓ New idea or existing codebase?

1. MEMORY
   ↓ Load or create MRECALL.md

2. PRODUCT PLAN
   ↓ APPFORGE discovery, PRD.md, design plan, TASKS.md, DEPENDENCIES.md

3. TASK LOOP
   ↓ Select exactly one task
   ↓ Implement only that task
   ↓ Platform review
   ↓ Tests
   ↓ PRD verification
   ↓ UI match review
   ↓ Mobile MCP QA
   ↓ Update MRECALL.md

4. FULL QA
   ↓ Accessibility, performance, crash risk, edge cases

5. LAUNCH
   ↓ Store listing, release notes, checklist, pipeline
```

---

## Source of Truth

| Artifact | Required | Owner | Purpose |
|---|---|---|---|
| `MRECALL.md` | Required for multi-session work | MRECALL | Context, decisions, current task, next action |
| `PRD.md` | Required before implementation | APPFORGE | Product behavior and requirements |
| Design plan / `DESIGN.md` | Required before UI implementation | APPFORGE | Visual target and UI states |
| `TASKS.md` | Required before implementation | APPFORGE | Task scope and acceptance criteria |
| `DEPENDENCIES.md` | Required before implementation | APPFORGE / PIPELINE | Libraries, APIs, env vars, build constraints |
| `ROADMAP.md` | Recommended | APPFORGE | Milestones and sequencing |
| `MOBILE_HARNESS_REPORT.md` | Required after each cycle | MOBILE-HARNESS | Evidence and pass/fail state |

If any required artifact is missing, MOBILE-HARNESS creates or updates it through APPFORGE before coding.

---

## Stage 1 — Start or Restore

Ask whether this is:

- New app idea
- Existing codebase
- Existing feature in progress
- QA-only pass
- Launch preparation

Then load `MRECALL.md` if present. If no memory file exists and the work is more than a short one-off, create one.

If the user already gave enough context to infer the mode, do not stop for this question. Pick the mode, document the assumption in `MRECALL.md`, and continue.

---

## Stage 2 — Product Planning

If product artifacts are missing, run APPFORGE internally:

1. Discovery
2. `PRD.md`
3. Design plan
4. `TASKS.md`
5. `DEPENDENCIES.md`
6. `ROADMAP.md`

Do not implement until the user approves these artifacts.

Do not ask the user to draft these files. MOBILE-HARNESS owns the first complete version and asks for approval or corrections.

---

## Stage 3 — One-Task Implementation Loop

For each task:

1. Read `MRECALL.md`.
2. Read `PRD.md`.
3. Read design plan.
4. Read `TASKS.md`.
5. Read `DEPENDENCIES.md`.
6. Select exactly one task.
7. Implement only that task.
8. Run platform reviewer.
9. Run tests.
10. Verify behavior against `PRD.md`.
11. Verify UI against design.
12. Run `/mobile-mcp-qa` if device automation is available.
13. Write `MOBILE_HARNESS_REPORT.md`.
14. Update `MRECALL.md`.

After a task passes, continue to the next safe task automatically when the user has approved autonomous execution for the project. Stop only at human gates defined in the Autonomy Contract.

---

## Stage 4 — PRD Verification

Every acceptance criterion must reference a source:

```markdown
| Criteria | Source | Result | Evidence |
|---|---|---|---|
| Save button disabled until form is valid | PRD.md > Functional Requirements > Invoice Form | PASS | Unit test + screenshot |
```

Never verify against memory or assumptions.

---

## Stage 5 — UI Match Review

Compare implementation against the approved design artifact:

- Layout
- Spacing
- Typography
- Colors
- Components
- Responsiveness
- Empty/loading/error states
- Accessibility

Default pass threshold: 90%.

---

## Stage 6 — Mobile MCP QA

Run `/mobile-mcp-qa` when a device, emulator, or simulator is available.

Capture:

- Device name
- App id
- Screen size
- Screenshots
- Element list
- User flow results
- Edge cases
- Accessibility issues
- Restart/rotation results

If Mobile MCP is unavailable, mark this stage `SKIPPED` and provide manual QA steps.

---

## Stage 7 — Full QA and Launch Prep

After task loop completion:

- Run `/accessibility-audit`
- Run PERF or `/perf-audit`
- Run CRASHER if crash logs appear
- Run LAUNCHPAD or `/store-listing`
- Run SCRIBE for release notes
- Run PIPELINE if build/release automation is missing
- Run `/release-prep`

---

## Pass Criteria

A task can be marked done only when:

- Acceptance criteria pass
- Tests pass or accepted skip is documented
- PRD verification passes
- UI match is at or above threshold
- Mobile MCP QA passes or accepted skip is documented
- No CRITICAL platform-review findings remain
- `MRECALL.md` is updated
- NEXT ACTION is either the next task or a concrete fix

---

## Handoff Prompts

Start from scratch:

```text
Use MOBILE-HARNESS. Start from a new app idea and orchestrate APPFORGE, MRECALL, implementation, QA, and launch prep.
```

Resume multi-day feature:

```text
Use MOBILE-HARNESS. Read MRECALL.md, PRD.md, DESIGN.md, TASKS.md, and DEPENDENCIES.md. Continue from NEXT ACTION.
```

QA-only:

```text
Use MOBILE-HARNESS in QA_ONLY mode. Run /mobile-mcp-qa against this app flow and produce MOBILE_HARNESS_REPORT.md.
```
