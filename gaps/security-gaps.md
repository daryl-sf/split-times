# Security gaps

| ID | Gap | Priority | Notes |
| --- | --- | --- | --- |
| SG-001 | No authentication | Critical for SaaS | Blocking commercial |
| SG-002 | No authorisation model | Critical | |
| SG-003 | Public `/admin` data wipe | High | Even for local-only, dangerous on shared devices |
| SG-004 | No tenant isolation (N/A until server data) | Critical later | Design before storing PII server-side |
| SG-005 | No privacy policy / terms | High for selling | |
| SG-006 | No audit trail of sensitive actions | Medium | |
| SG-007 | Dependency vulnerabilities not actively managed | Medium | |
| SG-008 | Unknown production HTTPS/header hardening | Medium | Verify in AWS |
