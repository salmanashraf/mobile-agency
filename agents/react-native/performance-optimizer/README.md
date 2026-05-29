# React Native Performance Optimizer Agent

> Paste a React Native component. Get a ranked list of re-render bottlenecks, FlatList issues, bridge overhead, and animation problems — with corrected TypeScript for each fix.

---

## What This Agent Does

Analyzes React Native TypeScript components for performance issues and returns findings ranked by impact:

- **Re-render prevention** — missing `useCallback`, `useMemo`, `React.memo`; inline functions and objects in JSX
- **FlatList / FlashList** — `keyExtractor`, `getItemLayout`, `windowSize`, `removeClippedSubviews`, `initialNumToRender`
- **Bridge overhead** — `NativeModules` calls in render paths, synchronous bridge calls (Old Architecture)
- **Animation thread** — animations running on JS thread instead of native thread (`useNativeDriver: true`)
- **Context re-renders** — large context consumers that re-render on unrelated context changes

Every finding includes: impact estimate (re-renders/interaction or FPS impact), root-cause explanation, and corrected TypeScript code.

---

## Files

| File | Purpose |
|---|---|
| [`agent.md`](agent.md) | Input format, output format, full system prompt |
| [`example-input.md`](example-input.md) | FeedScreen with 4 intentional performance issues |
| [`example-output.md`](example-output.md) | Ranked performance audit with fixes |

---

## Quick Start

```
RN_VERSION: 0.76
ARCH: new
FILE_PATH: src/screens/FeedScreen.tsx
CODE:
[paste your component]
```

Set `ARCH: old` for Bridge architecture apps, `ARCH: new` for JSI/Fabric apps.

---

## Output Preview

```
PERFORMANCE AUDIT
=================
Issues Found: 4  |  High: 2  |  Medium: 1  |  Low: 1

[HIGH] renderItem recreated on every parent render
  Impact: Every state change forces re-render of all 10–20 visible PostCards.
  Fix   : const renderItem = useCallback(({ item }) => <PostCard ... />, [cardStyle])

[HIGH] Inline style object — new reference every renderItem call
  Fix   : const cardStyle = useMemo(() => ({ backgroundColor: theme.colors.background }),
                                    [theme.colors.background])
```

Full example: [`example-output.md`](example-output.md)

---

## When to Use

| Symptom | Use This Agent |
|---|---|
| List scrolling drops below 60 FPS | Yes |
| Screens feel sluggish to respond | Yes |
| React DevTools Profiler shows many re-renders | Yes |
| Bridge calls visible in Flipper Bridge Spy | Yes (Old Arch) |
| App is fast but want to validate before shipping | Yes |

---

## Related Agents

- `skills/react-native/performance.md` — quick skill module for inline checks
- `skills/react-native/bridge-audit.md` — bridge-specific Old Architecture audit
- `prompts/react-native/component-audit.md` — single-component quick audit prompt
