# Example Output — Android Code Reviewer

Full agent response to the input in [`example-input.md`](example-input.md).

---

```
REVIEW SUMMARY
==============
File: app/src/main/java/com/example/socialapp/ui/profile/ProfileViewModel.kt
Layer: ViewModel
Issues Found: 7
Critical: 4  Warning: 2  Info: 1

FINDINGS
--------

[CRITICAL] Line 19 — GlobalScope used instead of viewModelScope
  Problem : GlobalScope is not tied to the ViewModel's lifecycle. When the ViewModel
            is cleared (screen navigated away, process death), the coroutine continues
            running, holding references to the ViewModel's LiveData and potentially the
            Fragment. This is a guaranteed scope leak.
  Fix     : Replace both GlobalScope.launch calls with viewModelScope.launch:
            fun loadUser(userId: String) {
                viewModelScope.launch {
                    ...
                }
            }

[CRITICAL] Line 20 — LiveData.value assigned from a background coroutine thread
  Problem : GlobalScope.launch uses Dispatchers.Default by default. Calling
            isLoading.value = true on a non-Main thread throws CalledFromWrongThreadException
            in debug builds and causes silent data races in release builds.
            LiveData.value can only be set from the Main thread; LiveData.postValue
            is the background-safe alternative, but it introduces a delivery delay.
  Fix     : Either switch the coroutine to the Main dispatcher:
            viewModelScope.launch(Dispatchers.Main) { isLoading.value = true; ... }
            Or migrate isLoading to MutableStateFlow and update it from any thread via .value.
            The cleanest solution is viewModelScope.launch, which defaults to Main.

[CRITICAL] Lines 22 & 42 — UserRepository instantiated directly inside ViewModel
  Problem : new UserRepository() (or UserRepository() in Kotlin) constructs a concrete
            dependency inside the ViewModel. This:
            (1) makes the class impossible to unit-test without the real network/database,
            (2) violates the Dependency Inversion Principle,
            (3) creates a new repository instance on every function call, bypassing any
                caching or connection pooling in the repository.
  Fix     : Inject UserRepository via the constructor. With Hilt:
            @HiltViewModel
            class ProfileViewModel @Inject constructor(
                private val userRepository: UserRepository
            ) : ViewModel() { ... }
            Then use userRepository.getUser(userId) instead of UserRepository().getUser(userId).

[CRITICAL] Lines 36 & 38 — !! force-unwrap on user.value
  Problem : user.value!! will throw NullPointerException if saveProfile() is called before
            loadUser() completes, or if loadUser() failed with an error. The !! operator
            should be treated as a code smell in production ViewModel code — it converts a
            compile-time nullable into a runtime crash.
  Fix     : Use safe navigation and an early return:
            val currentUser = user.value ?: run {
                errorMessage.value = "No user loaded"
                return
            }
            val updated = User(id = currentUser.id, name = name, bio = bio,
                               avatarUrl = currentUser.avatarUrl)

[WARNING]  Line 34 — null check on non-nullable String (always false)
  Problem : name == null is always false because name: String is non-nullable in Kotlin.
            The compiler treats this as a warning. The intent was to guard against an empty
            string, but the null check is dead code that misleads future readers.
  Fix     : Replace with:
            if (name.isBlank()) return
            isBlank() checks for both empty and whitespace-only strings, which is the
            correct guard for a user-facing name field.

[WARNING]  Lines 13–15 — MutableLiveData exposed directly as public properties
  Problem : Exposing MutableLiveData publicly allows any observer to call .value = ...
            from outside the ViewModel, breaking the single-source-of-truth pattern and
            making state mutations untraceable.
  Fix     : Follow the backing property pattern:
            private val _user = MutableLiveData<User>()
            val user: LiveData<User> = _user

            private val _isLoading = MutableLiveData<Boolean>()
            val isLoading: LiveData<Boolean> = _isLoading

[INFO]     Lines 13–15 — Consider migrating from LiveData to StateFlow
  Problem : LiveData is lifecycle-aware but less composable than StateFlow and requires
            Android framework classes (LifecycleOwner) to observe. For new ViewModels,
            StateFlow + collectAsStateWithLifecycle() is the idiomatic Kotlin choice and
            integrates directly with Jetpack Compose.
  Fix     : private val _user = MutableStateFlow<User?>(null)
            val user: StateFlow<User?> = _user.asStateFlow()
            In the Fragment: collect with repeatOnLifecycle(STARTED).

CLEAN ARCHITECTURE ASSESSMENT
------------------------------
Layer boundary respected: No
  → UserRepository() is instantiated directly inside ViewModel. The ViewModel should
    depend on an abstraction (interface), not a concrete repository implementation.
    Inject via Hilt constructor injection.

COROUTINE SAFETY
----------------
Scope leaks detected: Yes
  → Two GlobalScope.launch calls (lines 19 and 41). Both must be replaced with
    viewModelScope.launch. viewModelScope is automatically cancelled in onCleared().

TESTABILITY SCORE: 1/10
  → Direct UserRepository instantiation and GlobalScope make this class effectively
    untestable. After applying the fixes, testability rises to ~8/10.

OVERALL VERDICT: NEEDS WORK
```
