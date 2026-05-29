# Flutter Skills

Reusable skill prompt modules for Flutter (Dart 3.x) widget generation and code review.

## Index

| Skill | File | When to Use |
|---|---|---|
| Flutter Widget Generation Rules | [widget-gen.md](widget-gen.md) | Before generating any widget — ensures null-safety, const constructors, theming, accessibility |

## Usage

```
# Prime any LLM session before widget generation
[paste skill prompt from widget-gen.md]

Generate a widget for: [describe the widget]
```

## Composable With

- [`agents/flutter/widget-generator`](../../agents/flutter/widget-generator/) — full structured widget generation
- [`agents/flutter/bloc-feature-builder`](../../agents/flutter/bloc-feature-builder/) — generate full feature layer

## Contributing

High-value skills to add:
- `state-management-review.md` — review BLoC, Cubit, Riverpod, Provider patterns
- `navigation-review.md` — GoRouter, Navigator 2.0 patterns
- `performance-review.md` — `const` constructors, `ListView.builder`, `RepaintBoundary`

Copy `templates/skill-template.md` and open a PR.
