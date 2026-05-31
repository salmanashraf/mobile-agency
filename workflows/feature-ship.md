# Workflow — Feature Ship

**Type:** End-to-end feature delivery
**Agents Used:** AXIOM / SWIFT / DART / BRIDGE, SCRIBE
**Skills Used:** /grill-mobile, /feature-slice, /compose-review or /swiftui-review or /flutter-review, /android-tdd or /ios-tdd or /flutter-tdd

---

## When to Use

Start here for any feature that will take more than one day to build.

---

## Steps

```
1. ALIGNMENT — /grill-mobile
   ↓ Ask all 20 questions before writing any code.
   ↓ Confirm understanding with 3-bullet summary.

2. PLANNING — /feature-slice
   ↓ Break the feature into independently shippable tickets.
   ↓ Identify the data layer ticket as the first blocker.

3. IMPLEMENTATION — AXIOM / SWIFT / DART / BRIDGE
   ↓ Implement data layer first (API model, repository).
   ↓ Domain layer (use case, business logic).
   ↓ ViewModel / state management.
   ↓ UI scaffold → UI with real data → error states.

4. REVIEW — /compose-review or /swiftui-review or /flutter-review or /rn-review
   ↓ Recomposition / rebuild audit before PR.
   ↓ Fix any WARNING or CRITICAL issues.

5. TESTS — /android-tdd or /ios-tdd or /flutter-tdd or /rn-tdd
   ↓ Unit tests for use case and ViewModel.
   ↓ UI test for the happy path.

6. DESCRIPTION — SCRIBE
   ↓ Generate PR description from commit log.
   ↓ Human reviews before submitting.

7. MERGE
```

---

## Inputs

- Jira / Linear / GitHub ticket describing the feature
- Figma design link (optional but recommended)
- Target platform and version context

---

## Outputs

- Working feature behind a feature flag
- Unit + UI tests
- PR description ready for review
