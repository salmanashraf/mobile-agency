# Example Output — RN Performance Optimizer

Full agent response to the input in [`example-input.md`](example-input.md).

---

```
PERFORMANCE AUDIT
=================
File: src/screens/FeedScreen.tsx
Component: FeedScreen
Architecture: New Architecture (JSI/Fabric)
Issues Found: 4
High Impact: 2  Medium Impact: 1  Low Impact: 1

FINDINGS (ranked by impact)
---------------------------

[HIGH] renderItem recreated on every parent render
  Impact      : Every state change in FeedScreen recreates renderItem, which gives FlatList
                a new function reference. FlatList uses referential equality to bail out of
                re-renders. A new reference on every render forces ALL visible PostCards
                (typically 10–20 on screen) to re-render — even when the posts data hasn't changed.
  Problem     : renderItem is an arrow function defined in the component body.
                Arrow functions are never referentially stable across renders.
  Refactored  :
  ```tsx
  const cardStyle = useMemo(
    () => ({ backgroundColor: theme.colors.background }),
    [theme.colors.background]
  );

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <PostCard
        post={item}
        onLike={() => handleLike(item.id)}  // see MEDIUM finding below
        style={cardStyle}
      />
    ),
    [cardStyle]
  );
  ```

[HIGH] Inline style object — new object reference every renderItem call
  Impact      : { backgroundColor: theme.colors.background } is a new object on every call.
                Even with renderItem memoized, if cardStyle is inline, PostCard's style prop
                changes on every render — defeating React.memo on PostCard (if applied).
  Problem     : Objects created in JSX are never referentially equal between renders.
  Refactored  :
  ```tsx
  const cardStyle = useMemo(
    () => ({ backgroundColor: theme.colors.background }),
    [theme.colors.background]
  );
  // Pass cardStyle (stable reference) to renderItem above
  ```

[MEDIUM] onLike inline closure captures item.id per cell
  Impact      : () => handleLike(item.id) is a new function per item per render.
                If PostCard is wrapped in React.memo, it still re-renders when its onLike
                prop changes reference. With 20 items, that's 20 new function references
                on every FeedScreen render.
  Problem     : The item.id needs to reach handleLike, but the way to do it matters.
  Refactored  :
  ```tsx
  // Pattern A: pass id as a stable prop, call handleLike inside PostCard
  // PostCard receives: onLike: (id: string) => void; id: string
  // Inside PostCard: <TouchableOpacity onPress={() => onLike(id)}>
  // In FeedScreen: pass onLike={handleLike} — same stable reference every render

  // Pattern B (simpler): wrap handleLike in useCallback
  const stableHandleLike = useCallback((id: string) => handleLike(id), []);
  // Then each cell still creates () => stableHandleLike(item.id), but the outer
  // reference is stable — combine with Pattern A for best results.
  ```

[LOW] FlatList missing getItemLayout
  Impact      : Without getItemLayout, FlatList cannot pre-calculate item positions.
                This causes extra layout measurements on initial mount and when
                scrollToIndex is called. With variable-height items it is unavoidable,
                but if PostCard has a fixed height, this is a free optimization.
  Problem     : FlatList must measure every rendered item to know total scroll height.
  Refactored  :
  ```tsx
  const ITEM_HEIGHT = 88; // measure your PostCard — padding 16 + title 24 + body 20 + like 20 + margin 8
  <FlatList
    data={posts}
    renderItem={renderItem}
    keyExtractor={(item) => item.id}
    getItemLayout={(_, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    })}
  />
  ```

BRIDGE / JSI OVERHEAD
---------------------
Synchronous bridge calls detected: No
  → No NativeModules calls detected in the render or event paths.

ANIMATION SAFETY
----------------
Animations running on JS thread: No
  → No Animated API usage detected in this file.

FLATLIST / FLASHLIST AUDIT
--------------------------
Issues found: 2
  → keyExtractor returns item.id — correct and stable. ✓
  → getItemLayout missing — see LOW finding above.
  → Consider FlashList (Shopify) for lists with 50+ posts — better recycling
    and memory usage on New Architecture.

ESTIMATED IMPROVEMENT
---------------------
Before: ~10–20 PostCard re-renders per FeedScreen state change
After : ~0 PostCard re-renders for unrelated FeedScreen state changes
Expected FPS gain: Sustained 60 FPS during scroll on mid-range devices (vs. potential
                   drops on lower-end Android without the fixes).

RECOMMENDED PROFILING STEPS
----------------------------
1. Open React DevTools → Profiler → Enable "Record why each component rendered"
2. Scroll the feed, toggle a like — record 5 seconds
3. Look for "Props changed" on PostCard — confirm it stops appearing for items
   that weren't liked after applying useCallback + useMemo
4. Enable "Highlight updates" in React DevTools to visually confirm only
   newly loaded or liked posts cause a highlight during scroll
```
