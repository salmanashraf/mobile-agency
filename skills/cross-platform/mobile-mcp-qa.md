# Skill — /mobile-mcp-qa

**Platform:** Android / iOS / Flutter / React Native  
**Slash Command:** `/mobile-mcp-qa`  
**Composable With:** APPFORGE, AXIOM, SWIFT, DART, BRIDGE, CRASHER, PERF, MRECALL

---

## Purpose

Use Mobile MCP to run AI-assisted QA on a real device, emulator, or simulator. This skill turns a feature flow into a repeatable device test plan using screenshots, accessibility snapshots, element inspection, taps, typing, swipes, app install, app launch, and device orientation checks.

Mobile MCP is best used after implementation, during APPFORGE Stage 7 Full QA, or before store submission.

---

## Prerequisites

Install Mobile MCP in your AI tool:

```json
{
  "mcpServers": {
    "mobile-mcp": {
      "command": "npx",
      "args": ["-y", "@mobilenext/mobile-mcp@latest"]
    }
  }
}
```

Claude Code:

```bash
claude mcp add mobile-mcp -- npx -y @mobilenext/mobile-mcp@latest
```

Codex:

```bash
codex mcp add mobile-mcp npx "@mobilenext/mobile-mcp@latest"
```

You also need at least one available Android emulator/device or iOS simulator/device.

---

## Input Format

```text
COMMAND: /mobile-mcp-qa
PLATFORM: <Android | iOS | Flutter | React Native>
APP_ID: <Android package name or iOS bundle id>
BUILD_PATH: <optional apk/ipa/app path>
DEVICE: <optional target device name>
FLOW:
<numbered user flow to test>
EXPECTED:
<expected UI state, navigation, data, and analytics>
EDGE_CASES:
<offline, invalid input, rotation, restart, permissions, api errors>
```

---

## Skill Prompt

```text
Run a Mobile MCP QA pass for the provided mobile app flow.

STEP 1 — VERIFY SETUP
- List available devices.
- Select the requested device, or choose the first available emulator/simulator.
- If BUILD_PATH is provided, install the app.
- Launch APP_ID.
- Capture screen size and orientation.

STEP 2 — BASELINE SCREEN
- Take a screenshot.
- List elements on screen.
- Record the initial screen name and visible primary actions.
- If accessibility data is incomplete, fall back to screenshot-based coordinate reasoning.

STEP 3 — EXECUTE FLOW
For each user-flow step:
- Identify the target element.
- Prefer accessibility element interaction when available.
- Use coordinate tap only when element metadata is missing.
- Type text where required.
- Swipe only when the target is off-screen.
- Take a screenshot after every major state transition.

STEP 4 — VERIFY EXPECTED RESULT
Check:
- Correct screen reached
- Correct labels and values rendered
- Loading, empty, and error states behave as expected
- Navigation stack and back behavior work
- Keyboard behavior is sane
- Orientation does not break layout
- App restart preserves required state
- Offline/API error behavior is user-safe

STEP 5 — REPORT
Return:
MOBILE MCP QA REPORT
====================
Platform:
Device:
App:
Flow:
Result: PASS | FAIL | BLOCKED

Steps Executed:
| Step | Action | Evidence | Result |
|---|---|---|---|

Issues:
| Severity | Screen | Issue | Repro Step | Fix |
|---|---|---|---|---|

Screenshots Captured:
- <screenshot name or description>

Accessibility Findings:
- <missing labels, small targets, focus issues>

Recommended Next Action:
<single concrete fix or next test>
```

---

## Example

### Input

```text
COMMAND: /mobile-mcp-qa
PLATFORM: Android
APP_ID: com.example.invoice
FLOW:
1. Launch app.
2. Tap Add Invoice.
3. Enter client "Acme Studio".
4. Enter amount "450".
5. Set due date tomorrow.
6. Save invoice.
7. Confirm invoice appears on dashboard.
EXPECTED:
Dashboard shows Acme Studio, $450, due tomorrow, status Unpaid.
EDGE_CASES:
Rotate on dashboard, restart app, verify invoice persists.
```

### Output

```text
MOBILE MCP QA REPORT
====================
Platform: Android
Device: Pixel_7_API_35
App: com.example.invoice
Flow: Create invoice and verify dashboard persistence
Result: FAIL

Steps Executed:
| Step | Action | Evidence | Result |
|---|---|---|---|
| 1 | Launched app | Home screenshot shows empty dashboard | PASS |
| 2 | Tapped Add Invoice | Add Invoice screen visible | PASS |
| 3 | Entered client and amount | Form fields populated | PASS |
| 4 | Saved invoice | Returned to dashboard | PASS |
| 5 | Restarted app | Dashboard empty after relaunch | FAIL |

Issues:
| Severity | Screen | Issue | Repro Step | Fix |
|---|---|---|---|---|
| CRITICAL | Dashboard | Invoice is not persisted after app restart | Save invoice, terminate app, relaunch | Verify Room insert is awaited before navigation |

Screenshots Captured:
- home-empty-initial
- add-invoice-filled
- dashboard-after-save
- dashboard-after-restart

Accessibility Findings:
- Add Invoice button has label.
- Amount field missing content description for currency expectation.

Recommended Next Action:
Fix invoice persistence by awaiting InvoiceDao.insert() before navigating back to Dashboard, then rerun the restart persistence flow.
```
