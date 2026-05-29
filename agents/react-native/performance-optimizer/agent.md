# Agent 05 — React Native Performance Optimizer

**Platform:** React Native (TypeScript)  
**Category:** Performance & Optimization  
**Complexity:** Medium–High

---

## Purpose

Analyzes React Native TypeScript components for performance issues including unnecessary re-renders, missing memoization, bridge call overhead, FlatList misconfiguration, and image/animation bottlenecks. Returns ranked findings with a measurable impact estimate and specific refactored code for each fix.

---

## Input Format

```
RN_VERSION: <e.g. 0.76>
ARCH: <old | new>
FILE_PATH: <relative path, e.g. src/screens/FeedScreen.tsx>
CODE:
<paste the full component file or relevant section>
PROFILER_DATA: <optional: paste Flipper or React DevTools Profiler output>
```

**Fields:**

| Field | Required | Description |
|---|---|---|
| `RN_VERSION` | Yes | Determines available APIs (New Arch, Fabric, etc.) |
| `ARCH` | Yes | `new` for New Architecture (JSI/Fabric), `old` for Bridge |
| `FILE_PATH` | Yes | Helps infer component role (screen vs. list item vs. modal) |
| `CODE` | Yes | Full component source |
| `PROFILER_DATA` | No | React DevTools or Flipper performance trace for priority ranking |

---

## Output Format

```
PERFORMANCE AUDIT
=================
File: <file path>
Component: <ComponentName>
Architecture: <Old Bridge | New Architecture (JSI/Fabric)>
Issues Found: <count>
High Impact: <count>  Medium Impact: <count>  Low Impact: <count>

FINDINGS (ranked by impact)
---------------------------
[HIGH] <Issue title>
  Impact      : <Estimated frames dropped or re-renders per interaction>
  Problem     : <What is happening and why it is expensive>
  Refactored  :
  ```tsx
  <corrected code snippet>
  ```

[MEDIUM] <Issue title>
  Impact      : <Estimated impact>
  Problem     : <What is happening>
  Refactored  :
  ```tsx
  <corrected code snippet>
  ```

[LOW] <Issue title>
  Impact      : <Estimated impact>
  Problem     : <What is happening>
  Refactored  :
  ```tsx
  <corrected code snippet>
  ```

BRIDGE / JSI OVERHEAD
---------------------
Synchronous bridge calls detected: Yes / No
  → <Which calls and alternatives>

ANIMATION SAFETY
----------------
Animations running on JS thread: Yes / No
  → <Which animations should use `useNativeDriver: true`>

FLATLIST / FLASHLIST AUDIT
--------------------------
N/A | Issues found: <count>
  → <keyExtractor, getItemLayout, windowSize, removeClippedSubviews issues>

ESTIMATED IMPROVEMENT
---------------------
Before: ~<N> renders per interaction
After : ~<N> renders per interaction
Expected FPS gain: <estimate or "measure to confirm">

RECOMMENDED PROFILING STEPS
----------------------------
1. <Specific Flipper / React DevTools step to validate the fix>
```

---

## System Prompt

```
You are a senior React Native performance engineer. Your job is to analyze React Native TypeScript components for performance problems and produce structured, actionable findings with refactored code.

Checks to perform:
1. Unnecessary re-renders: Are callbacks and objects recreated on every render without `useCallback`/`useMemo`? Are context values causing tree-wide re-renders?
2. Component memoization: Should this component be wrapped in `React.memo`? Are its props referentially stable?
3. FlatList/FlashList: Is `keyExtractor` returning stable keys? Is `getItemLayout` missing (causes full layout for every item)? Is `removeClippedSubviews` set? Is `windowSize` tuned?
4. Animations: Are Animated values using `useNativeDriver: true` where possible? Are Reanimated worklets free of JS-thread calls?
5. Bridge overhead (Old Arch): Are there synchronous calls to native modules in render paths? Can they be replaced with JSI or batched?
6. Image loading: Are images sized to display dimensions? Is `FastImage` or Expo Image used for caching?
7. Inline functions and objects in JSX: `onPress={() => fn(item)}` in a list cell forces every cell to re-render when the parent re-renders.
8. `useEffect` dependencies: Are effects running more often than needed?

For each finding:
- Rank by impact: HIGH (causes jank / dropped frames), MEDIUM (causes extra renders visible in profiler), LOW (minor).
- Estimate the impact in concrete terms (re-render count, frame budget).
- Provide a corrected code snippet — not pseudocode.
- Note when a fix requires measuring before and after to confirm.

Output MUST follow the exact format specified.
```

---

## Example

### Input

```
RN_VERSION: 0.76
ARCH: new
FILE_PATH: src/screens/FeedScreen.tsx
CODE:
const FeedScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    fetchPosts().then(setPosts);
  }, []);

  const renderItem = ({ item }: { item: Post }) => (
    <PostCard
      post={item}
      onLike={() => handleLike(item.id)}
      style={{ backgroundColor: theme.colors.background }}
    />
  );

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};
```

### Output

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
  Impact      : Every state change in FeedScreen (including unrelated state)
                recreates renderItem, which forces React to re-render every
                visible PostCard — typically 10–20 items on screen.
  Problem     : `renderItem` is an inline function defined in the component body.
                FlatList uses referential equality to bail out of re-renders.
                A new function reference on every render defeats this.
  Refactored  :
  ```tsx
  const renderItem = useCallback(({ item }: { item: Post }) => (
    <PostCard
      post={item}
      onLike={() => handleLike(item.id)}
      style={cardStyle}
    />
  ), [cardStyle]); // cardStyle extracted below
  ```

[HIGH] Inline style object created on every renderItem call
  Impact      : `{ backgroundColor: theme.colors.background }` is a new object
                reference each render, breaking `React.memo` on PostCard even
                if PostCard is memoized.
  Problem     : Objects created in JSX are never referentially equal across renders.
  Refactored  :
  ```tsx
  const cardStyle = useMemo(
    () => ({ backgroundColor: theme.colors.background }),
    [theme.colors.background]
  );
  ```

[MEDIUM] onLike callback captures item.id as a closure per cell
  Impact      : Each PostCard gets a unique `onLike` function. If PostCard is
                wrapped in React.memo, it still re-renders when the parent
                renderItem is recreated (addressed by HIGH fix above), but the
                inline `() => handleLike(item.id)` still creates a new reference
                per render per item.
  Problem     : Pass `item.id` as a prop and let PostCard call a stable callback.
  Refactored  :
  ```tsx
  // In FeedScreen:
  const handleLike = useCallback((id: string) => {
    // like logic
  }, []);

  // In PostCard: accept onLike(id: string) and call it with own props.id
  ```

[LOW] FlatList missing getItemLayout
  Impact      : Without `getItemLayout`, FlatList cannot pre-calculate item
                positions, causing extra layout passes when scrolling to an index
                or on initial mount.
  Problem     : If PostCard has a fixed height, provide `getItemLayout`.
  Refactored  :
  ```tsx
  const ITEM_HEIGHT = 120; // measure your PostCard
  <FlatList
    ...
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
  → No native module calls detected in the render path.

ANIMATION SAFETY
----------------
Animations running on JS thread: No
  → No Animated or Reanimated usage detected in this file.

FLATLIST / FLASHLIST AUDIT
--------------------------
Issues found: 2
  → `keyExtractor` returns `item.id` — correct and stable.
  → `getItemLayout` missing — see LOW finding above.
  → Consider migrating to FlashList (Shopify) for lists with 50+ items;
    it virtualizes more aggressively and performs better on New Architecture.

ESTIMATED IMPROVEMENT
---------------------
Before: ~10–20 PostCard re-renders per FeedScreen state change
After : ~0 PostCard re-renders for unrelated FeedScreen state changes
Expected FPS gain: Measure with React DevTools Profiler; expect 60 FPS sustained
                   during scroll on mid-range devices.

RECOMMENDED PROFILING STEPS
----------------------------
1. Open React DevTools → Profiler → Record while scrolling the feed.
2. Look for "Why did this render?" on PostCard — confirm it stops showing
   "props changed" after applying the useCallback/useMemo fixes.
3. Enable "Highlight updates" in React DevTools to visually confirm only
   newly loaded posts cause a re-render, not all visible posts.
```

---

## Notes

- For Old Architecture, the agent additionally checks for synchronous `NativeModules` calls in render paths.
- If `PROFILER_DATA` is provided, findings are ranked by actual measured render time, not heuristic estimates.
- The agent does not have visibility into PostCard's internals — it cannot confirm whether `React.memo` is already applied there.
- Tested with: Claude Sonnet 4.6, GPT-4o.
