# Now — Stabilise

Focus: make the existing single-device product safer and more trustworthy **before** commercial packaging.

| ID | Objective | User value | Technical implications | Dependencies | Complexity | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| NOW-001 | Add automated tests for split apply, undo, finish, TT taps, totals/sort | Fewer race-day regressions | Extract pure functions from `_index.tsx` | — | Medium | Critical |
| NOW-002 | Fix empty stage display (`—` / blank vs `00:00:00.0`) | Trustworthy results | UI + maybe DNF rules | — | Low | Critical |
| NOW-003 | Resume in-progress race from home; badge incomplete in `/races` | Recovery & clarity | Read localForage on boot | — | Medium | High |
| NOW-004 | Protect or remove public `/admin` wipe for shared devices | Prevent total loss | Confirm UX / hide route | — | Low | High |
| NOW-005 | Add `schemaVersion` + durable `createdAt` on saved races | Future-safe storage | Migration on read | — | Low | High |
| NOW-006 | Align CI Node version with Node 20 runtime | Build confidence | workflow change | — | Low | Medium |
| NOW-007 | Fix past-race date labelling for non-numeric keys | Clear history | races.tsx | NOW-005 | Low | Medium |
| NOW-008 | Document production URL / AWS health (ops) | Know what’s live | Owner access | Unknown | Low | High |

These items improve today’s tool even if SaaS work waits.
