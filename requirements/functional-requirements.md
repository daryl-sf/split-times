# Functional requirements

IDs are stable. Each requirement is independently understandable. Trace links are indicative.

Legend: **C** = covers current behaviour · **T** = target · **B** = both (current exists, target extends)

| ID | Requirement | State | Trace |
| --- | --- | --- | --- |
| FR-001 | An operator must be able to create a race configuration with a runner count and race type | C | F-001 |
| FR-002 | For mass start, an operator must be able to set the number of stages | C | F-001 |
| FR-003 | For mass start, an operator must be able to choose buttons or keypad input | C | F-003, F-004 |
| FR-004 | An operator must be able to start a shared mass-start clock | C | F-002, BR-010 |
| FR-005 | An operator must be able to record the next unfilled stage time for a bib | C | BR-012, BR-013 |
| FR-006 | An operator must be able to undo the last stage recorded for a bib | C | BR-017 |
| FR-007 | An operator must be able to finish a race before all splits are complete, with confirmation | C | BR-015 |
| FR-008 | The system must persist race progress on the operator device during timing | C | F-007 |
| FR-009 | An operator must be able to view results with totals and sort by bib or position | C | F-008 |
| FR-010 | An operator must be able to copy results to the clipboard | C | F-008 |
| FR-011 | An operator must be able to list and open past races stored on the device | C | F-009 |
| FR-012 | An operator must be able to delete a past race with confirmation | C | F-009 |
| FR-013 | For time trial, an operator must start and finish each bib with successive taps | C | F-005 |
| FR-014 | Unfinished time-trial athletes must be distinguishable from finishers in results | C | BR-036 |
| FR-015 | An authorised organisation admin must be able to create and manage an organisation | T | gaps |
| FR-016 | An authorised user must be able to invite timekeepers to an organisation | T | gaps |
| FR-017 | Race data must be stored in an organisation-scoped durable backend | T | ADR-001 |
| FR-018 | An authorised user must be able to export results as CSV | T | gaps |
| FR-019 | An operator must be able to optionally attach display names to bibs | T | gaps |
| FR-020 | The system must not display unrecorded mass-start stages as a plausible finish time | T | BR-P02 |
| FR-021 | Destructive data wipes must require an authorised role | T | security |
| FR-022 | An operator must be able to recover timing progress after a browser refresh on the same device | B | Partial today via autosave |
| FR-023 | The system must record timing corrections in an auditable way | T | ADR-003 |

## Traceability sketch

```text
Club needs trustworthy race-day times
  → Jobs (race day capture)
    → FR-004..FR-008, FR-017, FR-022
      → Features F-002, F-007, …
        → Implementation app/routes/_index.tsx
          → Tests (mostly missing today)
```
