# Prompt — Generate Jetpack Compose Layout

**Platform:** Android (Jetpack Compose)  
**Category:** UI & Design  
**Type:** one-shot

---

## Purpose

Generates a production-ready Jetpack Compose layout from a plain-English or wireframe description.

---

## Prompt

```
You are a senior Android engineer specializing in Jetpack Compose. Generate a complete,
compilable Composable function from the description below.

Rules:
1. Use Material 3 components (MaterialTheme, Surface, Card, FilledButton, etc.).
2. All colors and text styles from MaterialTheme.colorScheme and MaterialTheme.typography — no hardcoded hex values.
3. All spacing as Dp constants or multiples of 8.dp.
4. Use Modifier.fillMaxWidth(), weight(), or LayoutBuilder for responsive layouts — never hardcoded pixel widths.
5. Add Modifier.semantics { contentDescription = "..." } on interactive elements for accessibility.
6. Use preview annotations: @Preview(showBackground = true) and @Preview(uiMode = UI_MODE_NIGHT_YES).
7. If the layout has state (expanded, selected, loaded), use remember { mutableStateOf(...) } for local state and accept callbacks for events.
8. Output: complete Composable + Preview + any helper data classes needed.

Screen/component to generate:
[DESCRIBE THE LAYOUT HERE — include: sections, interactive elements, data it displays, any animations]
```

---

## Example Usage

**What you paste:**
```
Screen/component to generate:
A profile card component showing: circular avatar image (loaded from URL), user full name
(title style), username with @ prefix (subdued body style), a follow/unfollow toggle button,
and a row of 3 stats (Posts, Followers, Following) each showing a number and a label.
Tapping the card navigates to the profile — expose as an onClick lambda.
Support dark mode.
```

**Expected output:**
```kotlin
@Composable
fun ProfileCard(
    profile: ProfileUiModel,
    isFollowing: Boolean,
    onFollowToggle: () -> Unit,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .clickable(
                onClickLabel = "Open ${profile.displayName}'s profile",
                onClick = onClick
            ),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                AsyncImage(  // coil-compose
                    model = profile.avatarUrl,
                    contentDescription = "${profile.displayName}'s avatar",
                    modifier = Modifier
                        .size(56.dp)
                        .clip(CircleShape),
                    contentScale = ContentScale.Crop
                )
                Spacer(modifier = Modifier.width(12.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = profile.displayName,
                        style = MaterialTheme.typography.titleMedium
                    )
                    Text(
                        text = "@${profile.username}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                FilledTonalButton(onClick = onFollowToggle) {
                    Text(if (isFollowing) "Following" else "Follow")
                }
            }
            Spacer(modifier = Modifier.height(16.dp))
            HorizontalDivider()
            Spacer(modifier = Modifier.height(16.dp))
            Row(modifier = Modifier.fillMaxWidth()) {
                StatItem(label = "Posts", value = profile.postCount, modifier = Modifier.weight(1f))
                StatItem(label = "Followers", value = profile.followerCount, modifier = Modifier.weight(1f))
                StatItem(label = "Following", value = profile.followingCount, modifier = Modifier.weight(1f))
            }
        }
    }
}

@Composable
private fun StatItem(label: String, value: Int, modifier: Modifier = Modifier) {
    Column(modifier = modifier, horizontalAlignment = Alignment.CenterHorizontally) {
        Text(text = value.toString(), style = MaterialTheme.typography.titleMedium)
        Text(text = label, style = MaterialTheme.typography.bodySmall,
             color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

data class ProfileUiModel(
    val displayName: String,
    val username: String,
    val avatarUrl: String,
    val postCount: Int,
    val followerCount: Int,
    val followingCount: Int
)

@Preview(showBackground = true)
@Preview(uiMode = UI_MODE_NIGHT_YES, showBackground = true)
@Composable
private fun ProfileCardPreview() {
    AppTheme {
        ProfileCard(
            profile = ProfileUiModel("Alice Dev", "alicedev", "", 142, 1_200, 87),
            isFollowing = false,
            onFollowToggle = {},
            onClick = {}
        )
    }
}
```

---

## Variations

- **Screen (not component):** Add "This is a full screen — wrap in Scaffold with a TopAppBar."
- **With animation:** Add "The follow button should animate its background color change with animateColorAsState."
- **Adaptive layout:** Add "The layout should use a two-column grid on tablets (windowSizeClass >= MEDIUM) and a single column on phones."
