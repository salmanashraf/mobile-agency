# Skill — Flutter Widget Generation Rules

**Platform:** Flutter (Dart)  
**Category:** UI & Design  
**Composable With:** agents/flutter/widget-generator/agent.md

---

## Purpose

Gives an LLM the rules needed to generate production-quality Flutter widget code. Use as a standalone primer or as a module inside the Widget Generator agent.

## When to Use

- Before asking any LLM to write Flutter widget code
- When you want quick widget snippets without running the full agent
- As a quality gate when reviewing AI-generated Flutter code

---

## Skill Prompt

```
When generating Flutter/Dart widget code, follow these rules:

CORRECTNESS
- All code must be null-safe (Dart 3.x). Never use the legacy ? suffix on non-nullable types.
- Prefer `const` constructors wherever possible — this is a Flutter performance requirement,
  not a style preference. Mark widgets const when all fields are compile-time constants.
- Call `super.dispose()` in every dispose() override. Failure to do so is a memory leak.
- Use `super.key` parameter forwarding in constructors: MyWidget({super.key, ...}).

THEMING
- Never hardcode colors as hex literals (#FF5733) or RGB values (Colors.red). Always use:
  Theme.of(context).colorScheme.primary (Material 3)
  Theme.of(context).cardColor
  Theme.of(context).textTheme.bodyMedium
- Never hardcode font sizes. Use Theme.of(context).textTheme styles.
- For spacing, prefer a consistent spacing system (e.g., multiples of 8) using const values.

RESPONSIVE LAYOUT
- Never hardcode pixel widths for layout. Use:
  Flexible / Expanded for flex layouts
  LayoutBuilder for container-relative sizing
  MediaQuery.of(context).size for screen-relative sizing
- For text, let it wrap with softWrap: true (default) rather than fixed-width Text containers.

ANIMATIONS
- For simple show/hide or size changes: AnimatedContainer, AnimatedOpacity, AnimatedSize.
- For custom animations: AnimationController + SingleTickerProviderStateMixin.
  Always cancel the controller in dispose(): _controller.dispose().
- Always check if mounted before calling setState() in async callbacks:
  if (mounted) setState(() { ... });

ACCESSIBILITY
- Use Semantics widget to label non-text interactive elements.
- Ensure all tap targets are at least 48×48 dp (GestureDetector / InkWell padding).
- Use Tooltip for icon-only buttons.

STATE MANAGEMENT
- For local UI state: StatefulWidget + setState.
- For shared state across widgets: use the project's specified state management (Riverpod,
  Bloc, Provider) — do not mix approaches.
- Do not put business logic in build(). Business logic belongs in a ViewModel/controller/notifier.
```

---

## Example

**Input (after applying skill):**
```
Write a Flutter button that shows a loading spinner while its async action runs.
```

**Output:**
```dart
class AsyncButton extends StatefulWidget {
  const AsyncButton({super.key, required this.label, required this.onPressed});
  final String label;
  final Future<void> Function() onPressed;

  @override
  State<AsyncButton> createState() => _AsyncButtonState();
}

class _AsyncButtonState extends State<AsyncButton> {
  bool _loading = false;

  Future<void> _handlePress() async {
    setState(() => _loading = true);
    try {
      await widget.onPressed();
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return FilledButton(
      onPressed: _loading ? null : _handlePress,
      child: _loading
          ? const SizedBox(
              width: 18, height: 18,
              child: CircularProgressIndicator(strokeWidth: 2),
            )
          : Text(widget.label),
    );
  }
}
```

---

## Composition Example

```
Prepend this skill to any Flutter code generation request. Example:

"[paste skill prompt]

Now write a widget that shows a paginated list of products with pull-to-refresh."
```

---

## Notes

- Material 3 is the default from Flutter 3.16. Use `colorScheme` properties, not deprecated `primaryColor`, `backgroundColor`, etc.
- `withOpacity()` is deprecated in Dart 3.3+ — use `withValues(alpha: ...)` or the `Color.fromRGBO` constructor for new code.
