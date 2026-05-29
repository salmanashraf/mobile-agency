# Example Input — Android Crash Analyzer

This is a real-world crash scenario. Paste this into your LLM session after applying the system prompt from `agent.md`, or replace the `CRASH_LOG` and `RELATED_CODE` sections with your own.

---

```
PLATFORM: Android
APP_VERSION: 3.7.1 (build 412)
OS_VERSION: Android 13 — API 33
DEVICE: Google Pixel 7
USER_ACTION: User tapped the back button while the profile photo was uploading. The upload progress dialog was still visible when they navigated back.

CRASH_LOG:
Fatal Exception: java.lang.IllegalStateException: Fragment ProfileFragment{3a1b2c3} (b4c5d6e7-f8a9-0b1c-2d3e-4f5a6b7c8d9e) not attached to a context.
	at androidx.fragment.app.Fragment.requireContext(Fragment.java:947)
	at com.example.socialapp.ui.profile.ProfileFragment.showUploadSuccess(ProfileFragment.kt:124)
	at com.example.socialapp.ui.profile.ProfileFragment$observeViewModel$1.onChanged(ProfileFragment.kt:89)
	at androidx.lifecycle.LiveData.considerNotify(LiveData.java:133)
	at androidx.lifecycle.LiveData.dispatchingValue(LiveData.java:151)
	at androidx.lifecycle.LiveData.setValue(LiveData.java:309)
	at androidx.lifecycle.MutableLiveData.setValue(MutableLiveData.java:50)
	at androidx.lifecycle.LiveData$1.run(LiveData.java:91)
	at android.os.Handler.handleMessage(Handler.java:942)
	at android.os.Looper.loopOnce(Looper.java:201)
	at android.os.Looper.loop(Looper.java:288)
	at android.app.ActivityThread.main(ActivityThread.java:7872)
	at java.lang.reflect.Method.invoke(Method.java)
	at com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:548)
	at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:936)

RELATED_CODE:
// ProfileFragment.kt
class ProfileFragment : Fragment(R.layout.fragment_profile) {

    private val viewModel: ProfileViewModel by viewModels()
    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        _binding = FragmentProfileBinding.bind(view)

        viewModel.uploadState.observe(this) { state ->   // line 89 — observing with 'this' not viewLifecycleOwner
            when (state) {
                is UploadState.Success -> showUploadSuccess(state.photoUrl)
                is UploadState.Error   -> showError(state.message)
                else -> Unit
            }
        }

        binding.uploadButton.setOnClickListener {
            viewModel.uploadPhoto(requireContext(), getSelectedBitmap())
        }
    }

    private fun showUploadSuccess(photoUrl: String) {
        val ctx = requireContext()   // line 124 — throws if Fragment is detached
        Snackbar.make(ctx, binding.root, "Photo updated!", Snackbar.LENGTH_SHORT).show()
        Glide.with(ctx).load(photoUrl).into(binding.avatarImage)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

// ProfileViewModel.kt
class ProfileViewModel @Inject constructor(
    private val photoRepository: PhotoRepository
) : ViewModel() {

    private val _uploadState = MutableLiveData<UploadState>()
    val uploadState: LiveData<UploadState> = _uploadState

    fun uploadPhoto(context: Context, bitmap: Bitmap) {
        viewModelScope.launch {
            _uploadState.value = UploadState.Loading
            try {
                val url = photoRepository.uploadPhoto(context, bitmap)
                _uploadState.value = UploadState.Success(url)
            } catch (e: Exception) {
                _uploadState.value = UploadState.Error(e.message ?: "Upload failed")
            }
        }
    }
}
```

---

## What to Expect

Running this input through the crash analyzer agent produces a full 9-section report. See [`example-output.md`](example-output.md) for the complete analysis.

**Key issues the agent should identify:**

1. Observer registered with `this` (Fragment) instead of `viewLifecycleOwner` — accumulates duplicate observers across configuration changes and fires after the view is destroyed
2. `requireContext()` called inside an observer callback that can fire after the Fragment is detached
3. `Context` passed into `ViewModel.uploadPhoto()` — the ViewModel holds a `Context` reference, creating a memory leak
4. No `UploadState.Loading` UI feedback cancellation when the user navigates away mid-upload

---

## Variations to Try

Replace the crash log to test other scenarios:

### ANR Scenario
```
USER_ACTION: App was open on the home screen. User did nothing for 10 seconds.
CRASH_LOG:
ANR in com.example.socialapp (com.example.socialapp/.ui.home.HomeActivity)
PID: 12345
Reason: Input dispatching timed out (Waiting to send non-key input event because the touched window has not finished processing certain input events that were delivered to it over 500.0ms ago.  Wait queue length: 2.  Wait queue head age: 8510.2ms.)
...
----- pid 12345 at 2025-05-29 10:30:45 -----
Cmd line: com.example.socialapp

"main" prio=5 tid=1 Blocked
  | group="main" sCount=1 dsCount=0 flags=1 obj=0x71a2b3c4 self=0x71a2b3c5
  | sysTid=12345 nice=-10 cgrp=top-app sched=0/0 handle=0x71a2b3c6
  at com.example.socialapp.data.local.AppDatabase.query(AppDatabase.kt:0)
  - waiting to lock <0x0a1b2c3d> (a com.example.socialapp.data.local.AppDatabase) held by thread 2
  at com.example.socialapp.ui.home.HomeViewModel$loadFeed$1.invokeSuspend(HomeViewModel.kt:45)
```

### Coroutine Crash Scenario
```
USER_ACTION: User refreshed the feed by pulling down.
CRASH_LOG:
Fatal Exception: kotlinx.coroutines.JobCancellationException: StandaloneCoroutine was cancelled
Caused by: java.net.UnknownHostException: Unable to resolve host "api.socialapp.com": No address associated with hostname
	at com.example.socialapp.data.remote.FeedApi.getFeed(FeedApi.kt:0)
	at com.example.socialapp.data.repository.FeedRepository.refreshFeed(FeedRepository.kt:38)
	at com.example.socialapp.ui.home.HomeViewModel$refresh$1.invokeSuspend(HomeViewModel.kt:52)
```
