# Skill — /store-listing

**Platform:** Cross-Platform
**Slash Command:** `/store-listing`
**Composable With:** agents/cross-platform/launchpad/agent.md

---

## Purpose

Conversational ASO and growth listing writer. It audits the app baseline, then generates App Store and Play Store metadata, keyword strategy, screenshot/video briefs, and launch-growth recommendations without duplicating platform keywords incorrectly.

---

## Skill Prompt

```
Generate ASO-optimized store listing copy through a short diagnostic conversation:

ASK THESE QUESTIONS FIRST (wait for answers before generating unless the user already provided them):
1. App Store / Play Store URL if live, or app name and category if not live.
2. Target market/region and language. Example: US English, UK English, Brazil Portuguese, Japan Japanese.
3. Core value proposition in one sentence.
4. Target user and pain point. Include audience, use case, and purchase intent.
5. Top 3 features that make users stay.
6. Top 2-3 competitors or alternatives.
7. Current stage: idea, pre-launch, newly launched, scaling, or optimization.
8. Platform(s): Android, iOS, or both.
9. Monetization: free, ads, subscription, one-time purchase, IAP, or mixed.
10. Brand tone: professional, friendly, playful, premium, utility, or minimal.

AFTER RECEIVING ANSWERS, GENERATE:

PLAY STORE:
- Title (30 chars): Brand + primary keyword. Keep it natural and policy-safe.
- Short Description (80 chars): Primary conversion hook with 1-2 important keywords.
- Long Description (4000 chars max): Semantic description for Google Play NLP.
  Primary keyword in the first 167 chars. Maintain roughly 2-3% primary keyword density.
  Use benefit headers, short paragraphs, bullets, social-proof placeholders, and a CTA.
- Store Listing Experiments: 2-3 A/B test ideas for title, short description, screenshots, or feature graphic.
- Promotional Content: event/update/banner idea if relevant.

APP STORE:
- Name (30 chars): Brand + highest-value keyword if it fits naturally.
- Subtitle (30 chars): Secondary keyword phrase that complements the name and does not repeat words.
- Keyword field (100 chars): Comma-separated, no spaces, no repeats from name/subtitle.
  Break phrases into individual words. Prefer singular form unless plural has distinct intent.
- Promotional Text (170 chars): Timely update, offer, social proof, or launch hook.
- Description (4000 chars max): Benefit-first, structured, conversion-focused.
- Product Page Optimization: 2-3 PPO test ideas for icon, screenshots, preview video, or subtitle.
- Custom Product Page: one CPP angle mapped to a keyword or campaign.
- In-App Event: one IAE idea if relevant.

VISUAL + VIDEO BRIEF:
- Screenshot 1 hero caption and visual.
- Screenshots 2-5 feature captions and visuals.
- App preview/promo video concept with the first 3 seconds scripted.
- YouTube/short-form video distribution ideas if useful for the category.

GROWTH + OFF-STORE SEO:
- Google Play backlink/PR plan with safe contextual anchor examples.
- Landing page SEO angle and smart app banner/deep-link recommendation.
- Directory/community placements such as Product Hunt, AlternativeTo, G2, Capterra, or niche forums where appropriate.

RULES:
- Character limits are hard limits. Report character counts for every metadata field.
- Never use competitor names in keyword fields (App Store policy violation)
- Never use misleading superlatives like "best", "#1", or "world's leading" unless independently verifiable and policy-safe.
- Singular OR plural in keywords — not both (algorithm handles it)
- No emoji in Play Store title (against guidelines)
- Do not keyword-stuff. If density is too high, flag it before submission.
- Localize separately per market. Do not mix languages in one keyword field unless the market behavior supports it.

Flag any constraint violation before the developer submits.
```
