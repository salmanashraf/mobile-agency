# Skill — /compose-migration

**Platform:** Android
**Slash Command:** `/compose-migration`

---

## Purpose

Systematically converts Android XML layouts to Jetpack Compose. Handles ConstraintLayout, RecyclerView, ViewPager2, and custom views. Produces idiomatic Compose code with proper state lifting.

---

## Skill Prompt

```
Migrate the provided Android XML layout (or View-based code) to Jetpack Compose:

MIGRATION RULES:
1. Layout mapping:
   - LinearLayout (vertical) → Column
   - LinearLayout (horizontal) → Row
   - FrameLayout / merge → Box
   - ConstraintLayout → ConstraintLayout (Compose) or restructured Column/Row/Box
   - ScrollView → Column inside verticalScroll(rememberScrollState())
   - RecyclerView → LazyColumn / LazyRow with items(key = { ... })
   - ViewPager2 → HorizontalPager (Accompanist/Foundation)

2. Attribute mapping:
   - android:layout_width="match_parent" → Modifier.fillMaxWidth()
   - android:layout_width="wrap_content" → default (no modifier needed)
   - android:padding → Modifier.padding()
   - android:gravity / layout_gravity → Arrangement + Alignment
   - android:visibility → if (condition) { Composable() }
   - android:background → Modifier.background()
   - android:textSize / textColor / fontStyle → TextStyle or MaterialTheme.typography

3. State lifting:
   - View state (setVisibility, setText) → hoist to ViewModel StateFlow
   - ClickListeners → lambda parameters on the composable
   - TextWatcher → onValueChange with mutableStateOf

4. Custom views:
   - AndroidView { } wrapper for views with no Compose equivalent
   - Migrate incrementally — keep complex custom views as AndroidView until full migration

Output the complete Compose equivalent. Note any migration challenges or manual steps needed.
```
