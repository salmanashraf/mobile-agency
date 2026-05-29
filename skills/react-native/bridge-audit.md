# Skill — React Native Bridge Audit

**Platform:** React Native (TypeScript)  
**Category:** Performance & Optimization  
**Composable With:** agents/react-native/performance-optimizer/agent.md, skills/react-native/performance.md

---

## Purpose

Audits React Native code specifically for Old Architecture bridge overhead — synchronous calls, excessive serialization, and patterns that block the JS thread. Also flags migration candidates for the New Architecture (JSI/Fabric).

## When to Use

- When profiling shows dropped frames but re-render analysis doesn't explain it
- When auditing an Old Architecture app before migrating to New Architecture
- When a native module feels slow even though JS logic is fast

---

## Skill Prompt

```
When auditing React Native code for bridge overhead, check for:

OLD ARCHITECTURE — BRIDGE CALL PATTERNS
- NativeModules calls in the render path or in useEffect without debouncing:
  Each bridge call serializes arguments to JSON, crosses the bridge asynchronously,
  deserializes on the native side, and returns the same way. In a hot path (scroll,
  animation, frequent re-render), this compounds into dropped frames.
  Fix: cache native module results, debounce calls, or move to useRef to avoid re-triggering.

- Synchronous native calls (NativeModules.SomeModule.callSyncMethod()):
  Synchronous bridge calls BLOCK the JS thread until the native side returns.
  If the native operation takes >1ms, it will cause visible jank at 60 FPS.
  Fix: replace with async calls + caching, or migrate to JSI TurboModules (async by default,
  faster than the bridge even for async calls).

- High-frequency bridge calls in event handlers:
  onScroll, onMomentumScrollEnd, and gesture handlers that call native modules on every event
  are problematic. Use the Animated API with useNativeDriver: true to keep animation logic
  on the native side without any bridge crossing.

- Large payload serialization:
  Passing large objects (e.g., full image buffers, large arrays) across the bridge serializes
  them to JSON on the JS side and deserializes on native. Use native JSI references (Blob, ArrayBuffer)
  or keep large data on the native side and pass handles (IDs) across the bridge instead.

NEW ARCHITECTURE — JSI / FABRIC MIGRATION CANDIDATES
Flag these patterns as HIGH priority migration candidates to JSI TurboModules:
- Any NativeModule called more than once per second
- Any synchronous NativeModule call
- Any module that transfers binary data (images, audio, video buffers)
- Custom gesture handling that uses PanResponder — migrate to react-native-gesture-handler (runs on UI thread via JSI)

FABRIC (New Renderer) COMPATIBILITY
- Ensure all custom native view components use the Fabric component API if targeting New Architecture.
- Flag any legacy requireNativeComponent() calls — they do not work with Fabric.

For each issue: identify the call site, explain the bridge cost, and suggest the JSI/async alternative.
```

---

## Example

**Input:**
```
const ProfileScreen = () => {
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    const id = NativeModules.DeviceInfo.getDeviceIdSync();
    setDeviceId(id);
  }, []);

  return <Text>{deviceId}</Text>;
};
```

**Output:**
```
Synchronous bridge call in useEffect — HIGH impact
  Problem: getDeviceIdSync() blocks the JS thread until the native side returns.
           If DeviceInfo takes >1ms (disk read, system call), JS is frozen during that time.
           This is noticeable during screen mount, especially on low-end devices.
  Fix:
  useEffect(() => {
    NativeModules.DeviceInfo.getDeviceId().then(setDeviceId);
    // Or if using a library: DeviceInfo.getDeviceId().then(setDeviceId)
  }, []);

  Migration candidate: HIGH — device ID is fetched once; migrate to a TurboModule that
  caches the value natively and returns via JSI without serialization cost.
```

---

## Notes

- This skill is most relevant for apps still on Old Architecture (RN < 0.74 or new arch not enabled).
- New Architecture apps are largely immune to bridge-crossing overhead but still benefit from
  avoiding large payload transfers across JSI.
- Pair with Flipper's Bridge Spy plugin to measure actual bridge traffic before and after fixes.
