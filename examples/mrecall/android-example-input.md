# MRecall Android Example Input

```text
COMMAND: /mrecall save
PROJECT: CartPilot
PLATFORM: Android
STACK: Kotlin, Jetpack Compose, Hilt, Retrofit, Room, Coroutines, StateFlow, Turbine
ARCHITECTURE: MVVM + Clean Architecture

SESSION:
We are 2 hours into refactoring the checkout cart flow in an e-commerce app. The user asked for AXIOM to review CartViewModel because checkout state was becoming unstable after adding promo codes and guest checkout.

FILES BEING WORKED ON:
1. app/cart/ui/CartScreen.kt
   - Collects CartViewModel.uiState with collectAsStateWithLifecycle.
   - Has a LaunchedEffect collecting checkoutEvents.
   - Not mid-edit.

2. app/cart/CartViewModel.kt
   - Mid-edit.
   - Currently creates CartRepository manually.
   - Exposes MutableStateFlow publicly.
   - Calls navigator.openPayment(cartId) directly from submitCheckout().

3. app/cart/data/CartRepository.kt
   - Calls CartApi and CartDao.
   - Caches cart after network refresh.
   - Has a large submitCheckout() method that also clears local promo code rows.

4. app/cart/CheckoutNavigator.kt
   - Mid-edit.
   - New file that should turn CheckoutEvent into navigation actions from the UI layer.

AXIOM FINDINGS:
1. CRITICAL: CartViewModel directly constructs CartRepository, bypassing Hilt and making tests use production networking.
2. CRITICAL: CartViewModel exposes MutableStateFlow<CartUiState>, allowing UI to mutate state.
3. CRITICAL: CartViewModel owns navigation by calling CheckoutNavigator.openPayment() from inside the ViewModel.

DECISIONS MADE:
1. Keep MVVM + Clean Architecture because the rest of the app already follows ViewModel -> UseCase -> Repository.
2. Introduce SubmitCheckoutUseCase so CartViewModel no longer coordinates repository, promo cleanup, and checkout API directly.
3. Use MutableSharedFlow<CheckoutEvent> for one-shot navigation and collect it from CartScreen.

OPEN QUESTIONS:
1. Should guest checkout block payment until address validation succeeds?
2. Should promo code cleanup happen in SubmitCheckoutUseCase or CartRepository?

BLOCKED:
Blocked on product decision for guest checkout address validation.

PROGRESS:
Done:
- AXIOM reviewed CartViewModel.
- CheckoutEvent sealed interface was agreed.
- CartScreen LaunchedEffect shape was drafted.

In progress:
- CartViewModel constructor is mid-refactor.
- CheckoutNavigator.kt is a new file but not connected.

NEXT ACTION:
Edit app/cart/CartViewModel.kt so it injects SubmitCheckoutUseCase and CartRepository through the @HiltViewModel constructor, makes _uiState private, exposes uiState via asStateFlow(), and replaces navigator.openPayment(cartId) with _checkoutEvents.emit(CheckoutEvent.ToPayment(cartId)).
```
