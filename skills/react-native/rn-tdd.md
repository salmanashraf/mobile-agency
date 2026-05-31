# Skill — /rn-tdd

**Platform:** React Native
**Slash Command:** `/rn-tdd`
**Composable With:** agents/react-native/bridge/agent.md

---

## Purpose

Runs the red-green-refactor TDD loop for React Native using Jest and React Native Testing Library. Generates failing tests first, then the minimal implementation.

---

## Skill Prompt

```
Run the React Native TDD loop for the described component or function:

STEP 1 — RED: Write a failing test using Jest + @testing-library/react-native.
- Render the component with renderHook() or render().
- Use userEvent for interactions (preferred over fireEvent for accuracy).
- For custom hooks: use renderHook() with act() for state updates.
- For Redux/Zustand: wrap in provider or use store.dispatch in test.
- Test must fail for the right reason (expect failure, not crash).

STEP 2 — GREEN: Minimal implementation to pass the test.
STEP 3 — REFACTOR: Apply hooks, memoization, proper types.

Format:
--- RED ---
<Jest test>

--- GREEN ---
<minimal component/function>

--- REFACTOR ---
<final implementation>
```

---

## Example

**Input:** "TDD a useDebounce hook that delays a value by N ms"

**Output:**
```typescript
--- RED ---
import { renderHook, act } from '@testing-library/react-native';
import { useDebounce } from './useDebounce';

jest.useFakeTimers();

test('returns debounced value after delay', () => {
  const { result, rerender } = renderHook(
    ({ value }) => useDebounce(value, 300),
    { initialProps: { value: 'a' } }
  );
  expect(result.current).toBe('a');
  rerender({ value: 'ab' });
  expect(result.current).toBe('a'); // still old value
  act(() => jest.advanceTimersByTime(300));
  expect(result.current).toBe('ab');
});

--- GREEN ---
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
```
