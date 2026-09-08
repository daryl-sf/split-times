# ADR-002: Offline and multi-device timing approach

## Status

Proposed

## Context

Race venues often have poor connectivity. Larger events may need more than one timekeeper device. Today’s app is single-device local storage without a sync protocol.

## Options

1. Online-only server timing (simple, fragile on race day)
2. Single-device local-only (current) — good capture, weak durability/commercial fit
3. Local-first capture + async sync to server (single device first)
4. Full multi-device CRDT/real-time sync from day one (complex)

## Decision

**Near term:** Option 3 — local-first capture with durable sync for a **single authoritative timing device per race** (or per clearly assigned stage).

**Later:** Extend to multi-device with explicit stage/timing-point ownership before general concurrent edits.

## Rationale

Delivers race-day resilience and cloud archive without taking on the hardest distributed-timing problems immediately.

## Consequences

- Need a local append log + sync worker
- UX must show sync/backup state
- Multi-device marketing claims must wait until ownership rules ship
- Conflicts policy must be documented before enabling concurrent writers
