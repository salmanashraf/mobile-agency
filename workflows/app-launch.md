# Workflow — App Launch

**Type:** Store submission
**Agents Used:** SENTINEL, PERF, LAUNCHPAD, SCRIBE, PIPELINE
**Skills Used:** /release-prep, /perf-audit, /store-listing

---

## When to Use

Final checklist before submitting a new app or major version to the Play Store or App Store.

---

## Steps

```
1. SECURITY — SENTINEL
   ↓ Full security scan on release build sources.
   ↓ Block on any CRITICAL or HIGH finding.
   ↓ MEDIUM findings: document and plan post-launch remediation.

2. PERFORMANCE — PERF + /perf-audit
   ↓ Measure cold start time (target: < 2 seconds to interactive).
   ↓ Profile the 3 most-used screens for frame drops.
   ↓ Memory baseline on a 3-year-old mid-range device.

3. STORE LISTING — LAUNCHPAD + /store-listing
   ↓ Write or review Play Store / App Store copy.
   ↓ ASO keyword strategy for launch category.
   ↓ Screenshot brief for designer.

4. RELEASE NOTES — SCRIBE
   ↓ Generate first-version release notes from git log.
   ↓ "What's new in version 1.0" — highlight top 3 features.

5. RELEASE CHECKLIST — /release-prep
   ↓ Run through the full pre-submission checklist.
   ↓ All boxes must be checked before submitting.

6. BUILD & DEPLOY — PIPELINE
   ↓ Generate release build pipeline if not already set up.
   ↓ Sign and upload to Play Store internal track / TestFlight.
   ↓ Staged rollout plan: 1% → 5% → 20% → 100%.

7. MONITOR
   ↓ Watch crash-free rate, ANR rate, rating/review velocity.
   ↓ Set up alerts for crash rate > 0.5%.
```

---

## Inputs

- Release branch at feature freeze
- App store developer account access
- Designer assets (screenshots, feature graphic, app icon)

---

## Outputs

- Security-cleared, performance-validated release build
- Complete store listing ready for submission
- CI/CD pipeline for future releases
- Monitoring baseline for post-launch tracking
