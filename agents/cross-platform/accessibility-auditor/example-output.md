# Example Output — Accessibility Auditor

Full agent response to the input in [`example-input.md`](example-input.md).

---

```
ACCESSIBILITY AUDIT
===================
File: ui/components/TaskItem.kt
Platform: Android-Compose
Issues Found: 3
Critical: 1  High: 1  Medium: 1  Low: 0

FINDINGS
--------

[CRITICAL] Icon button has no accessibility label
  Element  : IconButton → Icon(Icons.Default.Delete, contentDescription = null)
  TalkBack announces: "Button" (no function description)
  Should announce  : "Delete [task title]"
  WCAG     : 1.1.1 Non-text Content
  Problem  : contentDescription = null means TalkBack announces this as an unlabeled
             interactive button. Screen reader users cannot know what tapping it does
             without trial and error — a potentially destructive action with no label is
             unusable for visually impaired users.
  Fix      :
  IconButton(
      onClick = { onDelete(task.id) },
      modifier = Modifier.size(48.dp)  // also fix touch target — see HIGH finding
  ) {
      Icon(
          imageVector = Icons.Default.Delete,
          // Action-oriented, task-specific — not "Trash icon" or "Delete"
          contentDescription = "Delete ${task.title}"
      )
  }

[HIGH] Touch target too small (24×24 dp)
  Element  : IconButton with Modifier.size(24.dp)
  WCAG     : 2.5.5 Target Size (Enhanced) — minimum 44×44 CSS px; Android guideline: 48×48 dp
  Problem  : 24dp is half the Android minimum interactive size. Users with motor impairments,
             tremors, or large fingers will frequently miss this target. On high-density
             displays, 24dp is physically very small — typically 6–8mm on a phone screen.
  Fix      :
  IconButton(
      onClick = { onDelete(task.id) },
      modifier = Modifier.size(48.dp)    // meets the 48×48dp minimum
  ) {
      Icon(
          imageVector = Icons.Default.Delete,
          contentDescription = "Delete ${task.title}",
          modifier = Modifier.size(24.dp)  // keep icon visually 24dp inside the 48dp target
      )
  }
  Alternative: use Modifier.minimumInteractiveComponentSize() which enforces the platform
  minimum automatically:
  IconButton(
      onClick = { onDelete(task.id) },
      modifier = Modifier.minimumInteractiveComponentSize()
  ) { ... }

[MEDIUM] Checkbox missing task context label
  Element  : Checkbox — checked = task.isDone, onCheckedChange = { onToggle(task.id) }
  TalkBack announces: "Checkbox, not checked" (no task name)
  Should announce  : "Mark complete: Buy groceries, Checkbox, not checked"
  WCAG     : 4.1.2 Name, Role, Value
  Problem  : TalkBack reads the Checkbox with its checked/unchecked state but no context
             about which task it belongs to. A user navigating by touch exploration must
             guess which checkbox belongs to which task.
  Fix Option A — add semantics to the Checkbox:
  Checkbox(
      checked = task.isDone,
      onCheckedChange = { onToggle(task.id) },
      modifier = Modifier.semantics {
          contentDescription = "${if (task.isDone) "Mark incomplete" else "Mark complete"}: ${task.title}"
      }
  )

  Fix Option B — merge the Row into one accessible element (better UX):
  Row(
      modifier = Modifier
          .fillMaxWidth()
          .padding(16.dp)
          // Merge all child semantics into one accessible node
          .semantics(mergeDescendants = true) {}
          // Make the whole row toggleable as a checkbox
          .toggleable(
              value = task.isDone,
              onValueChange = { onToggle(task.id) },
              role = Role.Checkbox
          )
  ) {
      // Remove individual Checkbox onCheckedChange — the Row handles interaction
      Checkbox(checked = task.isDone, onCheckedChange = null)
      Text(text = task.title, modifier = Modifier.weight(1f))
      // Delete button — keep separate from the toggleable Row
      IconButton(
          onClick = { onDelete(task.id) },
          modifier = Modifier.minimumInteractiveComponentSize()
      ) {
          Icon(Icons.Default.Delete, contentDescription = "Delete ${task.title}")
      }
  }
  With Option B, TalkBack reads the entire row as: "Buy groceries, not checked, Checkbox"
  and tapping anywhere on the row toggles the task — much more usable.

SCREEN READER ASSESSMENT
-------------------------
TalkBack / VoiceOver compatibility: FAIL
  → A visually impaired user encounters:
    - An unlabeled delete button (cannot identify what it does)
    - A 24dp tap target (likely to miss with assistive touch or motor impairment)
    - A checkbox with no task context (cannot know which task they're checking)
    The component is not safely operable with TalkBack enabled.

TOUCH TARGET AUDIT
------------------
All targets ≥ 48dp: No
  → IconButton is 24×24dp — fails Android guideline.
  → Checkbox is full-height (inherits Row padding) — acceptable. ✓
  → Text is not interactive — not evaluated. ✓

DYNAMIC CONTENT
---------------
State changes announced: N/A
  → No async state changes (snackbars, counters) in this component.
  → If task completion triggers a Snackbar elsewhere in the tree, ensure it uses
    Modifier.semantics { liveRegion = LiveRegionMode.Polite } to announce to TalkBack.

OVERALL VERDICT: INACCESSIBLE
```
