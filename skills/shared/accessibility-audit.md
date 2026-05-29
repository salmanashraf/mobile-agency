# Skill — Mobile Accessibility Audit

**Platform:** Cross-Platform (Android / iOS / Flutter / React Native)  
**Category:** Code Quality / Accessibility  
**Composable With:** agents/cross-platform/accessibility-auditor/agent.md

---

## Purpose

Reviews mobile UI code against WCAG 2.2 mobile guidelines and platform-specific accessibility APIs. Covers content descriptions, touch targets, screen reader behavior, focus order, and contrast. Use as a pre-release accessibility gate.

## When to Use

- Before releasing any screen that has new interactive elements
- When QA or a user reports a TalkBack/VoiceOver issue
- As a composable check inside a larger UI review

---

## Skill Prompt

```
When auditing mobile UI code for accessibility, check for:

CONTENT DESCRIPTIONS & LABELS
Android (Compose/XML):
- Every Image, Icon, or decorative element needs contentDescription.
  If purely decorative: contentDescription = null (Compose) or android:contentDescription=""
  and importantForAccessibility="no" (XML).
- Icon-only buttons: contentDescription must describe the ACTION, not the icon.
  "Back" not "Left arrow". "Delete task" not "Trash icon".
- Checkboxes and toggles: the label must be associated (Modifier.toggleable with semantics,
  or labelFor in XML).

iOS (SwiftUI/UIKit):
- Images used as buttons or conveyors of meaning need .accessibilityLabel("description").
- Decorative images: .accessibilityHidden(true).
- Custom controls: set accessibilityTraits (.button, .selected, .adjustable) to tell
  VoiceOver the element's role.
- accessibilityValue for sliders, toggles, and steppers: VoiceOver reads both label + value.

Flutter:
- Semantics widget required for custom interactive widgets. Set label, hint, and button: true/false.
- Exclude decorative elements: ExcludeSemantics or Semantics(excludeSemantics: true).
- MergeSemantics: merge related child semantics into one accessible node for compound widgets.

React Native:
- accessibilityLabel on all touchable elements that don't have descriptive text children.
- accessibilityRole: 'button', 'link', 'checkbox', 'header', etc.
- accessibilityState for interactive state: {checked: bool, disabled: bool, selected: bool}.
- accessibilityHint for actions whose purpose isn't obvious from the label alone.

TOUCH TARGET SIZE
- Minimum 48×48 dp (Android) / 44×44 pt (iOS) for all interactive elements.
- Flag any button, icon button, or tap area smaller than this minimum.
- Use padding to expand the touch area without changing visual size:
  Android Compose: Modifier.minimumInteractiveComponentSize() or padding
  iOS: contentEdgeInsets or .contentShape(Rectangle().inset(by: -8))
  Flutter: Padding or SizedBox wrapping the widget
  React Native: padding or hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}

FOCUS ORDER & KEYBOARD NAVIGATION
- Logical reading order: screen readers read in the order elements appear in the view hierarchy.
  Flag any absolute-positioned or z-index-manipulated elements where visual order ≠ DOM/hierarchy order.
- Android: use android:accessibilityTraversalAfter/Before or Modifier.semantics { traversalIndex } in Compose.
- iOS: accessibilityElements array on the parent to define custom order.
- React Native: accessible={true} with accessibilityViewIsModal for modals (traps focus inside).

DYNAMIC CONTENT ANNOUNCEMENTS
- When content changes dynamically (success toast, error message, loading complete), announce it:
  Android: View.announceForAccessibility("Upload complete") or AccessibilityEvent.TYPE_ANNOUNCEMENT
  iOS: UIAccessibility.post(notification: .announcement, argument: "Upload complete")
  Flutter: SemanticsService.announce("Upload complete", TextDirection.ltr)
  React Native: AccessibilityInfo.announceForAccessibility("Upload complete")
- Flag any dynamic UI state change (snackbar, badge update, count change) that has no announcement.

COLOR & CONTRAST
- The code cannot prove contrast ratios, but flag:
  Any hardcoded color that is not from the theme/design system (cannot be verified for contrast).
  Any text rendered over an image without a scrim/overlay (contrast is unpredictable).
  Any disabled state that uses only color to convey disabled-ness (should also use reduced opacity + non-interactive).

Severity:
- CRITICAL: blocks screen reader users entirely (no label on interactive element, focus trap outside modal)
- HIGH: degrades usability significantly (touch target too small, wrong role, no dynamic announcement)
- MEDIUM: impacts some users (missing hint, suboptimal reading order)
- LOW: minor improvement (redundant label, overly verbose hint)
```

---

## Example

**Input:**
```kotlin
// Compose
IconButton(onClick = { onDelete(item.id) }) {
    Icon(Icons.Default.Delete, contentDescription = null)
}
```

**Output:**
```
CRITICAL — Icon button has no accessibility label
  Problem: contentDescription = null on the Icon means TalkBack announces this as an
           unlabeled button. Screen reader users cannot know what tapping it does.
  Fix:
  IconButton(onClick = { onDelete(item.id) }) {
      Icon(
          imageVector = Icons.Default.Delete,
          contentDescription = "Delete ${item.name}"  // action-oriented, item-specific
      )
  }
```

---

## Composition Example

```
Prepend this skill to any UI component review for a quick accessibility gate.
For a full structured accessibility audit with severity counts and a platform-specific
remediation guide, run agents/cross-platform/accessibility-auditor/agent.md.
```

---

## Notes

- Automated accessibility checkers (Accessibility Scanner on Android, Xcode Accessibility Inspector) catch some issues but miss semantic meaning, logical reading order, and dynamic announcement gaps.
- Always test with TalkBack (Android) and VoiceOver (iOS) on a real device — emulator behavior differs.
