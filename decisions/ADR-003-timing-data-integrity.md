# ADR-003: Timing data integrity model

## Status

Proposed

## Context

Current code mutates `stage.time` / TT start-finish fields in place. Undo overwrites. Deletes are hard. This is simple but weak for auditability, recovery, and disputes.

## Options

1. Keep mutable fields forever
2. Append-only timing events (`split_recorded`, `split_undone`, …) with derived materialised results
3. Mutable current state + separate audit log

## Decision

Move toward **option 2** for server-backed timing, with derived results views. Client may keep a mutable working view but should flush event records.

## Rationale

Race timing is trust-sensitive. Append-only events support corrections, recovery, and future multi-device merge.

## Consequences

- More engineering than today’s setState model
- Storage volume grows (acceptable at club scale)
- Results computation must be deterministic from events
- Existing local races won’t have historical events — import as snapshots
