# Skill — /flutter-review

**Platform:** Flutter (Dart 3.x)
**Slash Command:** `/flutter-review`
**Composable With:** agents/flutter/dart/agent.md

---

## Purpose

Widget tree audit covering const constructors, state management correctness, rebuild scope, and accessibility. Use before PR merge on any Flutter screen or widget.

---

## Skill Prompt

```
Review the provided Flutter/Dart code for these issues:

CONST CONSTRUCTORS
- Every widget whose properties are all compile-time constants should be const.
- Flag every Text('literal'), Icon(Icons.x), SizedBox(height: N) that is missing const.
- Cost of missing const: unnecessary widget instantiation on every rebuild.

REBUILD SCOPE
- setState() in a large StatefulWidget that should be scoped to a smaller widget.
- Consumer/BlocBuilder/Selector wrapping the entire screen body.
  Fix: wrap only the smallest subtree that actually depends on the changing state.
- AnimatedBuilder wrapping non-animated children.

STATE MANAGEMENT
- Business logic in build() method — flag and suggest moving to Bloc/Cubit/Notifier.
- BuildContext used after async gap without mounted check.
- StreamBuilder with no initialData and no error handler.

NULL SAFETY
- Late variables without clear initialization guarantee.
- ! operator on values that could realistically be null.
- Dynamic type used where a concrete type is known.

ACCESSIBILITY
- Images without semanticLabel.
- Tappable widgets without Semantics(button: true) or semanticsLabel.
- Touch targets smaller than 48×48dp.
- Text contrast — flag hardcoded colors that may fail WCAG AA.

DART 3.x PATTERNS
- switch expressions where applicable (replaces verbose if/else chains).
- Records for lightweight multi-value returns.
- Sealed classes for exhaustive state modeling.

For each issue: widget name, line if given, what causes the problem, and the fix.
```

---

## Demo

<img width="400" height="261" alt="flutter-review demo" src="https://github.com/user-attachments/assets/e0c1d9d8-f66e-4983-a60b-b3b515fa0de0" />
