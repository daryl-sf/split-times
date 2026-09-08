# Technical debt

Engineering issues grounded in the current repo. Prefer incremental remediation.

| ID | Issue | Evidence | Risk | Suggested approach | Priority |
| --- | --- | --- | --- | --- | --- |
| TD-001 | Critical timing logic untested | Only `utils.test.ts` | Regressions on race day | Unit tests for split apply/undo/finish/TT | Critical |
| TD-002 | Monolithic `_index.tsx` state machine | Large route file | Hard to change safely | Extract hooks/domain functions without behaviour change | High |
| TD-003 | No schema versioning for stored races | localForage payloads | Future migrations break silently | Add `schemaVersion` | High |
| TD-004 | Fragile race list key/date parsing | `races.tsx` `parseInt(key)` | Bad labels / sort | Store `createdAt` in payload; don’t parse key | Medium |
| TD-005 | CI Node 18 vs app Node 20 | workflow vs `app.arc` / engines | “Works in CI ≠ prod” | Align to 20 | Medium |
| TD-006 | npm audit vulnerabilities reported at install | npm audit output | Supply-chain risk | Audit cadence; update deps | Medium |
| TD-007 | README region drift (`us-west-2` text vs `eu-west-1`) | README vs `app.arc` | Operator confusion | Fix docs in app repo | Low |
| TD-008 | Remix stack leftovers (`SESSION_SECRET`, MSW ping) unused for product | env/README | False security assumptions | Document or remove | Low |
| TD-009 | Mutating timing model without audit log | setState overwrites stage times | Irreversible mistakes | Toward append-only records | High (product+tech) |
| TD-010 | No error tracking | no Sentry/etc. | Blind production failures | Add when server-backed | Medium |
| TD-011 | `race.$id` hangs on missing data (loading state without not-found) | loader always returns id; client may never get raceInfo | Confusing empty load | Explicit not-found UI | Medium |
| TD-012 | Duplicate interval management complexity | multiple `setInterval` paths | Timer bugs historically | Centralise clock hook + tests | Medium |

**Do not** rewrite the Remix app wholesale because of these items.
