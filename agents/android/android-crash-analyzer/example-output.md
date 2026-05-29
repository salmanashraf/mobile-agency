# Example Output — Android Crash Analyzer

This is the agent's full response to the crash log in [`example-input.md`](example-input.md).

---

## Crash Summary

`IllegalStateException: Fragment ProfileFragment not attached to a context` thrown at `ProfileFragment.kt:124` inside a LiveData observer callback. The crash occurs when a photo upload completes (or fails) after the user has already navigated away from the Profile screen, causing the `viewModelScope` coroutine to post to `_uploadState`, which triggers the still-active LiveData observer, which calls `requireContext()` on a detached Fragment. **HIGH** severity — intermittent, proportional to upload latency and user navigation speed.

---

## Root Cause

There are two compounding bugs that together produce this crash:

**Bug 1 — Observer registered with wrong LifecycleOwner (`this` vs `viewLifecycleOwner`):**
```kotlin
viewModel.uploadState.observe(this) { state -> ... }
//                           ^^^^
// 'this' = the Fragment's lifecycle, which starts at onCreate and ends at onDestroy.
// The Fragment's VIEW lifecycle (onCreateView → onDestroyView) is shorter.
// When the user navigates back, the view is destroyed but the Fragment object
// may still exist in the back stack. The observer remains active.
```

**Bug 2 — `requireContext()` called inside that active observer:**
```kotlin
private fun showUploadSuccess(photoUrl: String) {
    val ctx = requireContext()  // throws if Fragment is not attached to an Activity
```

When the upload finishes on the `viewModelScope` coroutine (which survives navigation), it posts `UploadState.Success` to `_uploadState`. LiveData dispatches this on the Main thread. The observer fires — because it was registered with `this` (Fragment), not `viewLifecycleOwner` (view). Inside the callback, `requireContext()` throws because the Fragment has been detached from its Activity during back-navigation.

**Secondary bug — `Context` passed into `ViewModel`:**
```kotlin
fun uploadPhoto(context: Context, bitmap: Bitmap) { ... }
```
The ViewModel stores or uses a `Context` from the Fragment. If the repository retains this reference (e.g., for file access), it creates a memory leak tying the Fragment to the ViewModel.

---

## Why This Happens

Think of a Fragment as having two lifecycles: the Fragment itself (like the employee) and its View (like the employee's desk). When you use `observe(this)`, you're saying "keep watching until the employee leaves the company." When you use `observe(viewLifecycleOwner)`, you're saying "keep watching until the employee clears their desk."

When the user navigates back, the desk is cleared (`onDestroyView`) but the employee is still around (the Fragment stays in the back stack). Your upload finishes, and it tries to show a Snackbar — but the desk is gone. `requireContext()` is like asking "where's my desk?" when there is no desk anymore.

The fix is always to watch with `viewLifecycleOwner`, so the observer self-cancels the moment the view is destroyed — no desk, no watch.

---

## Risk Level

**HIGH**  
Reproducibility: **Intermittent** — triggered when:
- Upload takes longer than the user's back-navigation (more likely on slow networks)
- Device has background CPU throttling (common on budget devices)

Affected users: proportional to upload success rate on slow connections × navigation-back rate. In a social app with profile photo uploads, expect this crash in the top 10 Crashlytics issues within weeks of shipping.

---

## Recommended Fix

**Step 1 — Change observer to use `viewLifecycleOwner`**

This is the primary fix. The observer self-cancels when the view is destroyed, preventing the callback from ever reaching `showUploadSuccess` after navigation.

**Step 2 — Remove `requireContext()` from the observer callback**

The Fragment always has access to its context through the view binding root (`binding.root.context`) without calling `requireContext()`. This is safer because `binding` is only accessible when the view exists.

**Step 3 — Remove `Context` parameter from `ViewModel.uploadPhoto()`**

ViewModels must never hold Activity or Fragment context. Use `application.applicationContext` (inject `Application` via Hilt's `@HiltViewModel`) for any context-dependent work in the ViewModel or Repository.

**Step 4 — Cancel the upload when the user navigates away (optional but recommended)**

If you want uploads to stop when the user leaves, cancel the coroutine Job and expose cancellation via a `cancelUpload()` function.

---

## Updated Code

```kotlin
// ProfileFragment.kt — AFTER

class ProfileFragment : Fragment(R.layout.fragment_profile) {

    private val viewModel: ProfileViewModel by viewModels()
    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        _binding = FragmentProfileBinding.bind(view)

        // FIX 1: Use viewLifecycleOwner, not 'this'.
        // The observer now self-cancels when onDestroyView() fires.
        // 'uploadState' is now a StateFlow — collected with repeatOnLifecycle
        // to guarantee cancellation and avoid the race window.
        viewLifecycleOwner.lifecycleScope.launch {
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.uploadState.collect { state ->
                    when (state) {
                        is UploadState.Success -> showUploadSuccess(state.photoUrl)
                        is UploadState.Error   -> showError(state.message)
                        UploadState.Loading    -> binding.uploadProgress.isVisible = true
                        UploadState.Idle       -> binding.uploadProgress.isVisible = false
                    }
                }
            }
        }

        binding.uploadButton.setOnClickListener {
            // FIX 3: No longer passes Context to the ViewModel.
            viewModel.uploadPhoto(getSelectedBitmap())
        }
    }

    private fun showUploadSuccess(photoUrl: String) {
        // FIX 2: binding.root.context is always valid here because
        // repeatOnLifecycle guarantees this block only runs while STARTED.
        // No requireContext() needed.
        binding.uploadProgress.isVisible = false
        Snackbar.make(binding.root, "Photo updated!", Snackbar.LENGTH_SHORT).show()
        Glide.with(binding.root.context).load(photoUrl).into(binding.avatarImage)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

// ProfileViewModel.kt — AFTER

@HiltViewModel
class ProfileViewModel @Inject constructor(
    // FIX 3: Inject Application for context-dependent work.
    // Application context does NOT leak — it lives as long as the process.
    private val application: Application,
    private val photoRepository: PhotoRepository
) : ViewModel() {

    // Migrated from MutableLiveData to MutableStateFlow.
    // StateFlow + collectAsStateWithLifecycle/repeatOnLifecycle is the modern pattern.
    private val _uploadState = MutableStateFlow<UploadState>(UploadState.Idle)
    val uploadState: StateFlow<UploadState> = _uploadState.asStateFlow()

    private var uploadJob: Job? = null

    fun uploadPhoto(bitmap: Bitmap) {
        // Cancel any in-flight upload before starting a new one.
        uploadJob?.cancel()
        uploadJob = viewModelScope.launch {
            _uploadState.value = UploadState.Loading
            try {
                // Repository now receives applicationContext — no leak.
                val url = photoRepository.uploadPhoto(application.applicationContext, bitmap)
                _uploadState.value = UploadState.Success(url)
            } catch (e: CancellationException) {
                // User navigated away and the coroutine was cancelled — do not emit Error.
                _uploadState.value = UploadState.Idle
                throw e  // Always re-throw CancellationException
            } catch (e: Exception) {
                _uploadState.value = UploadState.Error(e.message ?: "Upload failed")
            }
        }
    }

    fun cancelUpload() {
        uploadJob?.cancel()
        _uploadState.value = UploadState.Idle
    }
}

// UploadState.kt — sealed class for type-safe state

sealed class UploadState {
    object Idle    : UploadState()
    object Loading : UploadState()
    data class Success(val photoUrl: String) : UploadState()
    data class Error(val message: String)   : UploadState()
}
```

---

## Edge Cases

- **ViewPager2 tabs:** Fragments in a ViewPager2 have their views destroyed and recreated when the user swipes away. Using `observe(this)` accumulates a new observer on every tab-return. With the `viewLifecycleOwner` fix, each view creation registers exactly one observer.

- **Bottom navigation with `FragmentManager` backstack:** A Fragment that is added to the back stack retains its Fragment instance. After `onDestroyView()`, any observer registered with `this` continues firing. The fix eliminates this entirely.

- **Configuration change mid-upload:** The ViewModel survives rotation, but the Fragment is recreated. Without the fix, both the old and new Fragment's observers fire. With the fix, only the new Fragment's observer is active.

- **Deep-link navigation to ProfileFragment:** If a deep link arrives while a previous ProfileFragment is still alive in the back stack, the upload from the back-stack Fragment can still post to the ViewModel's StateFlow — but with `repeatOnLifecycle(STARTED)`, only the foreground Fragment collects.

- **Application context for Glide:** `Glide.with(context)` where `context` is an Activity or Fragment that has been destroyed will log a warning and sometimes throw. Always use `Glide.with(applicationContext)` for background or long-lived loads.

---

## Testing Checklist

- [ ] Open Profile screen → start a photo upload → immediately press Back → confirm **no crash** in logcat or Crashlytics
- [ ] Open Profile screen → start a photo upload → rotate the device mid-upload → upload completes → confirm result appears correctly in the new Fragment instance
- [ ] Open Profile screen → start a photo upload → switch to another tab (bottom nav) → switch back → confirm upload state is restored correctly
- [ ] Open Profile screen → start a photo upload → throttle network to 3G (Developer Options → Network speed) → press Back → confirm no crash
- [ ] Run the app with LeakCanary enabled → complete a photo upload → navigate away → confirm **no Fragment or Activity leak** is reported
- [ ] Enable "Don't keep activities" in Developer Options → start upload → press Home → return to app → confirm no crash and UI state is correct
- [ ] Verify that calling `uploadPhoto()` twice rapidly does not produce two concurrent uploads (second call cancels the first)

---

## Prevention Tips

- **Rule:** Always use `viewLifecycleOwner` when observing LiveData or collecting Flow inside a Fragment. Add this to your code review checklist.
- **Lint:** Enable the AndroidX Lint rule `FragmentLiveDataObserve` — it flags `observe(this)` inside Fragments automatically.
- **Migration:** Replace `MutableLiveData` + `observe()` with `MutableStateFlow` + `repeatOnLifecycle(STARTED)` + `collect {}` in all new Fragments. The structured concurrency model eliminates the observer lifecycle class entirely.
- **Architecture:** ViewModels must never accept `Activity`, `Fragment`, or `View` as parameters. Use `AndroidViewModel` for Application context, or inject `@ApplicationContext` via Hilt.
- **CancellationException:** Never catch `CancellationException` generically. Use `catch (e: Exception) { if (e is CancellationException) throw e; ... }` or separate `catch` blocks.
- **Testing:** Add a `WhenFragmentDetachedTest` to your test suite that verifies ViewModel state changes after `fragmentScenario.recreate()` do not crash the Fragment.
- **Static analysis:** Add `detekt` or `ktlint` rules banning `GlobalScope` and `requireContext()` inside observer callbacks.
