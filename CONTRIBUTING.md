# CONTRIBUTING — Product Context Repository

## Purpose

Improve the **memory** of Split Times: accuracy, clarity, decisions, and plans.

## When to update

| Change in the product | Update here |
| --- | --- |
| New/changed feature behaviour | `current-state/feature-inventory.md`, journeys, business rules |
| New requirement | `requirements/*` with a new ID |
| Architecture shift | `architecture/*` + ADR |
| Priority change | `roadmap/*` |
| Discovery / unknown resolved | `context/assumptions.md`, audits |
| Security/reliability finding | `gaps/*`, audits |

## Rules

1. Label evidence: Confirmed / Partial / Intended / Proposed / Unknown
2. Keep **current** and **target** separate
3. Prefer stable IDs (`FR-0xx`, `ADR-0xx`, `FG-0xx`)
4. Do not silently overwrite Accepted ADRs — supersede with a new ADR
5. Do not invent customer requirements without labelling them Proposed
6. Keep docs concise; link instead of duplicating
7. Use Mermaid sparingly for architecture/ER clarity

## PR hygiene (when this is a standalone GitHub repo)

- Small, focused doc PRs
- Mention related application PRs/commits when behaviour changed
- Update `audits/` only for meaningful point-in-time assessments (don’t spam)

## Agents

Follow `agents/workflow.md` and `agents/development-principles.md`.
