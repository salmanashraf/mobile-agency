# Using Mobile Dev Skill Agents with Cursor

Cursor reads `.cursorrules` from the repo root automatically. When you open this repo in Cursor, the AI already knows the agent index, platform conventions, and severity levels — no setup needed.

---

## How `.cursorrules` Is Loaded

Cursor loads `.cursorrules` at the start of every session in the workspace. It acts as a persistent system prompt for Cursor Chat and Composer. You can verify it's active by asking:

> "What agents are available in this repo?"

Cursor should list all agents from the agent index in `.cursorrules`.

---

## Workflow 1 — Cursor Chat (Single File Review)

**Use when:** You want to review or improve one file.

1. Open the file you want to review (e.g., `ProfileViewModel.kt`)
2. Open Cursor Chat (Cmd+L)
3. Type:

```
Review this file using the Android Code Reviewer agent at
agents/android/code-reviewer/agent.md
```

Or more naturally:

```
Review this ViewModel for Clean Architecture violations and coroutine safety.
```

Cursor will read the agent rules from `.cursorrules` and produce a structured CRITICAL/WARNING/INFO report.

**With file reference:**

```
@ProfileViewModel.kt
Review for Clean Architecture violations, GlobalScope usage, and Compose best practices.
```

---

## Workflow 2 — Cursor Composer (Multi-File or Apply Fixes)

**Use when:** You want to review AND automatically apply fixes across one or more files.

1. Open Composer (Cmd+I or Cmd+Shift+I)
2. Reference the file(s) and the agent:

```
@agents/android/code-reviewer/agent.md @ProfileViewModel.kt

Review ProfileViewModel.kt, then apply the CRITICAL and WARNING fixes directly to the file.
```

Composer will:
- Run the agent review
- Show you a diff of every proposed change
- Let you accept or reject each change individually

**Multi-file example:**

```
@agents/react-native/performance-optimizer/agent.md

Review every file in src/screens/ for performance issues and apply the HIGH-impact fixes.
```

---

## Workflow 3 — Crash Log Analysis

1. Open or paste the crash log into a new file (e.g., `crash.txt`)
2. In Cursor Chat:

```
@crash.txt @agents/android/crash-analyzer/agent.md

Analyze this crash log. The user was on Android 14 / Pixel 8 Pro.
```

Cursor will return the full 9-section crash analysis: Summary, Root Cause, Why It Happens, Risk Level, Recommended Fix, Updated Code, Edge Cases, Testing Checklist, Prevention Tips.

---

## Workflow 4 — Generate Code from Description

**Flutter widget:**

```
@agents/flutter/widget-generator/agent.md

Generate a Flutter widget for a swipeable onboarding screen with 3 pages,
a dot indicator, skip button, and a Get Started button on the last page.
Flutter 3.27, Dart 3.6, no state management package.
```

**Unity shader:**

```
@agents/unity/shader-generator/agent.md

Generate a URP unlit shader for a dissolve effect using a noise texture.
The dissolve threshold should be a tweakable property. Mobile-friendly.
```

---

## Workflow 5 — CI/CD Pipeline Generation

```
@agents/cross-platform/ci-cd-generator/agent.md

Generate a GitHub Actions pipeline for my Flutter app.
Platforms: Android + iOS.
Distribution: Firebase App Distribution (Android) + TestFlight (iOS).
Tests: flutter test.
Notify Slack on success/failure.
```

---

## Tips

- **@codebase** in Cursor Chat gives the agent awareness of your entire project structure — useful for architecture-level questions.
- **Cursor Tab** (autocomplete) uses `.cursorrules` implicitly — it will suggest Kotlin idioms, avoid `!!`, and prefer `StateFlow` in Android files automatically.
- For agents with long output (CI/CD Generator, Store Listing Writer), use **Composer** rather than Chat — Composer handles long outputs better and can write directly to files.
- Combine multiple `@file` references to give the agent cross-file context:

```
@ProfileViewModel.kt @ProfileRepository.kt @ProfileUseCase.kt
Review the full data flow for Clean Architecture violations.
```

---

## Updating `.cursorrules`

When new agents are added to the repo, update the Agent Index table in `.cursorrules` so Cursor Chat can reference them. The table is at the top of the file.
