# Workflow - Device Proof Report

**Type:** Device evidence and QA reporting
**Agents Used:** MOBILE-HARNESS, APPFORGE, AXIOM / SWIFT / DART / BRIDGE, CRASHER, PERF, Mobile Memory
**Skills Used:** /mobile-mcp-qa, /prd-verification, /accessibility-audit, /perf-audit, /mobile-memory-save

---

## When to Use

Use this workflow after a feature has been installed, launched, tested, screenshotted, and verified on an Android device/emulator or iOS device/simulator with Mobile MCP.

The goal is not just to say the app works. The goal is to produce portable proof that a reviewer, teammate, or future AI session can inspect.

---

## Inputs

- Platform: Android or iOS
- Device name and OS version
- App package name or bundle ID
- Build path, build number, commit SHA, or release version
- User flow under test
- Expected behavior from PRD, design, task, or acceptance criteria
- Mobile MCP screenshots
- Mobile MCP UI element snapshots when available
- Actions performed through Mobile MCP
- Crash logs, console logs, or test output
- Accessibility and performance notes

---

## Evidence Rules

- Every PASS must reference evidence: screenshot, element snapshot, log, test output, or exact Mobile MCP action result.
- Every FAIL must include a reproducible step and the expected behavior.
- Every BLOCKED result must name the missing device, build, credential, app id, or artifact.
- Do not use screenshots as decoration. Each screenshot must prove a state, transition, or failure.
- Record package names, device names, OS versions, build identifiers, and orientation.
- For sensitive apps, use sandbox accounts and redact credentials, tokens, PII, payment data, and health data.

---

## Steps

```text
1. PREPARE
   -> Read PRD, design, task, and expected flow.
   -> Confirm app id, build, target device, and Mobile MCP availability.

2. INSTALL AND LAUNCH
   -> Install the build when a build path is provided.
   -> Launch the app by package name or bundle ID.
   -> Capture initial screenshot and visible UI elements.

3. EXECUTE FLOW
   -> Run each user action through Mobile MCP.
   -> Capture evidence after major state changes.
   -> Record exact action, target, result, and screenshot id.

4. VERIFY STATES
   -> Compare visible UI, data, navigation, restart behavior, rotation, and edge cases against expected behavior.
   -> Mark each assertion PASS, FAIL, or BLOCKED.

5. REVIEW QUALITY
   -> Note crashes, logs, accessibility issues, layout issues, and obvious performance symptoms.
   -> Escalate to CRASHER, /accessibility-audit, or /perf-audit when evidence shows a deeper issue.

6. WRITE REPORT
   -> Produce DEVICE_QA_REPORT.md using the deterministic format below.
   -> Attach or reference screenshots by stable filename.

7. SAVE CONTEXT
   -> Run /mobile-memory-save or update MOBILE_MEMORY.md with device, build, result, and next action.
```

---

## Output

Create:

```text
DEVICE_QA_REPORT.md
```

Format:

```markdown
# Device QA Report

## Summary
Result: PASS | FAIL | BLOCKED
Platform:
Device:
OS Version:
Orientation:
App ID:
Build:
Commit:
Flow:

## Build And Launch
| Check | Evidence | Result |
|---|---|---|
| Build installed | <path/version> | PASS/FAIL/BLOCKED |
| App launched | <screenshot id> | PASS/FAIL/BLOCKED |
| Initial screen visible | <screenshot id> | PASS/FAIL/BLOCKED |

## Actions Performed
| Step | Action | Target | Evidence | Result |
|---|---|---|---|---|

## Assertions
| ID | Expected Behavior | Evidence | Result |
|---|---|---|---|

## Screenshots
| Screenshot | Screen | Proves |
|---|---|---|

## Crashes And Logs
- <crash/log finding or "None">

## Accessibility Notes
- <finding or "None">

## Performance Notes
- <finding or "None">

## Issues Found
| ID | Severity | Screen | Issue | Repro Step | Suggested Fix |
|---|---|---|---|---|---|

## Pass/Fail Summary
- Passed:
- Failed:
- Blocked:

## Next Fixes
1. <highest priority fix or "None">
2. <next fix or "None">
3. <next fix or "None">
```

---

## Example

```markdown
# Device QA Report

## Summary
Result: FAIL
Platform: Android
Device: Pixel_7_API_35
OS Version: Android 15
Orientation: Portrait
App ID: com.example.invoice
Build: app-debug.apk
Commit: 7f31abc
Flow: Create invoice and verify restart persistence

## Build And Launch
| Check | Evidence | Result |
|---|---|---|
| Build installed | app-debug.apk | PASS |
| App launched | screenshots/01-home-empty.png | PASS |
| Initial screen visible | Home dashboard | PASS |

## Actions Performed
| Step | Action | Target | Evidence | Result |
|---|---|---|---|---|
| 1 | Tap | Add Invoice | screenshots/02-add-invoice.png | PASS |
| 2 | Type | Client field | screenshots/03-form-filled.png | PASS |
| 3 | Tap | Save | screenshots/04-dashboard-saved.png | PASS |
| 4 | Relaunch | App process | screenshots/05-dashboard-restart.png | FAIL |

## Assertions
| ID | Expected Behavior | Evidence | Result |
|---|---|---|---|
| QA-001 | Invoice appears after save | screenshots/04-dashboard-saved.png | PASS |
| QA-002 | Invoice persists after restart | screenshots/05-dashboard-restart.png | FAIL |

## Screenshots
| Screenshot | Screen | Proves |
|---|---|---|
| screenshots/01-home-empty.png | Dashboard | App launches |
| screenshots/04-dashboard-saved.png | Dashboard | Invoice saved |
| screenshots/05-dashboard-restart.png | Dashboard | Persistence fails |

## Crashes And Logs
- None.

## Accessibility Notes
- Amount field should describe expected currency format.

## Performance Notes
- No visible launch delay during this pass.

## Issues Found
| ID | Severity | Screen | Issue | Repro Step | Suggested Fix |
|---|---|---|---|---|---|
| QA-BUG-001 | CRITICAL | Dashboard | Invoice disappears after restart | Save invoice, relaunch app | Await local database write before navigation |

## Pass/Fail Summary
- Passed: Install, launch, create invoice, save invoice.
- Failed: Restart persistence.
- Blocked: None.

## Next Fixes
1. Fix invoice persistence after app restart.
2. Add a restart persistence regression test.
3. Rerun this Device Proof Report.
```

---

## Mobile Harness Integration

Use this after `/mobile-mcp-qa` inside MOBILE-HARNESS when the user needs auditable evidence for a task, release gate, screenshot review, or handoff.

For each completed task, attach `DEVICE_QA_REPORT.md` to `MOBILE_HARNESS_REPORT.md` and reference the exact screenshots used as proof.
