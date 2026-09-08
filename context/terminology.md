# Terminology glossary

Use these terms consistently in documentation and new code. Where the codebase uses a different word, both are listed.

| Preferred term | Code / UI synonym | Meaning | Status |
| --- | --- | --- | --- |
| Race | Race, raceInfo | A single timing session | Confirmed |
| Race type | `raceType` | `massStart` or `timeTrial` | Confirmed |
| Mass start | Mass Start | Shared clock; multi-stage splits | Confirmed |
| Time trial | Time Trial, TT | Per-runner start/finish | Confirmed |
| Runner | Bib #, runner number | Integer identifier `1..N` | Confirmed |
| Bib | Bib # | Same as runner number today | Confirmed |
| Stage | Stage, S1…Sn | Sequential split segment in mass start | Confirmed |
| Split / stage time | `stage.time` | Duration of one stage (ms), not cumulative | Confirmed |
| Total time | Total | Sum of stage times (mass start) or finish−start (TT) | Confirmed |
| UI mode | Input mode | `buttons` or `keypad` | Confirmed |
| Past race | Past Races | Saved localForage race record | Confirmed |
| Results | Results / Show Results | Tabular presentation of saved timings | Confirmed |
| Event | — | Multi-race organised occasion | **Missing** / Proposed |
| Organisation | — | Paying tenant (club/organiser) | **Missing** / Proposed |
| Athlete | — | Named person who races | **Missing** / Proposed |
| Participant | — | Athlete entered in a specific race | **Missing** / Proposed |
| Timing point | — | Named location where splits are taken | **Missing** / Proposed |
| Timing record | — | Immutable capture of a timing action | **Missing** / Proposed |
| Category | — | Classification for ranking (age/gender/etc.) | **Missing** / Proposed |
| Timekeeper | — | Person operating the timing UI | Implied user, not an entity |

## Naming pitfalls

- **“SplitTime”** historically referred both to a data structure and a React component. The data structure was renamed to `RunnerSplitTime` (Confirmed in git history / `app/types.ts`).
- **“Event”** in Architect (`@http`) means HTTP event, not a sporting event. Avoid using “event” without qualification in engineering docs.
- **Stage time `0`** means “not recorded”, not a literal zero-duration performance — except that the UI currently *displays* it as `00:00:00.0`, which can be misread as a real time.
