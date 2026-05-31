# Workflow — Crash to Fix

**Type:** Incident response
**Agents Used:** CRASHER, AXIOM / SWIFT / DART / BRIDGE, PIPELINE
**Skills Used:** /crash-triage, /android-tdd or /ios-tdd

---

## When to Use

When a crash alert fires in Firebase Crashlytics, Sentry, or Bugsnag.

---

## Steps

```
1. TRIAGE — /crash-triage
   ↓ Paste the stacktrace immediately.
   ↓ Classify: P0 (all users) / P1 (significant %) / P2 (edge case).
   ↓ P0: wake the on-call engineer. P2: file a ticket for next sprint.

2. INVESTIGATE — CRASHER
   ↓ Deep dive: root cause, failure path, reproduction conditions.
   ↓ Determine reproduction rate and affected versions.

3. FIX — AXIOM / SWIFT / DART / BRIDGE (platform-specific)
   ↓ Implement the concrete fix from CRASHER's recommendation.
   ↓ Do not refactor surrounding code — fix only what caused the crash.

4. REGRESSION TEST — /android-tdd or /ios-tdd or /flutter-tdd
   ↓ Write the test that would have caught this crash.
   ↓ The test must fail on the unfixed code and pass after the fix.

5. DEPLOY — PIPELINE (if P0/P1)
   ↓ Hot-patch via OTA update (React Native / Flutter) if available.
   ↓ Otherwise: expedited build → internal test → staged rollout.

6. MONITOR
   ↓ Watch crash rate for 24 hours post-deploy.
   ↓ Confirm crash-free rate returns to baseline.
```

---

## P0 Decision Tree

```
Crash rate > 1%?
├── YES → Wake on-call. Deploy hotfix within 2 hours.
│         If OTA possible (RN/Flutter): deploy in 15 minutes.
└── NO → Is it on a critical flow (login, payment, checkout)?
          ├── YES → P1. Fix in current sprint. Staged rollout.
          └── NO → P2. File ticket. Fix in next sprint.
```

---

## Inputs

- Full stacktrace from crash monitoring tool
- Reproduction rate and affected version range
- Recent code changes (git log since last stable version)

---

## Outputs

- Root cause analysis
- Code fix with regression test
- Deployed build or hotfix OTA
