# GitHub Roadmap Issues

These are the 10 planned issues for the v0.2.0 milestone. Copy each into a GitHub Issue directly.

---

## Issue 1

**Title:** `[AGENT] Android APK/AAB Size Analyzer`  
**Labels:** `new-agent`, `android`, `enhancement`  
**Milestone:** v0.2.0

### Description

Add a new agent that reviews an Android project's build output and Gradle configuration to identify APK/AAB size reduction opportunities.

**What it should analyze:**
- `build/outputs/mapping/` — detect unused code that R8 is not shrinking
- `build/outputs/apk/` — identify large resource files (images over 100KB, raw assets)
- `build.gradle.kts` — detect missing `isShrinkResources`, disabled minification, missing `splits` config
- `libs.versions.toml` — flag dependencies known for large transitive size (e.g., full Guava instead of the Android-safe subset)
- ProGuard/R8 keep rules — over-broad `-keep` rules that prevent code shrinking

**Input format:**
- APK analysis output (from `bundletool` or Android Studio's APK Analyzer)
- `build.gradle.kts` content
- Optional: `merged-manifest.xml`

**Expected output:**
- Ranked list of size reduction opportunities with estimated savings per item
- Corrected Gradle config for each optimization
- ProGuard rule improvements

**Reference:** Android docs on [Reduce your app size](https://developer.android.com/topic/performance/reduce-apk-size)

---

## Issue 2

**Title:** `[AGENT] iOS App Store Review Guidelines Compliance Checker`  
**Labels:** `new-agent`, `ios`, `enhancement`  
**Milestone:** v0.2.0

### Description

Add an agent that reviews an iOS app's code and `Info.plist` against Apple's App Store Review Guidelines to flag likely rejection reasons before submission.

**What it should check:**
- Privacy: `NSLocationWhenInUseUsageDescription` present when `CLLocationManager` is used; no undeclared data collection
- Permissions: No permissions requested without clear user-facing justification in usage strings
- In-app purchases: No external payment links (violates guideline 3.1.1)
- Age rating: Flag adult content, violence, gambling patterns without declared rating
- Deep links: No URL schemes that conflict with system apps
- Hidden features: No disabled-by-flag code that activates remotely (guideline 2.5.2)
- Login requirements: Non-account features gated behind login (guideline 5.1.1)

**Input format:** `Info.plist` content + Swift/ObjC source files

**Expected output:** Numbered list of potential guideline violations with the specific guideline reference (e.g., 2.1 App Completeness), severity, and corrective action.

---

## Issue 3

**Title:** `[AGENT] Flutter State Architecture Advisor`  
**Labels:** `new-agent`, `flutter`, `enhancement`  
**Milestone:** v0.2.0

### Description

Add an agent that analyzes a Flutter project description and recommends the right state management approach, with a migration path if they're currently using the wrong one.

**Approach matrix to cover:**

| Scenario | Recommendation |
|---|---|
| Solo dev, small app, no team | `setState` + `ValueNotifier` |
| Team, complex features, testability required | Riverpod (code gen) or BLoC |
| Real-time data (WebSocket, Firebase) | BLoC with `StreamSubscription` |
| Shared state across many unrelated widgets | Riverpod |
| Feature-scoped state, no global sharing | Cubit |
| Large team, need strict conventions | BLoC (events enforced) |

**Input:** Project description, team size, feature complexity, current state management  
**Output:** Recommendation with rationale, migration plan if switching, and 3 code examples

---

## Issue 4

**Title:** `[INTEGRATION] Windsurf IDE Integration Guide`  
**Labels:** `documentation`, `integration`, `enhancement`  
**Milestone:** v0.2.0

### Description

Add `docs/windsurf-integration.md` explaining how to use agents in Windsurf (Codeium's AI IDE).

**Content to cover:**
- How Windsurf reads project-level AI instructions (rules files)
- How to reference agent files in Cascade (Windsurf's AI chat)
- How to use Windsurf's multi-file context with agents that review multiple files
- Comparison with Cursor workflow
- Example session: open a Flutter BLoC feature, run the BLoC Feature Builder agent, apply the output

---

## Issue 5

**Title:** `[AGENT] React Native New Architecture Compatibility Auditor`  
**Labels:** `new-agent`, `react-native`, `enhancement`  
**Milestone:** v0.2.0

### Description

Add an agent that audits a React Native project for New Architecture (JSI/Fabric/TurboModules) compatibility — beyond the existing migration guide prompt.

**What it should audit:**
- `package.json` — flag community libraries with no New Arch support (check community directory)
- Native modules — identify which use legacy `ReactContextBaseJavaModule` (Android) or `RCTBridgeModule` (iOS) and need TurboModule migration
- Native UI components — identify `requireNativeComponent` calls that need Fabric migration
- `metro.config.js` — check for correct New Arch configuration
- `gradle.properties` / `Podfile` — verify New Arch enablement flags

**Input:** `package.json`, native module list, and RN version  
**Output:** Compatibility report sorted by blocking vs. non-blocking issues, with effort estimates per migration item

---

## Issue 6

**Title:** `[AGENT] Unity Mobile Performance Profiler Advisor`  
**Labels:** `new-agent`, `unity`, `enhancement`  
**Milestone:** v0.2.0

### Description

Add an agent that analyzes Unity Profiler output (frame data, memory snapshots) for mobile-specific performance issues.

**What it should identify:**
- Draw calls above the mobile budget (>100 on mid-range devices)
- GC.Alloc spikes in hot paths (Update, coroutines, LINQ in hot code)
- Texture memory overuse (>150MB VRAM on mobile)
- Physics.FixedUpdate taking >2ms per frame
- Shader compilation hitches on first render
- Audio mixer complexity causing CPU overhead

**Input:** Unity Profiler JSON export or frame time summary paste  
**Output:** Ranked findings with specific Unity API or settings change for each

---

## Issue 7

**Title:** `[PROMPT] Android Jetpack Compose Animation Prompt Pack`  
**Labels:** `new-prompt`, `android`, `enhancement`  
**Milestone:** v0.2.0

### Description

Add a prompt file at `prompts/android/compose-animations.md` covering the most common Compose animation needs:

- `AnimatedVisibility` with custom enter/exit transitions
- `animateContentSize` for expandable cards
- Shared element transitions (Compose 1.7+)
- `Crossfade` between loading/content states
- `AnimatedCounter` (number counting up animation)
- `ShimmerEffect` loading placeholder

Each prompt should produce a complete, self-contained Composable with a `@Preview`.

---

## Issue 8

**Title:** `[SKILL] Android Performance Skill Module`  
**Labels:** `new-skill`, `android`, `enhancement`  
**Milestone:** v0.2.0

### Description

Add `skills/android/performance.md` covering Android-specific performance patterns beyond what the existing Compose reviewer covers.

**Content to include:**
- Main thread rules: no disk I/O, no network, no heavy computation
- RecyclerView optimization: `DiffUtil`, `setHasFixedSize`, `setItemViewCacheSize`
- Bitmap handling: `BitmapFactory.Options.inSampleSize`, `inBitmap` reuse
- Startup performance: `App Startup library`, lazy initialization, splash screen best practices
- Tracing: `Trace.beginSection()` for custom Perfetto traces
- Baseline Profiles: when and how to generate them

---

## Issue 9

**Title:** `[WORKFLOW] Multi-File Feature Review Workflow`  
**Labels:** `new-agent`, `cross-platform`, `enhancement`  
**Milestone:** v0.2.0

### Description

Add a workflow agent at `agents/cross-platform/feature-reviewer/` that reviews an entire feature folder (multiple files) as a coherent unit, rather than one file at a time.

**Why this matters:** Individual file reviewers miss cross-file issues:
- ViewModel calling Repository directly (should go through UseCase)
- Fragment receiving a Domain entity (should receive a UI model)
- Use case importing Android framework classes (Clean Architecture violation)
- Repository method naming inconsistency across files

**Input:** Paste multiple files with `--- FILE: path ---` separators  
**Output:** Cross-file findings that cannot be caught in per-file review, plus a per-file summary

---

## Issue 10

**Title:** `[DOCS] Video Walkthrough — Using Agents in a Real Android Project`  
**Labels:** `documentation`, `community`, `enhancement`  
**Milestone:** v0.2.0

### Description

Add `docs/video-walkthroughs.md` linking to community-contributed screencasts showing agents used in real projects.

**Format for each entry:**
```
### [Agent Name] in a [Project Type]
- **Contributor:** @username
- **Duration:** X minutes
- **What it covers:** brief description
- **Link:** [YouTube / Loom]
```

**Seed content (to be added):**
- Crash analyzing a production ANR in a ride-sharing app
- Generating a complete BLoC feature in a Flutter e-commerce app
- Using the Compose Screen Builder to scaffold an onboarding flow

This issue is a call for community contributions — add your own walkthrough by opening a PR to `docs/video-walkthroughs.md`.
