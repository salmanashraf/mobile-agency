# Skill — /blueprint-to-cpp

**Platform:** Unreal Engine
**Slash Command:** `/blueprint-to-cpp`
**Composable With:** agents/gaming/unreal/agent.md

---

## Purpose

Converts Unreal Engine Blueprint logic to performant, idiomatic C++ with full explanation of why each node maps to each C++ construct.

---

## Skill Prompt

```
Migrate the provided Unreal Blueprint logic to C++:

MIGRATION RULES:
1. Identify Blueprint patterns that must move to C++ first:
   - Logic called in Tick (every frame) → C++ mandatory.
   - Math-heavy calculations (vector ops, lerps in loops) → C++ mandatory.
   - Logic called > 10 times per second → strong candidate for C++.
   - Event dispatchers with many subscribers → C++ delegates.
   - Pure functions used in many places → static C++ utility function.

2. Blueprint node → C++ mapping:
   - Get Player Character → APlayerController::GetPawn() or Cast<>
   - Branch → if/else or ternary
   - For Each Loop → for (const auto& Item : Collection)
   - Cast To → Cast<TargetType>(Object) with null check
   - Delay → FTimerHandle + GetWorldTimerManager().SetTimer()
   - Timeline → UCurveFloat + FTimeline
   - Print String → UE_LOG(LogTemp, Log, TEXT("...")) — remove before ship
   - Get All Actors Of Class → GetWorld()->GetAllActorsOfClass() — cache in BeginPlay
   - Spawn Actor → GetWorld()->SpawnActor<AMyActor>(Class, Transform)
   - Set Timer by Event → GetWorldTimerManager().SetTimer()

3. UPROPERTY annotations for Blueprint exposure:
   - BlueprintReadWrite → editable in BP and C++
   - BlueprintReadOnly → read in BP, set in C++
   - EditAnywhere, Category = "Config" → exposed in Details panel

4. Output format per migrated function:
   - Header declaration (.h)
   - Implementation (.cpp)
   - Explanation of why this moved to C++

Show the Blueprint pseudocode description alongside the C++ implementation.
```
