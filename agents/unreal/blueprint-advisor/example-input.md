# Example Input — Unreal Blueprint Advisor

---

```
UE_VERSION: 5.4
INPUT_TYPE: description
ACTOR_CLASS: BP_EnemyCharacter (extends ACharacter)
CONCERN: performance
DESCRIPTION:
On Event Tick:
  1. Get Player Character → Cast To BP_PlayerCharacter.
  2. Calculate distance from self to player (VectorLength of subtracted locations).
  3. If distance < 800, set IsChasing = true and call MoveToActor(player).
  4. If distance >= 800, set IsChasing = false and call StopMovement.
  5. If IsChasing is true AND distance < 150, call AttackPlayer custom function.

On Event BeginPlay:
  - Set Health = 100.
  - Register OnComponentBeginOverlap on CapsuleComponent.

On CapsuleComponent Overlap (with AnyActor):
  1. Cast to BP_Projectile, get Damage value.
  2. Subtract Damage from Health.
  3. If Health <= 0, call Die function.

Die (custom function):
  - Play death montage.
  - Set timer by function name "DestroySelf" with 3.0 second delay.
  - DestroySelf calls DestroyActor.
```

---

## What to Expect

The agent identifies five issues across two severity levels and produces C++ migration code for the two HIGH-priority items. See [`example-output.md`](example-output.md).

**Issue map:**
1. `GetPlayerCharacter + Cast` in Event Tick — CRITICAL (1,200+ operations/second with 20 enemies)
2. `MoveToActor` called every Tick — CRITICAL (restarts pathfinding 60× per second)
3. Attack check in Tick — WARNING (needs a gate to prevent 60 attacks/second)
4. `SetTimer by Function Name` — INFO (legacy string-based API, prefer SetTimer by Event)
5. No component separation (health, damage, AI state all in root Actor) — WARNING

---

## Variations

### Pickup Actor
```
UE_VERSION: 5.4
INPUT_TYPE: description
ACTOR_CLASS: BP_Pickup extends AActor
CONCERN: architecture
DESCRIPTION:
On BeginPlay: set a rotating timer every 0.05 seconds that adds 2 degrees of Z rotation.
On ActorBeginOverlap with Pawn: Cast to BP_PlayerCharacter, call AddCoins(10),
play a SoundCue, destroy self after a SetTimer delay of 0.1 seconds.
```

### Vehicle controller
```
UE_VERSION: 5.4
INPUT_TYPE: description
ACTOR_CLASS: BP_VehicleController extends AWheeledVehiclePawn
CONCERN: all
DESCRIPTION:
On Event Tick: read Axis input for throttle and steering using GetInputAxisValue.
Apply throttle with SetThrottleInput. Apply steering with SetSteeringInput.
If speed > 100, enable boost by increasing max engine torque.
Check if player is pressing Handbrake with IsInputKeyDown each tick.
```
