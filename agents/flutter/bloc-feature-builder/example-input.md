# Example Input — Flutter BLoC Feature Builder

---

```
FEATURE_NAME: ProductCatalog

PATTERN: cubit

DESCRIPTION:
A product catalog screen that displays a paginated grid of products fetched from a REST API.
Each product card shows: product image (from URL), product name, price (formatted as currency),
and a rating (stars 1–5). The user can filter by category using a horizontal chip row at the top.
Selecting a chip reloads the list for that category. Tapping a product card navigates to the
Product Detail screen. The screen supports pull-to-refresh. Pagination: load 20 products per
page, append more as the user scrolls to the bottom. Empty state: "No products found" with
a refresh button. Error state: "Failed to load products" with a retry button.

API_ENDPOINT: GET /v1/products

REQUEST_PARAMS:
- category (String, optional) — filter products by category slug, e.g. "electronics"
- page (int, required) — page number starting at 1
- limit (int, required) — number of results per page (always 20)

RESPONSE_FIELDS:
- data: List<Object> — array of product objects
  - id: String — unique product identifier
  - name: String — product display name
  - price: double — product price in USD
  - imageUrl: String — URL of the product thumbnail
  - rating: double — average rating 1.0–5.0
  - category: String — category slug
- meta.total: int — total number of products for the current filter
- meta.page: int — current page number
- meta.hasMore: bool — whether more pages are available

ACTIONS:
- Load initial products — fetch page 1 on screen entry
- Filter by category — reset to page 1 and reload for selected category
- Load more — fetch next page and append to current list (triggered by scroll)
- Pull-to-refresh — reset to page 1 and reload current category
- Retry — reload after error

FLUTTER_VERSION: 3.27
DART_VERSION: 3.6
```
