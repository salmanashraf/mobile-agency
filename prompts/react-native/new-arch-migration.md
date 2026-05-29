# Prompt — React Native New Architecture Migration

**Platform:** React Native (TypeScript)  
**Category:** Code Quality  
**Type:** one-shot

---

## Purpose

Generates a step-by-step migration plan from the Old Architecture (Bridge) to the New Architecture (JSI/Fabric/TurboModules) for a React Native app.

---

## Prompt

```
You are a senior React Native engineer specializing in the New Architecture (JSI, Fabric,
TurboModules, Codegen). Generate a step-by-step migration guide for the codebase described below.

For each step:
1. State what to change and why (what problem the old approach has).
2. Provide before/after code examples in TypeScript/JavaScript.
3. Flag breaking changes, testing considerations, and rollback steps.
4. Estimate effort: Quick (< 1 day), Medium (2–5 days), High (1+ week).

Cover:
- Enabling New Architecture in Android (gradle.properties) and iOS (Podfile)
- Migrating NativeModules to TurboModules (with Codegen type specs)
- Migrating native UI components to Fabric (with Codegen ViewConfig)
- Updating library dependencies (check community libraries for New Arch support)
- Removing bridge-specific patterns (NativeModules.X.callMethod pattern)
- Performance wins to validate after migration

App details:
RN_VERSION: [e.g. 0.73]
PLATFORM: [Android / iOS / Both]
NATIVE_MODULES: [list your custom native modules, or "none"]
NATIVE_COMPONENTS: [list your custom native UI components, or "none"]
THIRD_PARTY_LIBS: [list key native libraries, e.g. react-native-camera, react-native-maps]
```

---

## Example Usage

**What you paste:**
```
App details:
RN_VERSION: 0.73
PLATFORM: Both
NATIVE_MODULES: DeviceSecurityModule (checks biometrics), FileUploadModule
NATIVE_COMPONENTS: VideoPlayerView
THIRD_PARTY_LIBS: react-native-camera, react-native-maps, react-native-reanimated 3.x
```

**Expected output:**
```
MIGRATION GUIDE: Old Architecture → New Architecture

Step 1 — Enable New Architecture
Effort: Quick

Android: gradle.properties
  newArchEnabled=true  ← add this line

iOS: Podfile
  ENV['RCC_NEW_ARCH_ENABLED'] = '1'  ← add at top, before target block
  Then: cd ios && RCT_NEW_ARCH_ENABLED=1 pod install

Rollback: set back to false/0 and re-pod-install.

---

Step 2 — Audit third-party library compatibility
Effort: Medium

Check each library at https://reactnative.directory for New Arch support:
- react-native-reanimated 3.x: ✓ Full New Arch support
- react-native-maps: ✓ Supported from v1.9+
- react-native-camera: ⚠ Deprecated — migrate to react-native-vision-camera v4
  (Full New Arch support, active maintenance)

Action: Upgrade react-native-maps to 1.9+, migrate camera to VisionCamera.

---

Step 3 — Migrate DeviceSecurityModule to TurboModule
Effort: Medium

Before (Old Arch — NativeModules):
  const result = await NativeModules.DeviceSecurity.checkBiometrics();

After (TurboModule):
  // 1. Create a Codegen spec file:
  // NativeDeviceSecurity.ts
  import type { TurboModule } from 'react-native';
  import { TurboModuleRegistry } from 'react-native';
  export interface Spec extends TurboModule {
    checkBiometrics(): Promise<boolean>;
  }
  export default TurboModuleRegistry.getEnforcing<Spec>('DeviceSecurity');

  // 2. Update Android/iOS native code to extend TurboModule instead of ReactContextBaseJavaModule.
  // 3. Run Codegen: cd android && ./gradlew generateCodegenArtifactsFromSchema

  // Usage stays the same but now goes through JSI (synchronous, no bridge overhead):
  import NativeDeviceSecurity from './NativeDeviceSecurity';
  const result = await NativeDeviceSecurity.checkBiometrics();

---

Step 4 — Migrate VideoPlayerView to Fabric
Effort: High

Before: requireNativeComponent('VideoPlayerView')
After: Create a Codegen ViewConfig spec and implement Fabric ViewManager.

// VideoPlayerViewNativeComponent.ts
import type {HostComponent, ViewProps} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
export interface NativeProps extends ViewProps {
  videoUrl: string;
  autoPlay: boolean;
}
export default codegenNativeComponent<NativeProps>('VideoPlayerView') as HostComponent<NativeProps>;

Then update Android ViewManager to extend Fabric ViewManager and iOS to use RCTFabricComponentsPlugins.

---

Performance Wins to Validate:
1. Synchronous native calls: measure latency of checkBiometrics() before and after
   (expect 0-1ms vs 5-10ms over the bridge).
2. Video player frame rate: record FPS during video playback with Perfetto (Android) or
   Instruments (iOS) — expect fewer dropped frames with Fabric.
3. JavaScript thread load: check Flipper Performance Monitor — bridge calls no longer
   appear on the JS thread timeline.
```

---

## Variations

- **No custom native modules:** Add "The app has no custom native modules. Focus only on enabling New Architecture and verifying third-party library compatibility."
- **iOS only:** Add "Migration is iOS only. Skip Android gradle.properties steps."
