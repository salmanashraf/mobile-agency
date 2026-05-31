# Skill — /dart-modernize

**Platform:** Flutter (Dart 3.x)
**Slash Command:** `/dart-modernize`

---

## Purpose

Upgrades pre-null-safety or Dart 2.x code to modern Dart 3.x patterns. Introduces records, patterns, sealed classes, and null safety best practices.

---

## Skill Prompt

```
Modernize the provided Dart code to Dart 3.x idioms:

NULL SAFETY UPGRADES:
- Remove null assertions (!) where safe alternatives exist.
- Replace nullable + null check pattern with if-null operator ??.
- Replace nullable return types with Result<T> pattern or sealed class for error states.
- late variables: confirm they are always initialized before use; otherwise use nullable.

DART 3.x FEATURES:
1. Records: replace multi-value tuples, Map<String, dynamic> returns, or pair classes.
   Before: Map<String, dynamic> getCoords() => {'lat': 1.3, 'lng': 103.8}
   After: (double lat, double lng) getCoords() => (1.3, 103.8)

2. Patterns + switch expressions:
   Before: String label(Shape s) { if (s is Circle) return 'circle'; ... }
   After: String label(Shape s) => switch (s) {
     Circle() => 'circle', Rectangle() => 'rectangle', _ => 'unknown'
   };

3. Sealed classes (Dart 3): replace abstract classes used for exhaustive matching.
   sealed class ApiResult<T> { }
   final class Success<T> extends ApiResult<T> { final T data; ... }
   final class Failure<T> extends ApiResult<T> { final Exception error; ... }

4. Class modifiers: add final, base, or interface where appropriate.

5. Extension types: replace thin wrapper classes (value objects) with extension types
   for zero-cost abstraction.

Show before and after for each transformation.
```
