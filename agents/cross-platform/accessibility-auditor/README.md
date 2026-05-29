# Accessibility Auditor Agent

> Paste a UI component. Get a WCAG 2.2-aligned accessibility audit with CRITICAL / HIGH / MEDIUM / LOW findings and platform-specific fixes for Compose, SwiftUI, Flutter, or React Native.

---

## What This Agent Does

Reviews mobile UI code for accessibility compliance across all four major mobile UI frameworks:

- **Content labels** — missing `contentDescription`, `accessibilityLabel`, or `Semantics(label:)` on interactive/meaningful elements
- **Touch targets** — elements below 48dp (Android) or 44pt (iOS/Flutter/RN) minimum
- **Roles and traits** — buttons not announced as buttons, toggles without state (`isSelected`, `checked`)
- **Focus order** — visual vs. hierarchy mismatch, focus not trapped in modals
- **Dynamic announcements** — state changes (loading complete, error shown) not announced to screen readers
- **Grouping** — related elements read as separate items when they should be combined

Every finding includes: element name, what a screen reader currently announces, what it should announce, the WCAG 2.2 criterion, and the corrected code.

---

## Files

| File | Purpose |
|---|---|
| [`agent.md`](agent.md) | Input format, output format, full system prompt |
| [`example-input.md`](example-input.md) | Compose TaskItem with missing labels and small tap target |
| [`example-output.md`](example-output.md) | Full WCAG-annotated accessibility audit |

---

## Quick Start

```
PLATFORM: <Android-Compose | Android-XML | iOS-SwiftUI | iOS-UIKit | Flutter | React-Native>
FILE_PATH: <relative path>
CODE:
[paste the UI component]
```

---

## Related Agents

- [`agents/cross-platform/security-scanner`](../security-scanner/) — pair with this for a complete pre-release audit
- `skills/shared/accessibility-audit.md` — quick inline accessibility checklist
- `prompts/ios/swiftui-accessibility.md` — SwiftUI-only accessibility audit prompt
