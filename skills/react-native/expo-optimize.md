# Skill — /expo-optimize

**Platform:** React Native (Expo)
**Slash Command:** `/expo-optimize`

---

## Purpose

Expo config audit, OTA update strategy, bundle size reduction, and EAS Build optimization. The complete Expo production checklist.

---

## Skill Prompt

```
Audit the provided Expo project configuration for production optimization:

APP.JSON / APP.CONFIG.JS AUDIT:
- Missing splash screen configuration (white flash on startup).
- Missing android.adaptiveIcon (Android 8+ adaptive icons).
- Missing ios.infoPlist privacy usage descriptions for permissions.
- jsEngine not set: set to "hermes" for better startup performance.
- Missing updates configuration for OTA updates.
- android.versionCode and ios.buildNumber automation strategy.

OTA UPDATE STRATEGY (expo-updates):
- Set updates.fallbackToCacheTimeout appropriately (default 0 is risky).
- Configure update channels (production, staging, preview) via eas.json.
- Conditionally check for updates: use Updates.checkForUpdateAsync() with user notification.
- Critical updates: force reload with Updates.reloadAsync().
- Never OTA-update native code changes (config plugins, new native modules).

BUNDLE SIZE:
- Run: npx expo export --analyze to identify large modules.
- Remove unused expo-* SDK packages from app.json plugins array.
- Use Metro bundle splitting for large feature modules.
- Replace heavy libraries with lighter alternatives:
  moment.js → date-fns (20× smaller)
  lodash (full) → lodash/pick (tree-shaken)
  react-native-vector-icons → @expo/vector-icons (bundled, no native setup)

EAS BUILD OPTIMIZATION:
- eas.json build profiles: development (simulator), preview (APK for testing), production (AAB/IPA).
- Enable build cache to avoid redundant Gradle/Xcode builds.
- Use managed workflow unless you genuinely need custom native code.
- Add .easignore to exclude dev files from upload.

HERMES OPTIMIZATION:
- Confirm hermes is enabled (app.json jsEngine: "hermes").
- Hermes benefits: bytecode pre-compilation, lower memory on Android.
- Incompatible libraries with Hermes (flag if found in package.json).

Output a prioritized list of changes with the config/code snippet for each.
```
