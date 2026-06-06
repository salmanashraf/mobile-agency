---
# 🔁 MRECALL
**Project:** CartPilot
**Platform:** Android
**Stack:** Kotlin, Jetpack Compose, Hilt, Retrofit, Room, Coroutines, StateFlow, Turbine
**Architecture:** MVVM + Clean Architecture
**Saved:** 2026-06-06
**Compatible:** Claude Code · Cursor · Windsurf · ChatGPT · Gemini · Copilot
**Token reduction:** 41× vs reading raw files

---

## ⚡ INSTANT RESUME
CartPilot is an Android e-commerce app using Kotlin, Compose, Hilt, Retrofit, Room, Coroutines, and MVVM + Clean Architecture. The current task is refactoring the checkout cart flow after AXIOM found three CRITICAL issues in CartViewModel: direct repository construction, exposed MutableStateFlow, and ViewModel-owned navigation. The team decided to introduce SubmitCheckoutUseCase, keep one-shot navigation in MutableSharedFlow<CheckoutEvent>, and let CartScreen handle navigation. Continue by editing CartViewModel to inject dependencies, encapsulate state, and emit CheckoutEvent.ToPayment(cartId) instead of calling CheckoutNavigator directly.

---

## 🗺️ Knowledge Graph

### Nodes
| Node | Type | Layer | Health |
|---|---|---|---|
| CartScreen | UI | UI | OK |
| CartViewModel | VM | UI | CRITICAL |
| CartUiState | UI | UI | WARNING |
| CheckoutEvent | NAV | UI | OK |
| CheckoutNavigator | NAV | UI | WARNING |
| SubmitCheckoutUseCase | UC | Domain | OK |
| CartRepository | REPO | Data | WARNING |
| CartApi | NET | Data | OK |
| CartDao | DB | Data | OK |
| CartViewModelTest | TEST | Test | DEBT |

### Key Edges
| From | Edge | To | Note |
|---|---|---|---|
| CartScreen | OBSERVES | CartViewModel | EXTRACTED: collects uiState with collectAsStateWithLifecycle |
| CartScreen | OBSERVES | CheckoutEvent | INFERRED: drafted LaunchedEffect will collect one-shot events |
| CartViewModel | CALLS | CartRepository | EXTRACTED: ViewModel currently constructs and calls repository directly |
| CartViewModel | CALLS | SubmitCheckoutUseCase | INFERRED: planned replacement for checkout orchestration |
| SubmitCheckoutUseCase | CALLS | CartRepository | INFERRED: use case will submit checkout through repository |
| CartRepository | CALLS | CartApi | EXTRACTED: repository performs checkout network request |
| CartRepository | CALLS | CartDao | EXTRACTED: repository caches cart and clears promo code rows |
| CartViewModel | NAVIGATES_TO | CheckoutNavigator | EXTRACTED: ViewModel currently calls navigator.openPayment(cartId) |
| CartViewModel | EMITS | CheckoutEvent | INFERRED: planned SharedFlow replacement for direct navigation |
| CartViewModel | VIOLATES | Clean Architecture | EXTRACTED: direct repository construction bypasses Hilt and domain layer |

### God Nodes
| Node | Connections | Platform Risk | Recommendation |
|---|---|---|---|
| CartViewModel | 6 | High: owns state, checkout orchestration, data access, and navigation | Inject SubmitCheckoutUseCase, expose immutable StateFlow, emit CheckoutEvent |
| CartRepository | 4 | Medium: handles network, cache, and promo cleanup in one checkout method | Keep API/cache in repository, move business sequencing to SubmitCheckoutUseCase |

### Architecture Violations
- CartViewModel VIOLATES dependency inversion — constructs CartRepository directly and bypasses Hilt → inject CartRepository or SubmitCheckoutUseCase through @HiltViewModel constructor.
- CartViewModel VIOLATES state encapsulation — exposes MutableStateFlow<CartUiState> publicly → keep `_uiState` private and expose `uiState = _uiState.asStateFlow()`.
- CartViewModel VIOLATES navigation ownership — calls CheckoutNavigator.openPayment() directly → emit CheckoutEvent.ToPayment(cartId) and let CartScreen navigate.
- CartViewModel VIOLATES domain boundary — coordinates repository checkout and promo cleanup directly → move orchestration to SubmitCheckoutUseCase.

---

## 🏥 Health Report
### 🚨 CRITICAL
- CartViewModel: Direct CartRepository construction can hit production networking in tests and bypasses DI → inject SubmitCheckoutUseCase and CartRepository through Hilt.
- CartViewModel: Public MutableStateFlow lets UI mutate checkout state → expose immutable StateFlow only.
- CartViewModel: ViewModel owns navigation through CheckoutNavigator → emit CheckoutEvent from ViewModel and navigate from CartScreen.

### ⚠️ WARNING
- CartRepository: submitCheckout() mixes remote checkout, local cache, and promo cleanup → keep persistence details in repository but move business sequencing into SubmitCheckoutUseCase.
- CheckoutNavigator: New file is mid-edit and not connected to CartScreen yet → wire it only from UI after CheckoutEvent collection.
- CartUiState: Checkout loading and promo validation are likely becoming coupled → keep independent fields or sealed checkout substate.

### 🏦 Tech Debt
- CartViewModelTest: Current fixture depends on production CartRepository constructor → replace with fake SubmitCheckoutUseCase and assert CheckoutEvent emission.

---

## 🎯 Session Context

### Current Task
Refactor CartPilot's checkout cart flow so CartViewModel follows MVVM + Clean Architecture after AXIOM found direct data construction, mutable state exposure, and navigation ownership problems.

### Decisions Made
| Decision | Reason | Rejected |
|---|---|---|
| Keep MVVM + Clean Architecture | Existing app already follows ViewModel -> UseCase -> Repository | Rewriting checkout to MVI |
| Introduce SubmitCheckoutUseCase | Checkout orchestration is business logic, not ViewModel logic | Putting promo cleanup and API sequencing in ViewModel |
| Use MutableSharedFlow<CheckoutEvent> | Payment navigation is a one-shot UI event | Storing navigation target in CartUiState |

### Progress
✅ Done: AXIOM reviewed CartViewModel; CheckoutEvent sealed interface was agreed; CartScreen LaunchedEffect collection shape was drafted.
🔄 In Progress: CartViewModel constructor is mid-refactor; CheckoutNavigator.kt exists but is not connected.
⏭️ NEXT ACTION: Edit app/cart/CartViewModel.kt so it injects SubmitCheckoutUseCase and CartRepository through the @HiltViewModel constructor, makes _uiState private, exposes uiState via asStateFlow(), and replaces navigator.openPayment(cartId) with _checkoutEvents.emit(CheckoutEvent.ToPayment(cartId)).
🚧 Blocked: Product decision pending on whether guest checkout must block payment until address validation succeeds.

### Open Questions
- Should guest checkout block payment until address validation succeeds?
- Should promo code cleanup happen in SubmitCheckoutUseCase or CartRepository?

---

## 🤖 Agent State
| Agent | Last Action | Finding | Pending |
|---|---|---|---|
| AXIOM | Reviewed CartViewModel checkout flow | 3 CRITICAL issues: direct repository construction, public MutableStateFlow, ViewModel-owned navigation | Re-run after CartViewModel refactor and test update |
| MRECALL | Saved session checkpoint | Knowledge graph and NEXT ACTION created | Update after DI and SharedFlow changes land |

---

## 📄 Code State
app/cart/CartViewModel.kt is mid-edit. It still needs constructor injection for SubmitCheckoutUseCase, private `_uiState`, immutable `uiState`, a private `_checkoutEvents`, public `checkoutEvents`, and replacement of direct `navigator.openPayment(cartId)` with `_checkoutEvents.emit(CheckoutEvent.ToPayment(cartId))`.

app/cart/CheckoutNavigator.kt is new but not connected. It should be called only from CartScreen after collecting CheckoutEvent, not from CartViewModel.

---

## 🔄 Resume Instructions

**Claude Code:**
Start new session → paste INSTANT RESUME → paste full MRECALL.md → say "Continue"

**Cursor/Windsurf:**
Save as MRECALL.md in project root → next prompt: "Read MRECALL.md and continue"

**ChatGPT/Gemini:**
Paste full file as first message → "Resume from NEXT ACTION"

**Same tool, new session:**
Paste full file → /mrecall restore
---
