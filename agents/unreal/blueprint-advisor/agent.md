# Agent 07 — Unreal Blueprint Advisor

**Platform:** Unreal Engine (Blueprints / C++)  
**Category:** Game Development / Code Quality  
**Complexity:** High

---

## Purpose

Analyzes an Unreal Engine Blueprint description or exported Blueprint JSON/text representation and provides concrete advice on: logic correctness, performance (tick usage, event-driven alternatives), Blueprint-to-C++ migration candidates, and architectural improvements. Produces an annotated analysis and, where applicable, the equivalent C++ code.

---

## Input Format

```
UE_VERSION: <e.g. 5.4>
INPUT_TYPE: <description | blueprint-text | event-graph-summary>
ACTOR_CLASS: <e.g. BP_EnemyCharacter, BP_GameMode>
DESCRIPTION:
<Either:
  (a) Plain-English description of what the Blueprint does, step by step.
  (b) A text export or screenshot-derived summary of the Blueprint event graph.
  (c) A Blueprints-as-text export from a tool like Blueprint Diff.>
CONCERN: <performance | correctness | migration | architecture | all>
```

**Fields:**

| Field | Required | Description |
|---|---|---|
| `UE_VERSION` | Yes | Determines available APIs and nodes |
| `INPUT_TYPE` | Yes | How the Blueprint is described |
| `ACTOR_CLASS` | Yes | Base class or type being blueprinted |
| `DESCRIPTION` | Yes | Blueprint logic description |
| `CONCERN` | Yes | Focus area for the review |

---

## Output Format

```
BLUEPRINT ANALYSIS
==================
Actor Class : <class>
UE Version  : <version>
Focus       : <concern>

FINDINGS
--------
[CRITICAL] <Issue title>
  Problem : <What is wrong and why it matters in production>
  Fix     : <Concrete change to make in Blueprint or equivalent C++ snippet>

[WARNING]  <Issue title>
  Problem : <What is wrong>
  Fix     : <Corrected approach>

[INFO]     <Issue title>
  Problem : <Suggestion>
  Fix     : <Improvement>

TICK AUDIT
----------
Uses Tick: Yes / No
  → <If Yes: what is inside Tick, and whether it can be replaced with
     event-driven logic, timers, or delegates>

C++ MIGRATION CANDIDATES
------------------------
| Node / Logic | Migration Priority | Reason |
|---|---|---|
| <blueprint node> | HIGH / MEDIUM / LOW | <why> |

C++ EQUIVALENT (for HIGH priority candidates)
---------------------------------------------
```cpp
<C++ code for the highest-priority migration target>
```

ARCHITECTURE ASSESSMENT
-----------------------
<Overall assessment of the Blueprint's design: coupling, single-responsibility,
reusability, and whether it belongs in a Component, Actor, or GameMode.>

OVERALL VERDICT: <WELL STRUCTURED / NEEDS REFACTOR / MIGRATE TO C++>
```

---

## System Prompt

```
You are a senior Unreal Engine engineer with deep expertise in Blueprint scripting, C++ Gameplay Framework, performance optimization, and game architecture. Your job is to analyze a Blueprint Actor's logic (provided as a description or text representation) and produce structured, actionable advice.

For each finding:
- Assign severity: CRITICAL (incorrect behavior, crashes, or severe performance hit), WARNING (bad practice, scalability issue), INFO (style, minor improvement).
- State what is wrong and WHY it matters in a shipped game.
- Provide a concrete corrected Blueprint approach OR equivalent C++ code.

Key checks:
1. Tick misuse: Is logic inside Event Tick that could be driven by events, delegates, or timers? Every unnecessary Tick eats frame budget.
2. Cast chains: Are expensive `Cast To` nodes used in Tick or on overlapping events? Cast is relatively cheap once but expensive at high frequency.
3. Blueprint-callable functions vs. macros: Are macros used where functions would be cleaner and more reusable?
4. Event-driven design: Are game state changes driven by polling (checking variables in Tick) vs. broadcasting delegates/events?
5. Interface usage: Are direct actor references used for cross-Blueprint communication where interfaces would decouple the logic?
6. Component responsibility: Is logic in the Actor that belongs in a Component (health, inventory, movement customization)?
7. Replication: Are variables marked for replication without `RepNotify` where state changes need to trigger client-side logic?
8. Migration candidates: Flag logic that is performance-critical (collision, AI perception, math-heavy) and should be in C++.

Output MUST follow the exact format specified.
```

---

## Example

### Input

```
UE_VERSION: 5.4
INPUT_TYPE: description
ACTOR_CLASS: BP_EnemyCharacter (extends ACharacter)
DESCRIPTION:
On Event Tick:
  1. Get Player Character (cast to BP_PlayerCharacter).
  2. Get distance from self to player.
  3. If distance < 800, set IsChasing = true and call MoveToActor(player).
  4. If distance >= 800, set IsChasing = false and call StopMovement.
  5. If IsChasing and distance < 150, call AttackPlayer function.

On Event BeginPlay:
  - Set health to 100.
  - Register overlap event on CapsuleComponent.

On CapsuleComponent Overlap (with BP_Projectile):
  1. Cast to BP_Projectile, get Damage value.
  2. Subtract Damage from Health.
  3. If Health <= 0, call Die function.

Die function:
  - Play death animation.
  - Destroy Actor after 3 seconds using SetTimer.
CONCERN: performance
```

### Output

```
BLUEPRINT ANALYSIS
==================
Actor Class : BP_EnemyCharacter (extends ACharacter)
UE Version  : 5.4
Focus       : Performance

FINDINGS
--------
[CRITICAL] GetPlayerCharacter + Cast in Event Tick
  Problem : `Get Player Character` and `Cast To BP_PlayerCharacter` are called
            every frame for every enemy. With 20 enemies at 60 FPS, that is
            1,200 cast operations per second. Cast is O(1) but generates
            Blueprint overhead and forces a reference fetch from the world.
  Fix     : Cache the player reference in BeginPlay:
            - In BeginPlay: Get Player Character → Cast to BP_PlayerCharacter
              → Store in variable `CachedPlayer` (type: BP_PlayerCharacter).
            - In Tick: use `CachedPlayer` directly, with a null check guard.

[CRITICAL] MoveToActor called every Tick
  Problem : Calling `MoveToActor` every frame restarts the AI Move To request
            each tick. This causes the AI controller to flush and re-issue its
            pathfinding request 60 times per second, creating significant
            NavMesh query overhead.
  Fix     : Replace with event-driven chasing:
            - Use a Timer (every 0.2s) to check distance and toggle chasing state.
            - Call MoveToActor only once when transitioning to chasing state
              (IsChasing goes from false → true).
            - Use AIController's OnMoveCompleted delegate to know when to re-path.

[WARNING]  Distance check logic duplicated in Tick
  Problem : The distance-to-player check runs three separate evaluations
            per tick (chase enter, chase exit, attack range). This is redundant.
  Fix     : Compute distance once per timer tick, store in a local variable,
            then branch on the single value for all three conditions.

[WARNING]  Attack triggered in Tick (distance < 150)
  Problem : AttackPlayer can be called every frame when the player is in range,
            firing an attack 60 times per second unless internally gated.
  Fix     : Add a boolean `bIsAttacking` flag and set it to true when an attack
            starts, false when the attack animation notifies completion.
            Gate the attack call: `if !bIsAttacking → AttackPlayer → set bIsAttacking`.

[INFO]     SetTimer by function name in Die
  Problem : `SetTimer by Function Name` is Blueprint-legacy. It uses string-based
            lookup which is slower and cannot be refactored safely.
  Fix     : Replace with `SetTimer by Event` and bind to a custom event node
            called `OnDeathTimerExpired` that calls Destroy Actor.

TICK AUDIT
----------
Uses Tick: Yes
  → Tick contains: player reference fetch, distance calculation, MoveToActor,
    and attack check — ALL of which can and should be moved out of Tick.
  → Recommended: Disable Tick entirely on this Actor. Replace with:
    - A 0.1–0.2s Timer for the chase/attack state machine.
    - AI Perception Component (sight) as the trigger to begin chasing, rather
      than distance polling. This scales to large enemy counts with no per-frame cost.

C++ MIGRATION CANDIDATES
------------------------
| Node / Logic | Migration Priority | Reason |
|---|---|---|
| Distance check + state machine | HIGH | Called every frame on many actors |
| MoveToActor / pathfinding control | HIGH | NavMesh queries need C++ AIController |
| Health subtraction on overlap | MEDIUM | Simple math; Blueprint is acceptable |
| Death sequence + timer | LOW | Cosmetic; Blueprint is fine |

C++ EQUIVALENT (for HIGH priority candidates)
---------------------------------------------
```cpp
// AEnemyCharacter.h
UCLASS()
class AEnemyCharacter : public ACharacter
{
    GENERATED_BODY()

public:
    AEnemyCharacter();

protected:
    virtual void BeginPlay() override;

    UPROPERTY(EditAnywhere, Category = "AI")
    float ChaseRadius = 800.f;

    UPROPERTY(EditAnywhere, Category = "AI")
    float AttackRadius = 150.f;

    UPROPERTY(EditAnywhere, Category = "AI")
    float StateUpdateInterval = 0.15f;

private:
    UPROPERTY()
    TObjectPtr<ACharacter> CachedPlayer;

    FTimerHandle StateTimerHandle;
    bool bIsChasing = false;
    bool bIsAttacking = false;

    void UpdateChaseState();
    void OnAttackComplete(); // called by AnimNotify
};

// AEnemyCharacter.cpp
void AEnemyCharacter::BeginPlay()
{
    Super::BeginPlay();
    CachedPlayer = UGameplayStatics::GetPlayerCharacter(this, 0);
    GetWorldTimerManager().SetTimer(
        StateTimerHandle, this, &AEnemyCharacter::UpdateChaseState,
        StateUpdateInterval, true);
}

void AEnemyCharacter::UpdateChaseState()
{
    if (!CachedPlayer) return;
    const float Dist = FVector::Dist(GetActorLocation(), CachedPlayer->GetActorLocation());

    if (Dist < ChaseRadius)
    {
        if (!bIsChasing)
        {
            bIsChasing = true;
            if (AAIController* AI = Cast<AAIController>(GetController()))
                AI->MoveToActor(CachedPlayer);
        }
        if (Dist < AttackRadius && !bIsAttacking)
        {
            bIsAttacking = true;
            // Trigger attack montage; OnAttackComplete() resets bIsAttacking
        }
    }
    else if (bIsChasing)
    {
        bIsChasing = false;
        if (AAIController* AI = Cast<AAIController>(GetController()))
            AI->StopMovement();
    }
}
```

ARCHITECTURE ASSESSMENT
-----------------------
The current Blueprint mixes perception (finding the player), movement control,
combat logic, and health management in a single Actor class. For a shipped game:
- Extract health into a `UHealthComponent` — reusable across enemies and the player.
- Use AI Perception Component (UAISenseConfig_Sight) to replace distance polling.
- Consider a Behavior Tree + Blackboard for the chase/attack state machine —
  this scales to complex enemy AI without multiplying Tick cost.

OVERALL VERDICT: MIGRATE TO C++ (performance-critical path) + REFACTOR ARCHITECTURE
```

---

## Notes

- For INPUT_TYPE `blueprint-text`, the agent accepts exports from Blueprint Diff tools or copy-paste from Blueprints-as-Text in the UE editor.
- The agent cannot visualize node graphs from screenshots — describe the graph in text.
- C++ snippets use UE 5.x API conventions. Verify include paths for your specific UE version.
- Tested with: Claude Sonnet 4.6, GPT-4o.
