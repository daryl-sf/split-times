# Feature gaps

Gaps are product capabilities missing or inadequate relative to the commercial target. Not the same as engineering debt.

| ID | Problem | User | Why it matters | Proposed solution | Complexity | Dependencies | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| FG-001 | No organisation / multi-tenant accounts | Admin, buyer | Cannot sell as club SaaS | Org model + auth | High | ADR-001 | Critical |
| FG-002 | No roles/permissions | Admin | Shared tablets / volunteers unsafe | Admin / timekeeper roles | Medium | FG-001 | Critical |
| FG-003 | Race data only on one browser | Organiser | Device loss = data loss | Server-backed store + sync | High | FG-001 | Critical |
| FG-004 | No CSV/PDF export | Organiser | Clubs need records | Export from results | Low–Med | Server or client | High |
| FG-005 | Bib-only identity | Organiser/coach | Hard to communicate results | Optional athlete names | Medium | Data model | High |
| FG-006 | Unrecorded stages show as `00:00:00.0` | All | False results risk | Display “—” / DNF rules | Low | UI | High |
| FG-007 | No categories / age groups | Organiser | Club races need class results | Category field + ranked views | Medium | FG-005 | Medium |
| FG-008 | No multi-device timing | Organiser | Larger events need it | Timing event protocol | High | ADR-002, FG-003 | High |
| FG-009 | Weak intentional offline mode | Timekeeper | Race venues have poor signal | PWA + queue | High | FG-003 | High |
| FG-010 | No public results link | Athletes | Sharing friction | Published results page | Medium | FG-003 | Medium |
| FG-011 | No race templates / season events | Admin | Repeated setup | Event/race templates | Medium | FG-001 | Low |
| FG-012 | In-progress races clutter history | Timekeeper | Confusion | Filter by status | Low | — | Medium |
| FG-013 | No billing | Buyer | Cannot revenue | Stripe (or similar) | Medium | FG-001 | Medium (after core) |
| FG-014 | No onboarding / help | New volunteer | Race-day mistakes | In-app guide | Low | — | Medium |
| FG-015 | Admin wipe unprotected | Anyone | Data loss | Remove or protect | Low | Auth | High |
