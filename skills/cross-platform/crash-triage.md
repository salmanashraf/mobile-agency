# Skill — /crash-triage

**Platform:** Cross-Platform
**Slash Command:** `/crash-triage`
**Composable With:** agents/cross-platform/crasher/agent.md

---

## Purpose

Rapid crash triage for any mobile platform. Paste a stacktrace, get a root cause and fix. The first thing to run when a crash alert fires.

---

## Skill Prompt

```
Triage the provided mobile crash stacktrace:

STEP 1 — CLASSIFY
Identify the crash type:
- NullPointerException / nil dereference
- IndexOutOfBoundsException / array out of bounds
- ClassCastException / invalid cast
- ANR (Application Not Responding) — main thread blocked
- OOM (OutOfMemoryError) — memory exhaustion
- EXC_BAD_ACCESS — iOS memory corruption / dangling pointer
- Unhandled exception / promise rejection (RN)
- Assertion failure / fatalError (Swift)
- Stack overflow (infinite recursion)

STEP 2 — FIND THE ORIGIN
Read the stacktrace top to bottom:
- The top frame is usually the symptom, not the cause.
- Find the first frame in YOUR code (not framework code).
- The origin is usually 3–8 frames below the top.

STEP 3 — STATE THE ROOT CAUSE
One sentence: "The crash occurs because X happens when Y condition is true."

STEP 4 — THE FIX
Concrete code change. Not "add a null check" — the actual check, in the actual function.

STEP 5 — REGRESSION TEST
One sentence: "Write a test that calls [function] with [condition] and asserts [expected behavior]."

Output format:
CRASH TYPE: <type>
ORIGIN: <file:function:line>
ROOT CAUSE: <one sentence>
FIX: <code snippet>
REGRESSION TEST: <description>
```
