# Workflow — Performance Sprint

**Type:** Performance optimization
**Agents Used:** PERF, AXIOM / DART / BRIDGE
**Skills Used:** /perf-audit, /compose-review or /flutter-review

---

## When to Use

When users are reporting slow performance, or before a major release as a performance gate.

---

## Steps

```
1. BASELINE — PERF
   ↓ Measure before touching anything:
     - App cold start time
     - Hot start time (from background)
     - 3 most-used screens: frame rate during scroll/interaction
     - Memory footprint on target device
     - Battery drain over 10 minutes of active use
   ↓ Document numbers. This is your benchmark.

2. PROFILE — /perf-audit
   ↓ Run screen-by-screen profiling.
   ↓ Use platform profiler (Systrace / Instruments / DevTools / Flipper).
   ↓ Identify top 3 bottlenecks by frame time cost.

3. FIX — AXIOM / DART / BRIDGE (platform-specific)
   ↓ Fix the highest-impact bottleneck first.
   ↓ Fix one thing at a time and re-measure after each fix.
   ↓ Do NOT batch fixes — you won't know which one helped.

4. REVIEW — /compose-review or /flutter-review (UI layer)
   ↓ Check for unnecessary rebuilds introduced by the fix.
   ↓ Ensure the optimization didn't create new jank.

5. VALIDATE — PERF
   ↓ Re-measure all baselines from step 1.
   ↓ Target: each bottleneck shows measurable improvement.
   ↓ Document: before numbers, after numbers, what changed.

6. DOCUMENT
   ↓ Write PERFORMANCE_AUDIT_REPORT.md.
   ↓ Add before/after screenshots to PR description.
   ↓ Link to profiler traces in the PR.
   ↓ Add a performance test or threshold to CI so it doesn't regress.
```

---

## Performance Targets (Mobile)

| Metric | Target |
|---|---|
| Cold start (time to interactive) | < 2 seconds |
| Hot start | < 500ms |
| Scroll frame rate | Consistent 60fps (< 16.7ms/frame) |
| Memory (mid-range device) | < 150MB active |
| Crash-free rate | > 99.5% |

---

## Inputs

- Platform and device target (flagship / mid-range / low-end)
- List of screens or features reported as slow
- Profiler traces if available

---

## Outputs

- Measured baseline vs. improved numbers
- Code changes with documented performance rationale
- `PERFORMANCE_AUDIT_REPORT.md`
- Performance CI gate to prevent regression
