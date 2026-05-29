# Example Output — Android Compose UI Reviewer

Full agent response to the input in [`example-input.md`](example-input.md).

---

```
COMPOSE REVIEW
==============
File: ui/feed/FeedScreen.kt
Composable(s): FeedScreen, PostItem
Issues Found: 3
Critical: 1  Warning: 1  Info: 1

FINDINGS
--------

[CRITICAL] FeedScreen — SimpleDateFormat instantiated inside LazyColumn items lambda
  Problem : SimpleDateFormat("dd MMM yyyy", Locale.getDefault()) is constructed fresh
            for EVERY post on EVERY recomposition of FeedScreen. SimpleDateFormat construction
            is expensive — it involves locale lookup, pattern parsing, and calendar initialization.
            With 20 visible posts and recompositions triggered by any parent state change
            (e.g., isLoading toggling), this creates hundreds of object allocations per second
            during active use and significantly increases GC pressure.
  Fix     :
  Option A — memoize per post inside the items lambda:
  items(posts, key = { it.id }) { post ->
      val formattedDate = remember(post.createdAt) {
          SimpleDateFormat("dd MMM yyyy", Locale.getDefault()).format(post.createdAt)
      }
      PostItem(post = post, formattedDate = formattedDate)
  }

  Option B (preferred) — format in the ViewModel or mapper, expose as String:
  // In ViewModel or UiModel mapper:
  data class PostUiModel(val id: String, val title: String, val body: String, val date: String)
  // date = SimpleDateFormat(...).format(createdAt) — runs once, not on every recomposition

  Option C — use Kotlin stdlib format which avoids SimpleDateFormat entirely:
  val formattedDate = remember(post.createdAt) {
      post.createdAt.toInstant().atZone(ZoneId.systemDefault())
          .format(DateTimeFormatter.ofPattern("dd MMM yyyy"))
  }

[WARNING]  FeedScreen — LazyColumn items missing key parameter
  Problem : Without a key, Compose cannot identify which item is which when the list
            changes. On any insertion, deletion, or reorder:
            - All visible items recompose unnecessarily
            - PostItem loses its isExpanded local state (expand/collapse resets)
            - Animations (if added later) will not animate correctly
            For 50+ posts this causes visible jank on data refresh.
  Fix     :
  items(
      items = posts,
      key = { it.id },              // stable String ID — item identity across recompositions
      contentType = { "post_item" } // allows Compose to reuse composition nodes efficiently
  ) { post -> ... }

[INFO]     FeedScreen — Column wrapping LazyColumn limits scroll composition
  Problem : Wrapping LazyColumn inside Column is fine here but creates a fragile structure.
            If a scrollable header or footer is added above/below the Column, the Column
            forces LazyColumn to measure all items eagerly (no lazy virtualization). This is
            a common source of "ConstraintsException: Nesting scrollable in the same direction"
            errors.
  Fix     : Use a single LazyColumn with header and loading items:
  LazyColumn {
      if (isLoading) {
          item(key = "loading") { CircularProgressIndicator() }
      }
      items(posts, key = { it.id }, contentType = { "post" }) { post ->
          val formattedDate = remember(post.createdAt) { ... }
          PostItem(post = post, formattedDate = formattedDate)
      }
  }

RECOMPOSITION SCOPE ASSESSMENT
-------------------------------
Recomposition scopes identified: 2 (FeedScreen body, PostItem body)
Unnecessary broad scopes: Yes
  → Both `posts` and `isLoading` are read in FeedScreen body. A change to `isLoading`
    while `posts` is stable causes the entire Column (including LazyColumn) to recompose.
    Extract the loading indicator into a separate composable that reads `isLoading`
    independently, or use an AnimatedVisibility that reads isLoading in its own scope:
    AnimatedVisibility(visible = isLoading) { CircularProgressIndicator() }
    With AnimatedVisibility, the visibility animation runs without recomposing the LazyColumn.

STATE HOISTING
--------------
State correctly hoisted: Partially
  → `isExpanded` in PostItem is local UI state — this is correct for toggle state.
    However, if expanded state must survive scrolling (PostItem leaving the viewport
    causes it to recompose and lose state), hoist `isExpanded` to the ViewModel keyed
    by post ID, or use rememberSaveable with a custom Saver.

SIDE EFFECTS
------------
Side effects correctly placed: Yes
  → No misplaced side effects detected. ViewModel is called from button handlers,
    not directly from the Composable body.

OVERALL VERDICT: NEEDS WORK
```
