# Skill — /mobile-memory-save

**Platform:** Cross-Platform  
**Slash Command:** `/mobile-memory-save`  
**Composable With:** Mobile Memory, AXIOM, CRASHER, SWIFT, DART, BRIDGE, PERF

---

## Purpose

Create a compact `MOBILE_MEMORY.md` checkpoint fast. Use this when the session is getting long, a major decision was made, or you need to switch AI tools without losing progress.

This skill does not require activating the full Mobile Memory agent. It produces a smaller file with only:

- `INSTANT RESUME`
- `Progress`
- `NEXT ACTION`
- `Code State`
- Resume instructions

---

## Input Format

```text
COMMAND: /mobile-memory-save
PROJECT: <project name>
PLATFORM: <Android/iOS/Flutter/RN/Unity/Unreal>
CURRENT TASK:
<what we are doing>
DECISIONS:
<bullet list of decisions made>
PROGRESS:
<done / in progress / blocked>
CODE STATE:
<files changed, files mid-edit, important snippets if needed>
NEXT ACTION:
<one executable instruction>
```

If the user does not provide fields, infer them from the conversation and mark uncertain items as `AMBIGUOUS`.

---

## Skill Prompt

```text
Create a compact MOBILE_MEMORY.md checkpoint from the current session.

Rules:
1. Capture only what a future AI needs to continue without asking the user to repeat context.
2. Do not summarize away decisions, blockers, or file names.
3. Produce exactly one NEXT ACTION. It must be executable, concrete, and free of assumed context.
4. Include code state for any file mid-edit or any snippet that would be lost between sessions.
5. Use the compact MOBILE_MEMORY.md format below. Do not add extra sections.

Compact MOBILE_MEMORY.md format:

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
[2-4 self-contained sentences covering project, task, decisions, progress, and next move.]

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

## Output Format

Return a single Markdown document named `MOBILE_MEMORY.md` using the compact format in the prompt.

---

## Example

### Input

```text
COMMAND: /mobile-memory-save
PROJECT: PayTrack
PLATFORM: Flutter
CURRENT TASK: Replace setState checkout form with Riverpod StateNotifier.
DECISIONS:
- Keep checkout validation in CheckoutController.
- Use AsyncValue for submit state.
- Keep navigation in the widget after successful submit.
PROGRESS:
- Done: controller skeleton created.
- In progress: widget still calls setState in _submit().
- Blocked: none.
CODE STATE:
lib/checkout/checkout_page.dart has old _submitting bool.
NEXT ACTION: Replace _submitting bool with ref.watch(checkoutControllerProvider).isLoading and call controller.submit(orderId).
```

### Output

```markdown
---
# Mobile Memory
**Project:** PayTrack
**Platform:** Flutter
**Stack:** Dart, Flutter, Riverpod
**Architecture:** Feature-first MVVM with StateNotifier controllers
**Saved:** 2026-06-06
**Compatible:** Claude Code · Cursor · Windsurf · ChatGPT · Gemini · Copilot
**Token reduction:** 18× vs reading raw files

---

## ⚡ INSTANT RESUME
PayTrack is a Flutter app refactoring checkout from local setState to a Riverpod StateNotifier. The session decided validation belongs in CheckoutController, submit state should use AsyncValue, and navigation remains in the widget after success. The controller skeleton exists, but checkout_page.dart still uses a local _submitting bool. Continue by replacing _submitting with provider state and routing submit through CheckoutController.submit(orderId).

---

## 🎯 Session Context

### Current Task
Replace the checkout page's local setState submit flow with a Riverpod StateNotifier while preserving existing navigation behavior.

### Decisions Made
| Decision | Reason | Rejected |
|---|---|---|
| Keep validation in CheckoutController | Makes submit logic testable | Validation inside widget callbacks |
| Use AsyncValue for submit state | Represents loading, success, and error cleanly | Separate bool and error fields |
| Keep navigation in widget | UI owns navigation after controller success | Controller using BuildContext |

### Progress
✅ Done: CheckoutController skeleton created.
🔄 In Progress: checkout_page.dart still owns _submitting and _submit().
⏭️ NEXT ACTION: Replace _submitting bool in lib/checkout/checkout_page.dart with ref.watch(checkoutControllerProvider).isLoading and call ref.read(checkoutControllerProvider.notifier).submit(orderId) from the submit button.
🚧 Blocked: Nothing

### Open Questions
- Should submit errors render inline or as a SnackBar?

---

## 📄 Code State
lib/checkout/checkout_page.dart still has a private `_submitting` bool and `_submit()` method that call setState before and after the API call.

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
