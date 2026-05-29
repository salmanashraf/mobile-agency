# Example Input — Android Code Reviewer

Paste this into your LLM session after applying the system prompt from `agent.md`. The `ProfileViewModel` below contains six intentional issues for the agent to find.

---

```
PLATFORM: Android
KOTLIN_VERSION: 2.0
COMPOSE_VERSION: none
FILE_PATH: app/src/main/java/com/example/socialapp/ui/profile/ProfileViewModel.kt
CODE:
package com.example.socialapp.ui.profile

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.example.socialapp.data.repository.UserRepository
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch

data class User(val id: String, val name: String, val bio: String, var avatarUrl: String?)

class ProfileViewModel : ViewModel() {

    val user = MutableLiveData<User>()
    val isLoading = MutableLiveData<Boolean>()
    val errorMessage = MutableLiveData<String?>()

    fun loadUser(userId: String) {
        GlobalScope.launch {                                  // issue 1
            isLoading.value = true                           // issue 2
            try {
                val result = UserRepository().getUser(userId) // issue 3
                user.value = result
                isLoading.value = false
            } catch (e: Exception) {
                errorMessage.value = e.message
                isLoading.value = false
            }
        }
    }

    fun saveProfile(name: String, bio: String) {
        if (name == null || name.isEmpty()) return           // issue 4
        val updated = User(
            id        = user.value!!.id,                     // issue 5
            name      = name,
            bio       = bio,
            avatarUrl = user.value!!.avatarUrl
        )
        GlobalScope.launch {
            UserRepository().updateUser(updated)             // issue 3 (repeated)
        }
    }

    fun clearError() {
        errorMessage.value = null
    }
}
```

---

## What to Expect

The agent identifies six issues across three severity levels. See [`example-output.md`](example-output.md) for the full report.

**Issue map:**
1. `GlobalScope` instead of `viewModelScope` (line 19) — CRITICAL
2. `isLoading.value = true` called on the coroutine's background thread, not Main (line 20) — CRITICAL
3. `UserRepository()` instantiated directly (line 22 and 42) — CRITICAL
4. `name == null` on a non-nullable `String` (line 34) — WARNING
5. `user.value!!.id` force-unwrap (line 36) — CRITICAL
6. `MutableLiveData` exposed publicly (line 13–15) — WARNING

---

## Variations to Try

### Compose ViewModel
```
PLATFORM: Android
KOTLIN_VERSION: 2.0
COMPOSE_VERSION: 1.7
FILE_PATH: app/src/main/java/com/example/app/ui/feed/FeedViewModel.kt
CODE:
class FeedViewModel : ViewModel() {
    private val _posts = MutableStateFlow<List<Post>>(emptyList())
    val posts = _posts

    fun refresh() {
        viewModelScope.launch {
            _posts.value = PostRepository().getPosts()
        }
    }
}
```
Issues: `_posts` exposed as mutable (should be `.asStateFlow()`), `PostRepository()` direct instantiation.

### Repository Layer
```
PLATFORM: Android
KOTLIN_VERSION: 2.0
COMPOSE_VERSION: none
FILE_PATH: app/src/main/java/com/example/app/data/repository/UserRepositoryImpl.kt
CODE:
import android.content.Context
class UserRepositoryImpl(private val context: Context) : UserRepository {
    override suspend fun getUser(id: String): User {
        val prefs = context.getSharedPreferences("users", Context.MODE_PRIVATE)
        val json = prefs.getString(id, null) ?: throw Exception("Not found")
        return Gson().fromJson(json, User::class.java)
    }
}
```
Issues: Android `Context` in repository (Clean Architecture violation), `Gson().fromJson()` can return null for malformed JSON.
