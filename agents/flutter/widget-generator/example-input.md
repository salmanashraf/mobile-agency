# Example Input — Flutter Widget Generator

---

```
FLUTTER_VERSION: 3.27
DART_VERSION: 3.6
STATE_MANAGEMENT: setState
WIDGET_TYPE: stateful
DESCRIPTION:
An expandable card widget that shows a title and a short preview of content.
When tapped, it smoothly expands to reveal the full content body. A chevron icon
on the right rotates 180 degrees when expanded. Uses the app's card color from Theme.
Should work in both light and dark mode. Receives: title (String), preview (String),
fullContent (String). No external packages needed.
CONTEXT:
```

---

## What to Expect

See [`example-output.md`](example-output.md) for the complete Dart widget, usage example, and notes.

The agent generates:
- `ExpandableCard` — `StatefulWidget` with `SingleTickerProviderStateMixin`
- `AnimationController` + `RotationTransition` for the chevron
- `Theme.of(context)` for all colors and text styles
- `Semantics` for accessibility
- Usage example in a parent widget

---

## Variations

### Loading button
```
FLUTTER_VERSION: 3.27
DART_VERSION: 3.6
STATE_MANAGEMENT: setState
WIDGET_TYPE: stateful
DESCRIPTION:
A button that shows a circular loading spinner while its async action runs.
Disabled (non-tappable) during loading. Normal FilledButton appearance otherwise.
Receives: label (String), onPressed (Future<void> Function()). No external packages.
```

### Pill badge chip
```
FLUTTER_VERSION: 3.27
DART_VERSION: 3.6
STATE_MANAGEMENT: setState
WIDGET_TYPE: stateful
DESCRIPTION:
A pill-shaped tag chip. Background is primaryContainer color, text is onPrimaryContainer.
Tapping toggles selected/unselected (filled vs outlined). Optional remove button (×)
that fades in with 200ms when selected. Receives: label, isSelected, onToggle, onRemove (nullable).
```

### Shimmer loading placeholder
```
FLUTTER_VERSION: 3.27
DART_VERSION: 3.6
STATE_MANAGEMENT: setState
WIDGET_TYPE: stateful
DESCRIPTION:
A shimmer loading placeholder for a list card. Shows animated horizontal gradient
sweeping left-to-right repeatedly. Contains a circle placeholder (for avatar, 48dp)
and two rectangle placeholders (for title and subtitle lines). Uses surfaceVariant color.
No external packages — implement shimmer with AnimationController and LinearGradient.
```
