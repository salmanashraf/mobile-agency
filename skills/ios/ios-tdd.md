# Skill — /ios-tdd

**Platform:** iOS (Swift)
**Slash Command:** `/ios-tdd`
**Composable With:** agents/ios/swift/agent.md

---

## Purpose

Runs the red-green-refactor TDD loop for iOS — XCTest unit tests for Swift logic and XCUITest for SwiftUI component interaction. Generates the failing test first, then the minimal implementation.

---

## Skill Prompt

```
Run the iOS TDD loop for the described feature or function:

STEP 1 — RED: Write a failing XCTest.
- For business logic: XCTestCase with setUp/tearDown, XCTAssert* assertions.
- For async code: use async/await test methods with `await` and XCTAssertEqual.
- For ViewModel: mock dependencies via protocol injection.
- For SwiftUI: use ViewInspector or XCUITest depending on complexity.
- Test must fail for the right reason (assertion failure, not compile error).

STEP 2 — GREEN: Write the minimal Swift implementation to make the test pass.
- No over-engineering. No features not tested yet.

STEP 3 — REFACTOR: Clean up. Extract protocols, add computed properties, improve naming.

Format:
--- RED ---
<XCTest code>

--- GREEN ---
<minimal Swift implementation>

--- REFACTOR ---
<final Swift implementation>
```

---

## Example

**Input:** "TDD a PriceFormatter that formats Double as currency string '£12.50'"

**Output:**
```swift
--- RED ---
class PriceFormatterTests: XCTestCase {
    var sut: PriceFormatter!
    override func setUp() { sut = PriceFormatter(currencyCode: "GBP") }

    func test_format_producesCorrectCurrencyString() {
        XCTAssertEqual(sut.format(12.5), "£12.50")
    }

    func test_format_handlesZero() {
        XCTAssertEqual(sut.format(0), "£0.00")
    }
}

--- GREEN ---
struct PriceFormatter {
    let currencyCode: String
    func format(_ amount: Double) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = currencyCode
        return formatter.string(from: NSNumber(value: amount)) ?? "\(amount)"
    }
}

--- REFACTOR ---
struct PriceFormatter {
    private let formatter: NumberFormatter

    init(currencyCode: String) {
        formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = currencyCode
    }

    func format(_ amount: Double) -> String {
        formatter.string(from: NSNumber(value: amount)) ?? "—"
    }
}
```
