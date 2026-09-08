# User journeys (current)

Only roles/journeys supported or strongly implied by the current app are documented.

---

## J-001 — Timekeeper: mass-start race (keypad)

**Status:** Confirmed (manual test + code)

1. **Starting point:** Open `/`
2. **Actions:** Enter optional name; choose Mass Start; set runners/stages; choose Keypad; Start Race; Start timer; enter bib + Enter for each split; optionally undo via tile / redo toast; Finish (confirm) or auto-finish when all stages filled
3. **System behaviour:** Shared clock; incremental stage durations; autosave to IndexedDB; wake lock requested
4. **Result:** Race marked finished; results available via Show Results / Past Races
5. **Pain points:** Mistyped bibs; zeros look like real times; single device only; no named athletes
6. **Failure cases:** Browser killed → may recover last autosave if same device/profile; tab discard / storage clear → data loss; accidental Finish → confirmed but not reversible after save except by re-timing
7. **Missing:** Multi-device, named participants, export, live public results

---

## J-002 — Timekeeper: mass-start race (buttons)

**Status:** Confirmed

Same as J-001 with per-runner buttons instead of keypad. Better for small fields; worse for large runner counts.

---

## J-003 — Timekeeper / coach: time trial

**Status:** Confirmed

1. **Starting point:** `/` → Time Trial → set runners → Start Race
2. **Actions:** Tap runner to start; tap again to finish; undo as needed; Finish early or auto-finish when all done
3. **System behaviour:** Per-runner absolute timestamps; progress `finished/total`; autosave (may list incomplete races under Past Races)
4. **Result:** Results show elapsed or DNF
5. **Pain points:** No planned start intervals; incomplete races clutter history
6. **Failure cases:** Same device-local risks as mass start
7. **Missing:** Training plans, athlete names, target times

---

## J-004 — Same-device viewer: past results

**Status:** Confirmed

1. Open `/races` → select race → sort Bib/Position → Copy Results
2. **Pain points:** Only on the device that timed; copy is plain text; no share link
3. **Failure cases:** Missing key → loading forever or empty if raceInfo absent; non-numeric keys can show Invalid Date in list

---

## J-005 — Anyone: wipe local data

**Status:** Confirmed

1. Open `/admin` → Reset local DB → confirm
2. **Result:** All local races deleted
3. **Pain points / risks:** No authentication; catastrophic on shared tablets

---

## Journeys not supported today

| Journey | Status |
| --- | --- |
| Club administrator onboarding org | Missing |
| Event organiser inviting volunteers | Missing |
| Athlete viewing personal history online | Missing |
| Public spectator results page | Missing |
| Multi-timekeeper simultaneous recording | Missing |
| Cross-device recovery after device failure | Missing |
