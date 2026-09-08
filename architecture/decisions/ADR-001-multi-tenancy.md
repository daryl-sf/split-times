# ADR-001: Multi-tenancy via organisation accounts

## Status

Proposed

## Context

The current app stores races only in the browser with no user or organisation concept. Selling to clubs requires isolation, ownership, and access control for race data.

## Options

1. Stay device-local forever (not commercially viable for paying clubs)
2. Single global shared database without tenants (unsafe)
3. Organisation (tenant) as the root ownership entity, with users belonging to orgs
4. Fully separate database per club (heavy ops)

## Decision

Choose **option 3**: organisation-scoped multi-tenancy. All durable race entities carry an `organisationId`. Users authenticate and are authorised via org membership roles.

## Rationale

Fits club buying model; standard SaaS pattern; supports shared volunteers; avoids per-club infra explosion.

## Consequences

- Requires auth, membership, and a server database
- Current localForage becomes a cache/offline buffer, not the system of record
- `/admin` wipe semantics must be redesigned
- Migration path needed for any existing local races users care about
