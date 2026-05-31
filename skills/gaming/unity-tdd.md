# Skill — /unity-tdd

**Platform:** Unity (C#)
**Slash Command:** `/unity-tdd`
**Composable With:** agents/gaming/forge/agent.md

---

## Purpose

NUnit + Unity Test Runner TDD loop covering both EditMode (pure logic) and PlayMode (runtime behavior) tests. Generates failing tests first, then the minimal implementation.

---

## Skill Prompt

```
Run the Unity TDD loop using NUnit and Unity Test Runner:

STEP 1 — RED: Write the failing test.
- EditMode test: for pure C# logic (no MonoBehaviour, no scene needed).
  [TestFixture] class, [Test] methods, [SetUp]/[TearDown].
- PlayMode test: for runtime behavior requiring scene, physics, or coroutines.
  Use UnityTest with IEnumerator return, yield return null to advance frame.
- Use [UnitySetUp] / [UnityTearDown] for async setup in PlayMode.

STEP 2 — GREEN: Minimal implementation to pass.
STEP 3 — REFACTOR: Separate concerns, extract interfaces for testability.

TESTABILITY PATTERNS FOR UNITY:
- Avoid MonoBehaviour in business logic: extract to plain C# classes.
- Use interfaces for dependencies (IEnemyAI, IHealthSystem) to enable mocking.
- ScriptableObjects for data: easy to instantiate in tests without scene.
- Time.deltaTime dependency: inject a clock abstraction (IClock.DeltaTime).

Format:
--- RED ---
<NUnit test code>

--- GREEN ---
<minimal C# implementation>

--- REFACTOR ---
<final implementation>
```

---

## Example

**Input:** "TDD a HealthSystem that reduces health on damage and fires OnDeath when reaching 0"

**Output:**
```csharp
--- RED ---
[TestFixture]
public class HealthSystemTests {
    [Test]
    public void TakeDamage_ReducesHealth() {
        var health = new HealthSystem(maxHealth: 100);
        health.TakeDamage(30);
        Assert.AreEqual(70, health.Current);
    }

    [Test]
    public void TakeDamage_ToZero_FiresOnDeath() {
        var health = new HealthSystem(maxHealth: 100);
        bool died = false;
        health.OnDeath += () => died = true;
        health.TakeDamage(100);
        Assert.IsTrue(died);
    }
}

--- GREEN ---
public class HealthSystem {
    public int Current { get; private set; }
    public event Action OnDeath;
    public HealthSystem(int maxHealth) => Current = maxHealth;
    public void TakeDamage(int amount) {
        Current = Mathf.Max(0, Current - amount);
        if (Current == 0) OnDeath?.Invoke();
    }
}
```
