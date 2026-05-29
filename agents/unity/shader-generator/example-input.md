# Example Input — Unity Shader Generator

---

```
UNITY_VERSION: 6000.0
RENDER_PIPELINE: urp
SHADER_TYPE: unlit
TARGET_PLATFORM: mobile
DESCRIPTION:
A holographic scanline effect for a UI panel. The panel should have a semi-transparent
dark blue tint with horizontal scanlines scrolling upward over time. The scanline
frequency and scroll speed should be tweakable. A subtle edge glow (brighter at the
top and bottom edges of the mesh) should be included. No lighting needed.
Mobile-friendly: ≤2 texture samples, half precision throughout.
```

---

## What to Expect

The agent produces a complete URP unlit `.shader` file. See [`example-output.md`](example-output.md).

Generated file includes:
- `_TintColor`, `_ScanlineFreq`, `_ScanlineSpeed`, `_ScanlineBright`, `_EdgeGlow`, `_EdgeFalloff` properties
- URP `HLSLPROGRAM` with correct includes
- `sin(_Time.y)` for the scanline scroll — no C# scripts needed
- `half` precision throughout for mobile GPU compatibility
- Blend mode: `SrcAlpha OneMinusSrcAlpha` for transparency
- Material setup guide

---

## Variations

### Rim / Fresnel glow (character outline)
```
UNITY_VERSION: 6000.0
RENDER_PIPELINE: urp
SHADER_TYPE: lit
TARGET_PLATFORM: desktop
DESCRIPTION:
A rim light / Fresnel glow for a sci-fi character. The character glows at silhouette edges
where the surface normal faces away from the camera. The glow color and sharpness should
be tweakable. The base albedo texture should show through. Needs to respond to scene lighting.
```

### Dissolve effect
```
UNITY_VERSION: 6000.0
RENDER_PIPELINE: urp
SHADER_TYPE: unlit
TARGET_PLATFORM: mobile
DESCRIPTION:
A dissolve effect using a noise texture. A threshold property controls how much of the
surface is dissolved. Edges of the dissolve should glow with a configurable color and width.
Uses clip() to discard dissolved fragments. One texture sample for the noise.
```

### Water surface
```
UNITY_VERSION: 6000.0
RENDER_PIPELINE: urp
SHADER_TYPE: lit
TARGET_PLATFORM: desktop
DESCRIPTION:
A stylized water surface with two scrolling normal maps for wave detail, Fresnel reflection
at grazing angles, foam at the shoreline (using a depth texture), and an adjustable water
color. Should respond to directional light.
```
