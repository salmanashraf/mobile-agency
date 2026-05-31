# Skill — /android-tdd

**Platform:** Android (Kotlin)
**Slash Command:** `/android-tdd`
**Composable With:** agents/android/axiom/agent.md

---

## Purpose

Runs the red-green-refactor TDD loop for Android — JUnit5 unit tests, Compose UI tests, and ViewModel tests with Turbine for StateFlow. Generates a failing test first, then the minimal implementation that makes it pass.

---

## Skill Prompt

```
Run the Android TDD loop for the described feature or function:

STEP 1 — RED: Write a failing test first.
- For business logic: JUnit5 test class using @Test, @BeforeEach, MockK or Mockito.
- For ViewModel: use TestCoroutineDispatcher + Turbine to test StateFlow emissions.
- For Compose UI: use ComposeTestRule + semantic matchers (onNodeWithText, performClick).
- Test must fail for the right reason (not compile error, but assertion failure).

STEP 2 — GREEN: Write the minimal implementation to make the test pass.
- No extra logic, no future-proofing. Just enough to pass the test.

STEP 3 — REFACTOR: Clean up without breaking the test.
- Extract functions, improve naming, add sealed class if needed.

Format each step clearly:
--- RED (failing test) ---
<test code>

--- GREEN (implementation) ---
<minimal production code>

--- REFACTOR (cleaned up) ---
<final production code>
```

---

## Example

**Input:** "TDD a CalculateDiscountUseCase that applies 20% off when total > 100"

**Output:**
```kotlin
--- RED (failing test) ---
class CalculateDiscountUseCaseTest {
    private val useCase = CalculateDiscountUseCase()

    @Test
    fun `applies 20 percent discount when total exceeds 100`() {
        val result = useCase(120.0)
        assertEquals(96.0, result, 0.01)
    }

    @Test
    fun `no discount when total is 100 or less`() {
        val result = useCase(100.0)
        assertEquals(100.0, result, 0.01)
    }
}

--- GREEN (implementation) ---
class CalculateDiscountUseCase {
    operator fun invoke(total: Double): Double =
        if (total > 100.0) total * 0.80 else total
}

--- REFACTOR ---
private const val DISCOUNT_THRESHOLD = 100.0
private const val DISCOUNT_RATE = 0.80

class CalculateDiscountUseCase {
    operator fun invoke(total: Double): Double =
        if (total > DISCOUNT_THRESHOLD) total * DISCOUNT_RATE else total
}
```

---

## Notes

- Always write the test before asking for the implementation.
- For coroutine-heavy code, add `@OptIn(ExperimentalCoroutinesApi::class)` and use `runTest`.
