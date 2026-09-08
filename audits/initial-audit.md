# Initial audit — Split Times

**Audit date:** 2026-09-08  
**Application revision observed:** `027ff19` (main — “add TT mode”) on [daryl-sf/split-times](https://github.com/daryl-sf/split-times)  
**Methods:** Source inspection, CI/config review, local build/test/lint, manual UI exploration at `http://localhost:3333`

---

## Current maturity

**Functional prototype / volunteer tool** — strong enough for a skilled operator on one device; **not** a commercial club SaaS.

Rough stage: **Stabilise → pre-Commercial MVP**.

## Strengths

1. Clear, focused race-day UX for mass-start splits (buttons + keypad) and TT
2. Sensible race-day touches: undo/redo toast, finish confirm, wake lock, beforeunload, autosave
3. Simple results with position sort and clipboard copy
4. Modern baseline stack (Remix, TypeScript, Tailwind) with lint/typecheck/tests in CI and AWS deploy path
5. Small codebase — understandable and evolvable incrementally

## Weaknesses

1. All durable state is browser-local
2. No auth, orgs, roles, or multi-user model
3. Timing business logic barely tested
4. Results UX can misrepresent missing splits as zero times
5. `/admin` wipe is unprotected
6. No product monitoring, backups, billing, or customer docs

## Critical risks

| Risk | Severity |
| --- | --- |
| Race data loss (device/storage/`/admin`) | Critical |
| Silent incorrect results display (zeros) | High |
| Untested timing edge cases | High |
| Premature multi-device assumptions | High if marketed wrongly |

## Product gaps (top)

Org accounts, durable storage/sync, export, athlete names, trustworthy empty states, protected admin — see `gaps/feature-gaps.md`.

## Technical debt (top)

Untested domain logic, monolithic route state, no schema versioning, CI Node drift — see `gaps/technical-debt.md`.

## Commercial gaps (top)

Nothing to sell as multi-user software yet: tenancy, legal, support, billing, onboarding — see `gaps/commercial-gaps.md` and `audits/commercial-readiness.md`.

## Recommended priorities

Follow `roadmap/now.md` then `roadmap/next.md`.

## Unknowns

Production URL/health, real-event usage history, willingness to pay, legal packaging — `context/assumptions.md`.

## Commercial usability verdict

**Not commercially usable as a paid club product today.**  
**Usable** as a free single-device timing utility for a trusted operator who accepts device-local risk.
