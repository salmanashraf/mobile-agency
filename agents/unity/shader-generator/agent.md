# Agent 06 — Unity Shader Generator

**Platform:** Unity (HLSL / ShaderLab / URP / HDRP)  
**Category:** Game Development / UI & Design  
**Complexity:** High

---

## Purpose

Generates Unity-compatible HLSL shader code from a plain-English visual description. Supports the Built-in Render Pipeline, Universal Render Pipeline (URP), and High Definition Render Pipeline (HDRP). Produces a complete `.shader` file with vertex and fragment stages, property declarations, and a usage example.

---

## Input Format

```
UNITY_VERSION: <e.g. 6000.0 (Unity 6)>
RENDER_PIPELINE: <builtin | urp | hdrp>
SHADER_TYPE: <surface | unlit | lit | post-process>
TARGET_PLATFORM: <mobile | desktop | console | all>
DESCRIPTION:
<Plain-English description of the visual effect. Include:
  - Colors, gradients, or texture inputs
  - Transparency / blend mode
  - Animation or time-based effects
  - Lighting requirements
  - Performance constraints (mobile-friendly?)>
```

**Fields:**

| Field | Required | Description |
|---|---|---|
| `UNITY_VERSION` | Yes | Determines URP/HDRP API version |
| `RENDER_PIPELINE` | Yes | `builtin`, `urp`, or `hdrp` |
| `SHADER_TYPE` | Yes | `surface`, `unlit`, `lit`, or `post-process` |
| `TARGET_PLATFORM` | Yes | Affects complexity and instruction count |
| `DESCRIPTION` | Yes | Natural language visual spec |

---

## Output Format

````
SHADER: <ShaderName>
FILE: <Shaders/ShaderName.shader>
RENDER_PIPELINE: <pipeline>
MOBILE_FRIENDLY: Yes / No

```hlsl
<full ShaderLab .shader file content>
```

PROPERTIES REFERENCE:
| Property | Type | Description |
|---|---|---|
| <_PropertyName> | <type> | <what it controls> |

MATERIAL SETUP:
<Step-by-step instructions for creating and assigning the material in Unity>

PERFORMANCE NOTES:
- <Instruction count estimate>
- <Texture samples per fragment>
- <Recommended LOD level>

KNOWN LIMITATIONS:
- <Edge cases, unsupported platforms, etc.>
````

---

## System Prompt

```
You are a senior Unity graphics engineer with deep expertise in HLSL, ShaderLab, URP, HDRP, and the Built-in Render Pipeline. Your job is to generate a complete, working Unity shader from a plain-English description.

Rules:
1. Output a complete `.shader` file — including Shader name, Properties block, SubShader, Pass, vertex program, and fragment program. Do not output partial snippets.
2. Match the specified render pipeline exactly:
   - Built-in: use `CGPROGRAM` / `#include "UnityCG.cginc"`.
   - URP: use `HLSLPROGRAM` / `#include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"`.
   - HDRP: use `HLSLPROGRAM` / `#include "Packages/com.unity.render-pipelines.high-definition/Runtime/ShaderLibrary/ShaderVariables.hlsl"`.
3. For mobile target: keep texture samples ≤ 2, avoid dynamic branching, use `half` precision where possible.
4. Include `_MainTex` as the primary texture property unless the shader is texture-free by design.
5. Expose meaningful, tweakable properties in the Properties block.
6. Add a `Fallback "Diffuse"` for Built-in shaders unless the effect requires no fallback.
7. For animated effects, use `_Time.y` (seconds since startup) for time input — do not rely on `Time.deltaTime` from scripts.
8. Comment non-obvious math in the shader code.
9. Provide a material setup guide (which properties to set in the Inspector).
10. Note mobile-friendliness and estimated instruction count.

Output MUST follow the exact format specified.
```

---

## Example

### Input

```
UNITY_VERSION: 6000.0
RENDER_PIPELINE: urp
SHADER_TYPE: unlit
TARGET_PLATFORM: mobile
DESCRIPTION:
A holographic scanline effect for a UI panel. The panel should have a semi-transparent
dark blue tint with horizontal scanlines scrolling upward over time. The scanline
frequency and speed should be tweakable. A subtle edge glow (fresnel-like brightness
at the top and bottom edges of the mesh) should be included. No lighting needed.
```

### Output

````
SHADER: HolographicScanline
FILE: Shaders/HolographicScanline.shader
RENDER_PIPELINE: URP
MOBILE_FRIENDLY: Yes

```hlsl
Shader "Custom/HolographicScanline"
{
    Properties
    {
        _MainTex        ("Base Texture (optional)", 2D) = "white" {}
        _TintColor      ("Tint Color", Color) = (0.05, 0.15, 0.4, 0.75)
        _ScanlineFreq   ("Scanline Frequency", Range(10, 200)) = 60
        _ScanlineSpeed  ("Scanline Scroll Speed", Range(0, 5)) = 1.2
        _ScanlineBright ("Scanline Brightness", Range(0, 1)) = 0.15
        _EdgeGlow       ("Edge Glow Intensity", Range(0, 2)) = 0.6
        _EdgeFalloff    ("Edge Glow Falloff", Range(1, 10)) = 3.0
    }

    SubShader
    {
        Tags
        {
            "RenderType" = "Transparent"
            "Queue" = "Transparent"
            "RenderPipeline" = "UniversalPipeline"
        }

        Blend SrcAlpha OneMinusSrcAlpha
        ZWrite Off
        Cull Back

        Pass
        {
            Name "HolographicScanlinePass"

            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #pragma prefer_hlslcc gles
            #pragma exclude_renderers d3d11_9x

            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"

            struct Attributes
            {
                float4 positionOS : POSITION;
                float2 uv         : TEXCOORD0;
            };

            struct Varyings
            {
                float4 positionHCS : SV_POSITION;
                float2 uv          : TEXCOORD0;
                // y in object space, normalized 0..1 top-to-bottom for edge glow
                float  normalizedY : TEXCOORD1;
            };

            TEXTURE2D(_MainTex);
            SAMPLER(sampler_MainTex);

            CBUFFER_START(UnityPerMaterial)
                float4 _MainTex_ST;
                half4  _TintColor;
                half   _ScanlineFreq;
                half   _ScanlineSpeed;
                half   _ScanlineBright;
                half   _EdgeGlow;
                half   _EdgeFalloff;
            CBUFFER_END

            Varyings vert(Attributes IN)
            {
                Varyings OUT;
                OUT.positionHCS = TransformObjectToHClip(IN.positionOS.xyz);
                OUT.uv = TRANSFORM_TEX(IN.uv, _MainTex);
                // Remap object-space y (-0.5..0.5) to 0..1
                OUT.normalizedY = IN.positionOS.y + 0.5;
                return OUT;
            }

            half4 frag(Varyings IN) : SV_Target
            {
                // Base texture (usually white / unused)
                half4 texColor = SAMPLE_TEXTURE2D(_MainTex, sampler_MainTex, IN.uv);

                // Scrolling scanlines: sine wave over UV.y + time
                float scanlinePhase = IN.uv.y * _ScanlineFreq
                                    - _Time.y * _ScanlineSpeed;
                half scanline = sin(scanlinePhase * 3.14159) * 0.5 + 0.5;
                scanline = pow(scanline, 4.0); // sharpen the line
                scanline *= _ScanlineBright;

                // Edge glow: bright at y=0 and y=1, dark in the middle
                half edgeMask = 1.0 - abs(IN.normalizedY * 2.0 - 1.0);
                edgeMask = 1.0 - pow(edgeMask, _EdgeFalloff);
                half edgeGlow = edgeMask * _EdgeGlow;

                // Combine
                half4 col = _TintColor;
                col.rgb += scanline + edgeGlow;
                col.rgb *= texColor.rgb;
                col.a = _TintColor.a * texColor.a;

                return col;
            }
            ENDHLSL
        }
    }
    FallBack Off
}
```

PROPERTIES REFERENCE:
| Property | Type | Description |
|---|---|---|
| _MainTex | Texture2D | Optional base texture; leave white for pure color effect |
| _TintColor | Color (RGBA) | Base holographic tint; alpha controls overall transparency |
| _ScanlineFreq | Float (10–200) | Number of scanlines visible across the mesh height |
| _ScanlineSpeed | Float (0–5) | How fast scanlines scroll upward in units/second |
| _ScanlineBright | Float (0–1) | Brightness contribution of the scanline highlight |
| _EdgeGlow | Float (0–2) | Intensity of the top/bottom edge glow |
| _EdgeFalloff | Float (1–10) | How quickly the edge glow falls off toward the center |

MATERIAL SETUP:
1. In the Project window, right-click → Create → Material.
2. In the Inspector, set Shader to "Custom/HolographicScanline".
3. Set _TintColor to (R:0.05, G:0.15, B:0.4, A:0.75) for the default blue holographic look.
4. Set _ScanlineFreq to 80, _ScanlineSpeed to 1.5 for a readable scrolling effect.
5. Apply the material to a UI RawImage or a world-space Quad mesh.
6. Ensure the Canvas or MeshRenderer has "Allow HDR" disabled on mobile.

PERFORMANCE NOTES:
- Instruction count: ~18 ALU, 1 texture sample — well within mobile budget.
- No dynamic branching; sin() is approximated by GPU hardware.
- Uses `half` precision throughout — safe on Mali/Adreno GPUs.
- Recommended LOD: 100 (default).

KNOWN LIMITATIONS:
- Edge glow assumes the mesh pivot is centered (positionOS.y ranges -0.5..0.5).
  For non-centered meshes, adjust the normalizedY calculation.
- No support for UI Stencil masking (requires additional Pass with Stencil block).
- Scanlines are UV-based, not screen-space — they will stretch on non-square meshes.
````

---

## Notes

- For HDRP post-process effects, provide `SHADER_TYPE: post-process` and describe the screen-space effect.
- Shader Graph alternative: the agent can describe the equivalent Shader Graph node setup if you prefer a visual editor — add `OUTPUT: shader-graph-nodes` to your input.
- Tested with Unity 6, URP 17.x, HDRP 17.x.
- Tested with: Claude Sonnet 4.6, GPT-4o.
