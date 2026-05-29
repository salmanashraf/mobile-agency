# Example Output — Compose Screen Builder

Generated from [`example-input.md`](example-input.md).

---

## File: OrderHistoryUiState.kt

```kotlin
package com.example.app.ui.orders.history

// One-shot events that should not be replayed on recomposition.
sealed class OrderHistoryUiEvent {
    data class NavigateToDetail(val orderId: String) : OrderHistoryUiEvent()
    object NavigateToHome : OrderHistoryUiEvent()
    object NavigateUp : OrderHistoryUiEvent()
}

// Single source of truth for the screen's visual state.
sealed class OrderHistoryUiState {
    object Loading : OrderHistoryUiState()
    object Empty : OrderHistoryUiState()
    data class Success(
        val orders: List<OrderUiModel>,
        val isRefreshing: Boolean = false
    ) : OrderHistoryUiState()
    data class Error(val message: String) : OrderHistoryUiState()
}

data class OrderUiModel(
    val orderId: String,
    val displayId: String,           // e.g. "#ORD-4821"
    val status: OrderStatus,
    val itemCount: Int,
    val totalPrice: String,          // pre-formatted, e.g. "$48.50"
    val orderDate: String            // pre-formatted, e.g. "May 12, 2025"
)

enum class OrderStatus { DELIVERED, PROCESSING, CANCELLED }
```

---

## File: OrderHistoryViewModel.kt

```kotlin
package com.example.app.ui.orders.history

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class OrderHistoryViewModel @Inject constructor(
    savedStateHandle: SavedStateHandle,
    private val getOrderHistory: GetOrderHistoryUseCase
) : ViewModel() {

    // Pulled from navigation args — NavController puts them in SavedStateHandle automatically.
    private val userId: String = checkNotNull(savedStateHandle["userId"])

    private val _uiState = MutableStateFlow<OrderHistoryUiState>(OrderHistoryUiState.Loading)
    val uiState: StateFlow<OrderHistoryUiState> = _uiState.asStateFlow()

    // Channel for one-shot events — SharedFlow would re-emit on new collectors (config change).
    // Channel with BUFFERED capacity holds the event until the screen collects it.
    private val _uiEvents = Channel<OrderHistoryUiEvent>(Channel.BUFFERED)
    val uiEvents = _uiEvents.receiveAsFlow()

    init {
        loadOrders()
    }

    fun loadOrders() {
        viewModelScope.launch {
            _uiState.value = OrderHistoryUiState.Loading
            try {
                val orders = getOrderHistory(userId)
                _uiState.value = if (orders.isEmpty()) {
                    OrderHistoryUiState.Empty
                } else {
                    OrderHistoryUiState.Success(orders = orders.map { it.toUiModel() })
                }
            } catch (e: CancellationException) {
                throw e  // Never swallow CancellationException
            } catch (e: Exception) {
                _uiState.value = OrderHistoryUiState.Error(
                    message = e.message ?: "Failed to load orders"
                )
            }
        }
    }

    fun refresh() {
        val current = _uiState.value
        if (current is OrderHistoryUiState.Success) {
            // Mark as refreshing without losing the existing list.
            _uiState.value = current.copy(isRefreshing = true)
        }
        viewModelScope.launch {
            try {
                val orders = getOrderHistory(userId)
                _uiState.value = if (orders.isEmpty()) {
                    OrderHistoryUiState.Empty
                } else {
                    OrderHistoryUiState.Success(orders = orders.map { it.toUiModel() })
                }
            } catch (e: CancellationException) {
                throw e
            } catch (e: Exception) {
                // On refresh failure, keep the existing list but stop the spinner.
                if (_uiState.value is OrderHistoryUiState.Success) {
                    _uiState.value = (current as OrderHistoryUiState.Success).copy(isRefreshing = false)
                } else {
                    _uiState.value = OrderHistoryUiState.Error(e.message ?: "Refresh failed")
                }
            }
        }
    }

    fun onOrderTapped(orderId: String) {
        viewModelScope.launch {
            _uiEvents.send(OrderHistoryUiEvent.NavigateToDetail(orderId))
        }
    }

    fun onStartShoppingTapped() {
        viewModelScope.launch {
            _uiEvents.send(OrderHistoryUiEvent.NavigateToHome)
        }
    }

    fun onNavigateUp() {
        viewModelScope.launch {
            _uiEvents.send(OrderHistoryUiEvent.NavigateUp)
        }
    }
}

// --- Domain stub (place in domain module, zero Android imports) ---

class GetOrderHistoryUseCase @Inject constructor(
    private val repository: OrderRepository
) {
    suspend operator fun invoke(userId: String): List<Order> =
        repository.getOrderHistory(userId)
}

// --- Mapper (place in UI or data-ui mapping layer) ---

fun Order.toUiModel() = OrderUiModel(
    orderId    = id,
    displayId  = "#ORD-${id.takeLast(4).uppercase()}",
    status     = when (status) {
        "DELIVERED"  -> OrderStatus.DELIVERED
        "PROCESSING" -> OrderStatus.PROCESSING
        "CANCELLED"  -> OrderStatus.CANCELLED
        else         -> OrderStatus.PROCESSING
    },
    itemCount  = items.size,
    totalPrice = "$${String.format("%.2f", totalPrice)}",
    orderDate  = date.toDisplayString()   // your date formatting extension
)
```

---

## File: OrderHistoryScreen.kt

```kotlin
package com.example.app.ui.orders.history

import android.content.res.Configuration.UI_MODE_NIGHT_YES
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.ArrowBack
import androidx.compose.material.icons.rounded.ShoppingBag
import androidx.compose.material3.*
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController

// ─── Route definition ────────────────────────────────────────────────────────

object OrderHistoryRoute {
    const val ROUTE = "order_history/{userId}"
    fun build(userId: String) = "order_history/$userId"
}

// ─── Screen entry point ──────────────────────────────────────────────────────

@Composable
fun OrderHistoryScreen(
    navController: NavController,
    viewModel: OrderHistoryViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    // One-shot event handling — collected once per composition lifetime.
    LaunchedEffect(Unit) {
        viewModel.uiEvents.collect { event ->
            when (event) {
                is OrderHistoryUiEvent.NavigateToDetail ->
                    navController.navigate("order_detail/${event.orderId}")
                OrderHistoryUiEvent.NavigateToHome ->
                    navController.navigate("home") { popUpTo("home") { inclusive = false } }
                OrderHistoryUiEvent.NavigateUp ->
                    navController.navigateUp()
            }
        }
    }

    OrderHistoryContent(
        uiState   = uiState,
        onRefresh = viewModel::refresh,
        onOrderTapped = viewModel::onOrderTapped,
        onStartShopping = viewModel::onStartShoppingTapped,
        onRetry   = viewModel::loadOrders,
        onNavigateUp = viewModel::onNavigateUp
    )
}

// ─── Stateless content (testable in isolation) ───────────────────────────────

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OrderHistoryContent(
    uiState: OrderHistoryUiState,
    onRefresh: () -> Unit,
    onOrderTapped: (String) -> Unit,
    onStartShopping: () -> Unit,
    onRetry: () -> Unit,
    onNavigateUp: () -> Unit
) {
    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = { Text("My Orders") },
                navigationIcon = {
                    IconButton(
                        onClick = onNavigateUp,
                        modifier = Modifier.minimumInteractiveComponentSize()
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.ArrowBack,
                            contentDescription = "Go back"
                        )
                    }
                }
            )
        }
    ) { innerPadding ->
        when (uiState) {
            OrderHistoryUiState.Loading -> OrderHistoryLoading(innerPadding)

            OrderHistoryUiState.Empty -> OrderHistoryEmpty(
                modifier = Modifier.padding(innerPadding),
                onStartShopping = onStartShopping
            )

            is OrderHistoryUiState.Error -> OrderHistoryError(
                message = uiState.message,
                onRetry = onRetry,
                modifier = Modifier.padding(innerPadding)
            )

            is OrderHistoryUiState.Success -> OrderHistorySuccess(
                orders = uiState.orders,
                isRefreshing = uiState.isRefreshing,
                onRefresh = onRefresh,
                onOrderTapped = onOrderTapped,
                modifier = Modifier.padding(innerPadding)
            )
        }
    }
}

// ─── State renderers ─────────────────────────────────────────────────────────

@Composable
private fun OrderHistoryLoading(paddingValues: PaddingValues) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(paddingValues),
        contentAlignment = Alignment.Center
    ) {
        CircularProgressIndicator(
            modifier = Modifier.semantics { contentDescription = "Loading orders" }
        )
    }
}

@Composable
private fun OrderHistoryEmpty(
    onStartShopping: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Icon(
            imageVector = Icons.Rounded.ShoppingBag,
            contentDescription = null,   // decorative — message text provides context
            modifier = Modifier.size(72.dp),
            tint = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Spacer(Modifier.height(16.dp))
        Text(
            text = "No orders yet",
            style = MaterialTheme.typography.titleMedium,
            color = MaterialTheme.colorScheme.onSurface
        )
        Spacer(Modifier.height(8.dp))
        Text(
            text = "Your completed orders will appear here.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Spacer(Modifier.height(24.dp))
        FilledTonalButton(onClick = onStartShopping) {
            Text("Start Shopping")
        }
    }
}

@Composable
private fun OrderHistoryError(
    message: String,
    onRetry: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Something went wrong",
            style = MaterialTheme.typography.titleMedium
        )
        Spacer(Modifier.height(8.dp))
        Text(
            text = message,
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Spacer(Modifier.height(24.dp))
        Button(onClick = onRetry) { Text("Retry") }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun OrderHistorySuccess(
    orders: List<OrderUiModel>,
    isRefreshing: Boolean,
    onRefresh: () -> Unit,
    onOrderTapped: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    PullToRefreshBox(
        isRefreshing = isRefreshing,
        onRefresh = onRefresh,
        modifier = modifier.fillMaxSize()
    ) {
        LazyColumn(
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(
                items = orders,
                key = { it.orderId },           // stable key prevents unnecessary recomposition
                contentType = { "order_card" }  // allows Compose to reuse composition nodes
            ) { order ->
                OrderCard(order = order, onClick = { onOrderTapped(order.orderId) })
            }
        }
    }
}

// ─── Order card component ────────────────────────────────────────────────────

@Composable
private fun OrderCard(
    order: OrderUiModel,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val statusColor = when (order.status) {
        OrderStatus.DELIVERED  -> Color(0xFF2E7D32)   // exception: semantic color not in M3 scheme
        OrderStatus.PROCESSING -> Color(0xFFE65100)
        OrderStatus.CANCELLED  -> MaterialTheme.colorScheme.error
    }
    val statusLabel = when (order.status) {
        OrderStatus.DELIVERED  -> "Delivered"
        OrderStatus.PROCESSING -> "Processing"
        OrderStatus.CANCELLED  -> "Cancelled"
    }

    Card(
        modifier = modifier
            .fillMaxWidth()
            .clickable(
                onClickLabel = "View order ${order.displayId}",
                onClick = onClick
            ),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceContainerLow
        )
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = order.displayId,
                    style = MaterialTheme.typography.titleSmall
                )
                Surface(
                    color = statusColor.copy(alpha = 0.12f),
                    shape = MaterialTheme.shapes.small
                ) {
                    Text(
                        text = statusLabel,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp),
                        style = MaterialTheme.typography.labelSmall,
                        color = statusColor
                    )
                }
            }
            Spacer(Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "${order.itemCount} ${if (order.itemCount == 1) "item" else "items"}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                    text = order.totalPrice,
                    style = MaterialTheme.typography.bodyMedium
                )
            }
            Spacer(Modifier.height(4.dp))
            Text(
                text = order.orderDate,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

// ─── Previews ────────────────────────────────────────────────────────────────

private val previewOrders = listOf(
    OrderUiModel("1", "#ORD-4821", OrderStatus.DELIVERED,  3, "$48.50",  "May 12, 2025"),
    OrderUiModel("2", "#ORD-3917", OrderStatus.PROCESSING, 1, "$12.99",  "May 10, 2025"),
    OrderUiModel("3", "#ORD-3105", OrderStatus.CANCELLED,  2, "$29.00",  "Apr 28, 2025"),
)

@Preview(showBackground = true, name = "Light — Success")
@Composable
private fun OrderHistorySuccessPreview() {
    MaterialTheme {
        OrderHistoryContent(
            uiState = OrderHistoryUiState.Success(orders = previewOrders),
            onRefresh = {}, onOrderTapped = {}, onStartShopping = {}, onRetry = {}, onNavigateUp = {}
        )
    }
}

@Preview(showBackground = true, uiMode = UI_MODE_NIGHT_YES, name = "Dark — Success")
@Composable
private fun OrderHistorySuccessDarkPreview() {
    MaterialTheme {
        OrderHistoryContent(
            uiState = OrderHistoryUiState.Success(orders = previewOrders),
            onRefresh = {}, onOrderTapped = {}, onStartShopping = {}, onRetry = {}, onNavigateUp = {}
        )
    }
}

@Preview(showBackground = true, name = "Empty")
@Composable
private fun OrderHistoryEmptyPreview() {
    MaterialTheme {
        OrderHistoryContent(
            uiState = OrderHistoryUiState.Empty,
            onRefresh = {}, onOrderTapped = {}, onStartShopping = {}, onRetry = {}, onNavigateUp = {}
        )
    }
}

@Preview(showBackground = true, name = "Error")
@Composable
private fun OrderHistoryErrorPreview() {
    MaterialTheme {
        OrderHistoryContent(
            uiState = OrderHistoryUiState.Error("Unable to connect to server"),
            onRefresh = {}, onOrderTapped = {}, onStartShopping = {}, onRetry = {}, onNavigateUp = {}
        )
    }
}
```

---

## Navigation Registration

Add this block to your `NavHost` in your app's main `NavGraph.kt`:

```kotlin
composable(
    route = OrderHistoryRoute.ROUTE,
    arguments = listOf(navArgument("userId") { type = NavType.StringType })
) {
    OrderHistoryScreen(navController = navController)
}
```

Navigate to this screen from anywhere:

```kotlin
navController.navigate(OrderHistoryRoute.build(userId = currentUserId))
```

---

## Gradle Dependencies

```kotlin
// All required for this screen — add to app/build.gradle.kts if not already present:
implementation("androidx.compose.material3:material3:1.3.1")
implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")
implementation("androidx.lifecycle:lifecycle-runtime-compose:2.8.7")  // collectAsStateWithLifecycle
implementation("androidx.hilt:hilt-navigation-compose:1.2.0")
implementation("androidx.navigation:navigation-compose:2.8.5")
```
