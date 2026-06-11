# Workflow — Mobile MCP QA

**Type:** Device automation QA  
**Agents Used:** APPFORGE, AXIOM / SWIFT / DART / BRIDGE, CRASHER, PERF, MRECALL  
**Skills Used:** /mobile-mcp-qa, /accessibility-audit, /perf-audit, /mrecall-save

---

## When to Use

Use this workflow when a mobile feature is implemented and needs real-device, simulator, or emulator verification before merge or launch.

Mobile MCP is useful for:

- Native app automation on iOS and Android
- Scripted user journeys
- Form entry and multi-step flows
- Screenshots and visual evidence
- Accessibility element inspection
- App install, launch, terminate, and orientation checks

---

## Setup

Add Mobile MCP to the AI tool:

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

Then confirm at least one device, emulator, or simulator is available.

---

## Flow

```text
Build app
  ↓
Install or launch with Mobile MCP
  ↓
Baseline screenshot + element list
  ↓
Run happy path
  ↓
Run edge cases
  ↓
Capture screenshots after state changes
  ↓
Run accessibility and performance checks
  ↓
Write QA report
  ↓
Save context with /mrecall-save
```

---

## Step 1 — Device Selection

Use Mobile MCP to list available devices and select the target:

- Prefer the requested device if specified.
- Otherwise choose the newest available emulator/simulator.
- Record screen size and orientation.

---

## Step 2 — App Install and Launch

If a build path is available, install it:

- Android: `.apk`
- iOS: `.app`, `.ipa`, or simulator build

Launch the app by package name or bundle ID. Take a screenshot immediately.

---

## Step 3 — Happy Path Test

For every step:

1. Inspect visible UI elements.
2. Prefer structured accessibility targets.
3. Tap, type, or swipe.
4. Capture a screenshot after major transitions.
5. Compare the screen to the expected PRD/design outcome.

---

## Step 4 — Edge Cases

Run the relevant cases:

- Invalid input
- Empty state
- Loading state
- API error
- Offline state
- Back navigation
- App restart
- Rotation
- Permission denial
- Long text
- Keyboard overlap

---

## Step 5 — Accessibility Pass

Check:

- Missing labels
- Small touch targets
- Ambiguous buttons
- Focus order
- Text contrast from screenshot evidence
- Error messages announced or visible

Pair with `/accessibility-audit` for a deeper report.

---

## Step 6 — Performance Pass

Check:

- Cold launch behavior
- Slow screen transitions
- Long loading states
- Repeated jank during scroll
- Memory or crash symptoms during restart/rotation

Pair with PERF or `/perf-audit` when performance risk appears.

---

## Output

Create:

```text
MOBILE_MCP_QA_REPORT.md
```

Format:

```markdown
# Mobile MCP QA Report

## Summary
Result: PASS | FAIL | BLOCKED
Platform:
Device:
App ID:
Build:

## Flow Tested
<flow name and purpose>

## Evidence
| Step | Screenshot | Result |
|---|---|---|

## Bugs
| Severity | Screen | Issue | Repro | Fix |
|---|---|---|---|---|

## Accessibility
<findings>

## Performance
<findings>

## Next Action
<single executable next step>
```

---

## APPFORGE Integration

In APPFORGE, use this workflow during:

- Stage 6 UI Match Review
- Stage 7 Full QA
- Stage 8 screenshot plan validation

Do not use device automation to expand MVP scope. Use it to prove the approved PRD and design are working on a real screen.

---

## MRecall Integration

After each QA pass, run:

```text
/mrecall-save
```

Capture:

- Device tested
- App build
- Screenshots captured
- Bugs found
- Next action
