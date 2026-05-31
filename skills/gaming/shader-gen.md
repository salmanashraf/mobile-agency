# Skill — /shader-gen

**Platform:** Unity (HLSL / ShaderLab) / Unreal (HLSL)
**Slash Command:** `/shader-gen`
**Composable With:** agents/gaming/forge/agent.md, agents/gaming/unreal/agent.md

---

## Purpose

Generates HLSL/ShaderLab shader code from a plain English visual description. Covers URP, HDRP, and Built-in pipeline for Unity; material expressions for Unreal.

---

## Skill Prompt

```
Generate shader code for the described visual effect:

INPUT FORMAT:
PLATFORM: <Unity-URP | Unity-HDRP | Unity-BuiltIn | Unreal>
EFFECT: <plain English description of the visual effect>
PERFORMANCE_TARGET: <Mobile | PC | Console>
PROPERTIES_NEEDED: <list any tweakable properties — colors, speeds, intensities>

GENERATION RULES:
1. Minimize instruction count for mobile targets.
2. Avoid dynamic branching (if/else in shader) on mobile — use step(), lerp(), saturate().
3. Include fallback for mobile limitations (no geometry shaders on OpenGL ES 2.0).
4. Expose meaningful properties to the Material Inspector via Properties block.
5. Add ShaderLab properties with [HDR] for emissive colors, [Toggle] for booleans.

EFFECT PATTERNS:
- Dissolve effect: use noise texture + cutoff threshold + clip().
- Hologram: scanline UV offset + rim lighting + fresnel term.
- Water ripple: sin-based UV distortion + normal map.
- Outline: render back faces scaled along normal in separate pass.
- Glow/bloom: emissive color with HDR intensity > 1.
- Toon/cel shading: step() on diffuse lighting term.
- Fresnel rim light: pow(1 - dot(viewDir, normal), power) * rimColor.

Output complete ShaderLab (.shader) file or HLSL material function.
Note instruction count estimate and mobile compatibility.
```
