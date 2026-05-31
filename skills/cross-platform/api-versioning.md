# Skill — /api-versioning

**Platform:** Cross-Platform
**Slash Command:** `/api-versioning`

---

## Purpose

API deprecation strategy and migration plan for mobile clients. Handles the "we have users on v1.2 who won't update" reality that backend engineers underestimate.

---

## Skill Prompt

```
Create an API versioning and deprecation strategy for the described API change:

MOBILE CLIENT REALITY:
Mobile clients cannot be force-updated. Users on old versions may remain on them for
12–24 months. Any breaking API change must have a graceful degradation path.

BREAKING vs NON-BREAKING CHANGES:
Non-breaking (safe to ship):
- Adding new optional fields to responses
- Adding new optional request parameters
- Adding new endpoints
- Expanding enum values (with unknown value handling)

Breaking (requires versioning):
- Removing fields from responses
- Changing field types
- Renaming fields
- Changing endpoint URLs
- Making optional fields required
- Removing enum values

VERSIONING STRATEGIES:
1. URL versioning: /v1/users, /v2/users — simple, explicit, but multiplies maintenance.
2. Header versioning: API-Version: 2 — cleaner URLs, harder to test in browser.
3. Query param: /users?version=2 — easy to test, pollutes URLs.
4. Content negotiation: Accept: application/vnd.myapp.v2+json — RESTfully correct.

MIGRATION PLAN FOR MOBILE:
For each breaking change, provide:
1. Transition period: run v1 and v2 in parallel for N months.
2. Client detection: identify client version from User-Agent or app header.
3. Feature flag: gate new behavior on client version ≥ X.
4. Sunset date: minimum 6 months notice for mobile, 12 months recommended.
5. Monitoring: track request distribution by client version before sunset.

MOBILE CLIENT IMPLEMENTATION:
- Handle unknown enum values gracefully (don't crash — use UNKNOWN sentinel).
- Handle missing optional fields (use defaults, not force-unwrap).
- Version the local data model separately from the API model.
  Map API v1 and v2 responses to the same domain model in the repository layer.

Output a complete migration plan with timeline and client-side implementation guide.
```
