# Example Output — Flutter Widget Generator

Full agent response to the input in [`example-input.md`](example-input.md).

---

```
WIDGET: ExpandableCard
FILE: expandable_card.dart
DEPENDENCIES: none
```

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
  }

  @override
  void dispose() {
    // Always dispose AnimationController to prevent memory leaks.
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
    return Semantics(
      button: true,
      expanded: _isExpanded,
      label: '${widget.title}, ${_isExpanded ? "expanded" : "collapsed"}',
      child: Card(
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
                AnimatedCrossFade(
                  firstChild: Text(
                    widget.preview,
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: theme.colorScheme.onSurface.withOpacity(0.7),
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  secondChild: Text(
                    widget.fullContent,
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: theme.colorScheme.onSurface.withOpacity(0.7),
                    ),
                  ),
                  crossFadeState: _isExpanded
                      ? CrossFadeState.showSecond
                      : CrossFadeState.showFirst,
                  duration: const Duration(milliseconds: 200),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
```

---

**USAGE EXAMPLE:**

```dart
ExpandableCard(
  title: 'Release Notes v3.0',
  preview: 'Performance improvements, bug fixes, and dark mode...',
  fullContent:
      'This release includes a 40% faster startup time, fixes for the '
      'notification badge count, and full dark mode support across all '
      'screens. We also migrated to the new networking stack.',
)
```

---

**ACCESSIBILITY NOTES:**
- `Semantics(button: true, expanded: _isExpanded, label: ...)` announces expand/collapse state to TalkBack and VoiceOver.
- The entire card is the tap target — well above the 48×48dp minimum.
- Screen readers announce the title + state (e.g., "Release Notes v3.0, collapsed, button").

**THEMING NOTES:**
- Card background: `theme.cardColor` — adapts to light/dark automatically.
- Title: `theme.textTheme.titleMedium` — responds to system text scale.
- Body: `theme.textTheme.bodyMedium` — responds to text scale and user accessibility settings.
- Icon inherits from `IconTheme` — no hardcoded color.

**KNOWN LIMITATIONS:**
- `AnimatedCrossFade` applies a fixed 200ms cross-fade — it does not respond to `AccessibilityFeatures.reduceMotion`. Wrap the animation in a check if your app supports reduced motion.
- The `preview` text is truncated at 2 lines with ellipsis — very long previews may be cut in a way that breaks mid-sentence.
- No `rememberSaveable` equivalent — expanded state resets on hot-reload and widget recreation in parent lists. To preserve state across scroll, hoist `_isExpanded` to the parent and pass it as a constructor parameter.
