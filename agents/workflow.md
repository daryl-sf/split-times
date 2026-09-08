# Development workflow (application + context)

The **application repo** implements. This **context repo** remembers.

## Before development

1. Read `agents/coding-agent-context.md`
2. Check relevant requirements IDs (`requirements/`)
3. Check ADRs (`decisions/`)
4. Check `roadmap/now.md` (or next) for priority fit
5. Inspect current implementation in `daryl-sf/split-times`

## During development

1. Preserve documented business rules unless the change explicitly updates them
2. Add/update automated tests for timing-critical paths
3. Update documentation in this repo when user-visible or architectural behaviour changes
4. Record significant decisions as ADRs (Proposed → Accepted when adopted)

## After development

1. Update `current-state/feature-inventory.md` status/limitations
2. Update requirements if scope changed
3. Update architecture docs if structure changed
4. Update roadmap (move completed items; reprioritise)
5. Note discoveries in `context/assumptions.md` or audits if material

## Conflict rule

If context docs disagree with code: **fix the discrepancy** (fix docs, or change code intentionally). Do not ignore.

## What not to do in the context repo

- Do not paste the application source tree here
- Do not treat this repo as a second implementation
