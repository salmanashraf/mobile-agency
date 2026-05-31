# Workflow — Release Cycle

**Type:** Release management
**Agents Used:** CRASHER, SENTINEL, SCRIBE, LAUNCHPAD, PIPELINE
**Skills Used:** /release-prep

---

## When to Use

Every release, from feature freeze to store submission.

---

## Steps

```
1. FEATURE FREEZE
   ↓ Cut release branch: git checkout -b release/vX.Y.Z
   ↓ No new features merged after this point. Only bug fixes.

2. CRASH REVIEW — CRASHER
   ↓ Pull last 7 days of crash data from Crashlytics/Sentry.
   ↓ Any P0/P1 crashes must be fixed before this release ships.
   ↓ Document crash-free rate baseline for comparison post-launch.

3. SECURITY PASS — SENTINEL
   ↓ Scan release branch for any new CRITICAL or HIGH vulnerabilities.
   ↓ Focus on any new third-party dependencies added in this cycle.
   ↓ Block release on any new CRITICAL finding.

4. RELEASE NOTES — SCRIBE
   ↓ git log <last-tag>..HEAD --oneline → paste into SCRIBE.
   ↓ Generate store listing notes + internal changelog + stakeholder summary.
   ↓ Human review before publishing.

5. STORE LISTING — LAUNCHPAD (if features changed)
   ↓ Update Play Store / App Store listing if new features warrant it.
   ↓ New screenshots if UI changed significantly.

6. CHECKLIST — /release-prep
   ↓ Work through the full release checklist.
   ↓ Every item checked before proceeding.

7. BUILD & UPLOAD — PIPELINE
   ↓ Trigger release build workflow.
   ↓ AAB uploaded to Play Store internal track.
   ↓ IPA uploaded to TestFlight.

8. STAGED ROLLOUT
   ↓ Play Store: 1% → 5% → 20% → 100% (monitor 24h at each stage).
   ↓ App Store: release after review approval.
   ↓ Monitor: crash rate, ANR rate, user ratings.
```

---

## Inputs

- Last release tag for git log diff
- Crash reports from current version
- Store developer account access

---

## Outputs

- Release branch with all fixes
- Store listing updated
- Build uploaded to stores
- Post-release monitoring active
