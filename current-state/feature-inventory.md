# Feature inventory (current)

Status values: **Complete** · **Mostly complete** · **Partial** · **Fragile** · **Experimental** · **Deprecated** · **Missing**

---

## F-001 — Race setup

| Field | Value |
| --- | --- |
| Description | Configure optional name, race type, runner count, stage count (mass start), input mode (mass start) |
| User | Timekeeper |
| Status | Mostly complete |
| Evidence | Manual UI test; `RaceSetupForm.tsx` |
| Implementation | `app/components/RaceSetupForm.tsx`, `app/routes/_index.tsx` |
| Limitations | No athlete list import; no templates; no validation beyond empty counts; stage meaning free-form |
| Bugs | None confirmed |
| Dependencies | None |

## F-002 — Mass start timer

| Field | Value |
| --- | --- |
| Description | Shared race clock with Start / Finish |
| User | Timekeeper |
| Status | Mostly complete |
| Evidence | Code + manual test |
| Implementation | `_index.tsx` `onStartTimer`, `RaceHeader` |
| Limitations | Uses device `Date.now()`; no gun-time offset; no countdown |
| Bugs | None confirmed |
| Dependencies | Wake lock (optional enhancement) |

## F-003 — Button input mode

| Field | Value |
| --- | --- |
| Description | One tile per runner; tap to record next stage; per-runner undo |
| User | Timekeeper |
| Status | Complete |
| Evidence | `RunnerButton.tsx` |
| Implementation | `app/components/RunnerButton.tsx` |
| Limitations | Crowded for large fields; less ideal for 100+ runners |
| Dependencies | Mass start |

## F-004 — Keypad input mode

| Field | Value |
| --- | --- |
| Description | Enter bib number + Enter to record; tiles show progress; tap tile to undo; redo toast |
| User | Timekeeper |
| Status | Mostly complete |
| Evidence | Manual test; `Keypad.tsx`, `KeypadRunnerTile.tsx`, `UndoToast.tsx` |
| Implementation | `_index.tsx` keypad handlers |
| Limitations | Easy to mistype bib; no confirmation of recorded bib beyond tile update |
| Dependencies | Mass start |

## F-005 — Time trial mode

| Field | Value |
| --- | --- |
| Description | Per-runner waiting → running → done via taps; progress counter; undo |
| User | Timekeeper / coach |
| Status | Mostly complete |
| Evidence | Manual test; commit `add TT mode` |
| Implementation | `TimeTrialRunnerButton.tsx`, TT handlers in `_index.tsx` |
| Limitations | No scheduled start gaps; no distance/effort metadata; in-progress TT appears in past races list |
| Bugs | Partial — leaving mid-TT still creates a past-race entry |
| Dependencies | localForage autosave |

## F-006 — Undo / redo

| Field | Value |
| --- | --- |
| Description | Undo last split (mass start) or start/finish (TT); keypad redo toast 5s |
| User | Timekeeper |
| Status | Mostly complete |
| Evidence | Code + history “fix stale closures and redo bug” |
| Limitations | Cannot edit arbitrary earlier stages without undoing forward; no audit log of undos |
| Dependencies | — |

## F-007 — Autosave / local persistence

| Field | Value |
| --- | --- |
| Description | Save race payload to IndexedDB after timing mutations and on finish |
| User | Timekeeper (invisible) |
| Status | Partial / Fragile |
| Evidence | `localforage.setItem` calls; past races UI |
| Implementation | `_index.tsx`, `races.tsx`, `race.$id.tsx` |
| Limitations | Single device; no backup; key strategies differ slightly for TT; no schema versioning; clearing browser data loses everything |
| Dependencies | localForage |

## F-008 — Results view

| Field | Value |
| --- | --- |
| Description | Table of stage/total or TT elapsed; sort bib/position; copy text |
| User | Timekeeper / organiser on same device |
| Status | Mostly complete |
| Evidence | Manual test; `SplitTime.tsx` |
| Limitations | Zero stages look like valid times; no export CSV/PDF; no share URL; copy is plain text only |
| Dependencies | Saved race data |

## F-009 — Past races list

| Field | Value |
| --- | --- |
| Description | List local races newest-first; open; delete with confirm |
| User | Same-device user |
| Status | Partial |
| Evidence | Manual test; `races.tsx` |
| Limitations | Includes in-progress autosaved races; TT keys without numeric start may show Invalid Date (`parseInt` on key); no search/filter/archive |
| Bugs | Fragile date parsing when key is not numeric |
| Dependencies | localForage keys |

## F-010 — Screen wake lock

| Field | Value |
| --- | --- |
| Description | Request screen wake lock when timing starts |
| User | Timekeeper |
| Status | Partial |
| Evidence | `useWakeLock.ts` |
| Limitations | Browser support varies; failures only `console.warn` |
| Dependencies | Secure context / browser API |

## F-011 — Navigation guard

| Field | Value |
| --- | --- |
| Description | `beforeunload` while race running / race view active (conditions in code) |
| User | Timekeeper |
| Status | Partial |
| Evidence | `_index.tsx` |
| Limitations | Does not prevent all mobile browser dismissals; not a durability strategy |

## F-012 — Admin reset

| Field | Value |
| --- | --- |
| Description | Clear all localForage data |
| User | Anyone with URL |
| Status | Complete but insecure for multi-user future |
| Evidence | `admin.tsx` |
| Limitations | No auth; irreversible |

## F-013 — Error boundaries

| Field | Value |
| --- | --- |
| Description | Route/root error UI with reload links |
| User | Anyone |
| Status | Mostly complete |
| Evidence | `root.tsx` and route files |

## Missing feature areas (inventory pointers)

See [`../gaps/feature-gaps.md`](../gaps/feature-gaps.md) for: auth, orgs, athlete registry, multi-device sync, offline package, categories, exports, billing, public results, audit log, backups, etc.
