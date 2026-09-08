# API inventory (current)

## First-party HTTP APIs

**Confirmed:** There is **no** dedicated race-timing REST/GraphQL API.

| Endpoint pattern | Method | Purpose | Auth |
| --- | --- | --- | --- |
| `/*` | ANY | Remix document/data requests + static | None |

### Remix loaders/actions

| Route module | Loader | Action | Notes |
| --- | --- | --- | --- |
| `app/routes/_index.tsx` | No | No | Pure client state |
| `app/routes/races.tsx` | No | No | Client localForage |
| `app/routes/race.$id.tsx` | Yes — returns `{ id }` | No | Does not load race data server-side |
| `app/routes/admin.tsx` | No | No | Client clear |

## Client “API” (storage)

| Operation | Interface | Status |
| --- | --- | --- |
| Save race | `localforage.setItem(key, payload)` | Confirmed |
| Load race | `localforage.getItem(key)` | Confirmed |
| List races | `localforage.keys()` + getItem | Confirmed |
| Delete race | `localforage.removeItem(key)` | Confirmed |
| Reset all | `localforage.clear()` | Confirmed |

## External HTTP

- **Confirmed:** MSW mock only for Remix dev ping in `test/mocks`
- **Confirmed absent:** Third-party product integrations

## Proposed future APIs (not implemented)

Documented under requirements / target architecture — e.g. org-scoped race CRUD, timing event ingest, results export — **Proposed** only.
