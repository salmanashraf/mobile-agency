# Skill — /accessibility-audit

**Platform:** Cross-Platform
**Slash Command:** `/accessibility-audit`

---

## Purpose

Reviews any mobile screen for WCAG 2.1 AA compliance and platform accessibility standards. Increasingly required by law (EU Accessibility Act 2025, ADA).

---

## Skill Prompt

```
Audit the provided mobile screen or component for accessibility:

WCAG 2.1 AA REQUIREMENTS:
1. PERCEIVABLE
   - 1.1.1 Non-text content: all images, icons, and decorative elements have alt text
     or are marked as decorative.
   - 1.3.1 Info and relationships: screen reader can determine the purpose of all UI elements.
   - 1.4.3 Contrast (minimum): text contrast ratio ≥ 4.5:1 (normal), ≥ 3:1 (large 18pt+).
   - 1.4.11 Non-text contrast: interactive components have ≥ 3:1 against adjacent color.

2. OPERABLE
   - 2.1.1 Keyboard: all functionality available without pointing device (hardware keyboard on iPad/Android).
   - 2.4.3 Focus order: focus sequence is logical and meaningful.
   - 2.5.3 Label in name: visible label text included in accessible name.
   - 2.5.5 Target size: interactive targets ≥ 44×44pt (iOS) or 48×48dp (Android).

3. UNDERSTANDABLE
   - 3.3.1 Error identification: form errors identified in text, not color alone.
   - 3.3.2 Labels or instructions: form inputs have visible labels.

4. ROBUST
   - 4.1.2 Name, role, value: all components have correct accessibility roles.

PLATFORM CHECKS:
Android:
- contentDescription on all ImageView and IconButton elements.
- importantForAccessibility="no" on decorative elements.
- TalkBack focus order matches visual order.
- Custom view provides AccessibilityNodeInfoCompat.

iOS:
- accessibilityLabel on all images and icon buttons.
- accessibilityTraits correct (.button, .header, .link, .selected).
- accessibilityHint for non-obvious actions.
- isAccessibilityElement = false for decorative views.

Flutter:
- Semantics widget with label, button, and excludeSemantics for decorative.
- SemanticsHint for non-obvious interactions.

React Native:
- accessibilityLabel and accessibilityRole on all interactive elements.
- accessibilityHint for non-obvious actions.
- accessible={false} for decorative elements.

For each issue: element, requirement violated, WCAG criterion, and concrete fix.
```
