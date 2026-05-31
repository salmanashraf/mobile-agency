# Skill — /proguard-rules

**Platform:** Android
**Slash Command:** `/proguard-rules`

---

## Purpose

Generates correct R8/ProGuard rules from a project's dependency list and code patterns. Eliminates the "copy from StackOverflow" anti-pattern. Explains why each rule is needed.

---

## Skill Prompt

```
Generate R8/ProGuard rules for the provided dependencies and code patterns.

For each dependency or pattern listed, generate the minimal rules needed and explain why:

COMMON DEPENDENCIES AND THEIR RULES:
- Retrofit + Gson/Moshi: keep data classes used as JSON models
- Room: keep entities, DAOs, and database class
- Hilt/Dagger: keep @HiltAndroidApp, @AndroidEntryPoint, @Inject annotated classes
- Kotlin serialization: keep @Serializable annotated classes
- OkHttp: keep interceptors and custom authenticators
- Firebase: usually handled by firebase-android-sdk aar — note which rules come from the AAR
- Glide/Coil: custom transformations and targets
- Reflection usage: any class loaded by Class.forName()
- Sealed classes/interfaces used in when() expressions
- Parcelable implementations

RULE FORMAT:
For each rule, output:
```proguard
# Reason: <why this rule is needed>
-keep class <pattern> { <members>; }
```

VALIDATION CHECKLIST:
After generating rules, check for:
- [ ] No overly broad -keep class * rules
- [ ] Data classes for network/database are explicitly kept
- [ ] Enum classes used in serialization are kept
- [ ] No rules that disable R8's full-mode optimizations unnecessarily

Also note which dependencies already ship their own consumer ProGuard rules (via .pro files in the AAR) — those don't need manual rules.
```
