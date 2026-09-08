# Non-functional requirements

| ID | Requirement | State |
| --- | --- | --- |
| NFR-001 | Timing UI interactions must remain usable on a modern mobile browser viewport | C (Partial — built mobile-first) |
| NFR-002 | Split recording must not require a server round-trip to succeed on a single device | C |
| NFR-003 | The product must clearly separate device-local vs organisation-durable storage in UX once both exist | T |
| NFR-004 | Critical timing business rules must have automated tests | T (Missing today) |
| NFR-005 | Production deployments must run on supported Node/runtime aligned with CI | T (Partial drift today) |
| NFR-006 | Dependency vulnerabilities affecting the served app should be tracked and remediated on a defined cadence | T |
| NFR-007 | Race-day capture must tolerate temporary loss of network for single-device timing | C for local capture; T for sync |
| NFR-008 | Time display precision must include tenths of a second | C |
| NFR-009 | Clock sampling for UI should update at least every 100ms while running | C |
| NFR-010 | Organisation data must be isolated between tenants | T |
| NFR-011 | The system should provide basic operational monitoring for server components once races are server-backed | T |
| NFR-012 | Documentation (this repo) must be updated when user-visible behaviour changes | T process |
