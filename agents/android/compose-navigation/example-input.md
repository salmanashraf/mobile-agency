# Example Input

```text
MODE: GENERATE
PACKAGE: com.example.catalog
NAVIGATION_VERSION: 2.8.9
KOTLIN_VERSION: 2.0
MODULES:
- :app
- :feature:home
- :feature:search
- :feature:favorites
- :feature:profile
- :feature:product

SCREENS:
- Home — no arguments
- Search — optional initialQuery: String
- Favorites — no arguments
- Profile — no arguments
- Settings — no arguments
- ProductDetail — productId: String
- SignIn — optional redirectProductId: String

FLOWS:
- Home, Search, Favorites, and Profile are top-level destinations.
- Product cards open ProductDetail.
- Settings opens from Profile.
- Unauthenticated users opening ProductDetail go to SignIn, then continue to ProductDetail.
- Back from ProductDetail returns to the previous tab.

BOTTOM_NAVIGATION:
- Home
- Search
- Favorites
- Profile

DEEP_LINKS:
- https://catalog.example.com/products/{productId} -> ProductDetail

AUTH_RULES:
- Home, Search, Favorites, and Profile are public.
- ProductDetail requires authentication.
- Preserve productId through sign-in.

EXISTING_CODE:
None.
```

