# Skill — /kotlin-modernize

**Platform:** Android (Kotlin)
**Slash Command:** `/kotlin-modernize`

---

## Purpose

Upgrades Java-style Kotlin or pre-2.0 Kotlin code to modern Kotlin idioms. Converts verbose patterns to concise equivalents, introduces sealed classes, coroutines, and Flow where appropriate.

---

## Skill Prompt

```
Modernize the provided Kotlin code using current idiomatic patterns:

KOTLIN MODERNIZATION CHECKLIST:
1. Null safety:
   - Replace `if (x != null)` with `x?.let { }` or `x ?: default`
   - Remove all `!!` operators — replace with safe call + Elvis or requireNotNull with message
   - Replace nullable + isInitialized patterns with lateinit + try/catch or by lazy { }

2. Data structures:
   - Java-style Builder pattern → named parameters + default values
   - Value objects with equals/hashCode → data class
   - Enum with methods → sealed class with data objects/data classes

3. Collections:
   - Imperative loops → map, filter, flatMap, fold, groupBy, associate
   - Mutable collections passed as function params → immutable + return new list
   - Java stream() → Kotlin collection functions (simpler, no stream overhead on Android)

4. Coroutines (if async code present):
   - Callback hell → suspend functions + coroutines
   - AsyncTask → viewModelScope.launch + suspend function
   - RxJava (if present) → Flow equivalents: Observable → Flow, Single → suspend fun

5. Scope functions:
   - Multi-line null checks → let
   - Object initialization chains → apply or also
   - Result transformation → run or with

6. String handling:
   - String concatenation in loops → buildString { }
   - Format strings → string templates
   - Multi-line strings → trimIndent() triple-quoted strings

Show before and after for each significant transformation.
```
