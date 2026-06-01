# Installation Guide

This guide is for first-time users who want Mobile Agency installed in their AI coding tool without needing to understand the repo structure first.

---

## Quick Start

If you are not sure what to choose, use the default install:

```bash
npx mobile-agency install
```

This installs Mobile Agency for Claude Code. It adds agents, skills, and workflows as slash commands in:

```text
~/.claude/commands/
~/.claude/agents/
```

After install, open Claude Code in your app project and try:

```text
/flutter-review
/android-tdd
/crasher
```

---

## Before You Install

You need:

1. Node.js 18 or newer
2. An AI coding tool such as Claude Code, Cursor, Windsurf, GitHub Copilot, or Codex
3. A terminal opened in the project where you want the rules installed

Check Node.js:

```bash
node --version
```

If this prints a version like `v18.x`, `v20.x`, or newer, you are ready.

---

## Step 1: Pick Your AI Tool

Choose the tool you use most often:

| I use... | Run this |
|---|---|
| Claude Code | `npx mobile-agency install` |
| Cursor | `npx mobile-agency install --tool cursor` |
| Windsurf | `npx mobile-agency install --tool windsurf` |
| GitHub Copilot | `npx mobile-agency install --tool copilot` |
| Codex / OpenAI | `npx mobile-agency install --tool codex` |
| More than one tool | `npx mobile-agency install --tool all` |

If you do not know which one to pick, start with the command for your editor. For example, Cursor users should use `--tool cursor`.

---

## Step 2: Run the Command From Your App Project

Open a terminal inside your mobile app project, not inside Mobile Agency.

Example:

```bash
cd ~/Code/my-flutter-app
npx mobile-agency install --tool cursor
```

Why this matters:

- Cursor installs files into your current project under `.cursor/rules/`
- Windsurf installs `.windsurfrules` into your current project
- Copilot installs `.github/copilot-instructions.md` into your current project
- Codex installs `AGENTS.md` into your current project
- Claude Code installs globally into `~/.claude/`

---

## Step 3: Optionally Limit by Platform

By default, Mobile Agency installs all platforms:

- Android
- iOS
- Flutter
- React Native
- Unity / Unreal
- Cross-platform workflows

For a smaller install, choose one platform:

```bash
npx mobile-agency install --platform android
npx mobile-agency install --platform ios
npx mobile-agency install --platform flutter
npx mobile-agency install --platform rn
npx mobile-agency install --platform gaming
```

You can combine platform and tool:

```bash
npx mobile-agency install --platform flutter --tool cursor
npx mobile-agency install --platform android --tool codex
npx mobile-agency install --platform rn --tool all
```

---

## What Gets Installed

| Tool | Files created |
|---|---|
| Claude Code | `~/.claude/agents/*.md` and `~/.claude/commands/*.md` |
| Cursor | `.cursor/rules/*.mdc` |
| Windsurf | `.windsurfrules` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Codex / OpenAI | `AGENTS.md` |

The install command does not change your application source code. It only adds instruction files for your AI coding tool.

---

## Examples by Tool

### Claude Code

```bash
npx mobile-agency install
```

Then open Claude Code and run a slash command:

```text
/crasher
```

Paste a crash log and ask for the root cause.

### Cursor

```bash
npx mobile-agency install --tool cursor
```

Then use Cursor Chat:

```text
@axiom review this ViewModel
@flutter-review review this widget
```

### Windsurf

```bash
npx mobile-agency install --tool windsurf
```

Windsurf reads `.windsurfrules` from your project. After install, ask Windsurf to use the relevant Mobile Agency agent or skill.

### GitHub Copilot

```bash
npx mobile-agency install --tool copilot
```

Then use Copilot Chat with workspace context:

```text
@workspace Review this file using the Android code reviewer rules.
```

### Codex / OpenAI

```bash
npx mobile-agency install --tool codex
```

This creates `AGENTS.md` in your project. Codex reads that file as project instructions when working in the repo.

---

## Local Clone Install

Use this if you cloned the Mobile Agency repo and want to install from local files instead of npm:

```bash
git clone https://github.com/salmanashraf/mobile-agency
cd mobile-agency
./install.sh --platform android
./install.sh --platform flutter --tool cursor
./install.sh --tool all
```

For most users, `npx mobile-agency install` is simpler.

---

## Troubleshooting

### `npx: command not found`

Install Node.js from [nodejs.org](https://nodejs.org/) and reopen your terminal.

### `mobile-agency: command not found`

Use the full `npx` command:

```bash
npx mobile-agency install
```

### Cursor does not see the rules

Make sure the command created files under:

```text
.cursor/rules/
```

Then restart Cursor or reload the window.

### Codex does not follow the instructions

Make sure `AGENTS.md` exists at the root of the project you opened in Codex.

### I installed the wrong platform

Run the install command again with the platform you want:

```bash
npx mobile-agency install --platform flutter --tool cursor
```

---

## Recommended First Commands

| Project type | Try first |
|---|---|
| Android | `/axiom` or `/compose-review` |
| iOS | `/swift-review` |
| Flutter | `/flutter-review` |
| React Native | `/rn-review` or `/perf-audit` |
| Unity / Unreal | `/game-perf` or `/blueprint-to-cpp` |
| Any app | `/crasher`, `/release-prep`, `/store-listing` |

---

## Wiki Version

If you maintain the GitHub Wiki, copy this page into a wiki page named:

```text
Installation
```

Suggested wiki URL:

```text
https://github.com/salmanashraf/mobile-agency/wiki/Installation
```
