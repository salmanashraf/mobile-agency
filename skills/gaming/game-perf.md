# Skill — /game-perf

**Platform:** Unity / Unreal
**Slash Command:** `/game-perf`
**Composable With:** agents/gaming/forge/agent.md, agents/gaming/unreal/agent.md

---

## Purpose

Frame budget audit for game scenes. Identifies draw call sources, GC allocation hotspots, physics overhead, and shader complexity. Produces a prioritized optimization plan.

---

## Skill Prompt

```
Audit the provided game code or scene description for frame budget issues:

FRAME BUDGET REFERENCE:
- Mobile 60fps: 16.67ms total per frame
- CPU budget: ~8ms for game logic + physics
- GPU budget: ~6ms for rendering
- Rendering budget per call: 0.01–0.1ms on mobile

DRAW CALL ANALYSIS:
- Count unique materials (each unique material = potential draw call break).
- Dynamic vs static batching eligibility:
  Static: non-moving objects with same material → enable static batching.
  Dynamic: moving objects < 900 vertices, same material → Unity handles automatically.
- GPU Instancing: many identical meshes (trees, grass, enemies) → enable GPU Instancing on material.
- Atlas textures: multiple small textures → combine into texture atlas to reduce draw calls.

GC ALLOCATION AUDIT (Unity C#):
- foreach on List<T>: use for loop (foreach boxes the enumerator on older Unity versions).
- String operations in Update: build strings in Start or cache with StringBuilder.
- new MyStruct() in hot path: use object pools (ObjectPool<T> in Unity 2021+).
- LINQ in Update: pre-compute and cache results.
- GetComponent in Update: cache in Awake.

PHYSICS OPTIMIZATION:
- Layer collision matrix: disable collision between layers that never interact.
- Rigidbody Sleep: set rigidbodies to sleep when idle (Rigidbody.IsSleeping()).
- Collider complexity: use primitive colliders (Box, Sphere, Capsule) over MeshCollider.
- FixedUpdate rate: default 0.02 (50fps). Increase for smoother physics; decrease for performance.

RENDERING OPTIMIZATION:
- Shadow casters: disable shadows on small/distant objects.
- LOD groups: add LODGroup to complex meshes.
- Occlusion culling: bake occlusion for enclosed spaces.
- Shader complexity: mobile shaders should be < 30 instructions per pixel.

Output a prioritized list with estimated frame time saved per optimization.
```
