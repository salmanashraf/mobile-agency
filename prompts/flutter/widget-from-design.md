# Prompt — Flutter Widget from Design

**Platform:** Flutter (Dart)  
**Category:** UI & Design  
**Type:** one-shot

---

## Purpose

Generates a production-ready Flutter widget from a Figma spec, wireframe description, or design brief.

---

## Prompt

```
You are a senior Flutter engineer. Generate a production-ready Flutter widget from the
design description below.

Rules:
1. Null-safe Dart 3.x. Use const constructors everywhere possible.
2. All colors and text styles from Theme.of(context) — no hardcoded hex values.
3. Spacing in multiples of 8 (8, 16, 24, 32).
4. Responsive: use Flexible/Expanded for layouts; never hardcode pixel widths.
5. Animations: AnimatedContainer or AnimationController + SingleTickerProviderStateMixin. Always dispose controllers.
6. Accessibility: add Semantics widget for custom interactive elements. 48×48 dp minimum tap targets.
7. State: use StatefulWidget + setState for local UI state; accept callbacks for events.
8. Output: complete widget class + usage example in a parent widget.
9. Add a short comment for any non-obvious implementation decision.

Design to implement:
[DESCRIBE THE DESIGN — include sections, colors (as theme roles: primary, surfaceVariant, etc.),
typography roles (titleLarge, bodyMedium), interactive elements, animations, states]
```

---

## Example Usage

**What you paste:**
```
Design to implement:
A pill-shaped tag chip widget. Shows a label and an optional remove (×) button.
Background is primary container color, text is onPrimaryContainer. Tapping the chip
selects/deselects it (toggles a filled vs outlined appearance). The remove button (only
visible when selected) fades in with a 200ms fade. Minimum height 32dp, padding 12dp horizontal.
Expose: label (String), isSelected (bool), onToggle callback, onRemove callback (nullable).
```

**Expected output:**
```dart
import 'package:flutter/material.dart';

class TagChip extends StatefulWidget {
  const TagChip({
    super.key,
    required this.label,
    required this.isSelected,
    required this.onToggle,
    this.onRemove,
  });

  final String label;
  final bool isSelected;
  final VoidCallback onToggle;
  final VoidCallback? onRemove;

  @override
  State<TagChip> createState() => _TagChipState();
}

class _TagChipState extends State<TagChip> with SingleTickerProviderStateMixin {
  late final AnimationController _fadeController;
  late final Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 200),
      vsync: this,
      value: widget.isSelected ? 1.0 : 0.0,
    );
    _fadeAnimation = CurvedAnimation(parent: _fadeController, curve: Curves.easeInOut);
  }

  @override
  void didUpdateWidget(TagChip oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.isSelected != widget.isSelected) {
      widget.isSelected ? _fadeController.forward() : _fadeController.reverse();
    }
  }

  @override
  void dispose() {
    _fadeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Semantics(
      button: true,
      selected: widget.isSelected,
      label: '${widget.label}, ${widget.isSelected ? "selected" : "not selected"}',
      child: GestureDetector(
        onTap: widget.onToggle,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          constraints: const BoxConstraints(minHeight: 32),
          padding: const EdgeInsets.symmetric(horizontal: 12),
          decoration: BoxDecoration(
            color: widget.isSelected
                ? colorScheme.primaryContainer
                : colorScheme.surfaceVariant,
            borderRadius: BorderRadius.circular(16),
            border: widget.isSelected
                ? null
                : Border.all(color: colorScheme.outline),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                widget.label,
                style: textTheme.labelLarge?.copyWith(
                  color: widget.isSelected
                      ? colorScheme.onPrimaryContainer
                      : colorScheme.onSurfaceVariant,
                ),
              ),
              if (widget.onRemove != null)
                FadeTransition(
                  opacity: _fadeAnimation,
                  child: GestureDetector(
                    onTap: widget.isSelected ? widget.onRemove : null,
                    child: Padding(
                      padding: const EdgeInsets.only(left: 4),
                      child: Icon(
                        Icons.close,
                        size: 16,
                        color: widget.isSelected
                            ? colorScheme.onPrimaryContainer
                            : Colors.transparent,
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

// Usage:
// TagChip(
//   label: 'Flutter',
//   isSelected: _selectedTags.contains('Flutter'),
//   onToggle: () => setState(() => _selectedTags.toggle('Flutter')),
//   onRemove: () => setState(() => _selectedTags.remove('Flutter')),
// )
```

---

## Variations

- **From Figma specs:** Add "Use these exact Figma tokens: background = Color(0xFFE8DEF8), label = TextStyle(fontSize: 14, fontWeight: FontWeight.w500). Map them to ThemeExtension properties."
- **With Hero animation:** Add "Wrap in a Hero widget with tag = 'chip-${label}' so it animates when navigating to a detail screen."
