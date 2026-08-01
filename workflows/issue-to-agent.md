# Workflow - Issue to Agent

**Type:** GitHub issue execution planning
**Agents Used:** APPFORGE, CRASHER, FREEZE, RETAINER, AXIOM / SWIFT / DART / BRIDGE, SENTINEL, PERF, MOBILE-HARNESS, PIPELINE, LAUNCHPAD, SCRIBE
**Skills Used:** /crash-triage, /anr-investigation, /memory-leak-investigation, /perf-audit, /security-audit, /security-scan, /clean-code-audit, /prd-verification, /mobile-mcp-qa, /release-prep, /store-listing

---

## When to Use

Use this when a GitHub issue should become an executable Mobile AI Agents plan.

The workflow accepts feature requests, crashes, ANRs, memory leaks, UI bugs, security issues, release work, store listing tasks, CI/CD work, and documentation tasks.

---

## Inputs

- Issue title
- Issue body
- Labels
- Comments or maintainer notes
- Linked PRD, design, logs, crash reports, screenshots, or source files
- Target platform, if known

---

## Classification

Choose exactly one primary issue type:

| Issue Type | Signals | Recommended Start |
|---|---|---|
| New feature | User story, acceptance criteria, screens | APPFORGE or MOBILE-HARNESS |
| Crash | Stacktrace, exception, crash monitor link | /crash-triage then CRASHER |
| ANR | Main thread blocked, Play Console ANR | /anr-investigation then FREEZE |
| Memory leak | LeakCanary, retained object, heap growth | /memory-leak-investigation then RETAINER |
| UI bug | Screenshot mismatch, layout, accessibility | Platform reviewer plus /mobile-mcp-qa |
| Performance issue | Startup, jank, slow screen, battery, size | /perf-audit then PERF |
| Security issue | Secrets, auth, storage, network, WebView | /security-scan or /security-audit then SENTINEL |
| Release task | Signing, rollout, release readiness | /release-prep then PIPELINE or SCRIBE |
| Store listing | ASO, copy, screenshots, metadata | /store-listing then LAUNCHPAD |
| CI/CD task | GitHub Actions, Bitrise, Fastlane | PIPELINE |
| Documentation | Guide, README, integration docs | MOBILE-HARNESS with docs scope |

If the issue has multiple types, pick the one that blocks delivery first and list secondary types under `Risks`.

---

## Steps

```text
1. LOAD ISSUE
   -> Read title, body, labels, comments, linked artifacts, and acceptance criteria.

2. CLASSIFY
   -> Choose one primary issue type from the classification table.
   -> Identify platform: Android, iOS, Flutter, React Native, Kotlin Multiplatform, Unity, Unreal, or Cross-platform.

3. ROUTE
   -> Select the smallest agent and skill set that can solve the issue.
   -> Prefer specialist agents for evidence-heavy bugs.

4. PLAN
   -> Identify likely files, required evidence, implementation steps, verification, and risks.
   -> If product or credential decisions are missing, mark the plan BLOCKED.

5. EXECUTE ONE TASK
   -> Implement the smallest safe change.
   -> Do not expand scope beyond the issue acceptance criteria.

6. VERIFY
   -> Run tests, lint, build, or documentation checks that match the changed files.
   -> For UI/device bugs, use /mobile-mcp-qa when a target is available.

7. REPORT
   -> Produce ISSUE EXECUTION PLAN before coding or ISSUE EXECUTION REPORT after coding.
```

---

## Output Format

Use this before implementation:

```text
ISSUE EXECUTION PLAN
====================
Issue:
Issue type:
Platform:
Recommended agent:
Recommended skills:
Files likely involved:
- <path or area>

Implementation plan:
1. <step>
2. <step>
3. <step>

Verification plan:
1. <check>
2. <check>

Risks:
- <risk or "None">

Definition of done:
- <specific acceptance criterion>
```

Use this after implementation:

```text
ISSUE EXECUTION REPORT
======================
Issue:
Issue type:
Platform:
Agent route used:
Skills used:

Changes made:
- <file>: <change>

Verification:
- <command or check>: PASS | FAIL | NOT RUN

Remaining risks:
- <risk or "None">

Definition of done:
- <met criterion>
```

---

## Example

### Input

```text
Issue #142
Title: [BUG] Checkout crashes when coupon response has no discount
Labels: bug, android

Body:
Crashlytics shows a NullPointerException in CheckoutViewModel.applyCoupon.
Stacktrace points to coupon.discount.amount.
Expected behavior: invalid or empty discounts should show a message and keep checkout open.
```

### Output

```text
ISSUE EXECUTION PLAN
====================
Issue: #142 - Checkout crashes when coupon response has no discount
Issue type: Crash
Platform: Android
Recommended agent: CRASHER
Recommended skills: /crash-triage, /android-tdd, /clean-code-audit
Files likely involved:
- CheckoutViewModel
- CouponRepository
- CheckoutViewModelTest

Implementation plan:
1. Use /crash-triage to confirm the first app-owned crashing frame.
2. Update coupon mapping so missing discounts become a typed failure state.
3. Add a regression test for a coupon response with no discount.

Verification plan:
1. Run CheckoutViewModelTest.
2. Re-run /clean-code-audit on checkout files.

Risks:
- API contract may need backend confirmation.

Definition of done:
- Missing coupon discounts no longer crash checkout.
- User sees a recoverable error message.
- Regression test passes.
```

---

## Tool Fit

- Codex: Use this workflow after fetching a GitHub issue. Let Codex inspect the local checkout, choose the route, implement the smallest safe change, run verification, and summarize the pushed branch or PR.
- GitHub Copilot coding agent: Attach the issue to the coding agent with the `ISSUE EXECUTION PLAN` as the task brief so the agent has deterministic scope, files, and verification.
- Manual GitHub workflow: Paste the plan into the issue or PR description, then assign the recommended specialist agent or skill to each implementation step.

---

## Stop Conditions

Stop and ask for a maintainer decision when:

- The issue lacks enough reproduction evidence for a crash, ANR, leak, or security report.
- The fix requires credentials, store owner access, paid service access, or production data.
- The requested change is destructive or changes public API behavior without acceptance criteria.
- The issue mixes unrelated work that should be split before implementation.
