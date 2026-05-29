# Prompt — Explain Kotlin Flow Chain

**Platform:** Android (Kotlin)  
**Category:** Code Quality / Documentation  
**Type:** one-shot

---

## Purpose

Explains a Kotlin Flow operator chain in plain English, describing what each operator does and the overall data transformation from source to collector.

---

## Prompt

```
You are a senior Android/Kotlin engineer explaining code to a developer who knows Kotlin basics but is new to coroutines and Flow.

Explain the following Kotlin Flow chain step by step:
1. What is the source of data (what emits)?
2. What does each operator do to the data?
3. What does the collector receive?
4. Are there any threading implications (which thread does each part run on)?
5. Are there any potential issues (e.g., exception handling, backpressure, cancellation)?

Keep the explanation concrete — use the actual variable names and types from the code.
Do not use jargon without explaining it.

Flow chain to explain:
```
[PASTE YOUR FLOW CHAIN HERE]
```
```

---

## Example Usage

**What you paste:**
```
You are a senior Android/Kotlin engineer explaining code to a developer who knows Kotlin basics but is new to coroutines and Flow.

Explain the following Kotlin Flow chain step by step:
...

Flow chain to explain:
```
val userFlow = repository.getUsers()
    .filter { it.isActive }
    .map { it.toDisplayModel() }
    .catch { e -> emit(emptyList()) }
    .flowOn(Dispatchers.IO)
```
```

**Expected output:**
```
Here's what happens in this Flow chain, step by step:

1. SOURCE — repository.getUsers()
   This emits a List<User> (or individual User objects, depending on the repository).
   Think of it as the raw data tap — it starts the pipeline.

2. filter { it.isActive }
   Each User emitted is tested: if isActive is true, it passes through. If false, it's
   dropped silently. The downstream sees only active users.

3. map { it.toDisplayModel() }
   Converts each User to a DisplayModel — a transformation that changes the type.
   Whatever toDisplayModel() does (formatting dates, combining fields) happens here.

4. catch { e -> emit(emptyList()) }
   If any upstream operator throws an exception, this catches it and emits an empty
   list instead. The collector never sees the exception — it sees an empty list as a
   fallback. Note: if toDisplayModel() throws, that is also caught here.

5. flowOn(Dispatchers.IO)
   Moves the upstream work (getUsers, filter, map, catch) onto the IO thread pool.
   The collector still runs on whatever coroutine scope it was launched in (likely
   the main thread if collected in a ViewModel with viewModelScope).

THREADING SUMMARY:
  getUsers() → filter → map → catch : IO thread
  Collector (e.g., collect { ... })  : caller's thread (usually Main)

POTENTIAL ISSUES:
- If repository.getUsers() returns a cold flow, it re-runs on every collection.
  Make sure the flow is not doing expensive work (like a network call) that you
  expect to be cached.
- The catch block swallows ALL exceptions silently. Consider logging the error
  before emitting the fallback:
  .catch { e -> log(e); emit(emptyList()) }
```

---

## Variations

- **Explain for a team Slack post:** Append "Format the output as a short Slack message with emoji for the section headers."
- **With suggested improvements:** Append "After the explanation, suggest two improvements to the operator chain."
