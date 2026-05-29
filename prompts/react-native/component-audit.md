# Prompt — React Native Component Audit

**Platform:** React Native (TypeScript)  
**Category:** Performance & Optimization  
**Type:** one-shot

---

## Purpose

Quick performance audit of a single React Native component. Faster than the full RN Performance Optimizer agent — use for a focused, one-component review.

---

## Prompt

```
You are a senior React Native performance engineer. Audit the component below for performance
issues. For each issue: state what is wrong, estimate the impact (re-renders per interaction
or FPS impact), and provide the corrected code snippet.

Check for:
1. Inline functions in JSX passed as props (new reference every render)
2. Inline objects in JSX passed as props (new reference every render)
3. Missing React.memo on components receiving stable props
4. Missing useCallback on event handlers
5. Missing useMemo on derived data or computed values
6. FlatList without keyExtractor, getItemLayout, or removeClippedSubviews
7. Animations without useNativeDriver: true
8. useEffect with missing or incorrect dependencies
9. Context consumer that re-renders on unrelated context changes
10. State updates that trigger wider-than-necessary re-renders

Component to audit:
```
[PASTE YOUR REACT NATIVE COMPONENT HERE]
```
```

---

## Example Usage

**What you paste:**
```
Component to audit:
```
const OrderSummary = ({ items, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <View style={{ padding: 16, backgroundColor: '#f5f5f5' }}>
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row' }}>
            <Text>{item.name}</Text>
            <Text>${item.price}</Text>
          </View>
        )}
      />
      <Text>Total: ${total.toFixed(2)}</Text>
      <Button title="Checkout" onPress={() => onCheckout(items)} />
    </View>
  );
};
```
```

**Expected output:**
```
[HIGH] renderItem is an inline function — recreated on every parent render
  Impact: Every re-render of OrderSummary forces all visible FlatList items to re-render.
  Fix:
  const renderItem = useCallback(({ item }: { item: OrderItem }) => (
    <OrderItem item={item} />
  ), []);
  // Extract to a separate memoized component for best performance.

[HIGH] Inline style object on View — new reference every render
  Impact: { padding: 16, backgroundColor: '#f5f5f5' } is a new object each render,
          preventing PureComponent/memo bailout on the outer View.
  Fix:
  const styles = StyleSheet.create({
    container: { padding: 16, backgroundColor: '#f5f5f5' },
    row: { flexDirection: 'row' },
  });

[MEDIUM] total recalculated on every render
  Impact: .reduce() runs on every render of OrderSummary, even when items hasn't changed.
  Fix:
  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  );

[MEDIUM] onCheckout inline closure captures items
  Impact: () => onCheckout(items) is a new function per render. If passed further down,
          it defeats React.memo on child components.
  Fix:
  const handleCheckout = useCallback(() => onCheckout(items), [onCheckout, items]);
  <Button title="Checkout" onPress={handleCheckout} />

[LOW] FlatList missing keyExtractor
  Impact: Without a stable key, FlatList fully re-renders on any list change.
  Fix: keyExtractor={(item) => item.id}
```

---

## Variations

- **With profiler data:** Add "I've included React DevTools Profiler output below. Use it to rank findings by actual measured impact: [paste profiler JSON]"
- **New Architecture focus:** Add "This app uses New Architecture (RN 0.76). Skip bridge-specific checks and focus on JSI, Fabric, and TurboModule patterns."
