# Business rules

Only rules supported by current code are marked **Confirmed**. Proposed rules are explicitly labelled.

Evidence primarily from `app/routes/_index.tsx`, `app/components/SplitTime.tsx`, `app/types.ts`.

---

## Race setup

| ID | Rule | Status |
| --- | --- | --- |
| BR-001 | A race requires `numberOfRunners > 0` to start | Confirmed |
| BR-002 | Mass start also requires `numberOfStages > 0` to start | Confirmed |
| BR-003 | Race name is optional | Confirmed |
| BR-004 | Default setup is 20 runners, 5 stages, keypad mode, mass start | Confirmed |
| BR-005 | Changing runner or stage counts while on setup resets timer state (`startTime=0`, not running/finished) and recreates timing structures | Confirmed |
| BR-006 | Time trial hides stage count and input mode controls | Confirmed |

---

## Mass start timing

| ID | Rule | Status |
| --- | --- | --- |
| BR-010 | Mass start has an explicit Start action that sets `startTime = Date.now()` and begins a 100ms tick updating `currentTime` | Confirmed |
| BR-011 | Splits cannot be recorded until the timer is running (buttons disabled; keypad Enter disabled) | Confirmed |
| BR-012 | Recording a split for a runner fills the first stage with `time === 0` | Confirmed |
| BR-013 | Stage duration = `(currentTime - startTime) - sum(previous stage times)` | Confirmed |
| BR-014 | After all stages for all runners are non-zero, the race auto-finishes | Confirmed |
| BR-015 | Manual Finish is allowed earlier, with a confirmation dialog | Confirmed |
| BR-016 | A finished runner (all stages set) ignores further split attempts | Confirmed |
| BR-017 | Undo clears the most recently recorded non-zero stage for that runner (sets time back to 0) | Confirmed |
| BR-018 | In keypad mode, undo shows a toast with Redo for 5 seconds restoring the pre-undo stage snapshot | Confirmed |
| BR-019 | Progress is saved to localForage after every split and undo when `startTime` is set | Confirmed |
| BR-020 | Finished race is saved under key `` `${startTime}` `` | Confirmed |

---

## Time trial timing

| ID | Rule | Status |
| --- | --- | --- |
| BR-030 | Entering TT race view immediately sets `isRunning: true` and `startTime: now` (session start), and starts a 100ms UI tick | Confirmed |
| BR-031 | First tap on a TT runner sets `startTime`; second tap sets `finishTime`; further taps ignored | Confirmed |
| BR-032 | Undo on TT clears finish first, then start | Confirmed |
| BR-033 | When every runner has `finishTime > 0`, race auto-finishes | Confirmed |
| BR-034 | Manual Finish with confirmation is available | Confirmed |
| BR-035 | TT progress saved under `` `${startTime}` `` or `` `tt-${raceDate}` `` if startTime falsy | Confirmed |
| BR-036 | TT elapsed = `finishTime - startTime`; unfinished shown as DNF in results | Confirmed |

---

## Results and ranking

| ID | Rule | Status |
| --- | --- | --- |
| BR-040 | Mass-start total = sum of stage times | Confirmed |
| BR-041 | Results can sort by bib order or by total/elapsed ascending (“Position”) | Confirmed |
| BR-042 | Zero totals sort after non-zero when sorting by position | Confirmed |
| BR-043 | Position number is the index in the sorted list (1-based), not a stored entity | Confirmed |
| BR-044 | Unrecorded stages display as `00:00:00.0` (not a distinct “missing” marker) | Confirmed — UX risk |
| BR-045 | Copy Results copies the HTML table’s `innerText` to the clipboard | Confirmed |

---

## Storage and deletion

| ID | Rule | Status |
| --- | --- | --- |
| BR-050 | All race data is device-local (IndexedDB via localForage) | Confirmed |
| BR-051 | Deleting a past race removes that key after confirm | Confirmed |
| BR-052 | Admin “Reset local DB” clears **all** localForage data after confirm | Confirmed |
| BR-053 | In-progress races can appear in Past Races because autosave writes before finish | Confirmed (observed in manual testing) |

---

## Missing / duplicate / correction handling

| Topic | Current behaviour | Status |
| --- | --- | --- |
| Missing splits | Remain 0; race can still be manually finished | Confirmed |
| Duplicate split for same stage | Not possible — stages fill sequentially; finished runners ignore input | Confirmed |
| Wrong runner recorded | Undo last stage for that runner (or TT undo) | Confirmed — limited |
| Edit arbitrary historical split | Not supported | Confirmed absent |
| Multi-device same race | Not supported; would create independent local copies | Confirmed absent |
| Clock skew between devices | N/A today (single device) | — |
| Deleted timing recovery | Not supported | Confirmed absent |

---

## Proposed rules (not implemented)

| ID | Proposed rule | Why |
| --- | --- | --- |
| BR-P01 | Timing records should be append-only with corrections as new records | Auditability / race-day recovery |
| BR-P02 | Unrecorded stages should display as blank or “—” not `00:00:00.0` | Avoid false results |
| BR-P03 | Race data should sync to an organisation-scoped server store | Commercial / multi-device |
| BR-P04 | Destructive deletes should be soft-delete or require elevated role | Data safety |
