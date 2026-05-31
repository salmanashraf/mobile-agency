# Skill — /rn-review

**Platform:** React Native
**Slash Command:** `/rn-review`
**Composable With:** agents/react-native/bridge/agent.md

---

## Purpose

React Native component audit covering bridge calls, re-renders, New Architecture readiness, and FlatList performance.

---

## Skill Prompt

```
Review the provided React Native component for these issues:

BRIDGE PERFORMANCE
- NativeModule calls in render or event handlers that fire frequently.
  Fix: move to useEffect, debounce, or replace with JSI-based alternatives.
- AsyncStorage for synchronous-feeling reads: replace with MMKV.
- Animated.Value without useNativeDriver: true — runs on JS thread, causes jank.
  Fix: add useNativeDriver: true (only for transform and opacity properties).

RE-RENDERS
- Missing React.memo on child components that receive stable props.
- Missing useCallback on functions passed as props.
- Missing useMemo on expensive computations or derived arrays.
- useSelector without equality function (Redux) — re-renders on any store change.
  Fix: use shallowEqual or select specific slice.
- Context consumers re-rendering on every context value change.
  Fix: split context or use useMemo on context value.

FLATLIST OPTIMIZATION
- Missing keyExtractor → React can't diff efficiently.
- Missing getItemLayout for fixed-height rows → scrollToIndex doesn't work.
- Missing removeClippedSubviews (Android) for long lists.
- initialNumToRender not set — defaults to 10, adjust for screen height.
- renderItem not memoized with useCallback.

NEW ARCHITECTURE
- NativeModule using RCTBridgeModule → migrate to TurboModule.
- ViewManager using RCTViewManager → migrate to Fabric component.
- Animated.event bridge calls → useNativeDriver or Reanimated 2.

TYPESCRIPT
- any type on props or return values.
- Missing null checks on optional props.

For each issue: component name, line/hook, what causes it, and the fix.
```
