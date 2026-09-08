# Security requirements

| ID | Requirement | State |
| --- | --- | --- |
| SEC-001 | Organisation data must be accessible only to authorised users | T |
| SEC-002 | Administrative destructive actions require authentication and authorisation | T (`/admin` fails this today for any future shared data) |
| SEC-003 | Secrets must not be committed; deploy secrets via secure secret stores | C Partial (README process) |
| SEC-004 | Personal data (athlete names, emails) must have a retention and deletion policy | T |
| SEC-005 | Exports and deletes must be available to satisfy basic data-subject requests once PII exists | T |
| SEC-006 | All production traffic must use HTTPS | T/Unknown ops |
| SEC-007 | Audit log for authz-sensitive actions (invite, delete race, billing) | T |
| SEC-008 | Dependency vulnerabilities must be monitored | T |
