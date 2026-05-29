# Unity Skills

Reusable skill prompt modules for Unity (HLSL / ShaderLab / URP / HDRP) shader review and game development.

## Index

| Skill | File | When to Use |
|---|---|---|
| Unity Shader Review | [shader-review.md](shader-review.md) | Pre-submission mobile shader audit — texture budget, precision, render pipeline correctness |

## Usage

```
# Review a shader before committing to a mobile build
[paste skill prompt from shader-review.md]

Review this shader: [paste .shader file content]
```

## Composable With

- [`agents/unity/shader-generator`](../../agents/unity/shader-generator/) — generate shaders that already follow these rules

## Contributing

High-value skills to add:
- `unity-c-sharp-patterns.md` — MonoBehaviour patterns, coroutine safety, `Update` vs `FixedUpdate`
- `mobile-performance.md` — draw call budget, batching, texture atlas, LOD
- `addressables.md` — Addressable Asset System patterns for mobile memory management

Copy `templates/skill-template.md`.
