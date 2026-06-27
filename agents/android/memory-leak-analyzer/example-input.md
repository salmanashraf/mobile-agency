# Example Input — Android Memory Leak Analyzer

```text
APP: SampleShop
ANDROID_VERSION: Android 14 / API 34
DEVICE: Pixel 8 emulator
LEAK_SOURCE: LeakCanary
EXPECTED_LIFECYCLE: ProfileFragment view should be destroyed after navigating away from the Profile screen.
REPRO_STEPS:
- Open Profile screen.
- Tap Edit Profile.
- Rotate the device once.
- Press back to leave Profile.
- Wait for LeakCanary retained-object notification.

LEAK_TRACE:
┬───
│ GC Root: Global variable in native code
│
├─ com.sampleshop.analytics.AnalyticsTracker class
│    Leaking: NO (a class is never leaking)
│    ↓ static AnalyticsTracker.listeners
│                              ~~~~~~~~~
├─ java.util.ArrayList instance
│    Leaking: UNKNOWN
│    ↓ ArrayList[0]
│               ~~~
├─ com.sampleshop.profile.ProfileFragment$onViewCreated$1 instance
│    Leaking: UNKNOWN
│    Anonymous class implementing ProfileEventListener
│    ↓ ProfileFragment$onViewCreated$1.this$0
│                                      ~~~~~~
╰→ com.sampleshop.profile.ProfileFragment instance
     Leaking: YES (ObjectWatcher was watching this because ProfileFragment received Fragment#onDestroy())
     Retaining 1.8 MB in 432 objects

RELATED_CODE:
class AnalyticsTracker @Inject constructor() {
    interface ProfileEventListener {
        fun onProfileEvent(event: String)
    }

    companion object {
        val listeners = mutableListOf<ProfileEventListener>()
    }

    fun addListener(listener: ProfileEventListener) {
        listeners.add(listener)
    }

    fun track(event: String) {
        listeners.forEach { it.onProfileEvent(event) }
    }
}

@AndroidEntryPoint
class ProfileFragment : Fragment(R.layout.fragment_profile) {

    @Inject lateinit var analyticsTracker: AnalyticsTracker
    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        _binding = FragmentProfileBinding.bind(view)

        analyticsTracker.addListener(object : AnalyticsTracker.ProfileEventListener {
            override fun onProfileEvent(event: String) {
                binding.lastEventText.text = event
            }
        })
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
```
