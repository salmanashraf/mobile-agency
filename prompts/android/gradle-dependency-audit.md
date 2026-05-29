# Prompt — Gradle Dependency Audit

**Platform:** Android (Gradle / Kotlin DSL)  
**Category:** DevOps  
**Type:** one-shot

---

## Purpose

Audits a `build.gradle.kts` or `libs.versions.toml` for outdated dependencies, version conflicts, redundant dependencies, and security advisories.

---

## Prompt

```
You are a senior Android engineer and build system expert. Audit the Gradle configuration below.

Check for:
1. OUTDATED VERSIONS — compare against latest stable releases (as of your knowledge cutoff).
   For each outdated dependency: current version, latest stable version, and what changed.
2. VERSION CONFLICTS — dependencies that declare incompatible versions of a shared transitive dependency.
3. REDUNDANT DEPENDENCIES — libraries already provided transitively (e.g., explicitly declaring
   kotlin-stdlib when it's included by the Kotlin Gradle plugin).
4. KNOWN SECURITY ADVISORIES — flag any library version with a known CVE.
5. DEPRECATED APIS — libraries or configurations that are deprecated and should be migrated
   (e.g., compile instead of implementation, old Kotlin Gradle plugin DSL).
6. OPTIMIZATION OPPORTUNITIES — unused test dependencies in non-test scopes, debugImplementation
   vs implementation for debug-only tools.

Output format for each finding:
[CRITICAL/WARNING/INFO] Library name — Issue title
  Current : <version>
  Latest  : <latest stable version>
  Action  : <what to do>

End with a DEPENDENCY HEALTH SCORE (1–10) and a prioritized action list.

Gradle configuration to audit:
```
[PASTE build.gradle.kts OR libs.versions.toml HERE]
```
```

---

## Example Usage

**What you paste:**
```
Gradle configuration to audit:
```
[versions]
kotlin = "1.9.0"
agp = "8.2.0"
compose-bom = "2023.10.01"
retrofit = "2.9.0"
okhttp = "4.10.0"
hilt = "2.47"
room = "2.5.2"
coroutines = "1.7.1"

[libraries]
retrofit = { module = "com.squareup.retrofit2:retrofit", version.ref = "retrofit" }
okhttp = { module = "com.squareup.okhttp3:okhttp", version.ref = "okhttp" }
hilt-android = { module = "com.google.dagger:hilt-android", version.ref = "hilt" }
room-runtime = { module = "androidx.room:room-runtime", version.ref = "room" }
room-ktx = { module = "androidx.room:room-ktx", version.ref = "room" }
coroutines-android = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-android", version.ref = "coroutines" }
```
```

**Expected output:**
```
[WARNING] Kotlin — Outdated version
  Current : 1.9.0
  Latest  : 2.0.x
  Action  : Upgrade to Kotlin 2.0. Enables the new K2 compiler (faster builds, improved
             type inference). Breaking: some reflection APIs changed. Run ./gradlew build
             after upgrading to catch compilation errors.

[WARNING] AGP — Outdated version
  Current : 8.2.0
  Latest  : 8.7.x
  Action  : Upgrade AGP. Required for Kotlin 2.0 compatibility and Gradle 8.x features.
             Check AGP/Gradle compatibility matrix before upgrading.

[WARNING] Compose BOM — Outdated version
  Current : 2023.10.01
  Latest  : 2024.12.01
  Action  : Update Compose BOM. Includes stability improvements, new Material 3 components,
             and Compose compiler updates required for Kotlin 2.0.

[WARNING] Retrofit — Outdated version
  Current : 2.9.0
  Latest  : 2.11.0
  Action  : Upgrade. 2.11.0 adds Kotlin suspend function support without the need for
             a separate coroutines adapter in many cases.

[WARNING] OkHttp — Outdated version
  Current : 4.10.0
  Latest  : 4.12.0
  Action  : Upgrade. 4.12.0 includes security patches and TLS improvements.

[WARNING] Hilt — Outdated version
  Current : 2.47
  Latest  : 2.52
  Action  : Upgrade. Required for compatibility with Kotlin 2.0 and AGP 8.5+.

[WARNING] Room — Outdated version
  Current : 2.5.2
  Latest  : 2.7.0
  Action  : Upgrade. 2.6+ adds support for @Upsert and improved Flow integration.

[INFO] coroutines-android — Version sufficient but not latest
  Current : 1.7.1
  Latest  : 1.9.x
  Action  : Consider upgrading for TestScope improvements in tests.

DEPENDENCY HEALTH SCORE: 4/10

PRIORITIZED ACTION LIST:
1. Upgrade Kotlin to 2.0 and AGP to 8.7 together (they have tight compatibility requirements).
2. Update Compose BOM to match the Kotlin 2.0 compose compiler.
3. Upgrade Hilt to 2.52 (Kotlin 2.0 compatibility).
4. Upgrade OkHttp (security patches).
5. Upgrade Room and Retrofit at your convenience.
```

---

## Variations

- **Build performance audit:** Add "Also check for: configuration cache compatibility, parallel execution settings, Gradle daemon configuration, and R8/ProGuard rule bloat."
- **Security-focused:** Add "Focus exclusively on CVE advisories and dependency supply chain risks."
