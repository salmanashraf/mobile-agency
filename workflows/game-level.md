# Workflow — Game Level (Unity / Unreal)

**Type:** Game development
**Agents Used:** FORGE / UNREAL, PERF
**Skills Used:** /shader-gen, /game-perf, /unity-tdd or /blueprint-to-cpp

---

## When to Use

Designing, implementing, and optimizing a new game level or major game feature.

---

## Steps

```
1. ARCHITECTURE — FORGE / UNREAL
   ↓ Review the level design document against engine capabilities.
   ↓ Identify: which systems are affected (physics, AI, rendering, audio)?
   ↓ Flag any design element that will blow the frame budget on target hardware.
   ↓ Recommend architecture: which logic belongs in C++ vs Blueprint vs ScriptableObject.

2. VISUAL EFFECTS — /shader-gen
   ↓ Generate HLSL/ShaderLab shaders for any described visual effects.
   ↓ Request mobile-optimized variants for mobile targets.
   ↓ Note instruction count and mobile compatibility.

3. FRAME BUDGET — /game-perf
   ↓ Set the frame budget before implementation starts:
     - Draw call budget for the level
     - Polygon budget for hero vs background assets
     - Texture memory budget
     - Physics object limit
   ↓ Allocate budget to level elements: environment, characters, particles, UI.

4. IMPLEMENTATION — FORGE / UNREAL
   ↓ Implement game systems in C++ where performance requires it.
   ↓ Blueprint for designer-owned logic and rapid iteration.
   ↓ /blueprint-to-cpp for any Blueprint logic called in Tick.

5. TESTS — /unity-tdd or /blueprint-to-cpp
   ↓ EditMode tests for game logic (health, scoring, AI state machine).
   ↓ PlayMode tests for runtime behavior (collision, triggers, win conditions).

6. VALIDATE — PERF
   ↓ Profile the level on the lowest target device spec.
   ↓ Confirm frame rate at the most complex scene point (most particles, enemies, lights).
   ↓ Memory: no texture streaming hitches, no GC spikes during gameplay.

7. PLAYTEST READY
   ↓ Level loads in < 5 seconds on target hardware.
   ↓ Stable 30fps (mobile) or 60fps (PC/console) throughout.
   ↓ No physics glitches or rendering artifacts.
```

---

## Inputs

- Level design document (layout, objectives, visual style)
- Target platform specs (GPU, RAM, target frame rate)
- Engine version and render pipeline

---

## Outputs

- Level implementation with documented frame budget
- Custom shaders for visual effects
- Game logic unit tests
- Performance validation report
