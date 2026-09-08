# Reliability risks

| ID | Risk | Current exposure | Severity |
| --- | --- | --- | --- |
| RR-001 | Total loss if browser storage cleared / device lost | High — only copy is local | Critical |
| RR-002 | Shared club tablet wiped via `/admin` | High if URL known | High |
| RR-003 | Incomplete TT/mass races in history confuse recovery | Medium | Medium |
| RR-004 | No monitoring of client exceptions in production | Medium | Medium |
| RR-005 | Accidental navigation / browser kill despite beforeunload | Medium on mobile | High |
| RR-006 | Clock depends on device time changes mid-race | Low–Medium | Medium |
| RR-007 | Same-day TT key collision `tt-${raceDate}` | Low | Medium |
| RR-008 | Untested timing edge cases (rapid double taps, undo races) | Unknown | High |

Mitigations prioritised in [`../roadmap/now.md`](../roadmap/now.md).
