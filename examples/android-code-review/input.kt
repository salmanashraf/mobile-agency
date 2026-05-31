// ProfileViewModel.kt — intentionally bad code for AXIOM review example
// This is the "before" state — see output.md for AXIOM's full analysis

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
