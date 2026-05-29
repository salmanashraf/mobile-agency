# Prompt — Game Object / Actor Architecture

**Platform:** Unity / Unreal Engine  
**Category:** Game Development  
**Type:** one-shot

---

## Purpose

Designs a component-based architecture for a game entity — recommending which behaviors to put in which components, how components communicate, and how to keep the entity testable and extensible.

---

## Prompt

```
You are a senior game engineer. Design the component architecture for the game entity described below.

Output:
1. COMPONENT LIST — what components the entity should have and what each is responsible for.
2. COMMUNICATION PATTERN — how components talk to each other (events, delegates, direct reference, ScriptableObject/DataAsset).
3. DATA FLOW — what data lives where (health on HealthComponent, not on the Actor/GameObject root).
4. INHERITANCE vs COMPOSITION — recommend composition where possible; flag if inheritance is justified.
5. PSEUDO-CODE or real Unity C# / Unreal C++ snippets for the key interfaces and component skeletons.
6. ANTI-PATTERNS to avoid for this entity type.

Engine: [Unity / Unreal Engine]
Entity type: [e.g. Enemy character, Player character, Interactable pickup, Vehicle, Projectile]
Behaviors needed: [list the behaviors this entity must have]
```

---

## Example Usage

**What you paste:**
```
Engine: Unity
Entity type: Enemy character (melee AI)
Behaviors needed:
- Health (take damage, die, regenerate slowly)
- Movement (patrol between waypoints, chase player when in range)
- Attack (melee swing with hitbox, cooldown)
- Visual feedback (flash red on hit, ragdoll on death)
- Loot drop on death
- Sound (footsteps, attack grunt, death cry)
```

**Expected output:**
```
COMPONENT ARCHITECTURE: MeleeEnemy

COMPONENT LIST
--------------
EnemyRoot (GameObject)
├── HealthComponent          — current HP, max HP, regen rate; raises OnDamaged/OnDied events
├── AIMovementController     — NavMeshAgent wrapper; states: Patrol, Chase, Attack
├── PatrolBehavior           — waypoint list, movement requests to AIMovementController
├── ChaseBehavior            — detects player (SphereOverlap), triggers chase on AIMovementController
├── MeleeAttackBehavior      — manages attack cooldown, enables hitbox collider, plays animation
├── HitboxController         — child trigger collider; fires OnHit(target) when overlapping
├── HitFeedback              — subscribes to HealthComponent.OnDamaged, flashes material
├── DeathHandler             — subscribes to HealthComponent.OnDied, triggers ragdoll + loot drop
├── LootDropper              — spawns loot prefabs at death position (data-driven via ScriptableObject)
└── AudioController          — subscribes to movement/attack/death events, plays clips

COMMUNICATION PATTERN
---------------------
Components communicate via C# events (not direct references) to stay decoupled:

// HealthComponent.cs
public event Action<float, float> OnDamaged;  // (currentHp, maxHp)
public event Action OnDied;

// HitFeedback subscribes:
healthComponent.OnDamaged += (curr, max) => StartCoroutine(FlashRed());
healthComponent.OnDied += StartRagdoll;

// HitboxController.cs
public event Action<Collider> OnHit;
// MeleeAttackBehavior subscribes:
hitbox.OnHit += (col) => { if (col.TryGetComponent<HealthComponent>(out var h)) h.TakeDamage(damage); };

DATA FLOW
---------
- Health data: HealthComponent only
- Movement speed, patrol radius: AIMovementController (or EnemyDataSO)
- Attack damage, range, cooldown: MeleeAttackBehavior (or EnemyDataSO)
- Loot table: LootTableSO (ScriptableObject) referenced by LootDropper — data-driven
- Audio clips: AudioClipsSO (ScriptableObject) referenced by AudioController

COMPOSITION vs INHERITANCE
---------------------------
Use: composition for all the above (no EnemyBase class hierarchy)
Justified inheritance: EnemyRoot extends MonoBehaviour only — no deep enemy hierarchy.
Anti-pattern to avoid: a single EnemyController.cs with 500 lines handling everything.

COMPONENT SKELETONS
-------------------
// HealthComponent.cs
public class HealthComponent : MonoBehaviour
{
    [SerializeField] private float maxHp = 100f;
    [SerializeField] private float regenRate = 2f;

    private float _currentHp;
    public event Action<float, float> OnDamaged;
    public event Action OnDied;

    private void Awake() => _currentHp = maxHp;

    public void TakeDamage(float amount)
    {
        _currentHp = Mathf.Max(0, _currentHp - amount);
        OnDamaged?.Invoke(_currentHp, maxHp);
        if (_currentHp <= 0) OnDied?.Invoke();
    }
}

ANTI-PATTERNS TO AVOID
-----------------------
- God object: putting patrol + chase + attack + health + audio in one script
- GetComponent in Update: cache all component references in Awake/Start
- Direct field access across components: use events or interfaces, not enemy.health.currentHp
- Hardcoded waypoints: use a PatrolRoute ScriptableObject or child Transform markers
```

---

## Variations

- **Unreal Engine:** Add "Use Unreal C++ with UActorComponent classes and delegate-based communication."
- **Data-driven:** Add "All numeric values (HP, damage, speed) should be in a DataAsset / ScriptableObject so designers can tune without code changes."
