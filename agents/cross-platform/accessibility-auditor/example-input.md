# Example Input — Accessibility Auditor

---

```
PLATFORM: Android-Compose
FILE_PATH: ui/components/TaskItem.kt
CODE:
@Composable
fun TaskItem(
    task: Task,
    onDelete: (String) -> Unit,
    onToggle: (String) -> Unit
) {
    Row(modifier = Modifier.fillMaxWidth().padding(16.dp)) {
        Checkbox(
            checked = task.isDone,
            onCheckedChange = { onToggle(task.id) }
        )
        Text(
            text = task.title,
            modifier = Modifier.weight(1f)
        )
        IconButton(
            onClick = { onDelete(task.id) },
            modifier = Modifier.size(24.dp)
        ) {
            Icon(Icons.Default.Delete, contentDescription = null)
        }
    }
}
```

---

## What to Expect

The agent identifies three accessibility issues. See [`example-output.md`](example-output.md) for the full WCAG-annotated report.

**Issue map:**
1. Delete `IconButton` has no `contentDescription` — TalkBack announces "button" with no context (CRITICAL)
2. `IconButton` is 24×24dp — below the 48×48dp Android minimum (HIGH)
3. `Checkbox` has no associated label — TalkBack announces "Checkbox, not checked" with no task context (MEDIUM)

---

## Variations

### iOS SwiftUI
```
PLATFORM: iOS-SwiftUI
FILE_PATH: Views/TaskRowView.swift
CODE:
struct TaskRowView: View {
    let task: Task
    let onDelete: () -> Void
    let onToggle: () -> Void
    var body: some View {
        HStack {
            Image(systemName: task.isDone ? "checkmark.circle.fill" : "circle")
                .onTapGesture { onToggle() }
            Text(task.title)
            Spacer()
            Button(action: onDelete) {
                Image(systemName: "trash")
            }
            .frame(width: 20, height: 20)
        }
    }
}
```

### React Native
```
PLATFORM: React-Native
FILE_PATH: src/components/NotificationBadge.tsx
CODE:
const NotificationBadge = ({ count }: { count: number }) => (
  <View style={styles.badge}>
    <Text style={styles.count}>{count}</Text>
  </View>
);
```
Issue: Badge updates are not announced to screen readers — when count changes, TalkBack/VoiceOver users don't know.
