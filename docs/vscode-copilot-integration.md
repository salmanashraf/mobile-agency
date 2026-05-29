# Using Mobile Dev Skill Agents with GitHub Copilot (VS Code)

GitHub Copilot Chat supports custom workspace instructions via `.github/copilot-instructions.md`. When this file exists in your repo, Copilot Chat reads it automatically for every `@workspace` query.

This repo includes a pre-built `copilot-instructions.md` that loads the full agent index and platform conventions into Copilot.

---

## Setup (One-Time)

The file `.github/copilot-instructions.md` is already in this repo. No configuration needed — open the repo in VS Code with the GitHub Copilot extension installed, and it is active.

To verify, open Copilot Chat and ask:

> @workspace What agents are available for Android development?

Copilot should list the Android Code Reviewer, Android Crash Analyzer, and Android Compose UI Reviewer.

---

## Workflow 1 — Code Review via Copilot Chat

Open the file you want reviewed, then in Copilot Chat:

```
@workspace Review the open file using the Android Code Reviewer agent rules.
Flag CRITICAL and WARNING issues with the line number and a concrete fix for each.
```

Or reference the agent directly:

```
#file:agents/android/code-reviewer/agent.md
Review #file:app/src/main/java/com/example/ProfileViewModel.kt
```

---

## Workflow 2 — Inline Fix with Copilot Edits

1. Select a problematic code block
2. Press Cmd+I (or Ctrl+I on Windows) to open the inline chat
3. Type:

```
Fix the coroutine scope leak and dependency injection issues identified by the Android Code Reviewer.
```

Copilot Edits will propose a diff inline — accept or discard each change.

---

## Workflow 3 — Crash Analysis

```
@workspace Analyze this crash log using the Android Crash Analyzer rules and return
the 9-section report (Summary, Root Cause, Why It Happens, Risk Level, Fix, Code,
Edge Cases, Test Checklist, Prevention Tips):

[paste crash log]
```

---

## Workflow 4 — Widget / Shader Generation

```
@workspace Using the Flutter Widget Generator rules, generate a Dart widget for a
loading skeleton screen that shows placeholder shimmer cards while content loads.
Flutter 3.27, no external packages.
```

---

## Workflow 5 — @workspace for Architecture Questions

```
@workspace Using the Clean Architecture rules for Android, does this project correctly
separate domain, data, and presentation layers? List any violations.
```

Copilot uses `@workspace` to read your actual project files alongside the agent rules from `.github/copilot-instructions.md`.

---

## Limitations

- Copilot Chat has a shorter context window than Claude Code or GPT-4o — for very long files, split the review into sections.
- Copilot cannot read `.cursorrules` — it reads only `.github/copilot-instructions.md`.
- The `#file:` syntax for referencing agent files requires Copilot Chat version 1.x or later (VS Code extension).
- Complex structured output (the full 9-section crash report) may be truncated in inline chat — use the Copilot Chat panel instead.

---

## Manually Adding Agent Rules to Any Copilot Session

If you want to use a specific agent without `@workspace`:

1. Open the agent file (e.g., `agents/ios/swift-reviewer/agent.md`)
2. Copy the `## System Prompt` section
3. Paste it at the top of your Copilot Chat message
4. Follow it with your code and the input format

This works in any Copilot Chat session, even outside this repo.
