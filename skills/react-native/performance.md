# Skill — React Native Performance

**Platform:** React Native (TypeScript)  
**Category:** Performance & Optimization  
**Composable With:** agents/react-native/performance-optimizer/agent.md

---

## Purpose

A focused skill module covering the most common React Native performance pitfalls. Use as a quick primer before reviewing any RN component for re-render issues, FlatList problems, and animation overhead.

## When to Use

- Before reviewing any React Native component file
- When a screen feels janky or sluggish and you need a checklist
- When composing into a larger multi-file performance review

---

## Skill Prompt

```
When reviewing React Native TypeScript components for performance, check for:

RE-RENDER PREVENTION
- useCallback: every function passed as a prop to a child component (especially list items)
  must be wrapped in useCallback. Inline () => fn(id) creates a new reference every render.
- useMemo: every object or array created in the component body and passed as a prop must be
  wrapped in useMemo. Inline style={{ backgroundColor: color }} creates a new object every render.
- React.memo: components that receive stable props and render frequently (e.g., list cells)
  should be wrapped in React.memo to skip re-renders when props haven't changed.
- Context: components consuming a large Context object re-render on ANY context value change.
  Split Context into smaller focused contexts or use a state manager (Zustand, Jotai, Redux).

FLATLIST / FLASHLIST
- keyExtractor must return a stable, unique string per item. Using index as the key causes
  full re-renders on list changes.
- getItemLayout: provide this if list items have a fixed height. Without it, FlatList cannot
  pre-calculate positions, causing extra layout work on every scroll.
- removeClippedSubviews: set to true for long lists to unmount off-screen items.
- windowSize: default is 21 (viewports). For complex items, reduce to 7–11 to lower memory.
- initialNumToRender: set to the count visible above the fold to avoid over-rendering on mount.
- Consider migrating large lists (50+ items) to FlashList (Shopify) — better recycling,
  significantly lower memory on New Architecture.

ANIMATIONS
- Every Animated.Value animation must use useNativeDriver: true where possible.
  Animations without useNativeDriver run on the JS thread and drop frames under load.
- useNativeDriver: true is compatible with: opacity, transform (scale, translate, rotate).
  It is NOT compatible with: layout properties (width, height, margin, padding).
- For layout animations, use Reanimated v3 with useAnimatedStyle — runs on the UI thread.
- Avoid animating properties inside a FlatList renderItem — each frame update causes item re-renders.

INLINE OBJECTS AND FUNCTIONS IN JSX
- <Component style={{ flex: 1 }} /> — new object every render.
  Fix: extract to StyleSheet.create or useMemo.
- <Component onPress={() => doSomething(item.id)} /> — new function every render.
  Fix: extract with useCallback or pass item.id as a prop and let the component call a stable handler.
- <Component data={items.filter(i => i.active)} /> — new array every render.
  Fix: memoize with useMemo.

BRIDGE OVERHEAD (Old Architecture)
- NativeModules calls in the render path or in a tight loop are expensive — they cross the bridge synchronously.
- Prefer batch native calls or migrate to JSI (New Architecture) where native calls are synchronous and cheap.
- AsyncStorage, FileSystem, and similar modules in hot render paths should use caching.

For each issue found: state the component/line, what is wrong (with an impact estimate), and provide the corrected code snippet.
```

---

## Example

**Input:**
```
const CartItem = ({ item, onRemove }) => (
  <TouchableOpacity
    onPress={() => onRemove(item.id)}
    style={{ padding: 12, backgroundColor: '#fff' }}
  >
    <Text>{item.name}</Text>
  </TouchableOpacity>
);
```

**Output:**
```
Inline onPress function — HIGH impact in lists
  Problem: () => onRemove(item.id) is a new function reference every render. If CartItem
           is inside a FlatList and the parent re-renders, every visible CartItem re-renders.
  Fix:
  const CartItem = React.memo(({ item, onRemoveId }) => (
    <TouchableOpacity onPress={onRemoveId} style={styles.item}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  ));
  // In parent: const handleRemove = useCallback((id) => { ... }, []);
  // Pass: onRemoveId={() => handleRemove(item.id)} is still inline — instead:
  // Pass: item.id as a prop and call handleRemove(item.id) inside CartItem

Inline style object — MEDIUM impact
  Problem: { padding: 12, backgroundColor: '#fff' } is a new object every render.
  Fix: const styles = StyleSheet.create({ item: { padding: 12, backgroundColor: '#fff' } });
```

---

## Composition Example

```
Use before the RN Performance Optimizer agent for a quick triage:
paste this skill → paste component → get a ranked list of issues.

For the full structured report with ESTIMATED IMPROVEMENT and PROFILING STEPS,
run agents/react-native/performance-optimizer/agent.md instead.
```

---

## Notes

- New Architecture (JSI/Fabric, RN 0.74+) eliminates bridge overhead. Bridge-specific checks still apply to Old Architecture apps.
- React DevTools Profiler and Flipper are the ground-truth tools — use this skill for pre-profiling code review, not as a replacement for measuring.
