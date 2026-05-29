# Flutter Widget Generator Agent

> Describe a widget in plain English. Get a complete, production-ready Dart widget — null-safe, themed, accessible, animated if needed, and copy-paste ready.

---

## What This Agent Does

Generates a complete Flutter widget from a plain-English description. Every widget follows these non-negotiables:

- **Null-safe Dart 3.x** — no legacy `?` suffixes on non-nullable types
- **`const` constructors** — wherever possible, for Compose-level performance
- **Theme-driven** — `Theme.of(context).colorScheme.*` and `TextTheme.*` throughout; no hardcoded hex
- **Responsive** — `Flexible`, `Expanded`, `LayoutBuilder`; no hardcoded pixel widths
- **Accessible** — `Semantics` widget on custom interactive elements, 48×48dp minimum tap targets
- **Animation-safe** — `AnimationController` always disposed in `dispose()`

---

## Files

| File | Purpose |
|---|---|
| [`agent.md`](agent.md) | Input format, output format, full system prompt |
| [`example-input.md`](example-input.md) | Expandable card description |
| [`example-output.md`](example-output.md) | Complete Dart widget + usage example |

---

## Quick Start

```
FLUTTER_VERSION: 3.27
DART_VERSION: 3.6
STATE_MANAGEMENT: setState
WIDGET_TYPE: stateful
DESCRIPTION:
[plain-English widget description]
```

---

## Output Format

````
WIDGET: <WidgetClassName>
FILE: <suggested_file_name.dart>
DEPENDENCIES: <pub.dev additions, or "none">

```dart
<full widget code>
```

USAGE EXAMPLE:
ACCESSIBILITY NOTES:
THEMING NOTES:
KNOWN LIMITATIONS:
````

---

## Related Agents

- [`agents/flutter/bloc-feature-builder`](../bloc-feature-builder/) — generate an entire feature layer, not just a widget
- `skills/flutter/widget-gen.md` — lightweight generation rules for inline sessions
- `prompts/flutter/widget-from-design.md` — generate from a Figma/wireframe description
