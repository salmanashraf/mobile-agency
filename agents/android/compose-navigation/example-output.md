# Example Output

## Navigation Architecture

Mode: `GENERATE`  
Verdict: `GENERATED`

### Graph

```text
AppGraph
├── Home
├── Search(initialQuery?)
├── Favorites
├── Profile
├── Settings
├── AuthGraph
│   └── SignIn(redirectProductId?)
└── ProductDetail(productId)
```

Top-level tabs are direct destinations so each tab can save and restore its state. Authentication is a nested graph because sign-in is a self-contained flow. Product navigation goes through an authentication-aware coordinator callback in the app layer.

## Files

### File: `app/navigation/AppRoute.kt`

```kotlin
package com.example.catalog.navigation

import kotlinx.serialization.Serializable

sealed interface AppRoute {
    @Serializable
    data object Home : AppRoute

    @Serializable
    data class Search(val initialQuery: String? = null) : AppRoute

    @Serializable
    data object Favorites : AppRoute

    @Serializable
    data object Profile : AppRoute

    @Serializable
    data object Settings : AppRoute

    @Serializable
    data class ProductDetail(val productId: String) : AppRoute

    @Serializable
    data object AuthGraph : AppRoute

    @Serializable
    data class SignIn(val redirectProductId: String? = null) : AppRoute
}
```

### File: `app/navigation/TopLevelDestination.kt`

```kotlin
package com.example.catalog.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.Search
import androidx.compose.ui.graphics.vector.ImageVector

enum class TopLevelDestination(
    val route: AppRoute,
    val label: String,
    val icon: ImageVector,
) {
    HOME(AppRoute.Home, "Home", Icons.Outlined.Home),
    SEARCH(AppRoute.Search(), "Search", Icons.Outlined.Search),
    FAVORITES(AppRoute.Favorites, "Favorites", Icons.Outlined.FavoriteBorder),
    PROFILE(AppRoute.Profile, "Profile", Icons.Outlined.Person),
}
```

### File: `app/navigation/NavControllerExtensions.kt`

```kotlin
package com.example.catalog.navigation

import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController

fun NavHostController.navigateToTopLevel(
    destination: TopLevelDestination,
) {
    navigate(destination.route) {
        popUpTo(graph.findStartDestination().id) {
            saveState = true
        }
        launchSingleTop = true
        restoreState = true
    }
}
```

### File: `app/navigation/AppNavHost.kt`

```kotlin
package com.example.catalog.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.navigation
import androidx.navigation.toRoute
import com.example.catalog.feature.favorites.FavoritesScreen
import com.example.catalog.feature.home.HomeScreen
import com.example.catalog.feature.product.ProductDetailScreen
import com.example.catalog.feature.profile.ProfileScreen
import com.example.catalog.feature.profile.SettingsScreen
import com.example.catalog.feature.search.SearchScreen
import com.example.catalog.feature.signin.SignInScreen

@Composable
fun AppNavHost(
    navController: NavHostController,
    isAuthenticated: () -> Boolean,
) {
    fun openProduct(productId: String) {
        val route = if (isAuthenticated()) {
            AppRoute.ProductDetail(productId)
        } else {
            AppRoute.SignIn(redirectProductId = productId)
        }
        navController.navigate(route)
    }

    NavHost(
        navController = navController,
        startDestination = AppRoute.Home,
    ) {
        composable<AppRoute.Home> {
            HomeScreen(onProductClick = ::openProduct)
        }

        composable<AppRoute.Search> { entry ->
            val route = entry.toRoute<AppRoute.Search>()
            SearchScreen(
                initialQuery = route.initialQuery,
                onProductClick = ::openProduct,
            )
        }

        composable<AppRoute.Favorites> {
            FavoritesScreen(onProductClick = ::openProduct)
        }

        composable<AppRoute.Profile> {
            ProfileScreen(
                onSettingsClick = {
                    navController.navigate(AppRoute.Settings)
                },
            )
        }

        composable<AppRoute.Settings> {
            SettingsScreen(onBack = navController::navigateUp)
        }

        composable<AppRoute.ProductDetail>(
            deepLinks = listOf(
                androidx.navigation.navDeepLink<AppRoute.ProductDetail>(
                    basePath = "https://catalog.example.com/products",
                ),
            ),
        ) { entry ->
            val route = entry.toRoute<AppRoute.ProductDetail>()
            ProductDetailScreen(
                productId = route.productId,
                onBack = navController::navigateUp,
            )
        }

        navigation<AppRoute.AuthGraph>(
            startDestination = AppRoute.SignIn(),
        ) {
            composable<AppRoute.SignIn> { entry ->
                val route = entry.toRoute<AppRoute.SignIn>()
                SignInScreen(
                    onSignedIn = {
                        val redirect = route.redirectProductId
                        if (redirect == null) {
                            navController.popBackStack()
                        } else {
                            navController.navigate(
                                AppRoute.ProductDetail(redirect),
                            ) {
                                popUpTo<AppRoute.SignIn> {
                                    inclusive = true
                                }
                            }
                        }
                    },
                    onCancel = navController::navigateUp,
                )
            }
        }
    }
}
```

### File: `feature/product/ProductDetailViewModel.kt`

```kotlin
package com.example.catalog.feature.product

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.navigation.toRoute
import com.example.catalog.navigation.AppRoute
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject

@HiltViewModel
class ProductDetailViewModel @Inject constructor(
    savedStateHandle: SavedStateHandle,
) : ViewModel() {
    private val route = savedStateHandle.toRoute<AppRoute.ProductDetail>()

    val productId: String = route.productId
}
```

### File: `app/navigation/AppNavigationTest.kt`

```kotlin
package com.example.catalog.navigation

import androidx.compose.ui.test.junit4.createComposeTestRule
import androidx.navigation.compose.ComposeNavigator
import androidx.navigation.hasRoute
import androidx.navigation.testing.TestNavHostController
import androidx.test.core.app.ApplicationProvider
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Rule
import org.junit.Test

class AppNavigationTest {
    @get:Rule
    val composeRule = createComposeTestRule()

    private lateinit var navController: TestNavHostController

    @Before
    fun setUp() {
        navController = TestNavHostController(
            ApplicationProvider.getApplicationContext(),
        ).apply {
            navigatorProvider.addNavigator(ComposeNavigator())
        }
    }

    @Test
    fun startsOnHome() {
        composeRule.setContent {
            AppNavHost(
                navController = navController,
                isAuthenticated = { true },
            )
        }

        assertTrue(
            navController.currentBackStackEntry
                ?.destination
                ?.hasRoute<AppRoute.Home>() == true,
        )
    }
}
```

## Back-Stack Rules

1. Top-level tab navigation saves and restores state.
2. `launchSingleTop` prevents duplicate tab destinations.
3. Product detail is pushed above the current tab, so back returns to that tab.
4. Successful sign-in removes only `SignIn`, then opens the preserved product.
5. Settings is pushed above Profile and uses `navigateUp()`.

## Deep-Link Rules

1. Accept only the HTTPS host `catalog.example.com`.
2. Parse `productId` through the typed route.
3. Validate that `productId` is non-blank before loading data.
4. If unauthenticated, preserve the ID and enter `AuthGraph`.
5. Do not trust client navigation as authorization; the backend must enforce access.

## Test Plan

- Verify the graph starts on Home.
- Verify tapping a product opens typed `ProductDetail`.
- Verify unauthenticated product navigation opens SignIn.
- Verify successful sign-in removes SignIn and opens the intended product.
- Verify switching tabs restores scroll/state and does not duplicate tabs.
- Verify back from ProductDetail returns to the originating tab.
- Verify the HTTPS product deep link opens the correct product.
- Verify malformed or blank product IDs show a safe error state.

## Review Findings

Not applicable.

## Dependencies

```kotlin
plugins {
    kotlin("plugin.serialization")
}

dependencies {
    implementation("androidx.navigation:navigation-compose:2.8.9")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.3")
    androidTestImplementation("androidx.navigation:navigation-testing:2.8.9")
}
```
