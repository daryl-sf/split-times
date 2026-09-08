# Testing (current)

## Tooling

- **Confirmed:** Vitest + Testing Library jest-dom + happy-dom
- **Confirmed:** `npm run test`, coverage via CI `--coverage`
- **Confirmed:** `npm run lint` (ESLint, max warnings 0)
- **Confirmed:** `npm run typecheck` (`tsc -b`)
- **Confirmed:** `npm run validate` runs test + lint + typecheck in parallel

## What is tested

| Area | Coverage | Status |
| --- | --- | --- |
| `convertMsToTime` | Unit tests in `app/utils.test.ts` | Confirmed |
| Split recording logic | None | Missing |
| Undo/redo | None | Missing |
| TT start/finish | None | Missing |
| Autosave key behaviour | None | Missing |
| Results sorting | None | Missing |
| Component / E2E tests | None found | Missing |

## Audit observation (2026-09-08)

On analysis environment: unit tests, typecheck, and lint **all passed**. Build succeeded. This does **not** imply race-day logic is well tested.

## Gaps

Critical business rules (BR-010+) lack automated tests — see [`../gaps/technical-debt.md`](../gaps/technical-debt.md).
