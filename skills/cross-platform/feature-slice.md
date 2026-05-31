# Skill — /feature-slice

**Platform:** Cross-Platform
**Slash Command:** `/feature-slice`

---

## Purpose

Breaks a mobile feature epic into independently shippable, correctly-sized tickets. Works with Jira, Linear, and GitHub Issues. Prevents the "one giant PR" anti-pattern.

---

## Skill Prompt

```
Slice the described mobile feature into independently shippable tickets:

SLICING RULES:
1. Each ticket should be shippable behind a feature flag without breaking existing behavior.
2. Each ticket should be completable by one engineer in 1–3 days.
3. Tickets are ordered: data layer first, then domain, then UI.
4. "Independently shippable" means the app still works if only this ticket is merged.

LAYER ORDER (mobile Clean Architecture):
1. Data models / API contract (can be merged immediately, no visible change)
2. Repository / data source implementation
3. Domain use case
4. ViewModel / state management
5. UI scaffold (empty screen, no data)
6. UI with real data
7. Error states and edge cases
8. Analytics / logging
9. Tests (can be bundled with each layer or as a final ticket)

OUTPUT PER TICKET:
Title: [PLATFORM] Layer — What it does
Acceptance Criteria:
- [ ] Criterion 1
- [ ] Criterion 2
Dependencies: <ticket numbers this depends on>
Estimated effort: <S | M | L> (S=4h, M=1d, L=2-3d)

Also flag:
- Any tickets that can be done in parallel (no dependency between them)
- Any ticket that is a blocker for everything else (do it first)
- Any ticket that touches existing code and needs a regression test
```
