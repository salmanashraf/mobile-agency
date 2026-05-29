# Prompt — Unity Shader from Visual Reference

**Platform:** Unity (HLSL / ShaderLab)  
**Category:** Game Development  
**Type:** one-shot

---

## Purpose

Generates a Unity shader file from a visual effect description or reference screenshot description. Faster than the full Shader Generator agent for iterative work.

---

## Prompt

```
You are a senior Unity graphics engineer. Generate a complete Unity .shader file that
reproduces the visual effect described below.

Rules:
1. Output a complete ShaderLab file — not a partial snippet.
2. Specify the render pipeline in your first line of thought, then match it:
   URP: HLSLPROGRAM + URP ShaderLibrary includes.
   Built-in: CGPROGRAM + UnityCG.cginc.
3. For mobile effects: ≤2 texture samples, use half precision, no dynamic branching.
4. Expose all tweakable parameters as Properties.
5. Use _Time.y for any time-based animation.
6. Include a material setup comment at the end (which properties to set in the Inspector).

Effect to reproduce:
RENDER_PIPELINE: [URP / Built-in / HDRP]
TARGET: [mobile / desktop / any]
DESCRIPTION: [describe the visual effect in detail]
```

---

## Example Usage

**What you paste:**
```
Effect to reproduce:
RENDER_PIPELINE: URP
TARGET: mobile
DESCRIPTION: A rim light / fresnel glow effect for a sci-fi character outline.
The character glows with a neon blue color at silhouette edges (where the surface
normal faces away from the camera). The glow intensity and color should be tweakable.
The base diffuse texture should still show through. Mobile-friendly.
```

**Expected output:**
```hlsl
Shader "Custom/SciFiRimLight"
{
    Properties
    {
        _MainTex    ("Albedo", 2D) = "white" {}
        _RimColor   ("Rim Color", Color) = (0.0, 0.6, 1.0, 1.0)
        _RimPower   ("Rim Power (edge sharpness)", Range(0.5, 8.0)) = 3.0
        _RimIntensity ("Rim Intensity", Range(0, 3)) = 1.0
    }

    SubShader
    {
        Tags { "RenderType" = "Opaque" "RenderPipeline" = "UniversalPipeline" }

        Pass
        {
            Name "ForwardLit"
            Tags { "LightMode" = "UniversalForward" }

            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Lighting.hlsl"

            struct Attributes
            {
                float4 positionOS : POSITION;
                float3 normalOS   : NORMAL;
                float2 uv         : TEXCOORD0;
            };

            struct Varyings
            {
                float4 positionHCS : SV_POSITION;
                float2 uv          : TEXCOORD0;
                half3  normalWS    : TEXCOORD1;
                half3  viewDirWS   : TEXCOORD2;
            };

            TEXTURE2D(_MainTex); SAMPLER(sampler_MainTex);

            CBUFFER_START(UnityPerMaterial)
                float4 _MainTex_ST;
                half4  _RimColor;
                half   _RimPower;
                half   _RimIntensity;
            CBUFFER_END

            Varyings vert(Attributes IN)
            {
                Varyings OUT;
                OUT.positionHCS = TransformObjectToHClip(IN.positionOS.xyz);
                OUT.uv          = TRANSFORM_TEX(IN.uv, _MainTex);
                OUT.normalWS    = TransformObjectToWorldNormal(IN.normalOS);
                OUT.viewDirWS   = GetWorldSpaceViewDir(TransformObjectToWorld(IN.positionOS.xyz));
                return OUT;
            }

            half4 frag(Varyings IN) : SV_Target
            {
                half4 albedo = SAMPLE_TEXTURE2D(_MainTex, sampler_MainTex, IN.uv);

                // Fresnel: dot(N, V) is 0 at silhouette edges, 1 at face-on surfaces
                half NdotV = saturate(dot(normalize(IN.normalWS), normalize(IN.viewDirWS)));
                half rim = pow(1.0 - NdotV, _RimPower) * _RimIntensity;

                half4 col = albedo;
                col.rgb += _RimColor.rgb * rim;
                return col;
            }
            ENDHLSL
        }
    }
    FallBack "Universal Render Pipeline/Lit"
}

// Material setup:
// 1. Assign your character's albedo texture to _MainTex.
// 2. Set _RimColor to (0, 0.6, 1, 1) for neon blue.
// 3. _RimPower 3–5 for a sharp sci-fi edge; lower for softer glow.
// 4. _RimIntensity 1–2 for visible but not overwhelming glow.
```

---

## Variations

- **Shader Graph instead:** Add "Describe the equivalent Shader Graph node setup instead of code."
- **Animated effect:** Add "The effect should pulse — the rim brightness should oscillate using sin(_Time.y * speed)."
