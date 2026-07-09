# Workflow — APPFORGE Idea to Store

**Type:** Idea to production launch  
**Agents Used:** APPFORGE, AXIOM / SWIFT / DART / BRIDGE, SENTINEL, PERF, LAUNCHPAD, PIPELINE, SCRIBE, Mobile Memory
**Skills Used:** /grill-mobile, /feature-slice, /perf-audit, /accessibility-audit, /release-prep, /store-listing, /mrecall-save

---

## When to Use

Use APPFORGE when a developer has a rough mobile app idea and needs a disciplined path to a small, shippable MVP prepared for Play Store launch.

Supported platforms:

- Android
- iOS
- Flutter
- React Native

---

## Stage Gate Loop

```text
Idea
  ↓
Stage 1: Discovery
  ↓ approve discovery
Stage 2: PRD.md
  ↓ approve PRD
Stage 3: Design Plan
  ↓ approve design
Stage 4: TASKS.md + DEPENDENCIES.md + ROADMAP.md
  ↓ approve tasks
Stage 5: Implement one subtask
  ↓ acceptance criteria pass
Stage 6: UI Match Review
  ↓ feature passes
Stage 7: Full QA
  ↓ launch readiness accepted
Stage 8: Play Store Preparation
```

APPFORGE must not skip a gate. If a gate is not approved, revise the current artifact instead of moving forward.

---

## Stage 1 — App Idea Discovery

Ask:

1. What app idea do you have?
2. Which platform are you building for?
3. Are you building solo or with a team?
4. What is your target launch date?
5. Do you want AI features, ads, subscription, or one-time purchase?
6. Do you already have designs or should we create wireframes from scratch?
7. What design direction should the app use? Examples: clean utility, polished consumer, playful gamified, premium wellness, dense dashboard, enterprise/admin, kids/education, game-like, or custom reference.
8. Which tech stack do you want to use?

Then produce five refined ideas, the best recommendation, target audience, problem statement, value proposition, monetization, and MVP scope.

---

## Stage 2 — PRD Creation

Create `PRD.md` with:

- Product overview
- Target audience
- User personas
- Core features
- User flows
- Functional requirements
- Non-functional requirements
- Monetization
- Analytics events
- Edge cases
- Risks
- MVP vs future features

---

## Stage 3 — Free Design Plan

Use free or low-cost tools:

- Pencil Project
- Figma free plan
- Penpot
- Excalidraw
- Canva free
- Hand-drawn wireframes

Create screen list, wireframe descriptions, design system, colors, typography, components, empty/loading/error states, and screenshot plan.

Before generating the design plan, ask or infer design direction:

- Clean utility
- Polished consumer
- Playful gamified
- Premium wellness
- Dense dashboard
- Enterprise/admin
- Kids/education
- Game-like
- Custom reference

The design plan must state the chosen direction, target emotion, first-screen goal, visual hierarchy, and why the style fits the audience. For demo-grade work, do not default to plain stock UI unless the user chooses clean utility.

---

## Stage 4 — Task Breakdown

Create:

- `TASKS.md`
- `DEPENDENCIES.md`
- `ROADMAP.md`

Each task must include title, goal, dependencies, likely files, acceptance criteria, QA checklist, estimated complexity, and implementation notes.

Add `/prd-verification` as the required post-implementation gate for every task. It must compare the implementation, tests, screenshots, and Mobile MCP evidence against `PRD.md`, `DESIGN.md`, and `TASKS.md` before APPFORGE marks a task complete.

---

## Stage 5 — Implementation Loop

For each subtask:

1. Read `PRD.md`.
2. Read the design plan.
3. Read `DEPENDENCIES.md`.
4. Implement only the current subtask.
5. Do not modify unrelated files.
6. Explain changed files.
7. Confirm acceptance criteria.
8. Compare output with design.
9. Run tests if available.
10. Run `/prd-verification` with PRD/design/tasks, changed files, tests, screenshots, and QA reports.
11. Mark task complete only when it matches PRD and design.

Use the platform reviewer after implementation:

- Android: AXIOM
- iOS: SWIFT
- Flutter: DART
- React Native: BRIDGE

---

## Stage 6 — UI Match Review

Check:

- Layout
- Spacing
- Typography
- Colors
- Components
- Responsiveness
- Empty states
- Loading states
- Error states
- Accessibility

Output match percentage, differences found, fix recommendations, and priority list.

---

## Stage 7 — Full QA

Test:

- Authentication
- Main flows
- Edge cases
- Offline behavior
- API errors
- App restart
- Rotation
- Performance
- Crash risks
- Memory leaks
- Accessibility
- Analytics events

Output:

- `QA_REPORT.md`
- Bug list
- Fix priority
- Launch readiness score

Mobile MCP integration belongs here when device automation is available. Use it for emulator/simulator or real-device screenshots, UI element inspection, taps, text input, app launch, app install, and repeated QA flows.

---

## Stage 8 — Play Store Preparation

Use LAUNCHPAD and `/store-listing` to create:

- `PLAYSTORE_LISTING.md`
- `SCREENSHOT_PLAN.md`
- `RELEASE_CHECKLIST.md`

Include app names, short description, full description, keywords, screenshot captions, feature graphic brief, app icon brief, privacy policy checklist, data safety checklist, release notes, and testing instructions.

---

## Outputs

| Stage | Artifact |
|---|---|
| Discovery | Refined idea set + recommended MVP |
| PRD | `PRD.md` |
| Design | Free design plan + screenshot plan |
| Tasks | `TASKS.md`, `DEPENDENCIES.md`, `ROADMAP.md` |
| Implementation | Per-task implementation summaries |
| UI Review | Match percentage + fix list |
| QA | `QA_REPORT.md` |
| Store | `PLAYSTORE_LISTING.md`, `SCREENSHOT_PLAN.md`, `RELEASE_CHECKLIST.md` |

---

## Operating Rules

- Keep MVP small enough to ship.
- Ask questions when requirements are unclear.
- Preserve context with `/mrecall-save` after every approved stage.
- Do not implement code until the PRD, design, and task breakdown are approved.
- Do not mark a task complete until acceptance criteria and design match are verified.
