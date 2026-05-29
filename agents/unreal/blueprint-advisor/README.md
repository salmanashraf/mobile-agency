# Unreal Blueprint Advisor Agent

> Describe your Blueprint logic. Get a structured analysis of Tick usage, Cast chains, event-driven alternatives, C++ migration candidates, and the equivalent C++ code for high-priority items.

---

## What This Agent Does

Analyzes Unreal Engine Blueprint logic (from a text description or Blueprint-as-text export) and returns:

- **Tick audit** — what runs in Event Tick and whether it can be replaced with timers, delegates, or AI Perception
- **C++ migration candidates** — which Blueprint nodes are performance-critical and should move to C++, ranked HIGH/MEDIUM/LOW
- **C++ equivalent** — complete header + implementation for the highest-priority migration targets
- **Architecture assessment** — coupling, single-responsibility, component separation recommendations
- **Findings** — CRITICAL / WARNING / INFO per issue with a concrete Blueprint or C++ fix

---

## Files

| File | Purpose |
|---|---|
| [`agent.md`](agent.md) | Input format, output format, full system prompt |
| [`example-input.md`](example-input.md) | Enemy AI Blueprint with Tick-based chase logic |
| [`example-output.md`](example-output.md) | Full analysis with C++ migration code |

---

## Quick Start

```
UE_VERSION: 5.4
INPUT_TYPE: description
ACTOR_CLASS: BP_EnemyCharacter extends ACharacter
DESCRIPTION:
[step-by-step description of the Blueprint event graph]
CONCERN: performance
```

---

## Input Types

| `INPUT_TYPE` | What to Provide |
|---|---|
| `description` | Step-by-step description of what each Blueprint node does |
| `blueprint-text` | Output from Blueprint Diff tool or "Blueprints as Text" export |
| `event-graph-summary` | Screenshot-derived summary of node connections |

---

## Output Preview

```
[CRITICAL] GetPlayerCharacter + Cast in Event Tick
  Problem : Cast To + GetPlayerCharacter called 60× per second per enemy.
            With 20 enemies = 1,200 cast operations/second.
  Fix     : Cache in BeginPlay: CachedPlayer = Cast<APlayerCharacter>(GetPlayerCharacter())

[HIGH] MoveToActor called every Tick
  Problem : Restarts the pathfinding request 60 times per second.
  Fix     : Call MoveToActor ONCE when chasing state begins; re-path only on OnMoveCompleted.
```

---

## Related Agents

- [`agents/unity/shader-generator`](../../unity/shader-generator/) — Unity equivalent for GPU effects
- `prompts/game-dev/blueprint-to-cpp.md` — quick one-shot Blueprint → C++ conversion
- `prompts/game-dev/game-object-architecture.md` — component architecture design
