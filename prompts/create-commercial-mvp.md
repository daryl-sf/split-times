# Prompt: Create Split Times Commercial MVP

Paste this entire document into a coding agent (or hand it to a developer) as the brief for building the commercial MVP.

---

# Build Split Times Commercial MVP

## Mission

Build a **new commercial MVP** of **Split Times**: a club-oriented race timing product for small triathlon, running, and cycling clubs / local organisers.

Do **not** build a full chip-timing platform, athlete social network, or club OS (membership/finance/booking). Do **not** market multi-device concurrent timing yet.

**MVP exit criteria:** A club admin can create an organisation, invite a timekeeper, run a race on a phone/tablet, and later retrieve/export results from another device.

## Who it is for

| Role | Needs |
| --- | --- |
| **Organisation (payer)** | Club/organiser owns the data |
| **Admin** | Create org, invite users, manage races, export, delete |
| **Timekeeper** | Fast race-day capture on mobile |
| Athlete/public | Out of scope for MVP (no public results portal required) |

## What already works (preserve these behaviours)

The existing app (`daryl-sf/split-times`) is a Remix browser tool with **device-local** IndexedDB storage. Preserve its race-day UX semantics:

### Mass start

- Shared clock; Start required before splits
- Configurable runner count + stage count
- Input modes: **Buttons** (one tile per bib) and **Keypad** (type bib + Enter)
- Stage times are **incremental durations**: `stage = (now - raceStart) - sum(previous stages)`
- Total = sum of stage times
- Undo last stage per runner; keypad undo has short redo toast
- Finish with confirmation; auto-finish when all stages filled
- Tenths-of-a-second display

### Time trial

- Tap bib to start, tap again to finish
- Elapsed = finish − start; unfinished = DNF
- Undo clears finish then start
- Progress counter (finished/total)

### Results

- Table with sort by Bib # or Position
- Missing/unrecorded stages must show **“—” / blank**, never `00:00:00.0`
- CSV export required (clipboard-only is not enough)

## What is broken / insufficient today (must fix in MVP)

- All data dies with the browser/device
- No auth, orgs, or roles
- Public `/admin` wipe
- In-progress races clutter history without clear status
- No resume-race flow
- Timing logic largely untested
- Mutable overwrite model with no audit trail

## MVP product scope (build this)

### 1. Organisation + auth

- Organisation is the tenant root (`organisationId` on all durable records)
- Auth (magic link or OAuth — pick one boring option)
- Roles: **admin**, **timekeeper**
- Admin can invite timekeepers
- Every server query is org-scoped; never bypass authz

### 2. Durable race storage

- Server DB (Postgres or equivalent) is system of record
- Local capture remains local-first for race day
- Sync to server for **one authoritative timing device per race**
- Show clear sync/backup status in UI
- Soft-delete or role-gated destructive deletes (no public wipe)

### 3. Race setup + participants

- Optional race name
- Race type: mass start | time trial
- Bib numbers `1..N`
- Optional display names per bib
- Mass start: stage count + input mode
- Resume in-progress races; badge incomplete vs finished in history

### 4. Timing integrity

- Prefer **append-only timing events** server-side (`split_recorded`, `split_undone`, `runner_started`, `runner_finished`, `race_finished`) with derived results
- Client may keep a fast mutable working view, but must flush events
- Autosave locally after every timing mutation; survive refresh on same device

### 5. Results + export

- Results view with bib/position sort
- CSV export
- Org race archive accessible from another device after sync

### 6. Hardening baked in

- Automated tests for: split apply, undo, finish, TT start/finish, totals/sort, authz isolation
- Empty stages never look like real zero times
- Finish confirmation retained
- Screen wake lock when available
- Mobile-first UI (large tap targets)

## Explicit non-goals for this MVP

- Multi-device concurrent writers / CRDTs
- Chip/RFID hardware
- Categories/age groups/federation rankings
- Public spectator results site
- Billing/Stripe (structure data for it later; not required to ship pilot)
- Native iOS/Android apps
- Rewriting for microservices novelty

## Architecture decisions (follow these)

1. **Multi-tenancy:** organisation accounts; shared DB with `organisationId` isolation
2. **Race day:** local-first capture + async sync; single authoritative device per race
3. **Integrity:** append-only timing events + derived materialised results
4. **Incremental:** evolve from the working timing UX; don’t throw away the proven keypad/buttons flows
5. **Boring stack:** keep web/PWA; prefer well-understood auth/DB/hosting

## Suggested delivery order

1. Extract pure timing domain functions + tests (preserve math/undo/finish semantics)
2. Org + auth + roles
3. Server race model + org isolation
4. Local event log + sync + sync status UI
5. Names on bibs, resume/incomplete UX, CSV export
6. Remove/protect admin wipe; soft-delete
7. Pilot-ready polish (empty states, loading, error recovery)

## Definition of done

- [ ] Admin creates org and invites a timekeeper
- [ ] Timekeeper runs mass-start (keypad) and time-trial on mobile browser
- [ ] Network blip during race does not lose local captures
- [ ] After sync, admin opens results on a different device
- [ ] CSV export works
- [ ] Unrecorded stages render as “—”, not zero times
- [ ] Org A cannot read Org B data (tested)
- [ ] Critical timing + authz paths have automated tests
- [ ] No claims of multi-device concurrent timing in UI copy

## Implementation note

Existing reference app: https://github.com/daryl-sf/split-times

Product context (deeper docs): branch `product-context` on that repo, or https://github.com/daryl-sf/split-times-product-context if populated.

Prefer improving/evolving the existing Remix app toward this MVP over a greenfield rewrite, unless you hit a hard blocker—and document that blocker before rewriting.
