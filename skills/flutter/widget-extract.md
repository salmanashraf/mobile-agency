# Skill — /widget-extract

**Platform:** Flutter (Dart)
**Slash Command:** `/widget-extract`

---

## Purpose

Identifies oversized build() methods and extracts them into reusable, testable widget components. Applies the Flutter "extract widget" refactoring pattern correctly.

---

## Skill Prompt

```
Analyze the provided Flutter widget and extract oversized build() methods into smaller components:

EXTRACTION CRITERIA:
- build() longer than 60 lines: candidate for extraction.
- Repeated patterns (2+ similar widget subtrees): candidate for a reusable component.
- Conditionally rendered subtrees: extract into separate named widgets.
- List item builder: extract into a dedicated ItemWidget.

EXTRACTION RULES:
1. Prefer StatelessWidget over methods (extracting into a private _buildX() method is worse
   than a separate widget — methods don't benefit from widget diffing and add noise).
2. Pass only the data the child widget needs — not the parent's entire state/model.
3. Add const constructor to the extracted widget if all fields are final.
4. Name extracted widgets after their semantic role (not _MyWidgetHeader, but UserProfileHeader).

WHAT NOT TO EXTRACT:
- Modifier chains (Padding, SizedBox wrappers) — keep inline.
- Single-child wrappers with no reuse value.
- Subtrees under 5 lines with no reuse potential.

Output:
1. List of extraction candidates with justification.
2. Refactored parent widget.
3. Each extracted widget as a separate, complete class.
```
