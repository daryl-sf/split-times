# Assumptions and unknowns

## Assumptions (unvalidated)

| ID | Assumption | Impact if wrong |
| --- | --- | --- |
| A-001 | Primary commercial buyers are clubs/organisers, not individual athletes | Wrong ICP → wrong packaging |
| A-002 | Single-device timekeeping is acceptable for MVP for small events | Larger events need multi-device sooner |
| A-003 | Bib-number-only identification is acceptable for early MVP | Clubs may require named athletes immediately |
| A-004 | Browser + mobile web is preferred over native apps for MVP | May need PWA/offline install sooner |
| A-005 | Architect/AWS serverless remains an acceptable hosting base | May outgrow or overcomplicate for a mostly-static client app |
| A-006 | English-only, UK/EU-oriented clubs are the initial market | Localisation / region needs may differ |
| A-007 | The product name “Split Times” is acceptable commercially | Trademark / clarity issues possible |

## Unknowns

| ID | Unknown | How to resolve |
| --- | --- | --- |
| U-001 | Is there a production URL customers already use? | Ask owner; check AWS account / CloudFormation `SplitTimesA104Production` |
| U-002 | Has the app been used at real events? How many runners/stages? | Owner interview |
| U-003 | Willingness to pay and price sensitivity | Customer interviews |
| U-004 | Competing tools already used by target clubs | Competitive discovery |
| U-005 | Legal entity, terms, privacy posture for selling | Owner decision |
| U-006 | Whether `SESSION_SECRET` / Remix stack auth leftovers will be reused | Architecture decision |
| U-007 | Exact AWS account state, staging URL, monitoring | Infra inspection with credentials |
| U-008 | Whether offline-first or online-first is the commercial bet | ADR (see decisions) |
| U-009 | Data residency / GDPR obligations once accounts exist | Privacy review |
| U-010 | Preferred identity model (email magic link, Google, club SSO) | Product decision |

## Explicit non-assumptions

- Do not assume offline sync exists because data is local — local storage ≠ intentional offline product mode.
- Do not assume multi-tenancy can be bolted on without a data-model change.
- Do not assume race-day reliability equals “works on my phone” — failure modes are documented in [`../requirements/race-day-requirements.md`](../requirements/race-day-requirements.md).
