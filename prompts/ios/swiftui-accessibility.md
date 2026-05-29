# Prompt — SwiftUI Accessibility Audit

**Platform:** iOS (SwiftUI)  
**Category:** Code Quality / Accessibility  
**Type:** one-shot

---

## Purpose

Audits a SwiftUI view for accessibility issues — missing labels, incorrect traits, touch target sizes, VoiceOver reading order, and dynamic content announcements.

---

## Prompt

```
You are a senior iOS accessibility engineer. Audit the SwiftUI view below for accessibility
compliance targeting WCAG 2.2 and iOS VoiceOver.

Check for:
1. LABELS: Every Image, icon, and interactive element that doesn't have descriptive text
   children needs .accessibilityLabel("..."). Labels describe the ACTION, not the element.
   Decorative elements need .accessibilityHidden(true).
2. TRAITS: Buttons need .accessibilityAddTraits(.isButton). Toggles need .isToggle.
   Headers need .isHeader. Selected items need .isSelected.
3. TOUCH TARGETS: Interactive elements must be at least 44×44 pt.
   Expand with .frame(minWidth: 44, minHeight: 44) or .contentShape(Rectangle()).
4. READING ORDER: VoiceOver reads in view hierarchy order. Flag elements where visual
   order differs from hierarchy order.
5. GROUPING: Related elements (label + value, image + caption) should be grouped with
   .accessibilityElement(children: .combine) so VoiceOver reads them as one item.
6. DYNAMIC ANNOUNCEMENTS: When content changes (loading complete, error shown, count
   updated), it should be announced with UIAccessibility.post or .accessibilityAnnouncement.
7. STATE: Toggles and checkboxes need .accessibilityValue("on"/"off") or
   .accessibilityAddTraits(.isSelected) to convey state to VoiceOver.

For each issue: element name/line, what VoiceOver currently announces, what it should
announce, severity (Critical / High / Medium / Low), and the corrected SwiftUI code.

SwiftUI view to audit:
```
[PASTE YOUR SWIFTUI VIEW HERE]
```
```

---

## Example Usage

**What you paste:**
```
SwiftUI view to audit:
```
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
```

**Expected output:**
```
ACCESSIBILITY AUDIT — TaskRowView

[CRITICAL] Trash button has no accessibility label
  VoiceOver says: "button"
  Should say   : "Delete [task title]"
  Fix:
  Button(action: onDelete) {
      Image(systemName: "trash")
          .accessibilityHidden(true)  // icon is decorative — label is on the button
  }
  .accessibilityLabel("Delete \(task.title)")
  .accessibilityAddTraits(.isButton)

[HIGH] Touch target too small (20×20 pt)
  The Button frame is 20×20 pt — below the iOS minimum of 44×44 pt.
  Fix:
  Button(action: onDelete) {
      Image(systemName: "trash")
          .accessibilityHidden(true)
  }
  .frame(width: 44, height: 44)
  .accessibilityLabel("Delete \(task.title)")

[HIGH] Checkbox icon tapped via onTapGesture — not accessible as a button
  The checkmark/circle image uses .onTapGesture, which is invisible to VoiceOver.
  VoiceOver says: nothing (image is not an accessibility element by default).
  Fix: Replace with a Button or add accessibility modifiers:
  Button(action: onToggle) {
      Image(systemName: task.isDone ? "checkmark.circle.fill" : "circle")
          .accessibilityHidden(true)
  }
  .accessibilityLabel(task.isDone ? "Mark \(task.title) incomplete" : "Mark \(task.title) complete")
  .accessibilityAddTraits(task.isDone ? [.isButton, .isSelected] : .isButton)

[MEDIUM] Row elements are read separately — should be grouped
  VoiceOver reads: "circle image", "Task title", "button" as 3 separate swipes.
  Better UX: combine into one element per row.
  Fix:
  HStack { ... }
  .accessibilityElement(children: .combine)
  // Or use .accessibilityElement(children: .ignore) with a custom label
```

---

## Variations

- **Full screen audit:** Add "This is a full screen with navigation. Also check: NavigationTitle is announced as a heading, back button has correct label, modal sheets trap focus."
- **With dynamic content:** Add "The view updates when a network call completes. Verify the state change is announced to VoiceOver."
