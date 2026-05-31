# Skill — /grill-mobile

**Platform:** Cross-Platform
**Slash Command:** `/grill-mobile`
**Viral Potential:** HIGHEST — 20 questions before any mobile code is written

---

## Purpose

Asks 20 mobile-specific alignment questions before writing a single line of code. Prevents the most common mobile AI mistakes: wrong API level, reinventing native components, ignoring platform constraints.

Inspired by mattpocock's `/grill-me` — the mobile-specific version.

---

## Skill Prompt

```
Before writing any code for this mobile feature, ask the following 20 questions.
Wait for answers before proceeding. Group them into 5 rounds of 4 questions each
so the conversation feels natural rather than overwhelming.

ROUND 1 — Platform Basics
1. What platform(s) are we targeting? (Android, iOS, Flutter, React Native, Unity/Unreal?)
2. What is the minimum OS version / SDK level we support?
3. Is this a new feature in a greenfield project or modifying an existing codebase?
4. Which design system or component library is in use? (Material3, Cupertino, custom?)

ROUND 2 — Technical Context
5. What state management solution is in use? (ViewModel/StateFlow, Bloc, Riverpod, Redux, Zustand, none?)
6. What dependency injection framework, if any? (Hilt, Koin, Provider, none?)
7. Are there existing components in the codebase that already solve part of this?
8. What is the target frame rate? (30fps for low-end, 60fps, 120fps for premium?)

ROUND 3 — User & Device Reality
9. What type of device is the primary target? (High-end flagship, mid-range, low-RAM budget?)
10. Will this feature work offline? What is the offline behavior?
11. Are there users with accessibility needs we should design for? (Screen reader, large text, motor?)
12. What is the expected data size? (A handful of items, hundreds, thousands?)

ROUND 4 — Integration & Constraints
13. What API or backend does this feature connect to? Any rate limits or auth requirements?
14. Are there any app store policies affecting this feature? (Location, permissions, content?)
15. What is the target app size budget? Any constraints on adding dependencies?
16. Is this screen deep-linkable? What parameters does the deep link carry?

ROUND 5 — Quality & Delivery
17. What is the test strategy? (Unit only, integration, UI test, manual only?)
18. Has this feature been designed in Figma or another tool? Can you share the spec?
19. What does "done" look like? What are the acceptance criteria?
20. What are the top 3 edge cases we must handle before this ships?

After receiving answers, summarize your understanding of the feature in 3 bullet points
and confirm with the developer before writing any code.
```

---

## Notes

- Use this at the start of every non-trivial feature implementation.
- Answers to questions 1, 2, 8, 9 directly prevent the most common AI mobile coding mistakes.
- The summary-and-confirm step catches misunderstandings before they become wrong code.
