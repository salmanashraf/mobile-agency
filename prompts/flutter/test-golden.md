# Prompt — Flutter Golden Test

**Platform:** Flutter (Dart)  
**Category:** Code Quality  
**Type:** one-shot

---

## Purpose

Generates a golden (screenshot) test for a Flutter widget using `flutter_test` golden files. Covers light mode, dark mode, and responsive sizes.

---

## Prompt

```
You are a senior Flutter engineer. Generate a complete golden test for the Flutter widget below.

Rules:
1. Use flutter_test's matchesGoldenFile matcher.
2. Test at minimum: light mode, dark mode, and one responsive size variation.
3. Use a MaterialApp wrapper with ThemeData.light() and ThemeData.dark().
4. Set a fixed screen size using tester.binding.setSurfaceSize(Size(width, height)) for deterministic rendering.
5. Call await tester.pumpAndSettle() to ensure animations are complete.
6. Generate golden files path: 'goldens/<widget_name>_<variant>.png'
7. Include a setUp that configures the font loader for consistent text rendering:
   await loadAppFonts(); or use googleFonts mock.
8. Wrap with testWidgets and group under a descriptive describe block.
9. Output: complete test file with all imports.

Widget to generate golden test for:
```
[PASTE YOUR WIDGET CODE HERE]
```
```

---

## Example Usage

**What you paste:**
```
Widget to generate golden test for:
```
class StatusBadge extends StatelessWidget {
  const StatusBadge({super.key, required this.status});
  final String status; // 'active', 'pending', 'inactive'

  @override
  Widget build(BuildContext context) {
    final color = switch (status) {
      'active' => Colors.green,
      'pending' => Colors.orange,
      _ => Colors.grey,
    };
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(color: color.withOpacity(0.15),
          borderRadius: BorderRadius.circular(12)),
      child: Text(status, style: TextStyle(color: color, fontWeight: FontWeight.w600)),
    );
  }
}
```
```

**Expected output:**
```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:your_app/widgets/status_badge.dart';

void main() {
  group('StatusBadge golden tests', () {
    Future<void> buildWidget(
      WidgetTester tester, {
      required String status,
      required ThemeData theme,
      Size size = const Size(200, 100),
    }) async {
      tester.binding.setSurfaceSize(size);
      addTearDown(() => tester.binding.setSurfaceSize(null));

      await tester.pumpWidget(
        MaterialApp(
          theme: theme,
          home: Scaffold(
            body: Center(child: StatusBadge(status: status)),
          ),
          debugShowCheckedModeBanner: false,
        ),
      );
      await tester.pumpAndSettle();
    }

    testWidgets('active status - light mode', (tester) async {
      await buildWidget(tester, status: 'active', theme: ThemeData.light());
      await expectLater(
        find.byType(StatusBadge),
        matchesGoldenFile('goldens/status_badge_active_light.png'),
      );
    });

    testWidgets('active status - dark mode', (tester) async {
      await buildWidget(tester, status: 'active', theme: ThemeData.dark());
      await expectLater(
        find.byType(StatusBadge),
        matchesGoldenFile('goldens/status_badge_active_dark.png'),
      );
    });

    testWidgets('pending status - light mode', (tester) async {
      await buildWidget(tester, status: 'pending', theme: ThemeData.light());
      await expectLater(
        find.byType(StatusBadge),
        matchesGoldenFile('goldens/status_badge_pending_light.png'),
      );
    });

    testWidgets('inactive status - light mode', (tester) async {
      await buildWidget(tester, status: 'inactive', theme: ThemeData.light());
      await expectLater(
        find.byType(StatusBadge),
        matchesGoldenFile('goldens/status_badge_inactive_light.png'),
      );
    });

    testWidgets('wide layout - active status', (tester) async {
      await buildWidget(
        tester,
        status: 'active',
        theme: ThemeData.light(),
        size: const Size(400, 100),
      );
      await expectLater(
        find.byType(StatusBadge),
        matchesGoldenFile('goldens/status_badge_active_wide.png'),
      );
    });
  });
}

// To generate goldens: flutter test --update-goldens test/widgets/status_badge_golden_test.dart
// To run comparison:   flutter test test/widgets/status_badge_golden_test.dart
```

---

## Variations

- **With alchemist package:** Add "Use the alchemist package for multi-variant golden tests in a single file with GoldenTestGroup."
- **Animated widget:** Add "The widget has an animation. Use tester.pump(Duration(milliseconds: 500)) at specific intervals to capture mid-animation frames."
