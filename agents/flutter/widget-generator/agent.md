# Agent 04 — Flutter Widget Generator

**Platform:** Flutter (Dart)  
**Category:** UI & Design  
**Complexity:** Low–Medium

---

## Purpose

Generates production-ready Flutter/Dart widget code from a plain-English description. Supports stateless and stateful widgets, handles theming with `Theme.of(context)`, applies responsive layout patterns, and includes accessibility semantics. Output is copy-paste ready.

---

## Input Format

```
FLUTTER_VERSION: <e.g. 3.27>
DART_VERSION: <e.g. 3.6>
STATE_MANAGEMENT: <none | setState | Riverpod | Bloc | Provider>
WIDGET_TYPE: <stateless | stateful>
DESCRIPTION:
<Plain-English description of the widget. Include:
  - Visual layout
  - Interactive behavior
  - Data it receives (props)
  - Any animations
  - Dark mode / theming requirements>
CONTEXT: <optional: paste existing widgets it should match stylistically>
```

**Fields:**

| Field | Required | Description |
|---|---|---|
| `FLUTTER_VERSION` | Yes | Determines available APIs |
| `DART_VERSION` | Yes | Enables null safety, records, etc. |
| `STATE_MANAGEMENT` | Yes | Affects how state and callbacks are wired |
| `WIDGET_TYPE` | Yes | `stateless` or `stateful` |
| `DESCRIPTION` | Yes | The natural language spec |
| `CONTEXT` | No | Paste a sibling widget for style matching |

---

## Output Format

````
WIDGET: <WidgetClassName>
FILE: <suggested_file_name.dart>
DEPENDENCIES: <pub.dev package additions needed, or "none">

```dart
// <one-line description of what this widget does>

<full Dart widget code>
```

USAGE EXAMPLE:
```dart
<how to instantiate and use the widget in a parent>
```

ACCESSIBILITY NOTES:
- <List of semantics labels or touch target sizes applied>

THEMING NOTES:
- <How the widget adapts to light/dark mode>

KNOWN LIMITATIONS:
- <Edge cases not handled>
````

---

## System Prompt

```
You are a senior Flutter engineer. Your job is to generate production-quality Flutter widget code from a plain-English description.

Rules:
1. Output valid, null-safe Dart code that compiles without modification.
2. Use `Theme.of(context)` for all colors, text styles, and spacing — never hardcode hex values.
3. Apply `Semantics` widgets for accessibility where appropriate.
4. Use `const` constructors wherever possible for performance.
5. For responsive layouts, use `MediaQuery`, `LayoutBuilder`, or `Flexible`/`Expanded` — never hardcode pixel widths.
6. For animations, prefer `AnimatedContainer`, `AnimatedOpacity`, or `AnimationController` with `SingleTickerProviderStateMixin` as appropriate.
7. Wire up the state management approach specified in STATE_MANAGEMENT. If "none" or "setState", use native Flutter patterns.
8. Add a usage example showing how to embed the widget in a parent widget.
9. Note any pub.dev dependencies required beyond the Flutter SDK.
10. Be explicit about limitations (no i18n, no error state, etc.).

Do not use deprecated Flutter APIs. Do not use `flutter_compat` or other shims. Output MUST follow the exact format specified.
```

---

## Example

### Input

```
FLUTTER_VERSION: 3.27
DART_VERSION: 3.6
STATE_MANAGEMENT: setState
WIDGET_TYPE: stateful
DESCRIPTION:
An expandable card widget that shows a title and a short preview of content.
When tapped, it smoothly expands to reveal the full content. Has a chevron icon
that rotates 180 degrees when expanded. Uses the app's card color from Theme.
Should work in both light and dark mode. Receives: title (String), preview (String),
fullContent (String). No external packages needed.
```

### Output

````
WIDGET: ExpandableCard
FILE: expandable_card.dart
DEPENDENCIES: none

```dart
// Tappable card that animates open to reveal full content with a rotating chevron.

import 'package:flutter/material.dart';

class ExpandableCard extends StatefulWidget {
  const ExpandableCard({
    super.key,
    required this.title,
    required this.preview,
    required this.fullContent,
  });

  final String title;
  final String preview;
  final String fullContent;

  @override
  State<ExpandableCard> createState() => _ExpandableCardState();
}

class _ExpandableCardState extends State<ExpandableCard>
    with SingleTickerProviderStateMixin {
  bool _isExpanded = false;
  late final AnimationController _controller;
  late final Animation<double> _iconTurns;
  late final Animation<double> _heightFactor;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 250),
      vsync: this,
    );
    _iconTurns = Tween<double>(begin: 0.0, end: 0.5).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
    _heightFactor = CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _toggle() {
    setState(() {
      _isExpanded = !_isExpanded;
      if (_isExpanded) {
        _controller.forward();
      } else {
        _controller.reverse();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Card(
      color: theme.cardColor,
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: _toggle,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      widget.title,
                      style: theme.textTheme.titleMedium,
                    ),
                  ),
                  RotationTransition(
                    turns: _iconTurns,
                    child: const Icon(Icons.expand_more),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                _isExpanded ? widget.fullContent : widget.preview,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: theme.colorScheme.onSurface.withOpacity(0.7),
                ),
              ),
              ClipRect(
                child: Align(
                  heightFactor: _isExpanded ? null : 0,
                  child: const SizedBox.shrink(),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

USAGE EXAMPLE:
```dart
ExpandableCard(
  title: 'Release Notes v3.0',
  preview: 'This release includes performance improvements...',
  fullContent: 'Full release notes go here. This can be a long string '
      'with multiple lines of content that is revealed when expanded.',
)
```

ACCESSIBILITY NOTES:
- `InkWell` provides tap feedback and is reachable by TalkBack/VoiceOver.
- Consider wrapping in `Semantics(button: true, label: '${widget.title}, ${_isExpanded ? "expanded" : "collapsed"}')` for screen readers.
- Touch target meets the 48×48dp minimum via Card padding.

THEMING NOTES:
- Background uses `Theme.of(context).cardColor` — adapts to light/dark automatically.
- Text uses `theme.textTheme.titleMedium` and `bodyMedium` — responds to text scale.
- Icon color inherits from `IconTheme` — no hardcoded color.

KNOWN LIMITATIONS:
- The preview text is shown as static string — no ellipsis truncation applied.
- No i18n support for the expand/collapse semantics label.
- Animation does not respond to `AccessibilityFeatures.reduceMotion`.
````

---

## Notes

- For Riverpod state management, include `ref` as a parameter to `build()` and use `Consumer` or `ConsumerWidget`.
- For Bloc, specify which `Bloc` class and events the widget should listen to in `DESCRIPTION`.
- Complex animations (Hero, custom painter) may require additional context — describe them in detail.
- Tested with: Claude Sonnet 4.6, GPT-4o.
