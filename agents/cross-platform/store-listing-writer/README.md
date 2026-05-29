# Store Listing Writer Agent

> Describe your app. Get fully ASO-optimized App Store and Google Play Store listings — title, subtitle, description, keywords, and What's New — with character counts and keyword density analysis.

---

## What This Agent Does

Writes App Store and Google Play Store listings from a brief product description:

- **App Store** — Title (30 chars), Subtitle (30 chars), Description (4,000 chars), Keywords (100 chars), What's New
- **Play Store** — Title (30 chars), Short Description (80 chars), Full Description (4,000 chars)
- **ASO analysis** — primary keyword placement, density check, competitor gap notes, A/B test suggestions

Every output respects Apple and Google's restrictions: no superlatives ("best", "#1"), no pricing, no competitor mentions.

---

## Files

| File | Purpose |
|---|---|
| [`agent.md`](agent.md) | Input format, output format, full system prompt |
| [`example-input.md`](example-input.md) | Taskly productivity app description |
| [`example-output.md`](example-output.md) | Complete App Store + Play Store listings |

---

## Quick Start

```
APP_NAME: <Your App>
STORE: <app-store | play-store | both>
CATEGORY: <App category>
TARGET_AUDIENCE: <Who uses this>
CORE_FEATURES:
- Feature 1
- Feature 2
TONE: <professional | friendly | playful | minimal>
```

---

## Character Limit Reference

| Field | App Store | Play Store |
|---|---|---|
| Title | 30 | 30 |
| Subtitle / Short Description | 30 | 80 |
| Description | 4,000 | 4,000 |
| Keywords (App Store only) | 100 | N/A |

---

## Related Agents

- [`agents/cross-platform/release-notes-generator`](../release-notes-generator/) — generate the "What's New" section from git commits
- `prompts/android/gradle-dependency-audit.md` — ensure the app is ship-ready before writing the listing
