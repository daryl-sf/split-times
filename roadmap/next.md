# Next — Commercial MVP

Build the minimum product a club could pay for.

| ID | Objective | User value | Technical implications | Dependencies | Complexity | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| NEXT-001 | Organisation accounts + auth | Buyer entity exists | Auth provider, session | ADR-001 | High | Critical |
| NEXT-002 | Roles: admin + timekeeper | Safe sharing | Authorisation middleware | NEXT-001 | Medium | Critical |
| NEXT-003 | Server-backed race store with org isolation | Durable results | DB + API | ADR-001, ADR-003 | High | Critical |
| NEXT-004 | Local-first capture syncing to server for one device | Race-day + archive | Local queue + sync | ADR-002, NEXT-003 | High | Critical |
| NEXT-005 | CSV export | Club records | API or client generation | NEXT-003 | Low | High |
| NEXT-006 | Optional athlete/bib names | Usable results | Data model | NEXT-003 | Medium | High |
| NEXT-007 | Terms, privacy, basic support channel | Sell legally/trustably | Policy + process | Owner | Medium | High |
| NEXT-008 | Billing for org subscription | Revenue | Stripe etc. | NEXT-001 | Medium | Medium |

MVP exit criteria (Proposed): a club admin can invite a timekeeper, run a race on a phone, and retrieve/export results later from another device.
