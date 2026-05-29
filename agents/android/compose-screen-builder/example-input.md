# Example Input — Compose Screen Builder

---

```
SCREEN_NAME: OrderHistoryScreen

DESCRIPTION:
A scrollable screen showing a user's past orders. The top bar shows "My Orders" with a
back button. The content is a LazyColumn of order cards. Each card shows: order ID
(e.g. #ORD-4821), a status badge (Delivered = green, Processing = amber, Cancelled = red),
the item count ("3 items"), total price formatted as currency ("$48.50"), and the order
date (e.g. "May 12, 2025"). Tapping a card navigates to the Order Detail screen.
The screen supports pull-to-refresh. Empty state: "No orders yet" with a shopping bag icon
and a "Start Shopping" button that navigates to the Home screen. Error state: "Something
went wrong" with a Retry button. Loading state: full-screen centered circular progress.

STATE_FIELDS:
- orders: List<OrderUiModel> — list of past orders to display
- isRefreshing: Boolean — true while pull-to-refresh is in progress

ACTIONS:
- Load orders on screen entry
- Pull-to-refresh — reloads the order list
- Tap order card — navigates to OrderDetailScreen with the orderId
- Tap "Start Shopping" (empty state) — navigates back to HomeScreen
- Tap Retry (error state) — reloads orders

NAVIGATION:
- Receives: userId: String from the caller (injected via SavedStateHandle in ViewModel)
- Navigates to: OrderDetailScreen(orderId: String) on card tap
- Navigates up: on TopAppBar back button press

DEPENDENCIES:
- OrderRepository (already exists in the data module)
- GetOrderHistoryUseCase (to be generated as a stub if not specified)

COMPOSE_VERSION: 1.7
KOTLIN_VERSION: 2.0
```
