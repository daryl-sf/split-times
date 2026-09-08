# Race-day requirements

Race day is the product’s highest-stress moment. This document separates **current behaviour** from **professional target behaviour**.

## Scenarios

### Internet disappears mid-event

| | |
| --- | --- |
| **Current** | Single-device timing continues because logic/storage are local. Loading the app **first time** without cache may fail. No multi-device sync to lose, but also no remote backup. |
| **Target** | Packaged offline-capable app shell; local queue of timing events; sync when connectivity returns; visible sync state. |

### Volunteer records the wrong athlete

| | |
| --- | --- |
| **Current** | Undo last stage / TT undo; keypad redo toast (5s). No deeper edit history. |
| **Target** | Undo + explicit correction flow; audit of corrections; optional confirm on high-risk actions. |

### Two devices record the same athlete

| | |
| --- | --- |
| **Current** | Not supported as one race — devices do not share state. |
| **Target** | If multi-device: conflict policy (first-write, stage ownership, or merge with review) — see ADR-002. |

### Device runs out of battery / is dropped

| | |
| --- | --- |
| **Current** | Data only on that device. If storage intact and user reopens origin, autosaved progress may remain. If device lost → race data lost. |
| **Target** | Frequent durable sync or paired backup device; export checkpoint. |

### Application crashes mid-race

| | |
| --- | --- |
| **Current** | Autosave after mutations; refresh may restore last save. In-memory unsaved state since last save lost. No crash reporting. |
| **Target** | Append-only local log flushed often; crash telemetry; recovery screen. |

### Timing record accidentally deleted

| | |
| --- | --- |
| **Current** | Past race delete and admin wipe are hard deletes. No recycle bin. |
| **Target** | Soft delete / authorised delete; restore window. |

### Clock differences

| | |
| --- | --- |
| **Current** | Single device clock (`Date.now()`). |
| **Target** | Define timing authority (device vs server timestamps); document accuracy expectations honestly. |

### Multiple simultaneous users

| | |
| --- | --- |
| **Current** | One browser session’s React state is authoritative per device. |
| **Target** | Explicit concurrency model for organisers + timekeepers. |

## Requirements IDs (race-day focused)

| ID | Requirement | State |
| --- | --- | --- |
| RD-001 | Operator can complete a mass-start race without network after initial load on one device | C Partial |
| RD-002 | Operator can recover an in-progress race after refresh on same browser profile | C Partial |
| RD-003 | System prevents accidental finish without confirmation | C |
| RD-004 | System keeps screen awake when API available | C Partial |
| RD-005 | Organisation race must have a backup not solely on one device | T |
| RD-006 | Multi-timekeeper races must define ownership of timing points/stages | T |
| RD-007 | Corrections must be auditable | T |
| RD-008 | Operator must see clear connectivity/sync status when sync exists | T |

## Reliability linkage

See [`reliability-requirements.md`](reliability-requirements.md) and [`../gaps/reliability-risks.md`](../gaps/reliability-risks.md).
