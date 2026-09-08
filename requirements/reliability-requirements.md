# Reliability requirements

| ID | Requirement | State |
| --- | --- | --- |
| REL-001 | Timing mutations must be persisted promptly on-device during an active race | C |
| REL-002 | Finish must persist final payload including `isFinished: true` | C |
| REL-003 | Timer intervals must be cleared on stop/unmount to avoid leaks | C (addressed in history) |
| REL-004 | Operators must be warned before leaving an active race when the browser supports it | C Partial |
| REL-005 | Server-backed races must have automated backups / point-in-time recovery story | T |
| REL-006 | Sync replication lag and failure must not silently drop timing events | T |
| REL-007 | Critical path code (split apply, undo, finish) must be covered by tests | T |
| REL-008 | Production error rates for timing APIs must be visible to operators of the service | T |
