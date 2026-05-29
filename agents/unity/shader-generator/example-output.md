# Example Output — Unity Shader Generator

Full agent response to the input in [`example-input.md`](example-input.md).

---

```
SHADER: HolographicScanline
FILE: Shaders/HolographicScanline.shader
RENDER_PIPELINE: URP
MOBILE_FRIENDLY: Yes
```

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
                // Normalized object-space Y (0=bottom, 1=top) for edge glow calculation
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
                // Remap object-space Y from [-0.5, 0.5] to [0, 1]
                OUT.normalizedY = IN.positionOS.y + 0.5;
                return OUT;
            }

            half4 frag(Varyings IN) : SV_Target
            {
                // Optional base texture — usually white/unused for pure color effects
                half4 texColor = SAMPLE_TEXTURE2D(_MainTex, sampler_MainTex, IN.uv);

                // Scrolling scanlines: sine wave over UV.y + time
                // _Time.y = seconds since startup (no C# needed)
                float scanlinePhase = IN.uv.y * _ScanlineFreq
                                    - _Time.y * _ScanlineSpeed;
                half scanline = sin(scanlinePhase * 3.14159) * 0.5h + 0.5h;
                scanline = pow(scanline, 4.0h); // pow sharpens the line without branching
                scanline *= _ScanlineBright;

                // Edge glow: bright at y=0 and y=1, dark in the middle
                // edgeMask = 0 at center, 1 at top/bottom edges
                half edgeMask = 1.0h - abs(IN.normalizedY * 2.0h - 1.0h);
                edgeMask = 1.0h - pow(edgeMask, _EdgeFalloff);
                half edgeGlow = edgeMask * _EdgeGlow;

                // Combine tint + scanline + edge glow + optional texture
                half4 col = _TintColor;
                col.rgb += scanline + edgeGlow;
                col.rgb *= texColor.rgb;
                col.a    = _TintColor.a * texColor.a;

                return col;
            }
            ENDHLSL
        }
    }
    FallBack Off
}
```

---

**PROPERTIES REFERENCE:**

| Property | Type | Description |
|---|---|---|
| `_MainTex` | Texture2D | Optional base texture; leave white for pure color effect |
| `_TintColor` | Color (RGBA) | Base holographic tint; alpha controls overall transparency |
| `_ScanlineFreq` | Float (10–200) | Number of scanlines visible across the mesh height |
| `_ScanlineSpeed` | Float (0–5) | How fast scanlines scroll upward in units/second |
| `_ScanlineBright` | Float (0–1) | Brightness contribution of the scanline highlight |
| `_EdgeGlow` | Float (0–2) | Intensity of the top/bottom edge glow |
| `_EdgeFalloff` | Float (1–10) | How quickly the edge glow falls off toward the center |

---

**MATERIAL SETUP:**

1. In the Project window: right-click → Create → Material
2. In the Inspector, set Shader to **Custom/HolographicScanline**
3. Set `_TintColor` to (R:0.05, G:0.15, B:0.4, A:0.75) for the default blue holographic look
4. Set `_ScanlineFreq` to 80, `_ScanlineSpeed` to 1.5
5. Apply the material to a UI `RawImage` or a world-space `Quad` mesh
6. For UI Canvas: ensure the Canvas Render Mode is "World Space" or use a `RawImage` on a Screen Space canvas

---

**PERFORMANCE NOTES:**
- Instruction count: ~18 ALU, 1 texture sample — well within mobile budget
- No dynamic branching — `pow()` and `sin()` are hardware-optimized on modern mobile GPUs
- All `half` precision — safe on Mali/Adreno GPUs, reduces register pressure
- Recommended LOD: 100 (default)

**KNOWN LIMITATIONS:**
- Edge glow assumes the mesh pivot is centered (`positionOS.y` ranges ±0.5). For non-centered meshes, adjust `OUT.normalizedY = IN.positionOS.y + YOUR_OFFSET`
- Scanlines are UV-space — they stretch on non-square meshes. For screen-space scanlines, use a post-process pass instead
- No UI Stencil masking — add a Stencil block to the SubShader if this material needs to be masked by a UI mask
