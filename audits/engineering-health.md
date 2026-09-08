# Engineering health

**Snapshot:** 2026-09-08

| Signal | Observation | Health |
| --- | --- | --- |
| Typecheck | Passes | Good |
| Lint | Passes | Good |
| Unit tests | Pass (1 file) | Poor coverage |
| Build | Passes | Good |
| CI pipeline | Present (lint/type/test/deploy) | Good structure, Node 18 vs 20 drift |
| Test depth on domain | Missing | Poor |
| Dependency advisories | Many reported on `npm install` | Needs attention |
| Architecture clarity | Small, client-centric | Understandable |
| Observability | None in app | Poor for SaaS |
| Docs in app repo | Mostly stack README | Thin product docs (this repo addresses) |
| Security posture | No auth; local data | Acceptable only pre-SaaS |

## Recommendations

1. Extract pure timing functions + tests (highest ROI)
2. Align CI Node to 20
3. Add schemaVersion to persisted races
4. Plan auth/DB work behind ADRs rather than ad-hoc
5. Start dependency update cadence before commercial launch
