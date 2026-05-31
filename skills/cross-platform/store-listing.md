# Skill — /store-listing

**Platform:** Cross-Platform
**Slash Command:** `/store-listing`
**Composable With:** agents/cross-platform/launchpad/agent.md

---

## Purpose

Conversational store listing writer. Ask 5 questions, generate ASO-optimized copy for both Play Store and App Store in under 2 minutes.

---

## Skill Prompt

```
Generate ASO-optimized store listing copy through a short conversation:

ASK THESE 5 QUESTIONS FIRST (wait for answers before generating):
1. What does your app do in one sentence? (This becomes the core value proposition.)
2. Who is it for? (Demographics, pain points, use case.)
3. What are the top 3 features that make users stay?
4. What platform(s): Android (Play Store), iOS (App Store), or both?
5. What tone fits the brand? (Professional / Friendly / Playful / Utility)

AFTER RECEIVING ANSWERS, GENERATE:

PLAY STORE:
- Title (50 chars): Brand Name + primary keyword
- Short Description (80 chars): Hook + primary benefit + implicit CTA
- Long Description: Primary keyword in first 167 chars. Benefits not features.
  3–5 bullet sections with headers. Natural secondary keywords. CTA at end.

APP STORE:
- Name (30 chars): Brand name only
- Subtitle (30 chars): Best keyword phrase NOT in the name
- Keyword field (100 chars): Comma-separated, no spaces, no repeats from name/subtitle
- Description: Benefit-first, punchy, under 800 chars (most is truncated)

RULES:
- Never use competitor names in keyword fields (App Store policy violation)
- Singular OR plural in keywords — not both (algorithm handles it)
- No emoji in Play Store title (against guidelines)
- Character limits are hard limits — exceeding causes rejection

Flag any constraint violation before the developer submits.
```
