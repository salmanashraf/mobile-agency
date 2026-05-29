# Prompt — Generate Android Unit Test

**Platform:** Android (Kotlin)  
**Category:** Code Quality  
**Type:** one-shot

---

## Purpose

Generates a JUnit 5 + MockK unit test for an Android Kotlin class (ViewModel, UseCase, Repository, or Mapper).

---

## Prompt

```
You are a senior Android engineer. Generate a complete, compilable JUnit 5 + MockK unit test
for the class below. Follow these rules:

1. Use @ExtendWith(MockKExtension::class) for MockK integration.
2. Use @MockK for dependencies; @InjectMockKs or manual construction for the class under test.
3. For ViewModel tests: use TestCoroutineDispatcher (or UnconfinedTestDispatcher in 1.6+)
   and Dispatchers.setMain / Dispatchers.resetMain in @BeforeEach / @AfterEach.
4. For StateFlow/Flow tests: use turbine (app.cash.turbine) to collect emissions.
5. Name tests using the format: `fun given_<state>_when_<action>_then_<expected>()`
6. Cover: happy path, error/exception path, edge cases (empty list, null input, zero count).
7. Do not test private methods — test through public API.
8. Use coEvery / coVerify for suspend functions.
9. Add a @TestInstance(TestInstance.Lifecycle.PER_CLASS) annotation.
10. Output a complete test file including imports, class declaration, and all test methods.

Class to test:
```
[PASTE YOUR CLASS HERE]
```
```

---

## Example Usage

**What you paste:**
```
You are a senior Android engineer. Generate a complete, compilable JUnit 5 + MockK unit test...

Class to test:
```
class GetUserProfileUseCase(private val repository: UserRepository) {
    suspend operator fun invoke(userId: String): Result<UserProfile> {
        if (userId.isBlank()) return Result.failure(IllegalArgumentException("userId is blank"))
        return try {
            Result.success(repository.getProfile(userId))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
```
```

**Expected output:**
```kotlin
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.mockk
import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class GetUserProfileUseCaseTest {

    private val repository: UserRepository = mockk()
    private lateinit var useCase: GetUserProfileUseCase

    @BeforeEach
    fun setUp() {
        useCase = GetUserProfileUseCase(repository)
    }

    @Test
    fun `given valid userId when invoked then returns success with profile`() = runTest {
        val profile = UserProfile(id = "user-1", name = "Alice")
        coEvery { repository.getProfile("user-1") } returns profile

        val result = useCase("user-1")

        assertTrue(result.isSuccess)
        assertEquals(profile, result.getOrNull())
        coVerify(exactly = 1) { repository.getProfile("user-1") }
    }

    @Test
    fun `given blank userId when invoked then returns failure without calling repository`() = runTest {
        val result = useCase("")

        assertTrue(result.isFailure)
        assertInstanceOf(IllegalArgumentException::class.java, result.exceptionOrNull())
        coVerify(exactly = 0) { repository.getProfile(any()) }
    }

    @Test
    fun `given repository throws when invoked then returns failure`() = runTest {
        val exception = RuntimeException("Network error")
        coEvery { repository.getProfile(any()) } throws exception

        val result = useCase("user-1")

        assertTrue(result.isFailure)
        assertEquals(exception, result.exceptionOrNull())
    }
}
```

---

## Variations

- **For ViewModel with StateFlow:** Append "Use `app.cash.turbine` to collect StateFlow emissions. Test that the state transitions from Loading → Success → Error correctly."
- **For Room DAO:** Append "Use an in-memory Room database (`Room.inMemoryDatabaseBuilder`) instead of mocking — DAOs should not be mocked."
- **For Compose UI:** Append "Use `createComposeRule()` and test composable state via `onNodeWithText`, `performClick`, and `assertIsDisplayed`."
