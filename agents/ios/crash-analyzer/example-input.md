# Example Input — iOS Crash Analyzer

---

```
PLATFORM: iOS
APP_VERSION: 2.3.0 (build 201)
OS_VERSION: iOS 17.4
DEVICE: iPhone 14
USER_ACTION: User dismissed the profile screen while an avatar image was still uploading.

CRASH_LOG:
Exception Type:  EXC_BAD_ACCESS (SIGSEGV)
Exception Subtype: KERN_INVALID_ADDRESS at 0x0000000000000010
Termination Signal: Segmentation fault: 11
Termination Reason: Namespace SIGNAL, Code 0xb

Thread 0 Crashed:
0  libswiftCore.dylib          0x00000001a3b4c000 swift_unknownObjectRetain + 8
1  SocialApp                   0x000000010042a100 ProfileViewModel.uploadAvatar(image:) + 156 (ProfileViewModel.swift:67)
2  SocialApp                   0x000000010041b200 ProfileViewController.uploadButtonTapped(_:) + 84 (ProfileViewController.swift:112)
3  UIKitCore                   0x00000001c4e12000 -[UIControl sendAction:to:forEvent:] + 96
4  UIKitCore                   0x00000001c4e12100 -[UIControl _sendActionsForEvents:withEvent:] + 284

Thread 3 (Network Queue):
0  libdispatch.dylib           0x00000001a2c10000 _dispatch_call_block_and_release + 12
1  libdispatch.dylib           0x00000001a2c10100 _dispatch_client_callout + 20
2  SocialApp                   0x000000010042a300 ProfileViewModel.uploadAvatar.completion + 88 (ProfileViewModel.swift:72)

RELATED_CODE:
class ProfileViewModel {
    var onUploadComplete: (() -> Void)?

    func uploadAvatar(image: UIImage) {
        let data = image.jpegData(compressionQuality: 0.8)!     // line 67
        uploadService.upload(data: data) { [unowned self] success in   // line 72
            if success {
                self.onUploadComplete?()
            }
        }
    }
}
```

---

## What to Expect

The agent produces a full 9-section report. See [`example-output.md`](example-output.md).

**Root cause:** `[unowned self]` in an upload callback that fires after the ViewModel was deallocated. `unowned` does not nil-check before access — accessing freed memory causes `EXC_BAD_ACCESS`.

---

## Variations

### Watchdog Termination (0x8badf00d)
```
USER_ACTION: App was in the background for 30 seconds uploading a video.
CRASH_LOG:
Exception Type:  EXC_CRASH (SIGKILL)
Exception Codes: 0x0000000000000000, 0x0000000000000000
Exception Note:  EXC_CORPSE_NOTIFY
Termination Reason: Namespace SPRINGBOARD, Code 0x8badf00d
Triggered by Thread: 0
```
Root cause: Background task not completing within 30 seconds; `setTaskCompleted()` not called in all code paths.

### Force-unwrap on optional chain
```
USER_ACTION: User navigated to the settings screen immediately after login.
CRASH_LOG:
Fatal error: Unexpectedly found nil while implicitly unwrapping an Optional value
  SocialApp                    ProfileCoordinator.showSettings() + 124 (ProfileCoordinator.swift:89)
  SocialApp                    AppCoordinator.handleDeepLink(_:) + 56 (AppCoordinator.swift:142)
RELATED_CODE:
func showSettings() {
    let vc = SettingsViewController()
    vc.user = currentUser!   // line 89
    navigationController?.pushViewController(vc, animated: true)
}
```
Root cause: `currentUser` is nil because the user object hasn't been set yet when `showSettings()` is called from a deep link that arrives before the login flow completes.
