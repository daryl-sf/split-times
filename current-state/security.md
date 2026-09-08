# Security (current)

## Authentication

**Confirmed:** None. No login, sessions, or user identity in application code.

`SESSION_SECRET` appears in `.env.example` / README deploy instructions as part of the Remix+Architect stack template — **not** used to protect product features.

## Authorisation

**Confirmed:** None. All routes are public to anyone who can load the origin.

`/admin` can wipe all local races for that browser origin — low risk for personal single-user use; **high risk** if the app is later shared with accounts/synced data without redesign.

## Data protection

| Topic | Current |
| --- | --- |
| Data location | User device only |
| Encryption at rest | Browser/OS dependent (**Unknown** beyond IndexedDB defaults) |
| Transport | HTTPS in deployed AWS environments (**Assumed** via AWS; **Unknown** exact cert setup) |
| PII | Minimal today (optional race name string; no athlete PII) |
| Secrets in client | No API keys in client for domain features |

## Threat notes (current architecture)

1. **No server race data** → limited blast radius for remote data breach of race results
2. **Device loss / shared tablet** → full access to local race history on that profile
3. **XSS** would expose localForage data — standard web XSS hygiene still matters
4. **Dependency vulnerabilities:** `npm install` reported many advisories at audit time (engineering health)

## Target security

See [`../requirements/security-requirements.md`](../requirements/security-requirements.md) and [`../gaps/security-gaps.md`](../gaps/security-gaps.md).
