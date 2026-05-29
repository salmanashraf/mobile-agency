# Unity Shader Generator Agent

> Describe a visual effect in plain English. Get a complete, compilable Unity `.shader` file — for URP, HDRP, or Built-in — with a Properties block, vertex/fragment stages, and a material setup guide.

---

## What This Agent Does

Generates a complete Unity ShaderLab `.shader` file from a visual description:

- Selects the correct render pipeline (URP: `HLSLPROGRAM` + URP includes; Built-in: `CGPROGRAM` + `UnityCG.cginc`; HDRP: HDRP ShaderLibrary)
- Exposes all tweakable values as Material `Properties`
- Applies mobile optimization rules when `TARGET: mobile` is specified (≤2 texture samples per fragment, `half` precision, no dynamic branching)
- Uses `_Time.y` for time-based animation — never C# `Time.deltaTime`
- Provides a step-by-step **Material Setup** guide for the Inspector

---

## Files

| File | Purpose |
|---|---|
| [`agent.md`](agent.md) | Input format, output format, full system prompt |
| [`example-input.md`](example-input.md) | Holographic scanline effect description |
| [`example-output.md`](example-output.md) | Complete URP `.shader` file |

---

## Quick Start

```
UNITY_VERSION: 6000.0
RENDER_PIPELINE: urp
SHADER_TYPE: unlit
TARGET_PLATFORM: mobile
DESCRIPTION:
[describe the visual effect]
```

---

## Output Format

````
SHADER: <Name>
FILE: <Shaders/Name.shader>
RENDER_PIPELINE: <pipeline>
MOBILE_FRIENDLY: Yes / No

```hlsl
<full .shader file>
```

PROPERTIES REFERENCE:
MATERIAL SETUP:
PERFORMANCE NOTES:
KNOWN LIMITATIONS:
````

---

## Supported Shader Types

| Type | When to Use |
|---|---|
| `unlit` | UI effects, holograms, VFX, any effect that doesn't need lighting |
| `lit` | PBR surfaces, characters, props that respond to scene lighting |
| `surface` | Built-in pipeline only; abstracts lighting boilerplate |
| `post-process` | Screen-space effects (bloom, color grade, dissolve) |

---

## Related Agents

- [`agents/unreal/blueprint-advisor`](../../unreal/blueprint-advisor/) — UE equivalent for materials and Blueprint logic
- `skills/unity/shader-review.md` — review an existing shader for mobile budget issues
- `prompts/game-dev/shader-from-reference.md` — quick one-shot shader from a visual reference
