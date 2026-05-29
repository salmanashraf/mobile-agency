# Example Input — Android Compose UI Reviewer

---

```
COMPOSE_VERSION: 1.7
KOTLIN_VERSION: 2.0
FILE_PATH: ui/feed/FeedScreen.kt
CODE:
@Composable
fun FeedScreen(viewModel: FeedViewModel = hiltViewModel()) {
    val posts by viewModel.posts.collectAsStateWithLifecycle()
    val isLoading by viewModel.isLoading.collectAsStateWithLifecycle()

    Column {
        if (isLoading) {
            CircularProgressIndicator()
        }
        LazyColumn {
            items(posts) { post ->
                val formattedDate = SimpleDateFormat("dd MMM yyyy", Locale.getDefault())
                    .format(post.createdAt)
                PostItem(post = post, formattedDate = formattedDate)
            }
        }
    }
}

@Composable
fun PostItem(post: Post, formattedDate: String) {
    var isExpanded by remember { mutableStateOf(false) }
    Column(modifier = Modifier.clickable { isExpanded = !isExpanded }) {
        Text(post.title)
        if (isExpanded) Text(post.body)
        Text(formattedDate)
    }
}
```

---

## What to Expect

The agent identifies 3 issues. See [`example-output.md`](example-output.md) for the full report.

**Issue map:**
1. `SimpleDateFormat` instantiated per item per recomposition inside `items { }` — CRITICAL
2. `LazyColumn items` missing `key` parameter — WARNING
3. `Column` wrapping `LazyColumn` — should be merged into one `LazyColumn` — INFO

---

## Variations

### Missing derivedStateOf
```
COMPOSE_VERSION: 1.7
KOTLIN_VERSION: 2.0
FILE_PATH: ui/cart/CartScreen.kt
CODE:
@Composable
fun CartScreen(items: List<CartItem>) {
    val total = items.sumOf { it.price * it.quantity }  // recalculated every recomposition
    val isCheckoutEnabled = total > 0 && items.isNotEmpty()
    Text("Total: $$total")
    Button(enabled = isCheckoutEnabled, onClick = {}) { Text("Checkout") }
}
```
Issue: `total` and `isCheckoutEnabled` should be `remember(items) { ... }` or `derivedStateOf { ... }`.

### Incorrect LaunchedEffect key
```
COMPOSE_VERSION: 1.7
KOTLIN_VERSION: 2.0
FILE_PATH: ui/profile/ProfileScreen.kt
CODE:
@Composable
fun ProfileScreen(userId: String, viewModel: ProfileViewModel = hiltViewModel()) {
    LaunchedEffect(Unit) {   // wrong key — won't restart when userId changes
        viewModel.loadProfile(userId)
    }
}
```
Issue: Key should be `LaunchedEffect(userId)` so the effect re-fires when the `userId` changes (e.g., viewing different profiles).
