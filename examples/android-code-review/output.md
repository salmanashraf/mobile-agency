# AXIOM Review — ProfileViewModel.kt

**Agent:** AXIOM  
**Input:** examples/android-code-review/input.kt

See the full example output in `agents/android/axiom/agent.md` — this file contains the canonical AXIOM review of the same ProfileViewModel.

## Issues Found: 6 (Critical: 3, Warning: 2, Info: 1)

| Severity | Line | Issue |
|---|---|---|
| CRITICAL | 7 | GlobalScope used instead of viewModelScope |
| CRITICAL | 8 | Repository instantiated directly in ViewModel |
| CRITICAL | 17 | Force unwrap !! on nullable LiveData value |
| WARNING | 5 | MutableLiveData instead of StateFlow |
| WARNING | 13 | Null check on non-nullable String |
| INFO | 6 | No error handling in loadUser |

## Verdict: NEEDS WORK

All 3 CRITICAL issues must be fixed before this code can merge.
See `agents/android/axiom/agent.md` for the complete fix for each issue.
