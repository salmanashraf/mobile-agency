# Skill — /new-arch-migrate

**Platform:** React Native
**Slash Command:** `/new-arch-migrate`

---

## Purpose

Step-by-step React Native New Architecture (JSI / Fabric / TurboModules) migration guide for an existing module or component.

---

## Skill Prompt

```
Migrate the provided React Native module or component to the New Architecture:

DETECT WHAT NEEDS MIGRATION:
1. NativeModule (RCTBridgeModule) → TurboModule
2. Native UI Component (RCTViewManager) → Fabric Component
3. Animated bridge calls → Reanimated 2 / useNativeDriver

TURBOMODULE MIGRATION:
Old Architecture:
- JS side: NativeModules.MyModule.doSomething()
- Native side: @ReactMethod doSomething() in Java/Kotlin/ObjC/Swift

New Architecture (TurboModule):
1. Create TypeScript spec file (NativeMyModule.ts):
   import type { TurboModule } from 'react-native';
   import { TurboModuleRegistry } from 'react-native';
   export interface Spec extends TurboModule {
     doSomething(param: string): Promise<string>;
   }
   export default TurboModuleRegistry.getEnforcing<Spec>('MyModule');

2. Android: implement ReactPackageTurboModuleManagerDelegate
3. iOS: implement RCTTurboModule protocol

FABRIC COMPONENT MIGRATION:
1. Create ComponentSpec.js with codegenNativeComponent
2. Register with RCTFabricComponentsPlugins
3. Update native implementation to use Fabric API

REANIMATED 2 MIGRATION:
- Replace Animated.Value with useSharedValue
- Replace Animated.timing/spring with withTiming/withSpring
- Replace Animated.event with useAnimatedScrollHandler/useAnimatedGestureHandler

Provide the complete before/after code for each migration step.
Flag any migration blocker (3rd party library not yet New Architecture compatible).
```
