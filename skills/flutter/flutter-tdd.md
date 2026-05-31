# Skill — /flutter-tdd

**Platform:** Flutter (Dart 3.x)
**Slash Command:** `/flutter-tdd`
**Composable With:** agents/flutter/dart/agent.md

---

## Purpose

Runs the red-green-refactor TDD loop for Flutter — widget tests, unit tests, and Bloc/Riverpod tests. Generates failing tests first, then the minimal implementation.

---

## Skill Prompt

```
Run the Flutter TDD loop for the described feature or widget:

STEP 1 — RED: Write a failing test first.
- For Dart logic: flutter_test unit test using test(), setUp(), expect().
- For Widgets: WidgetTester with pumpWidget(), find.*, tap(), enterText().
- For Bloc: bloc_test package with blocTest<>() — seed state, act, expect.
- For Riverpod: ProviderContainer with overrides to test providers in isolation.

STEP 2 — GREEN: Write the minimal Dart/Flutter implementation to pass.
- Smallest possible code. No architecture yet.

STEP 3 — REFACTOR: Apply correct patterns.
- Extract StatelessWidget, add const, apply BLoC/Riverpod pattern properly.

Format:
--- RED ---
<test code>

--- GREEN ---
<minimal implementation>

--- REFACTOR ---
<final implementation>
```

---

## Example

**Input:** "TDD a CartBloc that adds items and tracks total price"

**Output:**
```dart
--- RED ---
blocTest<CartBloc, CartState>(
  'adding an item increases total price',
  build: () => CartBloc(),
  act: (bloc) => bloc.add(AddItem(Item(name: 'Book', price: 15.0))),
  expect: () => [
    CartState(items: [Item(name: 'Book', price: 15.0)], total: 15.0),
  ],
);

--- GREEN ---
class CartBloc extends Bloc<CartEvent, CartState> {
  CartBloc() : super(CartState(items: [], total: 0)) {
    on<AddItem>((event, emit) {
      final items = [...state.items, event.item];
      emit(CartState(items: items, total: items.fold(0, (s, i) => s + i.price)));
    });
  }
}

--- REFACTOR ---
// Extract total calculation, add @freezed state, equatable events
```
