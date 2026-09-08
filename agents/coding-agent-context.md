# Coding agent context — Split Times

Load this file before changing the application at [daryl-sf/split-times](https://github.com/daryl-sf/split-times).

## What the product is

**Split Times** is a browser app for recording **mass-start multi-stage split times** and **time-trial start/finish times**. Primary operator: a **timekeeper on one device**. Data today lives in **IndexedDB via localForage**, not a server DB.

## Who it serves

- **Today:** anonymous timekeeper / coach on a phone or tablet
- **Commercial target:** triathlon/running/cycling clubs and small organisers (payers) with volunteer operators

## Core domain (current)

- `RaceInfo`, `RunnerSplitTime` + `Stage`, `TimeTrialRunner`
- Runners are **bib integers**, not athlete profiles
- Mass-start `stage.time` values are **incremental durations**; total = sum
- TT elapsed = `finishTime - startTime`; unfinished → DNF in results UI

## Important business rules

See `context/business-rules.md`. Especially:

- Splits only while mass-start timer running
- Stages fill in order; undo clears latest non-zero stage
- Autosave after timing mutations
- `/admin` clears all local data — **no auth**

## Architecture constraints

- Remix 2 + Architect (AWS `eu-west-1`), thin server
- Almost all domain logic is client-side (`app/routes/_index.tsx` + components)
- **Do not assume** multi-tenancy, auth, offline sync protocol, or server race APIs exist — they do not

## Technical risks

- Device-local data loss
- Minimal tests (timing logic largely untested)
- Empty stages display as `00:00:00.0`
- Public admin wipe
- Mutable timing fields without audit log

## Current priorities

1. Stabilise: tests, results empty-state, resume/incomplete UX, admin safety, schemaVersion (`roadmap/now.md`)
2. Then Commercial MVP: orgs, auth, durable store, sync, export (`roadmap/next.md`)

## Do not casually change

- Split duration calculation semantics
- Autosave keying behaviour without migration plan
- Race finish / undo semantics without tests + doc updates
- Deployment region/runtime without ops awareness

## Where to look next

| Need | Doc |
| --- | --- |
| Glossary | `context/terminology.md` |
| Features | `current-state/feature-inventory.md` |
| ADRs | `decisions/` |
| Gaps | `gaps/` |
| Process | `agents/workflow.md` |

## Evidence labels

Confirmed / Partial / Intended / Proposed / Unknown — do not invent requirements.
