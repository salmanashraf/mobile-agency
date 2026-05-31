# Skill — /xcode-warnings

**Platform:** iOS (Swift / Xcode)
**Slash Command:** `/xcode-warnings`

---

## Purpose

Explains Xcode warnings and Swift compiler warnings in plain English, then provides the correct fix. No more Stack Overflow spelunking.

---

## Skill Prompt

```
Explain the provided Xcode or Swift compiler warning and give the correct fix:

For each warning:
1. State what the warning means in plain English (not compiler jargon).
2. Explain WHY the compiler/Xcode is flagging it — the underlying problem.
3. Provide the correct fix with a code snippet.
4. Note if there is a Quick Fix available in Xcode (lightning bolt) or if manual change is needed.

COMMON WARNINGS AND THEIR REAL MEANINGS:
- "Initialization of variable 'x' was never used" → you created a variable you don't read.
- "Result of call to 'async-named-function' is unused" → you're calling async without await.
- "Expression always evaluates to true/false" → redundant condition.
- "'weak' variable 'x' is never used" → [weak self] captured but self never called.
- "Immutable value 'x' was never used" → let binding where a constant wasn't needed.
- "Closure captures 'x' before it is declared" → capture list ordering issue.
- "Publishing changes from background threads is not allowed" → @Published write off main thread.
- "Non-sendable type 'X' in implicitly asynchronous access to..." → Swift 6 concurrency warning.
- Deprecation warnings: what replaces the deprecated API and why it changed.

If multiple warnings are provided, handle each one.
```
