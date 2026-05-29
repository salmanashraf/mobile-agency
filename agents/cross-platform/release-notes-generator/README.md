# Release Notes Generator Agent

> Paste your git commit log. Get three outputs in one run: App Store / Play Store copy, a developer changelog, and QA regression notes.

---

## What This Agent Does

Converts raw `git log --oneline` output and optional issue references into three distinct, ready-to-use release note formats:

1. **User-facing** — App Store / Play Store description (≤4000 chars), benefit-driven language, no technical jargon
2. **Developer changelog** — Markdown changelog for GitHub Releases, internal wiki, or Slack announcements — includes commit refs
3. **QA regression notes** — internal-only, lists the highest-risk changes and what to test

The agent filters noise (merge commits, CI bumps, typo fixes) and groups changes by: Features, Fixes, Performance, Internal/Infra.

---

## Files

| File | Purpose |
|---|---|
| [`agent.md`](agent.md) | Input format, output format, full system prompt |
| [`example-input.md`](example-input.md) | Real git log for a task manager app |
| [`example-output.md`](example-output.md) | All three release note sections |

---

## Quick Start

```bash
# Get your commit range
git log v3.1.0..HEAD --oneline
```

Then paste the output:

```
APP_NAME: <Your App>
VERSION: <3.2.0>
PLATFORM: <iOS | Android | Flutter | All>
AUDIENCE: <users | developers | both>
TONE: <friendly | professional | terse>
GIT_LOG:
[paste git log --oneline output]
```

---

## Tone Guide

| Tone | Example |
|---|---|
| `friendly` | "We fixed a crash that happened when..." |
| `professional` | "Resolved an issue where..." |
| `terse` | "Fix: crash on notification tap" |

---

## Related Agents

- [`agents/cross-platform/ci-cd-generator`](../ci-cd-generator/) — set up the pipeline that triggers release notes generation
- [`agents/cross-platform/store-listing-writer`](../store-listing-writer/) — write the full App Store listing (not just What's New)
