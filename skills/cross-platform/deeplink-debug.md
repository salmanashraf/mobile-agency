# Skill — /deeplink-debug

**Platform:** Cross-Platform
**Slash Command:** `/deeplink-debug`

---

## Purpose

Diagnoses broken deep links across Android and iOS. Notoriously painful — this skill walks through every failure mode systematically.

---

## Skill Prompt

```
Debug the described deep link issue step by step:

PROVIDE THIS INFORMATION:
1. Deep link URL or app link (e.g. https://app.example.com/product/123 or myapp://product/123)
2. Platform: Android, iOS, or both
3. Symptom: doesn't open app / opens wrong screen / opens app but crashes / works on dev not prod
4. Link type: App Link (Android) / Universal Link (iOS) / Custom URL scheme / Branch.io / Firebase Dynamic Link

ANDROID APP LINKS CHECKLIST:
[ ] android:autoVerify="true" in the intent-filter (without this, App Links don't work)
[ ] Intent filter scheme is "https" (not "http") for App Links
[ ] /.well-known/assetlinks.json served at the exact domain, over HTTPS, with correct JSON
[ ] assetlinks.json contains the correct SHA-256 certificate fingerprint
    (Get fingerprint: keytool -list -v -keystore debug.keystore — debug != production!)
[ ] assetlinks.json is accessible without redirect (redirects break App Link verification)
[ ] App is installed and App Link verification has been triggered (reboot or reinstall)
[ ] Test: adb shell am start -a android.intent.action.VIEW -d "https://yourdomain.com/path"

iOS UNIVERSAL LINKS CHECKLIST:
[ ] apple-app-site-association (AASA) file served at /.well-known/apple-app-site-association
[ ] AASA is served with Content-Type: application/json (not .well-known/apple-app-site-association.json)
[ ] AASA contains the correct appID (TeamID.BundleID) in the "applinks" section
[ ] AASA path patterns match the URLs being tested (wildcards: * matches one path component, ** matches any)
[ ] Associated Domains entitlement includes applinks:yourdomain.com
[ ] Test on real device (simulator doesn't support Universal Links)
[ ] Test: Settings → Developer → Universal Links → Diagnostics tool (iOS 16+)

CUSTOM URL SCHEMES (fallback):
[ ] Scheme registered in AndroidManifest.xml / Info.plist
[ ] Scheme not conflicting with another installed app (no guarantee of uniqueness)
[ ] Test: adb shell am start -a android.intent.action.VIEW -d "myapp://path"
         xcrun simctl openurl booted "myapp://path"

COMMON FAILURES AND FIXES:
- "Works in dev, not prod": different signing certificate → different SHA-256 fingerprint in assetlinks.json
- "Opens browser instead of app": assetlinks.json or AASA not found / served with wrong Content-Type
- "App opens but wrong screen": intent/URL handler not matching the path pattern
- "Crashes on open": deep link handler accessing null navigation state before initialization

Output a step-by-step diagnosis with the most likely cause first.
```
