# Example Output — Unreal Blueprint Advisor

Full agent response to the input in [`example-input.md`](example-input.md).

---

```
BLUEPRINT ANALYSIS
==================
Actor Class : BP_EnemyCharacter (extends ACharacter)
UE Version  : 5.4
Focus       : Performance

FINDINGS
--------

[CRITICAL] GetPlayerCharacter + Cast To in Event Tick
  Problem : GetPlayerCharacter() + Cast To BP_PlayerCharacter run every frame for every
            enemy. With 20 enemies at 60 FPS = 1,200 cast operations per second.
            Blueprints have overhead per node execution. Cast is O(1) but the Blueprint
            VM cost of evaluating both nodes inside a Tick that runs 1,200×/second is
            significant and scales linearly with enemy count.
  Fix     : Cache in BeginPlay:
            - In BeginPlay: GetPlayerCharacter → Cast To BP_PlayerCharacter →
              Store result in variable CachedPlayer (type: BP_PlayerCharacter object ref)
            - In Tick: use CachedPlayer directly, with a null check before access.

[CRITICAL] MoveToActor called every Tick
  Problem : Calling MoveToActor every frame cancels and re-issues the AI Move To request
            60 times per second. Each call flushes the current pathfinding request and
            starts a new one — this causes the NavigationMesh to be queried every frame,
            creating significant NavMesh overhead that grows with enemy count.
  Fix     : Replace Tick-based movement with event-driven chasing:
            - Add a float variable ChaseUpdateRate = 0.15
            - In BeginPlay: SetTimer by Event → call UpdateChaseState every 0.15 seconds
            - In UpdateChaseState: compute distance, compare to radius, toggle IsChasing
            - Call MoveToActor ONCE when IsChasing transitions false → true
            - Bind to AIController OnMoveCompleted to know when to re-path

[WARNING]  AttackPlayer called every Tick when in range (60 attacks/second)
  Problem : `If IsChasing AND distance < 150 → AttackPlayer` fires every frame the player
            is in melee range. Unless AttackPlayer internally gates on an animation state,
            this fires the attack 60 times per second.
  Fix     : Add a boolean bIsAttacking = false.
            AttackPlayer: if !bIsAttacking → set bIsAttacking = true → play attack montage
            Attack montage AnimNotify at end of swing → set bIsAttacking = false
            Gate: only call AttackPlayer when NOT bIsAttacking.

[WARNING]  No component separation (health, damage, AI state all in root Actor)
  Problem : Health, damage handling, and AI movement state all live in BP_EnemyCharacter.
            For a shipped game this does not scale: health can't be reused on the player,
            projectile interactions can't be tested independently, and the class grows
            unbounded.
  Fix     : Extract to components:
            - BP_HealthComponent: Health, TakeDamage, OnDied event dispatcher
            - BP_AIStateComponent: IsChasing, chase/attack state machine
            CapsuleComponent overlap → calls HealthComponent.TakeDamage(damage)
            HealthComponent broadcasts OnDied → Die function listens and responds.

[INFO]     SetTimer by Function Name (Die → "DestroySelf")
  Problem : SetTimer by Function Name uses string-based lookup, which is slower than
            delegate-based timers and cannot be safely refactored (rename the function
            and the timer silently stops working).
  Fix     : Replace with SetTimer by Event:
            Create a Custom Event called OnDeathTimerExpired.
            SetTimer by Event → bind to OnDeathTimerExpired → call DestroyActor.

TICK AUDIT
----------
Uses Tick: Yes
  → Tick contains: player fetch + cast, distance calc, MoveToActor, attack check.
    ALL of this should leave Tick.
  Recommended final Tick state: DISABLED ENTIRELY on BP_EnemyCharacter.
  Replace with:
    - 0.15s looping timer for chase/attack state machine (CPU cost: negligible)
    - AI Perception Component with Sight config (triggered only when player enters range)
    - AIController OnMoveCompleted delegate for re-pathing

C++ MIGRATION CANDIDATES
------------------------
| Node / Logic | Priority | Reason |
|---|---|---|
| Distance check + state machine | HIGH | Called every frame on many actors — timer helps but C++ is cheaper |
| MoveToActor / NavMesh pathfinding | HIGH | NavMesh API is C++ only for full control; Blueprint wrapper has overhead |
| Health + damage calculation | MEDIUM | Math is trivial; Blueprint is acceptable for ≤20 enemies |
| Death sequence + timer | LOW | Cosmetic; Blueprint is fine |
| SetTimer by Function Name | LOW | Replace with SetTimer by Event in Blueprint |

C++ EQUIVALENT (HIGH priority items)
-------------------------------------

// AEnemyCharacter.h
#pragma once
#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "EnemyCharacter.generated.h"

UCLASS()
class MYGAME_API AEnemyCharacter : public ACharacter
{
    GENERATED_BODY()

public:
    AEnemyCharacter();

protected:
    virtual void BeginPlay() override;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "AI")
    float ChaseRadius = 800.f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "AI")
    float AttackRadius = 150.f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "AI")
    float StateUpdateInterval = 0.15f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Combat")
    float Health = 100.f;

private:
    UPROPERTY()
    TObjectPtr<ACharacter> CachedPlayer;

    FTimerHandle StateTimerHandle;
    bool bIsChasing   = false;
    bool bIsAttacking = false;

    UFUNCTION()
    void UpdateChaseState();

    // Called by AnimNotify at the end of the attack montage
    UFUNCTION(BlueprintCallable)
    void OnAttackComplete();
};

// AEnemyCharacter.cpp
#include "EnemyCharacter.h"
#include "Kismet/GameplayStatics.h"
#include "AIController.h"

AEnemyCharacter::AEnemyCharacter()
{
    // Disable Tick entirely — all updates are timer-driven
    PrimaryActorTick.bCanEverTick = false;
}

void AEnemyCharacter::BeginPlay()
{
    Super::BeginPlay();

    // Cache once — no Cast To in a hot loop
    CachedPlayer = Cast<ACharacter>(UGameplayStatics::GetPlayerCharacter(this, 0));

    // Replace Tick with a low-frequency state machine timer
    GetWorldTimerManager().SetTimer(
        StateTimerHandle,
        this,
        &AEnemyCharacter::UpdateChaseState,
        StateUpdateInterval,
        true   // looping
    );
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
            // MoveToActor called ONCE when transitioning into chase — not every tick
            if (AAIController* AI = Cast<AAIController>(GetController()))
            {
                AI->MoveToActor(CachedPlayer, AttackRadius * 0.9f);
            }
        }

        // Attack gate: only trigger when in range AND not already attacking
        if (Dist < AttackRadius && !bIsAttacking)
        {
            bIsAttacking = true;
            // Play montage here; OnAttackComplete() resets bIsAttacking via AnimNotify
        }
    }
    else if (bIsChasing)
    {
        bIsChasing = false;
        if (AAIController* AI = Cast<AAIController>(GetController()))
        {
            AI->StopMovement();
        }
    }
}

void AEnemyCharacter::OnAttackComplete()
{
    bIsAttacking = false;
}

ARCHITECTURE ASSESSMENT
-----------------------
BP_EnemyCharacter currently mixes: player perception (detecting the player), movement
control, combat logic, health management, and death handling in a single Actor class.
For shipped games:
- Extract health into UHealthComponent — call TakeDamage on it from the overlap handler
- Use AI Perception Component (UAISenseConfig_Sight) to replace distance polling — this
  scales to 200 enemies with no per-frame cost (perception runs on a budget)
- Consider Behavior Tree + Blackboard for the state machine — this cleanly separates
  the chase/attack logic from the Actor and is designer-editable without code changes

OVERALL VERDICT: MIGRATE TO C++ (for chase state machine) + REFACTOR ARCHITECTURE
```
