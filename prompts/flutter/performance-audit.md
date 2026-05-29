# Prompt — Flutter Widget Performance Audit

**Platform:** Flutter (Dart)  
**Category:** Performance & Optimization  
**Type:** one-shot

---

## Purpose

Audits a Flutter widget tree for performance issues — unnecessary rebuilds, missing const constructors, expensive operations in build(), and ListView/GridView virtualization gaps.

---

## Prompt

```
You are a senior Flutter performance engineer. Audit the widget tree below for performance
issues and produce a ranked list of findings with concrete fixes.

Check for:
1. MISSING CONST: Every widget instantiation that can be const should be const.
   Non-const widgets are recreated on every build() call.
2. EXPENSIVE BUILD(): Network calls, file I/O, sorting, filtering, or object instantiation
   in build() run on every rebuild. Move to initState(), a FutureBuilder, or a notifier.
3. UNNECESSARY REBUILDS: setState() higher in the tree rebuilds all descendants. Check
   if state can be moved lower (extract a stateful child) or use ValueNotifier + ValueListenableBuilder.
4. LISTVIEW WITHOUT BUILDER: ListView(children: [...]) renders all children eagerly.
   Use ListView.builder for any list with more than ~10 items.
5. IMAGES WITHOUT CACHE: Network images without caching (CachedNetworkImage or Cached+Glide).
   Also flag images not sized to their display dimensions (causes unnecessary decoding).
6. LARGE WIDGET TREES IN SINGLE BUILD: Deeply nested Column/Row/Stack trees in a single
   build() method are harder to optimize. Split into smaller const widgets.
7. ANIMATION: AnimationController not disposed in dispose() — memory leak.
   AnimatedBuilder rebuilding a large subtree when only a small part animates.

For each issue: widget/line, severity (High/Medium/Low), problem, and corrected code.

Widget tree to audit:
```
[PASTE YOUR FLUTTER WIDGET CODE HERE]
```
```

---

## Example Usage

**What you paste:**
```
Widget tree to audit:
```
class ProductListScreen extends StatefulWidget { ... }
class _ProductListScreenState extends State<ProductListScreen> {
  @override
  Widget build(BuildContext context) {
    final filtered = widget.products
        .where((p) => p.isAvailable)
        .toList()
      ..sort((a, b) => a.price.compareTo(b.price));

    return ListView(
      children: filtered.map((p) => ProductCard(product: p)).toList(),
    );
  }
}
```
```

**Expected output:**
```
[HIGH] Filtering and sorting in build() — runs on every rebuild
  The .where().toList()..sort() chain runs on every call to build(), which happens
  on every setState() anywhere in the parent tree. For 1000 products, this is O(n log n)
  per frame.
  Fix: Move computation to initState() or use a StreamBuilder/FutureBuilder pattern.
  Store the sorted list in a field and update it only when widget.products changes:
  late List<Product> _filtered;
  @override
  void initState() {
    super.initState();
    _updateFiltered();
  }
  @override
  void didUpdateWidget(ProductListScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.products != widget.products) _updateFiltered();
  }
  void _updateFiltered() {
    _filtered = widget.products.where((p) => p.isAvailable).toList()
      ..sort((a, b) => a.price.compareTo(b.price));
  }

[HIGH] ListView renders all children eagerly (no virtualization)
  ListView(children: [...]) creates all ProductCard widgets upfront, even those off-screen.
  For 100+ products, this causes slow initial render and excessive memory use.
  Fix: Use ListView.builder:
  ListView.builder(
    itemCount: _filtered.length,
    itemBuilder: (context, index) => ProductCard(product: _filtered[index]),
  )

[MEDIUM] ProductCard likely missing const constructor
  If ProductCard accepts only immutable data (a Product object), it should be const:
  class ProductCard extends StatelessWidget {
    const ProductCard({super.key, required this.product});
  }
  This allows Flutter to skip rebuilding unchanged cards during scrolling.
```

---

## Variations

- **CustomPainter audit:** Add "Also check CustomPainter.shouldRepaint() — returning true always causes a repaint on every frame."
- **With RepaintBoundary:** Add "Suggest where RepaintBoundary widgets should be added to isolate repaints to specific subtrees."
