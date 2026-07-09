# Skill — /mobile-memory-graph

**Platform:** Cross-Platform  
**Slash Command:** `/mobile-memory-graph`  
**Composable With:** Mobile Memory, AXIOM, SWIFT, DART, BRIDGE, FORGE, UNREAL

---

## Purpose

Build the Knowledge Graph section of `MOBILE_MEMORY.md` from pasted mobile code files. Use it when the user wants architecture context, dependency flow, god node detection, or a token-reduced map of a codebase.

---

## Input Format

````text
COMMAND: /mobile-memory-graph
FILES:
FILE: <relative/path/File.kt>
```kotlin
<code>
```
FILE: <relative/path/File.swift>
```swift
<code>
```
````

Accept Kotlin, Java, Swift, Dart, TypeScript, TSX, JavaScript, JSX, C#, and Blueprint/C++ snippets.

---

## Platform Detection

| Signal | Platform |
|---|---|
| `.kt`, `androidx`, `ViewModel`, `StateFlow`, `HiltViewModel` | Android |
| `.swift`, `SwiftUI`, `ObservableObject`, `@Published`, `MainActor` | iOS |
| `.dart`, `Widget`, `StateNotifier`, `Bloc`, `Riverpod` | Flutter |
| `.tsx`, `.jsx`, `React Native`, `NativeModules`, `FlatList` | React Native |
| `.cs`, `MonoBehaviour`, `Update()`, `Rigidbody` | Unity |

---

## Skill Prompt

```text
Build the Knowledge Graph section of MOBILE_MEMORY.md from the provided code files.

Output only:
## 🗺️ Knowledge Graph

Required subsections:
1. Nodes table
2. Key Edges table
3. God Nodes table
4. Architecture Violations list
5. Token Reduction Summary

Node types:
[UI] [VM] [UC] [REPO] [NET] [DB] [DI] [NAV] [TEST]

Health values:
OK, CRITICAL, WARNING, DEBT

Edge types:
OBSERVES, CALLS, INJECTS, NAVIGATES_TO, EMITS, VIOLATES

Every edge note must start with a confidence tag:
- EXTRACTED: direct code evidence exists
- INFERRED: strongly implied by naming/imports/framework convention
- AMBIGUOUS: possible relationship but insufficient code shown

Platform checks:
- Android: flag GlobalScope, repository construction in ViewModel, exposed MutableStateFlow, UI navigation from ViewModel, repository called by 2+ ViewModels.
- iOS: flag retain cycles, force unwraps, MainActor misuse, ObservableObject with 6+ @Published, class with 4+ protocol conformances.
- Flutter: flag expensive build() work, missing const constructors, unawaited futures, StateNotifier with 3+ consumers, build() over 200 lines.
- React Native: flag bridge calls in hot paths, missing keys on lists, Context with 5+ consumers, component over 150 lines.
- Unity: flag Update() abuse, GC allocations in hot paths, physics calls in Update(), class with 5+ responsibilities.

Token reduction estimate:
Estimate raw file tokens from code volume and compare to graph token count. Use conservative math and state assumptions.
```

---

## Output Format

```markdown
## 🗺️ Knowledge Graph

### Nodes
| Node | Type | Layer | Health |
|---|---|---|---|
| [ClassName] | [VM/REPO/UI/etc] | [UI/Domain/Data] | [OK/CRITICAL/WARNING/DEBT] |

### Key Edges
| From | Edge | To | Note |
|---|---|---|---|
| [Node] | OBSERVES | [Node] | EXTRACTED: [why this matters] |

### God Nodes
| Node | Connections | Platform Risk | Recommendation |
|---|---|---|---|

### Architecture Violations
- [Class] VIOLATES [rule] — [explanation] → [fix]

### Token Reduction Summary
- Raw files estimated: [N] tokens
- Graph summary: [N] tokens
- Reduction: [X×]
- Assumption: [how estimate was calculated]
```

---

## Example

### Input

````text
COMMAND: /mobile-memory-graph
FILE: app/cart/CartViewModel.kt
```kotlin
@HiltViewModel
class CartViewModel @Inject constructor() : ViewModel() {
    val uiState = MutableStateFlow(CartState())
    private val repo = CartRepository(RetrofitCartApi())

    fun checkout(activity: Activity) {
        GlobalScope.launch {
            repo.checkout()
            activity.startActivity(Intent(activity, PaymentActivity::class.java))
        }
    }
}
```
````

### Output

```markdown
## 🗺️ Knowledge Graph

### Nodes
| Node | Type | Layer | Health |
|---|---|---|---|
| CartViewModel | VM | UI | CRITICAL |
| CartRepository | REPO | Data | WARNING |
| RetrofitCartApi | NET | Data | OK |
| PaymentActivity | NAV | UI | WARNING |

### Key Edges
| From | Edge | To | Note |
|---|---|---|---|
| CartViewModel | CALLS | CartRepository | EXTRACTED: ViewModel constructs and calls repository directly |
| CartRepository | CALLS | RetrofitCartApi | INFERRED: repository receives RetrofitCartApi constructor dependency |
| CartViewModel | NAVIGATES_TO | PaymentActivity | EXTRACTED: ViewModel starts Activity through Activity reference |
| CartViewModel | VIOLATES | Coroutine ownership | EXTRACTED: uses GlobalScope inside ViewModel |

### God Nodes
| Node | Connections | Platform Risk | Recommendation |
|---|---|---|---|
| CartViewModel | 4 | High: mixes state, DI, coroutine ownership, and navigation | Inject repository, use viewModelScope, emit navigation event |

### Architecture Violations
- CartViewModel VIOLATES Clean Architecture — constructs CartRepository and RetrofitCartApi directly → inject dependencies with Hilt.
- CartViewModel VIOLATES state encapsulation — exposes MutableStateFlow publicly → expose StateFlow via asStateFlow().
- CartViewModel VIOLATES lifecycle ownership — uses GlobalScope → use viewModelScope.
- CartViewModel VIOLATES navigation ownership — starts Activity directly → emit navigation event and let UI navigate.

### Token Reduction Summary
- Raw files estimated: 180 tokens
- Graph summary: 125 tokens
- Reduction: 1.4×
- Assumption: Small snippet; larger projects improve because repeated code bodies collapse into nodes and edges.
```
