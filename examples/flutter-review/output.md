# DART Review — HomeScreen

**Agent:** DART
**Input:** examples/flutter-review/input.dart

---

## Output

```
DART REVIEW
===========
File: lib/screens/home_screen.dart
Widget Type: StatefulWidget
Issues Found: 6  Critical: 0  Warning: 4  Info: 2

FINDINGS
--------
[WARNING]  initState — Direct API instantiation inside widget
  Problem : ProductApi() is constructed inline with no dependency injection.
            This couples the UI directly to the network layer and makes the
            screen impossible to unit test without hitting a real API.
  Fix     : Accept a ProductRepository via constructor, or use a state
            management solution (Riverpod, Bloc) that injects the dependency.

[WARNING]  Line 28 — setState called after async gap without mounted check
  Problem : If HomeScreen is disposed before _loadProducts() completes,
            setState(() { ... }) throws:
            "setState() called after dispose(): _HomeScreenState#..."
  Fix     : Future<void> _loadProducts() async {
              final result = await ProductApi().fetchAll();
              if (!mounted) return;
              setState(() {
                products = result;
                isLoading = false;
              });
            }

[WARNING]  Line 37 — ListView instead of ListView.builder
  Problem : ListView renders all ProductCard widgets at once regardless of
            scroll position. With 200+ products this causes a massive first-
            frame spike and continuous memory pressure. This is the most
            common Flutter performance mistake on list screens.
  Fix     : ListView.builder(
              itemCount: products.length,
              itemBuilder: (context, index) =>
                  ProductCard(product: products[index]),
            )

[WARNING]  ProductCard build() — Computation inside build()
  Problem : final discounted = product.price * 0.9 runs on every rebuild of
            ProductCard. While cheap here, this pattern at scale (complex
            formatting, sorting, filtering) causes measurable jank.
  Fix     : Move to a getter on the Product model:
            double get discountedPrice => price * 0.9;
            Or use a computed field set once in the parent.

[INFO]     Line 33 — AppBar title missing const
  Problem : Text('Home') allocates a new object on every rebuild.
  Fix     : title: const Text('Home')

[INFO]     Line 43 — Card margin missing const
  Problem : EdgeInsets.all(8) allocates on every card rebuild.
  Fix     : margin: const EdgeInsets.all(8)

REBUILD ANALYSIS
----------------
Unnecessary rebuilds detected: Yes
  → Entire Scaffold (including AppBar) rebuilds on every setState call.
    With ListView.builder, only visible items rebuild. Consider extracting
    the product list into a separate widget scoped to product state only.

STATE MANAGEMENT
----------------
Pattern used: setState
Misuse detected: Yes
  → setState for async network data in a screen-level widget is the
    classic "works for demos, breaks in production" pattern. Migrate to
    Riverpod AsyncNotifier or Bloc for proper loading/error/data states.

TESTABILITY SCORE: 2/10
  → Inline API construction and no dependency injection make this
    untestable without hitting the real network.

VERDICT: NEEDS WORK
```

---

## Fixed Version (key changes)

```dart
// After applying DART's recommendations:

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Use Riverpod/Bloc — no setState, no manual loading flag
    final productsAsync = ref.watch(productsProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Home')),
      body: productsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
        data: (products) => ListView.builder(
          itemCount: products.length,
          itemBuilder: (context, index) =>
              ProductCard(product: products[index]),
        ),
      ),
    );
  }
}

class ProductCard extends StatelessWidget {
  final Product product;
  const ProductCard({super.key, required this.product});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(8),
      child: ListTile(
        title: Text(product.name),
        subtitle: Text(
          'Was \$${product.price}, now \$${product.discountedPrice.toStringAsFixed(2)}',
        ),
        trailing: ElevatedButton(
          onPressed: () => context.push('/product/${product.id}'),
          child: const Text('View'),
        ),
      ),
    );
  }
}
```
