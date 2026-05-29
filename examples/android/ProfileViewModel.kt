// Paired with: agents/android/code-reviewer/agent.md
// This file contains intentional issues for the code reviewer agent to find.
// Do not use this as production code.

package com.example.profile

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch

data class User(val id: String, val name: String, val bio: String)

class UserRepository {
    suspend fun getUser(id: String): User = User(id, "Alice", "Developer")
    suspend fun updateUser(user: User) {}
}

class ProfileViewModel : ViewModel() {

    val user = MutableLiveData<User>()

    fun loadUser(userId: String) {
        GlobalScope.launch {
            val result = UserRepository().getUser(userId)
            user.value = result
        }
    }

    fun saveProfile(name: String, bio: String) {
        if (name == null || name.isEmpty()) return
        val updated = User(id = user.value!!.id, name = name, bio = bio)
        GlobalScope.launch {
            UserRepository().updateUser(updated)
        }
    }
}
