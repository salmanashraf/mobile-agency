# Skill — iOS Data Persistence

**Platform:** iOS / macOS (Swift)  
**Category:** Code Quality  
**Composable With:** agents/ios/swift-reviewer/agent.md, skills/shared/security-scan.md

---

## Purpose

Reviews iOS data persistence code across Core Data, SwiftData, Keychain, and UserDefaults. Covers security, thread safety, migration strategy, and common pitfalls for each storage layer.

## When to Use

- When reviewing any code that reads from or writes to local storage
- When adding a new persistence layer to an existing app
- As a pre-release check for apps handling sensitive user data

---

## Skill Prompt

```
When reviewing iOS data persistence code, enforce these rules by storage layer:

USERDEFAULTS
- NEVER store: auth tokens, passwords, session IDs, credit card numbers, health data, or any PII.
  UserDefaults is stored as a plaintext plist at /Library/Preferences — readable with device access.
  Fix: use Keychain for any sensitive value.
- @AppStorage triggers a view body re-evaluation on every write. Flag @AppStorage for large or
  frequently-written values — use a ViewModel with debounced persistence instead.
- Flag: UserDefaults.standard.synchronize() — deprecated, a no-op in modern iOS, and a sign
  of cargo-cult code from older patterns.
- Appropriate uses: user preferences (theme, language), feature flag overrides, non-sensitive app state.

KEYCHAIN
- Use Security framework (SecItemAdd, SecItemCopyMatching) or a wrapper library (KeychainAccess).
- Set kSecAttrAccessible to kSecAttrAccessibleWhenUnlockedThisDeviceOnly for most cases.
  Avoid kSecAttrAccessibleAlways — it persists across unlocks and is available in background.
- Flag: Keychain items shared across apps without explicit kSecAttrAccessGroup — unintended access.
- For biometric-protected items: use kSecAccessControlBiometryCurrentSet, not BiometryAny —
  BiometryCurrentSet invalidates the item if a new fingerprint is enrolled (more secure).
- Always handle errSecItemNotFound gracefully — don't crash if a Keychain item doesn't exist yet.

CORE DATA
- Context threading: NEVER access a managed object from a different context's thread.
  viewContext is main-thread only. For background work:
  container.performBackgroundTask { backgroundContext in ... }
  Or: NSManagedObjectContext(concurrencyType: .privateQueueConcurrencyType)
- Flag: NSManagedObject passed between threads without objectID re-fetch.
  Fix: pass objectID across threads, then: let obj = backgroundContext.object(with: objectID)
- Flag: fetchRequest without a sortDescriptor — results are non-deterministic across saves.
- Flag: fetchRequest with no predicate fetching a large table — use predicates and fetchLimit.
- Migration: always add a NSMersistentStoreDescription with shouldMigrateStoreAutomatically = true
  and a lightweight migration model when adding/removing attributes.
- Cascade delete rules: set delete rules on relationships to prevent orphaned objects.

SWIFTDATA (iOS 17+)
- @Model classes must be used with a ModelContainer — never create @Model instances outside a context.
- Queries (@Query) run on the main actor by default. For background inserts, use ModelActor:
  @ModelActor actor DataImporter { func insert(_ items: [Item]) throws { ... } }
- Flag: @Model classes with large Data properties (images, files) — store file URLs, not raw data.
- Migration: use VersionedSchema and SchemaMigrationPlan for structural changes.

FILES
- Sensitive files must be stored in the Application Support directory with NSFileProtectionComplete:
  try data.write(to: url, options: .completeFileProtection)
  This encrypts the file when the device is locked.
- Flag: files written to the Documents directory without file protection — accessible via iTunes
  sharing and potentially unencrypted on non-passcode devices.
- Flag: large files written synchronously on the main thread.
  Fix: use a background Task or DispatchQueue.global(qos: .utility).

For each issue: state the storage layer, file/line, what is wrong, the security or correctness impact, and the corrected Swift snippet.
```

---

## Example

**Input:**
```swift
func saveToken(_ token: String) {
    UserDefaults.standard.set(token, forKey: "authToken")
    UserDefaults.standard.synchronize()
}

func loadToken() -> String? {
    UserDefaults.standard.string(forKey: "authToken")
}
```

**Output:**
```
CRITICAL — Auth token stored in UserDefaults (plaintext)
  Impact: The token is stored at ~/Library/Preferences/<BundleID>.plist.
          Any app with device access, jailbreak, or iTunes backup can read it.
  Fix:
  import Security

  enum KeychainKey { static let authToken = "com.example.authToken" }

  func saveToken(_ token: String) throws {
      let data = Data(token.utf8)
      let query: [CFString: Any] = [
          kSecClass: kSecClassGenericPassword,
          kSecAttrAccount: KeychainKey.authToken,
          kSecValueData: data,
          kSecAttrAccessible: kSecAttrAccessibleWhenUnlockedThisDeviceOnly
      ]
      SecItemDelete(query as CFDictionary)  // delete existing before adding
      let status = SecItemAdd(query as CFDictionary, nil)
      guard status == errSecSuccess else { throw KeychainError.saveFailed(status) }
  }

  func loadToken() throws -> String? {
      let query: [CFString: Any] = [
          kSecClass: kSecClassGenericPassword,
          kSecAttrAccount: KeychainKey.authToken,
          kSecReturnData: true,
          kSecMatchLimit: kSecMatchLimitOne
      ]
      var result: AnyObject?
      let status = SecItemCopyMatching(query as CFDictionary, &result)
      guard status == errSecSuccess, let data = result as? Data else {
          return status == errSecItemNotFound ? nil : { throw KeychainError.loadFailed(status) }()
      }
      return String(data: data, encoding: .utf8)
  }

WARNING — UserDefaults.synchronize() is a deprecated no-op
  Remove it. UserDefaults persists automatically.
```

---

## Composition Example

```
Combine with skills/shared/security-scan.md for a full data security audit:
[paste data-persistence skill] + [paste security-scan skill] → paste your persistence layer.

Or compose with skills/ios/networking.md when reviewing token storage after login flows.
```

---

## Notes

- SwiftData is the recommended persistence layer for new iOS 17+ apps. For existing Core Data apps, migration is optional but worthwhile for new features.
- KeychainAccess (open-source library) wraps the Security framework in a clean API — recommended for readability over raw SecItem calls.
